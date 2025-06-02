// apps/api/services/api-gateway/src/controllers/audit.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard } from '@microservices/common';
import { AuditProto } from '@microservices/proto';
import { firstValueFrom } from 'rxjs';

interface AuditUser {
  id: string;
  email: string;
  role: 'admin' | 'staff';
}

@Controller('audits')
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(
    @Inject('AUDIT_SERVICE') private readonly auditClient: ClientProxy,
  ) {}

  /**
   * Creates a new audit log entry
   * POST /audits
   */
  @Post()
  async createAuditLog(
    @Body()
    recordActionDto: {
      action: string;
      entityType: string;
      entityId: string;
      details?: string;
      metadata?: Record<string, any>;
    },
    @CurrentUser() user: AuditUser,
  ): Promise<AuditProto.RecordActionResponse> {
    const request: AuditProto.RecordActionRequest = {
      $type: 'api.audit.RecordActionRequest',
      userId: user.id,
      action: recordActionDto.action,
      entityType: recordActionDto.entityType,
      entityId: recordActionDto.entityId,
      details: recordActionDto.details,
      metadata: recordActionDto.metadata
        ? JSON.stringify(recordActionDto.metadata)
        : undefined,
    };

    return await firstValueFrom(
      this.auditClient.send('AuditService.recordAction', request),
    );
  }

  /**
   * Gets all audit logs (admin only)
   * GET /audits
   */
  @Get()
  async getAllAuditLogs(
    @CurrentUser() user: AuditUser,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('action') action?: string,
    @Query('entityType') entityType?: string,
    @Query('userId') userId?: string,
  ): Promise<AuditProto.GetAllLogsResponse> {
    // Admin only access
    if (user.role !== 'admin') {
      throw new ForbiddenException('Access denied. Admin role required.');
    }

    const request: AuditProto.GetAllLogsRequest = {
      $type: 'api.audit.GetAllLogsRequest',
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
      action,
      entityType,
      userId,
    };

    return await firstValueFrom(
      this.auditClient.send('AuditService.getAllLogs', request),
    );
  }

  /**
   * Gets audit logs for current user
   * GET /audits/me
   */
  @Get('me')
  async getMyAuditLogs(
    @CurrentUser() user: AuditUser,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<AuditProto.GetLogsByUserResponse> {
    const request: AuditProto.GetLogsByUserRequest = {
      $type: 'api.audit.GetLogsByUserRequest',
      userId: user.id,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };

    return await firstValueFrom(
      this.auditClient.send('AuditService.getLogsByUser', request),
    );
  }
}
