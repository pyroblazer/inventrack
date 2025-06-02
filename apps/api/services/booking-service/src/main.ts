import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { BookingModule } from './booking.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(BookingModule, {
    transport: Transport.GRPC,
    options: {
      package: 'api.booking',
      protoPath: join(__dirname, '../../../libs/proto/src/proto/booking.proto'),
      url: `${process.env.BOOKING_SERVICE_HOST ?? 'localhost'}:${process.env.BOOKING_SERVICE_PORT ?? '3343'}`,
    },
  });

  await app.listen();
  console.log('Booking Microservice is listening on gRPC');
}

bootstrap().catch((error: unknown) => {
  console.error(
    `[ERROR] Error starting booking service: ${JSON.stringify(error)}`,
  );
  process.exit(1);
});
