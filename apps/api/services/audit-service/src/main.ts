import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuditModule } from './audit.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuditModule, {
    transport: Transport.GRPC,
    options: {
      package: 'api.audit',
      protoPath: join(__dirname, '../../../libs/proto/src/proto/audit.proto'),
      url: `${process.env.AUDIT_SERVICE_HOST ?? 'localhost'}:${process.env.AUDIT_SERVICE_PORT ?? '3342'}`,
    },
  });

  await app.listen();
  console.log('Audit Microservice is listening on gRPC');
}

bootstrap().catch((error: unknown) => {
  console.error(
    `[ERROR] Error starting audit service: ${JSON.stringify(error)}`,
  );
  process.exit(1);
});
