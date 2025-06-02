/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// apps/api/services/audit-service/src/audit.service.ts
import {
  auditLogs,
  DATABASE_CONNECTION,
  eq,
  and,
  desc,
  gte,
  lte,
  count,
  type DrizzleDatabase,
  SQL,
} from '@microservices/database';
import { status } from '@grpc/grpc-js';
import { type AuditProto } from '@microservices/proto';
import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { timestampToDate, dateToTimestamp } from '@microservices/common';

@Injectable()
export class AuditService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: DrizzleDatabase,
  ) {}

  public async recordAction(
    request: AuditProto.RecordActionRequest,
  ): Promise<AuditProto.RecordActionResponse> {
    try {
      if (
        !request.userId ||
        !request.action ||
        !request.entityType ||
        !request.entityId
      ) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message:
            'Missing required fields: userId, action, entityType, entityId',
        });
      }

      const result = await this.database
        .insert(auditLogs)
        .values({
          userId: request.userId,
          action: request.action,
          entityType: request.entityType,
          entityId: request.entityId,
          details: request.details || null,
          metadata: request.metadata ? JSON.parse(request.metadata) : null,
          createdAt: request.createdAt
            ? timestampToDate(request.createdAt)
            : new Date(),
        })
        .returning({ id: auditLogs.id });

      return {
        $type: 'api.audit.RecordActionResponse',
        id: result[0]!.id,
      };
    } catch (error: unknown) {
      console.error(`[ERROR] recordAction: ${JSON.stringify(error)}`);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }

  public async getLogsByUser(
    request: AuditProto.GetLogsByUserRequest,
  ): Promise<AuditProto.GetLogsByUserResponse> {
    try {
      if (!request.userId) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'userId is required',
        });
      }

      const limit = request.limit || 50;
      const offset = request.offset || 0;

      // Get total count
      const whereClause = eq(auditLogs.userId, request.userId);
      const totalResult = await this.database
        .select({ count: count() })
        .from(auditLogs)
        .where(whereClause);

      // Get logs with pagination
      const logs = await this.database
        .select()
        .from(auditLogs)
        .where(whereClause)
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        $type: 'api.audit.GetLogsByUserResponse',
        logs: logs.map((log) => ({
          $type: 'api.audit.AuditLogEntry' as const,
          id: log.id,
          userId: log.userId,
          action: log.action,
          entityType: log.entityType,
          entityId: log.entityId,
          details: log.details || undefined,
          metadata: log.metadata ? JSON.stringify(log.metadata) : undefined,
          createdAt: dateToTimestamp(log.createdAt!),
        })),
        total: totalResult[0]?.count || 0,
      };
    } catch (error: unknown) {
      console.error(`[ERROR] getLogsByUser: ${JSON.stringify(error)}`);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }

  public async getAllLogs(
    request: AuditProto.GetAllLogsRequest,
  ): Promise<AuditProto.GetAllLogsResponse> {
    try {
      const limit = request.limit || 100;
      const offset = request.offset || 0;

      // Build where conditions - fix potential SQL type issues
      const conditions: (SQL<unknown> | undefined)[] = [];

      if (request.action) {
        conditions.push(eq(auditLogs.action, request.action));
      }

      if (request.entityType) {
        conditions.push(eq(auditLogs.entityType, request.entityType));
      }

      if (request.userId) {
        conditions.push(eq(auditLogs.userId, request.userId));
      }

      if (request.startDate) {
        conditions.push(
          gte(auditLogs.createdAt, timestampToDate(request.startDate)),
        );
      }

      if (request.endDate) {
        conditions.push(
          lte(auditLogs.createdAt, timestampToDate(request.endDate)),
        );
      }

      // Filter out undefined conditions and ensure proper typing
      const validConditions = conditions.filter(
        (condition): condition is SQL<unknown> => condition !== undefined,
      );
      const whereClause =
        validConditions.length > 0 ? and(...validConditions) : undefined;

      // Get total count
      const totalResult = await this.database
        .select({ count: count() })
        .from(auditLogs)
        .where(whereClause);

      // Get logs with pagination
      const logs = await this.database
        .select()
        .from(auditLogs)
        .where(whereClause)
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        $type: 'api.audit.GetAllLogsResponse',
        logs: logs.map((log) => ({
          $type: 'api.audit.AuditLogEntry' as const,
          id: log.id,
          userId: log.userId,
          action: log.action,
          entityType: log.entityType,
          entityId: log.entityId,
          details: log.details || undefined,
          metadata: log.metadata ? JSON.stringify(log.metadata) : undefined,
          createdAt: dateToTimestamp(log.createdAt!),
        })),
        total: totalResult[0]?.count || 0,
      };
    } catch (error: unknown) {
      console.error(`[ERROR] getAllLogs: ${JSON.stringify(error)}`);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }

  // Helper method for easy audit logging from other services
  public async logAction(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    details?: string,
    metadata?: Record<string, any>,
  ): Promise<string> {
    const request: AuditProto.RecordActionRequest = {
      $type: 'api.audit.RecordActionRequest',
      userId,
      action,
      entityType,
      entityId,
      details,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
      createdAt: dateToTimestamp(new Date()),
    };

    const response = await this.recordAction(request);
    return response.id;
  }
}
