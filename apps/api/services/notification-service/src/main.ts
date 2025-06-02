import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { NotificationModule } from './notification.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(NotificationModule, {
    transport: Transport.GRPC,
    options: {
      package: 'api.notification',
      protoPath: join(
        __dirname,
        '../../../libs/proto/src/proto/notification.proto',
      ),
      url: `${process.env.NOTIFICATION_SERVICE_HOST ?? 'localhost'}:${process.env.NOTIFICATION_SERVICE_PORT ?? '3345'}`,
    },
  });

  await app.listen();
  console.log('Notification Microservice is listening on gRPC');
}

bootstrap().catch((error: unknown) => {
  console.error(
    `[ERROR] Error starting notification service: ${JSON.stringify(error)}`,
  );
  process.exit(1);
});
