// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.2
//   protoc               v5.29.3
// source: auth.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Timestamp } from "./google/protobuf/timestamp";
import { messageTypeRegistry } from "./typeRegistry";

export const protobufPackage = "api.auth";

/** Role enum */
export enum UserRole {
  STAFF = 0,
  ADMIN = 1,
  UNRECOGNIZED = -1,
}

/** Common messages for Auth */
export interface User {
  $type: "api.auth.User";
  id: string;
  email: string;
  username: string;
  password?: string | undefined;
  refreshToken?: string | undefined;
  role: UserRole;
  createdAt?: Timestamp | undefined;
  updatedAt?: Timestamp | undefined;
}

export interface CreateUserDto {
  $type: "api.auth.CreateUserDto";
  email: string;
  password: string;
  username?: string | undefined;
}

export interface TokenPayload {
  $type: "api.auth.TokenPayload";
  userId: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  $type: "api.auth.LoginRequest";
  user?: User | undefined;
}

export interface RegisterRequest {
  $type: "api.auth.RegisterRequest";
  user?: CreateUserDto | undefined;
}

export interface RefreshTokenRequest {
  $type: "api.auth.RefreshTokenRequest";
  user?: User | undefined;
}

export interface SocialCallbackRequest {
  $type: "api.auth.SocialCallbackRequest";
  user?: User | undefined;
}

export interface VerifyRefreshTokenRequest {
  $type: "api.auth.VerifyRefreshTokenRequest";
  refreshToken: string;
  email: string;
}

export interface VerifyUserRequest {
  $type: "api.auth.VerifyUserRequest";
  email: string;
  password: string;
}

export interface AuthResponse {
  $type: "api.auth.AuthResponse";
  accessToken: string;
  refreshToken: string;
  expiresAccessToken?: Timestamp | undefined;
  expiresRefreshToken?: Timestamp | undefined;
  redirect?: boolean | undefined;
  redirectUrl?: string | undefined;
}

export const API_AUTH_PACKAGE_NAME = "api.auth";

function createBaseUser(): User {
  return { $type: "api.auth.User", id: "", email: "", username: "", role: 0 };
}

