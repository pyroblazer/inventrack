import { DatabaseModule } from '@microservices/database';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        USERS_SERVICE_HOST: Joi.string().required(),
        USERS_SERVICE_PORT: Joi.number().required(),
        ENCRYPTION_KEY: Joi.string().required(),
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
