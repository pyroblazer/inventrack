import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ReportingModule } from './reporting.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ReportingModule, {
    transport: Transport.GRPC,
    options: {
      package: 'api.reporting',
      protoPath: join(
        __dirname,
        '../../../libs/proto/src/proto/reporting.proto',
      ),
      url: `${process.env.REPORTING_SERVICE_HOST ?? 'localhost'}:${process.env.REPORTING_SERVICE_PORT ?? '3346'}`,
    },
  });

  await app.listen();
  console.log('Reporting Microservice is listening on gRPC');
}

bootstrap().catch((error: unknown) => {
  console.error(
    `[ERROR] Error starting reporting service: ${JSON.stringify(error)}`,
  );
  process.exit(1);
});
