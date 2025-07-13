/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// apps/api/services/reporting-service/src/reporting.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { ReportingProto } from '@microservices/proto';
import {
  type NeonDatabaseType,
  bookings,
  inventoryItems,
  users,
  usageLogs,
  overdueReturns,
  eq,
  and,
  gte,
  lte,
  sql,
  desc,
  asc,
} from '@microservices/database';
import { UTApi } from 'uploadthing/server';
import { UploadedFileData, UploadFileResult } from 'uploadthing/types';

interface TopItemQueryResult {
  itemId: string;
  name: string | null;
  bookingCount: number;
}

interface CategoryStatsQueryResult {
  category: string | null;
  totalBookings: number;
}

interface UsageTrendsQueryResult {
  date: string;
  count: number;
}

interface OverdueReturnsQueryResult {
  bookingId: string;
  itemId: string;
  itemName: string | null;
  dueDate: Date;
  userId: string;
  userName: string | null;
}

interface BookingHistoryQueryResult {
  bookingId: string;
  itemId: string;
  itemName: string | null;
  status: string | null;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

interface UsageLogsQueryResult {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  itemId: string;
  itemName: string | null;
  itemCategory: string | null;
  action: string;
  performedAt: Date | null;
}

@Injectable()
export class ReportingService {
  private readonly utapi: UTApi;

  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly database: NeonDatabaseType,
  ) {
    // Initialize UploadThing API
    this.utapi = new UTApi({
      apiKey: process.env.UPLOADTHING_SECRET || '',
    });
  }

