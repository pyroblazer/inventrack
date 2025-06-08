// auth.service.ts
import { status } from '@grpc/grpc-js';
import { GrpcError } from '@microservices/common';
import type { AuthProto, UsersProto } from '@microservices/proto';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { type ClientGrpc, RpcException } from '@nestjs/microservices';
import { compare, hash } from 'bcryptjs';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private usersService: UsersProto.UsersServiceClient;

  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientGrpc,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.usersService =
      this.usersClient.getService<UsersProto.UsersServiceClient>(
        'UsersService',
      );
  }

  private createTokenPayload(user: AuthProto.User): AuthProto.TokenPayload {
    console.log('Creating token payload for user:', { email: user.email });
    return {
      $type: 'api.auth.TokenPayload',
      userId: user.id.toString(),
      email: user.email,
      role: user.role,
    };
  }

  private async updateUserRefreshToken(
    tokenPayload: AuthProto.TokenPayload,
    refreshTokenHash: string,
  ) {
    const updateRequest: UsersProto.UpdateUserRequest = {
      $type: 'api.users.UpdateUserRequest',
      query: {
        $type: 'api.users.TokenPayload',
        userId: tokenPayload.userId,
        email: tokenPayload.email,
        role: tokenPayload.role,
      },
      data: {
        $type: 'api.users.ReceivedRefreshToken',
        refreshToken: refreshTokenHash,
      },
    };

    // Use firstValueFrom here as well
    await firstValueFrom(this.usersService.updateUser(updateRequest));
  }

  private generateTokens(payload: AuthProto.TokenPayload) {
    const accessTokenExpiration = parseInt(
      this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS'),
    );
    const refreshTokenExpiration = parseInt(
      this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS'),
    );

    const accessToken = this.jwtService.sign(
      { userId: payload.userId, email: payload.email },
      {
        secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: Math.floor(accessTokenExpiration / 1000),
      },
    );

    const refreshToken = this.jwtService.sign(
      { userId: payload.userId, email: payload.email },
      {
        secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: Math.floor(refreshTokenExpiration / 1000),
      },
    );

    return { accessToken, refreshToken };
  }

  private getTokenExpirations() {
    const expiresAccessToken = new Date();
    const expiresRefreshToken = new Date();

    expiresAccessToken.setTime(
      expiresAccessToken.getTime() +
        parseInt(
          this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS'),
        ),
    );

    expiresRefreshToken.setTime(
      expiresRefreshToken.getTime() +
        parseInt(
          this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS'),
        ),
    );

    return {
      expiresAccessToken: {
        $type: 'google.protobuf.Timestamp' as const,
        seconds: Math.floor(expiresAccessToken.getTime() / 1000),
        nanos: (expiresAccessToken.getTime() % 1000) * 1000000,
      },
      expiresRefreshToken: {
        $type: 'google.protobuf.Timestamp' as const,
        seconds: Math.floor(expiresRefreshToken.getTime() / 1000),
        nanos: (expiresRefreshToken.getTime() % 1000) * 1000000,
      },
    };
  }

  public async register(
    userData: AuthProto.CreateUserDto,
  ): Promise<AuthProto.AuthResponse> {
    try {
      const createUserRequest: UsersProto.CreateUserDto = {
        ...userData,
        $type: 'api.users.CreateUserDto',
      };

      const newUser = await firstValueFrom(
        this.usersService.createUser(createUserRequest),
      );

      if (typeof newUser === 'undefined') {
        throw new RpcException({
          code: status.INTERNAL,
          message: 'User creation failed',
        });
      }

      const tokenPayload = this.createTokenPayload({
        ...newUser,
        $type: 'api.auth.User',
        username: newUser.username ?? 'UNKNOWN',
      });

      const { accessToken, refreshToken } = this.generateTokens(tokenPayload);
      const { expiresAccessToken, expiresRefreshToken } =
        this.getTokenExpirations();

      return {
        $type: 'api.auth.AuthResponse',
        accessToken,
        refreshToken,
        expiresAccessToken: {
          $type: 'google.protobuf.Timestamp' as const,
          seconds: expiresAccessToken.seconds,
          nanos: expiresAccessToken.nanos,
        },
        expiresRefreshToken: {
          $type: 'google.protobuf.Timestamp' as const,
          seconds: expiresRefreshToken.seconds,
          nanos: expiresRefreshToken.nanos,
        },
      };
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException('User registration failed');
    }
  }

  public async login(
    user: AuthProto.User,
    redirect = false,
  ): Promise<AuthProto.AuthResponse> {
    try {
      if (typeof user === 'undefined') {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Invalid user data provided',
        });
      }

      const tokenPayload: AuthProto.TokenPayload = {
        $type: 'api.auth.TokenPayload',
        userId: user.id.toString(),
        email: user.email,
        role: user.role,
      };

      const { accessToken, refreshToken } = this.generateTokens(tokenPayload);
      const { expiresAccessToken, expiresRefreshToken } =
        this.getTokenExpirations();

      const refreshTokenData = await hash(refreshToken, 10);
      console.log('login auth-service before updateUserRefreshToken');
      await this.updateUserRefreshToken(tokenPayload, refreshTokenData);

      console.log(`${this.configService.getOrThrow('AUTH_UI_REDIRECT')}`);

      const returned = {
        $type: 'api.auth.AuthResponse',
        accessToken,
        refreshToken,
        expiresAccessToken,
        expiresRefreshToken,
        redirect: redirect || undefined,
        redirectUrl: redirect
          ? this.configService.getOrThrow('AUTH_UI_REDIRECT')
          : undefined,
      };

      console.log('returned', returned);

      return {
        $type: 'api.auth.AuthResponse',
        accessToken,
        refreshToken,
        expiresAccessToken,
        expiresRefreshToken,
        redirect: redirect || undefined,
        redirectUrl: redirect
          ? this.configService.getOrThrow('AUTH_UI_REDIRECT')
          : undefined,
      };
    } catch (error) {
      const err = error as GrpcError;
      console.error('Error in login:', {
        err,
        user,
        stack: err.stack,
      });

      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        code: status.INTERNAL,
        message: 'Login failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  public async refreshToken(
    user: AuthProto.User,
  ): Promise<AuthProto.AuthResponse> {
    try {
      console.log('Refreshing tokens for user:', { email: user.email });

      const tokenPayload: AuthProto.TokenPayload = {
        $type: 'api.auth.TokenPayload',
        userId: user.id.toString(),
        email: user.email,
        role: user.role,
      };

      const { accessToken, refreshToken } = this.generateTokens(tokenPayload);
      const { expiresAccessToken, expiresRefreshToken } =
        this.getTokenExpirations();

      const refreshTokenHash = await hash(refreshToken, 10);

      // Update user's refresh token
      const updateRequest: UsersProto.UpdateUserRequest = {
        $type: 'api.users.UpdateUserRequest',
        query: {
          $type: 'api.users.TokenPayload',
          userId: user.id.toString(),
          email: user.email,
          role: user.role,
        },
        data: {
          $type: 'api.users.ReceivedRefreshToken',
          refreshToken: refreshTokenHash,
        },
      };

      await firstValueFrom(this.usersService.updateUser(updateRequest));

      return {
        $type: 'api.auth.AuthResponse',
        accessToken,
        refreshToken,
        expiresAccessToken,
        expiresRefreshToken,
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to refresh token',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  public async verifyUser(
    email: string,
    password: string,
  ): Promise<AuthProto.User> {
    try {
      console.log('Verifying user:', { email });

      const getUserRequest: UsersProto.GetUserByEmailRequest = {
        $type: 'api.users.GetUserByEmailRequest',
        email,
      };

      // Use firstValueFrom to convert Observable to Promise
      const user = await firstValueFrom(
        this.usersService.getUserByEmail(getUserRequest),
      );

      if (typeof user === 'undefined') {
        console.log('User not found:', { email });
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'User not found',
        });
      }

      const authenticated = await compare(password, user.password ?? '');

      if (!authenticated) {
        console.log('Invalid password for user:', { email });
        throw new RpcException({
          code: status.UNAUTHENTICATED,
          message: 'Invalid credentials',
        });
      }

      return {
        $type: 'api.auth.User',
        id: user.id,
        email: user.email,
        username: user.username ?? 'UNKNOWN',
        role: user.role,
      };
    } catch (error) {
      const grpcError = error as GrpcError;
      console.error('Error in verifyUser:', {
        code: grpcError.code,
        message: grpcError.message,
        details: grpcError.details,
        stack: grpcError.stack,
      });

      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        code: status.INTERNAL,
        message: 'Internal server error',
        details: grpcError.message || 'Unknown error',
      });
    }
  }

  public async verifyUserRefreshToken(
    refreshToken: string,
    email: string,
  ): Promise<AuthProto.User> {
    try {
      console.log('Verifying refresh token for:', { email });

      const request: UsersProto.GetUserByEmailRequest = {
        $type: 'api.users.GetUserByEmailRequest',
        email,
      };

      const user = await firstValueFrom(
        this.usersService.getUserByEmail(request),
      );

      if (!user.refreshToken) {
        console.log('No refresh token found for user:', { email });
        throw new RpcException({
          code: status.UNAUTHENTICATED,
          message: 'Invalid refresh token',
        });
      }

      const isValid = await compare(refreshToken, user.refreshToken);
      if (!isValid) {
        console.log('Invalid refresh token for user:', { email });
        throw new RpcException({
          code: status.UNAUTHENTICATED,
          message: 'Invalid refresh token',
        });
      }

      return {
        $type: 'api.auth.User',
        id: user.id,
        email: user.email,
        username: user.username ?? 'UNKNOWN',
        role: user.role,
      };
    } catch (error) {
      console.error('Error verifying refresh token:', error);
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'Refresh token is not valid',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
