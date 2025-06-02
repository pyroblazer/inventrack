/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// apps/api/services/audit-service/src/audit.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuditService } from './audit.service';
import { AuditProto } from '@microservices/proto';

@Controller()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @GrpcMethod('AuditService', 'recordAction')
  async recordAction(
    data: AuditProto.RecordActionRequest,
  ): Promise<AuditProto.RecordActionResponse> {
    const result = await this.auditService.recordAction(data);
    return {
      $type: result.$type,
      id: result.id,
    };
  }

  @GrpcMethod('AuditService', 'getLogsByUser')
  async getLogsByUser(
    data: AuditProto.GetLogsByUserRequest,
  ): Promise<AuditProto.GetLogsByUserResponse> {
    const result = await this.auditService.getLogsByUser(data);
    return {
      $type: result.$type,
      logs: result.logs,
      total: result.total,
    };
  }

  @GrpcMethod('AuditService', 'getAllLogs')
  async getAllLogs(
    data: AuditProto.GetAllLogsRequest,
  ): Promise<AuditProto.GetAllLogsResponse> {
    const result = await this.auditService.getAllLogs(data);
    return {
      $type: result.$type,
      logs: result.logs,
      total: result.total,
    };
  }
}