  public async getAdminDashboardData(
    request: ReportingProto.DashboardRequest,
  ): Promise<ReportingProto.AdminDashboardResponse> {
    try {
      const start: Date = new Date(request.startDate);
      const end: Date = new Date(request.endDate);

      // Validate date range
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Invalid date format provided',
        });
      }

      if (start > end) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Start date cannot be after end date',
        });
      }

      // Get top items by booking count
      const topItemsQuery: TopItemQueryResult[] = await this.database
        .select({
          itemId: inventoryItems.id,
          name: inventoryItems.name,
          bookingCount: sql<number>`count(${bookings.id})`.as('booking_count'),
        })
        .from(bookings)
        .innerJoin(
          inventoryItems as any,
          eq(bookings.itemId, inventoryItems.id),
        )
        .where(
          and(gte(bookings.createdAt, start), lte(bookings.createdAt, end)),
        )
        .groupBy(inventoryItems.id, inventoryItems.name)
        .orderBy(desc(sql`count(${bookings.id})`))
        .limit(10);

      const items: ReportingProto.TopItem[] = topItemsQuery.map(
        (item: TopItemQueryResult) => ({
          $type: 'api.reporting.TopItem' as const,
          itemId: item.itemId.toString(),
          name: item.name ?? 'Unknown Item',
          bookingCount: item.bookingCount,
        }),
      );

      // Get category statistics
      const categoryStatsQuery: CategoryStatsQueryResult[] = await this.database
        .select({
          category: inventoryItems.category,
          totalBookings: sql<number>`count(${bookings.id})`.as(
            'total_bookings',
          ),
        })
        .from(bookings)
        .innerJoin(
          inventoryItems as any,
          eq(bookings.itemId, inventoryItems.id),
        )
        .where(
          and(gte(bookings.createdAt, start), lte(bookings.createdAt, end)),
        )
        .groupBy(inventoryItems.category);

      const categoryStats: ReportingProto.CategoryBookings[] =
        categoryStatsQuery.map((stat: CategoryStatsQueryResult) => ({
          $type: 'api.reporting.CategoryBookings' as const,
          category: stat.category ?? 'Uncategorized',
          totalBookings: stat.totalBookings,
        }));

      // Get usage trends (daily booking counts)
      const usageTrendsQuery: UsageTrendsQueryResult[] = await this.database
        .select({
          date: sql<string>`DATE(${bookings.createdAt})`.as('date'),
          count: sql<number>`count(${bookings.id})`.as('count'),
        })
        .from(bookings)
        .where(
          and(gte(bookings.createdAt, start), lte(bookings.createdAt, end)),
        )
        .groupBy(sql`DATE(${bookings.createdAt})`)
        .orderBy(asc(sql`DATE(${bookings.createdAt})`));

      const usageTrends: ReportingProto.UsageTrend[] = usageTrendsQuery.map(
        (trend: UsageTrendsQueryResult) => ({
          $type: 'api.reporting.UsageTrend' as const,
          date: trend.date,
          count: trend.count,
        }),
      );

      // Get overdue returns
      const overdueReturnsQuery: OverdueReturnsQueryResult[] =
        await this.database
          .select({
            bookingId: overdueReturns.bookingId,
            itemId: inventoryItems.id,
            itemName: inventoryItems.name,
            dueDate: overdueReturns.dueDate,
            userId: users.id,
            userName: users.username,
          })
          .from(overdueReturns)
          .innerJoin(bookings as any, eq(overdueReturns.bookingId, bookings.id))
          .innerJoin(
            inventoryItems as any,
            eq(bookings.itemId, inventoryItems.id),
          )
          .innerJoin(users as any, eq(bookings.userId, users.id))
          .where(
            and(
              gte(overdueReturns.detectedAt, start),
              lte(overdueReturns.detectedAt, end),
            ),
          );

      const overdueReturnsData: ReportingProto.OverdueReturn[] =
        overdueReturnsQuery.map((overdue: OverdueReturnsQueryResult) => ({
          $type: 'api.reporting.OverdueReturn' as const,
          bookingId: overdue.bookingId.toString(),
          itemId: overdue.itemId.toString(),
          dueDate: overdue.dueDate.toISOString(),
          userId: overdue.userId.toString(),
        }));

      return {
        $type: 'api.reporting.AdminDashboardResponse' as const,
        items,
        categoryStats,
        usageTrends,
        overdueReturns: overdueReturnsData,
      } satisfies ReportingProto.AdminDashboardResponse;
    } catch (error) {
      console.error('[ERROR] Error in getAdminDashboardData function:', error);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }

  public async getStaffDashboardData(
    request: ReportingProto.StaffDashboardRequest,
  ): Promise<ReportingProto.StaffDashboardResponse> {
    try {
      const userId: string = request.userId;

      const bookingHistoryQuery: BookingHistoryQueryResult[] =
        await this.database
          .select({
            bookingId: bookings.id,
            itemId: inventoryItems.id,
            itemName: inventoryItems.name,
            status: bookings.status,
            startDate: bookings.startTime,
            endDate: bookings.endTime,
            createdAt: bookings.createdAt,
          })
          .from(bookings)
          .innerJoin(
            inventoryItems as any,
            eq(bookings.itemId, inventoryItems.id),
          )
          .where(eq(bookings.userId, userId))
          .orderBy(desc(bookings.createdAt))
          .limit(50);

      const history: ReportingProto.BookingHistory[] = bookingHistoryQuery.map(
        (booking: BookingHistoryQueryResult) => ({
          $type: 'api.reporting.BookingHistory' as const,
          bookingId: booking.bookingId.toString(),
          itemId: booking.itemId.toString(),
          status: booking.status ?? 'pending',
          startDate: booking.startDate.toISOString(),
          endDate: booking.endDate.toISOString(),
        }),
      );

      return {
        $type: 'api.reporting.StaffDashboardResponse' as const,
        history,
      } satisfies ReportingProto.StaffDashboardResponse;
    } catch (error) {
      console.error('[ERROR] Error in getStaffDashboardData function:', error);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }

  public async exportUsageLogs(
    request: ReportingProto.ExportRequest,
  ): Promise<ReportingProto.ExportResponse> {
    try {
      const { format, rangeStart, rangeEnd }: ReportingProto.ExportRequest =
        request;

      const start: Date = new Date(rangeStart);
      const end: Date = new Date(rangeEnd);

      // Validate inputs
      if (!format || !rangeStart || !rangeEnd) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message:
            'Missing required parameters: format, rangeStart, or rangeEnd',
        });
      }

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Invalid date format provided',
        });
      }

      if (start > end) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Start date cannot be after end date',
        });
      }

      const supportedFormats: string[] = ['csv', 'pdf'];
      if (!supportedFormats.includes(format.toLowerCase())) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: `Unsupported format: ${format}. Supported formats: ${supportedFormats.join(', ')}`,
        });
      }

      // Fetch usage logs data
      const usageLogsQuery: UsageLogsQueryResult[] = await this.database
        .select({
          id: usageLogs.id,
          userId: usageLogs.userId,
          userName: users.username,
          userEmail: users.email,
          itemId: usageLogs.itemId,
          itemName: inventoryItems.name,
          itemCategory: inventoryItems.category,
          action: usageLogs.action,
          performedAt: usageLogs.performedAt,
        })
        .from(usageLogs)
        .innerJoin(users as any, eq(usageLogs.userId, users.id))
        .innerJoin(
          inventoryItems as any,
          eq(usageLogs.itemId, inventoryItems.id),
        )
        .where(
          and(
            gte(usageLogs.performedAt, start),
            lte(usageLogs.performedAt, end),
          ),
        )
        .orderBy(desc(usageLogs.performedAt));

      let fileContent: string;
      let fileName: string;
      let mimeType: string;

      const formatLower: string = format.toLowerCase();
      const startDateStr: string = start.toISOString().split('T')[0]!;
      const endDateStr: string = end.toISOString().split('T')[0]!;

      if (formatLower === 'csv') {
        // Generate CSV content with proper escaping
        const headers: string[] = [
          'ID',
          'User ID',
          'User Name',
          'User Email',
          'Item ID',
          'Item Name',
          'Item Category',
          'Action',
          'Performed At',
        ];

        const csvRows: string[] = [
          headers.join(','),
          ...usageLogsQuery.map((log: UsageLogsQueryResult) => {
            const escapeCsvField = (
              field: string | number | null | undefined,
            ): string => {
              const str: string = String(field ?? '');
              // Escape quotes and wrap in quotes if contains comma, quote, or newline
              if (
                str.includes(',') ||
                str.includes('"') ||
                str.includes('\n')
              ) {
                return `"${str.replace(/"/g, '""')}"`;
              }
              return str;
            };

            return [
              escapeCsvField(log.id),
              escapeCsvField(log.userId),
              escapeCsvField(log.userName ?? 'Unknown'),
              escapeCsvField(log.userEmail ?? 'Unknown'),
              escapeCsvField(log.itemId),
              escapeCsvField(log.itemName ?? 'Unknown'),
              escapeCsvField(log.itemCategory ?? 'Uncategorized'),
              escapeCsvField(log.action),
              escapeCsvField(log.performedAt?.toISOString() ?? ''),
            ].join(',');
          }),
        ];

        fileContent = csvRows.join('\n');
        fileName = `usage-logs-${startDateStr}-to-${endDateStr}.csv`;
        mimeType = 'text/csv';
      } else if (formatLower === 'pdf') {
        // Generate text-based report (in production, use a proper PDF library)
        const reportLines: string[] = [
          'Usage Logs Report',
          '==================',
          `Period: ${start.toDateString()} to ${end.toDateString()}`,
          `Generated: ${new Date().toISOString()}`,
          `Total Records: ${usageLogsQuery.length}`,
          '',
          'Usage Log Entries:',
          '==================',
          ...usageLogsQuery
            .map((log: UsageLogsQueryResult, index: number) => [
              `${index + 1}. ID: ${log.id}`,
              `   User: ${log.userName ?? 'Unknown'} (${log.userEmail ?? 'Unknown'})`,
              `   Item: ${log.itemName ?? 'Unknown'} (ID: ${log.itemId})`,
              `   Category: ${log.itemCategory ?? 'Uncategorized'}`,
              `   Action: ${log.action}`,
              `   Performed At: ${log.performedAt?.toISOString() ?? 'Unknown'}`,
              '',
            ])
            .flat(),
        ];

        fileContent = reportLines.join('\n');
        fileName = `usage-logs-${startDateStr}-to-${endDateStr}.txt`;
        mimeType = 'text/plain';
      } else {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: `Unsupported format: ${format}`,
        });
      }

      // Upload to UploadThing
      const fileBlob: Blob = new Blob([fileContent], { type: mimeType });
      const file: File = new File([fileBlob], fileName, { type: mimeType });

      const uploadResult: UploadFileResult[] = await this.utapi.uploadFiles([
        file,
      ]);

      if (!uploadResult[0] || uploadResult[0].error) {
        const errorMessage: string = 'Upload error';
        console.error('[ERROR] Upload failed:', errorMessage);
        throw new RpcException({
          code: status.INTERNAL,
          message: `File upload failed: ${errorMessage}`,
        });
      }

      if (!uploadResult[0].data?.url) {
        throw new RpcException({
          code: status.INTERNAL,
          message: 'Upload completed but no URL returned',
        });
      }

      return {
        $type: 'api.reporting.ExportResponse' as const,
        downloadUrl: uploadResult[0].data.url,
      } satisfies ReportingProto.ExportResponse;
    } catch (error) {
      console.error('[ERROR] Error in exportUsageLogs function:', error);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: status.INTERNAL,
        message: error instanceof Error ? error.message : 'Internal error',
      });
    }
  }
}
