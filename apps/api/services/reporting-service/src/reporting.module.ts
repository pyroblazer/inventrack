// apps/api/services/reporting-service/src/reporting.module.ts
import { Module } from '@nestjs/common';
import { ReportingController } from './reporting.controller';
import { ReportingService } from './reporting.service';
import { DatabaseModule } from '@microservices/database';

@Module({
  imports: [DatabaseModule],
  controllers: [ReportingController],
  providers: [ReportingService],
})
export class ReportingModule {}