export const User: MessageFns<User, "api.auth.User"> = {
  $type: "api.auth.User" as const,

  encode(
    message: User,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.email !== "") {
      writer.uint32(18).string(message.email);
    }
    if (message.username !== "") {
      writer.uint32(26).string(message.username);
    }
    if (message.password !== undefined) {
      writer.uint32(34).string(message.password);
    }
    if (message.refreshToken !== undefined) {
      writer.uint32(42).string(message.refreshToken);
    }
    if (message.role !== 0) {
      writer.uint32(48).int32(message.role);
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(message.createdAt, writer.uint32(58).fork()).join();
    }
    if (message.updatedAt !== undefined) {
      Timestamp.encode(message.updatedAt, writer.uint32(66).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): User {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUser();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.email = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.username = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.password = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.refreshToken = reader.string();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.role = reader.int32() as any;
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }

          message.createdAt = Timestamp.decode(reader, reader.uint32());
          continue;
        }
        case 8: {
          if (tag !== 66) {
            break;
          }

          message.updatedAt = Timestamp.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(User.$type, User);

function createBaseCreateUserDto(): CreateUserDto {
  return { $type: "api.auth.CreateUserDto", email: "", password: "" };
}

export const CreateUserDto: MessageFns<
  CreateUserDto,
  "api.auth.CreateUserDto"
> = {
  $type: "api.auth.CreateUserDto" as const,

  encode(
    message: CreateUserDto,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.email !== "") {
      writer.uint32(10).string(message.email);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    if (message.username !== undefined) {
      writer.uint32(26).string(message.username);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CreateUserDto {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateUserDto();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.email = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.password = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.username = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(CreateUserDto.$type, CreateUserDto);

function createBaseTokenPayload(): TokenPayload {
  return { $type: "api.auth.TokenPayload", userId: "", email: "", role: 0 };
}

export const TokenPayload: MessageFns<TokenPayload, "api.auth.TokenPayload"> = {
  $type: "api.auth.TokenPayload" as const,

  encode(
    message: TokenPayload,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.email !== "") {
      writer.uint32(18).string(message.email);
    }
    if (message.role !== 0) {
      writer.uint32(24).int32(message.role);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): TokenPayload {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenPayload();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.email = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.role = reader.int32() as any;
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(TokenPayload.$type, TokenPayload);

function createBaseLoginRequest(): LoginRequest {
  return { $type: "api.auth.LoginRequest" };
}

export const LoginRequest: MessageFns<LoginRequest, "api.auth.LoginRequest"> = {
  $type: "api.auth.LoginRequest" as const,

  encode(
    message: LoginRequest,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.user !== undefined) {
      User.encode(message.user, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): LoginRequest {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLoginRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.user = User.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(LoginRequest.$type, LoginRequest);

function createBaseRegisterRequest(): RegisterRequest {
  return { $type: "api.auth.RegisterRequest" };
}

export const RegisterRequest: MessageFns<
  RegisterRequest,
  "api.auth.RegisterRequest"
> = {
  $type: "api.auth.RegisterRequest" as const,

  encode(
    message: RegisterRequest,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.user !== undefined) {
      CreateUserDto.encode(message.user, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RegisterRequest {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.user = CreateUserDto.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(RegisterRequest.$type, RegisterRequest);

function createBaseRefreshTokenRequest(): RefreshTokenRequest {
  return { $type: "api.auth.RefreshTokenRequest" };
}

export const RefreshTokenRequest: MessageFns<
  RefreshTokenRequest,
  "api.auth.RefreshTokenRequest"
> = {
  $type: "api.auth.RefreshTokenRequest" as const,

  encode(
    message: RefreshTokenRequest,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.user !== undefined) {
      User.encode(message.user, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(
    input: BinaryReader | Uint8Array,
    length?: number,
  ): RefreshTokenRequest {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRefreshTokenRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.user = User.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(RefreshTokenRequest.$type, RefreshTokenRequest);

function createBaseSocialCallbackRequest(): SocialCallbackRequest {
  return { $type: "api.auth.SocialCallbackRequest" };
}

export const SocialCallbackRequest: MessageFns<
  SocialCallbackRequest,
  "api.auth.SocialCallbackRequest"
> = {
  $type: "api.auth.SocialCallbackRequest" as const,

  encode(
    message: SocialCallbackRequest,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.user !== undefined) {
      User.encode(message.user, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(
    input: BinaryReader | Uint8Array,
    length?: number,
  ): SocialCallbackRequest {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSocialCallbackRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.user = User.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(SocialCallbackRequest.$type, SocialCallbackRequest);

function createBaseVerifyRefreshTokenRequest(): VerifyRefreshTokenRequest {
  return {
    $type: "api.auth.VerifyRefreshTokenRequest",
    refreshToken: "",
    email: "",
  };
}

export const VerifyRefreshTokenRequest: MessageFns<
  VerifyRefreshTokenRequest,
  "api.auth.VerifyRefreshTokenRequest"
> = {
  $type: "api.auth.VerifyRefreshTokenRequest" as const,

  encode(
    message: VerifyRefreshTokenRequest,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.refreshToken !== "") {
      writer.uint32(10).string(message.refreshToken);
    }
    if (message.email !== "") {
      writer.uint32(18).string(message.email);
    }
    return writer;
  },

  decode(
    input: BinaryReader | Uint8Array,
    length?: number,
  ): VerifyRefreshTokenRequest {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVerifyRefreshTokenRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.refreshToken = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.email = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(
  VerifyRefreshTokenRequest.$type,
  VerifyRefreshTokenRequest,
);

function createBaseVerifyUserRequest(): VerifyUserRequest {
  return { $type: "api.auth.VerifyUserRequest", email: "", password: "" };
}

export const VerifyUserRequest: MessageFns<
  VerifyUserRequest,
  "api.auth.VerifyUserRequest"
> = {
  $type: "api.auth.VerifyUserRequest" as const,

  encode(
    message: VerifyUserRequest,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.email !== "") {
      writer.uint32(10).string(message.email);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): VerifyUserRequest {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVerifyUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.email = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.password = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(VerifyUserRequest.$type, VerifyUserRequest);

function createBaseAuthResponse(): AuthResponse {
  return { $type: "api.auth.AuthResponse", accessToken: "", refreshToken: "" };
}

export const AuthResponse: MessageFns<AuthResponse, "api.auth.AuthResponse"> = {
  $type: "api.auth.AuthResponse" as const,

  encode(
    message: AuthResponse,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    if (message.accessToken !== "") {
      writer.uint32(10).string(message.accessToken);
    }
    if (message.refreshToken !== "") {
      writer.uint32(18).string(message.refreshToken);
    }
    if (message.expiresAccessToken !== undefined) {
      Timestamp.encode(
        message.expiresAccessToken,
        writer.uint32(26).fork(),
      ).join();
    }
    if (message.expiresRefreshToken !== undefined) {
      Timestamp.encode(
        message.expiresRefreshToken,
        writer.uint32(34).fork(),
      ).join();
    }
    if (message.redirect !== undefined) {
      writer.uint32(40).bool(message.redirect);
    }
    if (message.redirectUrl !== undefined) {
      writer.uint32(50).string(message.redirectUrl);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): AuthResponse {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAuthResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.accessToken = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.refreshToken = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.expiresAccessToken = Timestamp.decode(
            reader,
            reader.uint32(),
          );
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.expiresRefreshToken = Timestamp.decode(
            reader,
            reader.uint32(),
          );
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.redirect = reader.bool();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.redirectUrl = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};

messageTypeRegistry.set(AuthResponse.$type, AuthResponse);

/** Auth specific messages */

export interface AuthServiceClient {
  login(request: LoginRequest): Observable<AuthResponse>;

  register(request: RegisterRequest): Observable<AuthResponse>;

  refreshToken(request: RefreshTokenRequest): Observable<AuthResponse>;

  googleCallback(request: SocialCallbackRequest): Observable<AuthResponse>;

  githubCallback(request: SocialCallbackRequest): Observable<AuthResponse>;

  verifyRefreshToken(request: VerifyRefreshTokenRequest): Observable<User>;

  verifyUser(request: VerifyUserRequest): Observable<User>;
}

/** Auth specific messages */

export interface AuthServiceController {
  login(
    request: LoginRequest,
  ): Promise<AuthResponse> | Observable<AuthResponse> | AuthResponse;

  register(
    request: RegisterRequest,
  ): Promise<AuthResponse> | Observable<AuthResponse> | AuthResponse;

  refreshToken(
    request: RefreshTokenRequest,
  ): Promise<AuthResponse> | Observable<AuthResponse> | AuthResponse;

  googleCallback(
    request: SocialCallbackRequest,
  ): Promise<AuthResponse> | Observable<AuthResponse> | AuthResponse;

  githubCallback(
    request: SocialCallbackRequest,
  ): Promise<AuthResponse> | Observable<AuthResponse> | AuthResponse;

  verifyRefreshToken(
    request: VerifyRefreshTokenRequest,
  ): Promise<User> | Observable<User> | User;

  verifyUser(
    request: VerifyUserRequest,
  ): Promise<User> | Observable<User> | User;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "login",
      "register",
      "refreshToken",
      "googleCallback",
      "githubCallback",
      "verifyRefreshToken",
      "verifyUser",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod("AuthService", method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod("AuthService", method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";

export interface MessageFns<T, V extends string> {
  readonly $type: V;
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
}
