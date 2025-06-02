// apps/api/services/notification-service/src/notification.module.ts
import { Module } from '@nestjs/common';
import { NotificationServiceImpl } from './notification.service';
import { NotificationController } from './notification.controller';
import { RedisModule } from '@microservices/redis';
import { DatabaseModule } from '@microservices/database';

@Module({
  imports: [RedisModule, DatabaseModule],
  controllers: [NotificationController],
  providers: [NotificationServiceImpl],
})
export class NotificationModule {}
