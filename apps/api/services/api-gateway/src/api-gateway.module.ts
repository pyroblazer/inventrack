//apps/api/services/api-gateway/src/api-gateway.module.ts
import {
  GithubStrategy,
  GoogleStrategy,
  JwtRefreshStrategy,
  JwtStrategy,
  LocalStrategy,
} from '@microservices/common';
import { DatabaseModule } from '@microservices/database';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import Joi from 'joi';
import { RedisModule } from '@microservices/redis';
import { createGrpcOptions } from './config/grpc.config';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { HealthModule } from './health/health.module';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { loggerConfig } from './logging/logger.config';
import { MetricsModule } from './metrics/metrics.module';
import { HelmetMiddleware } from './middlewares/helmet.middleware';
import { AuthProxyService } from './proxies/auth.proxy.service';
import { GrpcClientProxy } from './proxies/grpc-client.proxy';
import { CustomCacheInterceptor } from './caching/custom-cache.interceptor';
import { rateLimitConfig } from './config/rate-limit.config';
import { CacheModule } from './caching/cache.module';
import { ThrottleModule } from './throttling/throttle.module';
import { AuditController } from './controllers/audit.controller';
import { BookingController } from './controllers/booking.controller';
import { InventoryController } from './controllers/inventory.controller';
import { NotificationController } from './controllers/notification.controller';
import { ReportingController } from './controllers/reporting.controller';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    // DATABASE
    DatabaseModule,
    // REDIS - CACHING
    RedisModule,
    // CACHING MODULE
    CacheModule,
    // THROTTLING MODULE
    ThrottleModule,
    // LOGGER
    loggerConfig,
    // TERMINUS - HEALTHCHECKS
    TerminusModule,
    // SCHEDULE
    ScheduleModule.forRoot(),
    // PASSPORT
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    // CONFIG
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rateLimitConfig],
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().required(),

        AUTH_SERVICE_HOST: Joi.string().required(),
        AUTH_SERVICE_PORT: Joi.number().required(),

        USERS_SERVICE_HOST: Joi.string().required(),
        USERS_SERVICE_PORT: Joi.number().required(),

        AUDIT_SERVICE_HOST: Joi.string().required(),
        AUDIT_SERVICE_PORT: Joi.number().required(),

        BOOKING_SERVICE_HOST: Joi.string().required(),
        BOOKING_SERVICE_PORT: Joi.number().required(),

        INVENTORY_SERVICE_HOST: Joi.string().required(),
        INVENTORY_SERVICE_PORT: Joi.number().required(),

        NOTIFICATION_SERVICE_HOST: Joi.string().required(),
        NOTIFICATION_SERVICE_PORT: Joi.number().required(),

        REPORTING_SERVICE_HOST: Joi.string().required(),
        REPORTING_SERVICE_PORT: Joi.number().required(),

        RATE_LIMIT_TTL: Joi.number().default(60),
        RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
        RATE_LIMIT_STORAGE: Joi.string()
          .valid('memory', 'redis')
          .default('redis'),
        REDIS_URL: Joi.string().required(),
        REDIS_TOKEN: Joi.string().required(),

        GRPC_MAX_RETRIES: Joi.number().default(5),
        GRPC_RETRY_DELAY_MS: Joi.number().default(2000),

        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_MS: Joi.string().required(),

        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_MS: Joi.string().required(),

        GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_AUTH_REDIRECT_URI: Joi.string().required(),

        GITHUB_AUTH_CLIENT_ID: Joi.string().required(),
        GITHUB_AUTH_CLIENT_SECRET: Joi.string().required(),
        GITHUB_AUTH_REDIRECT_URI: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      // AUTH
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) =>
          createGrpcOptions(
            configService.getOrThrow('AUTH_SERVICE_HOST'),
            configService.getOrThrow('AUTH_SERVICE_PORT'),
            'api.auth',
            'auth',
          ),
        inject: [ConfigService],
      },
      {
        name: 'USERS_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) =>
          createGrpcOptions(
            configService.getOrThrow('USERS_SERVICE_HOST'),
            configService.getOrThrow('USERS_SERVICE_PORT'),
            'api.users',
            'users',
          ),
        inject: [ConfigService],
      },
      {
        name: 'AUDIT_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) =>
          createGrpcOptions(
            configService.getOrThrow('AUDIT_SERVICE_HOST'),
            configService.getOrThrow('AUDIT_SERVICE_PORT'),
            'api.audit',
            'audit',
          ),
        inject: [ConfigService],
      },
      {
        name: 'BOOKING_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) =>
          createGrpcOptions(
            configService.getOrThrow('BOOKING_SERVICE_HOST'),
            configService.getOrThrow('BOOKING_SERVICE_PORT'),
            'api.booking',
            'booking',
          ),
        inject: [ConfigService],
      },
      {
        name: 'INVENTORY_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) =>
          createGrpcOptions(
            configService.getOrThrow('INVENTORY_SERVICE_HOST'),
            configService.getOrThrow('INVENTORY_SERVICE_PORT'),
            'api.inventory',
            'inventory',
          ),
        inject: [ConfigService],
      },
      {
        name: 'NOTIFICATION_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) =>
          createGrpcOptions(
            configService.getOrThrow('NOTIFICATION_SERVICE_HOST'),
            configService.getOrThrow('NOTIFICATION_SERVICE_PORT'),
            'api.notification',
            'notification',
          ),
        inject: [ConfigService],
      },
      {
        name: 'REPORTING_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) =>
          createGrpcOptions(
            configService.getOrThrow('REPORTING_SERVICE_HOST'),
            configService.getOrThrow('REPORTING_SERVICE_PORT'),
            'api.reporting',
            'reporting',
          ),
        inject: [ConfigService],
      },
    ]),
    // GRAFANA
    HealthModule,
    // PROMETHEUS
    MetricsModule,
  ],
  controllers: [
    // ROUTE CONTROLLERS
    AuthController,
    UsersController,
    AuditController,
    BookingController,
    InventoryController,
    NotificationController,
    ReportingController,
    HealthController,
  ],
  providers: [
    // AUTH PROXY
    AuthProxyService,

    // ERROR INTERCEPTOR
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },

    // Register all strategies
    LocalStrategy,
    GoogleStrategy,
    GithubStrategy,
    JwtStrategy,
    JwtRefreshStrategy,

    // THROTTLER - RATE LIMITING (uncomment for global rate limiting or use @RateLimit() decorator for specific routes)
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottleGuard,
    // },

    // CACHING ------------------
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomCacheInterceptor,
    },

    // gRPC CLIENT PROXY WITH RETRIES
    GrpcClientProxy,
    {
      provide: GrpcClientProxy,
      useClass: GrpcClientProxy,
    },
  ],
})
export class ApiGatewayModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(HelmetMiddleware).forRoutes('*');
  }
}
