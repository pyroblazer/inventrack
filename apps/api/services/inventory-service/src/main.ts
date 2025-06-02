import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { InventoryModule } from './inventory.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(InventoryModule, {
    transport: Transport.GRPC,
    options: {
      package: 'api.inventory',
      protoPath: join(
        __dirname,
        '../../../libs/proto/src/proto/inventory.proto',
      ),
      url: `${process.env.INVENTORY_SERVICE_HOST ?? 'localhost'}:${process.env.INVENTORY_SERVICE_PORT ?? '3344'}`,
    },
  });

  await app.listen();
  console.log('Inventory Microservice is listening on gRPC');
}

bootstrap().catch((error: unknown) => {
  console.error(
    `[ERROR] Error starting inventory service: ${JSON.stringify(error)}`,
  );
  process.exit(1);
});
