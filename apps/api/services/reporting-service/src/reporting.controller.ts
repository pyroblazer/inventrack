// apps/api/services/reporting-service/src/reporting.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ReportingService } from './reporting.service';
import { ReportingProto } from '@microservices/proto';

@Controller()
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @GrpcMethod('ReportingService', 'GetAdminDashboardData')
  async getAdminDashboardData(
    request: ReportingProto.DashboardRequest,
  ): Promise<ReportingProto.AdminDashboardResponse> {
    return this.reportingService.getAdminDashboardData(request);
  }

  @GrpcMethod('ReportingService', 'GetStaffDashboardData')
  async getStaffDashboardData(
    request: ReportingProto.StaffDashboardRequest,
  ): Promise<ReportingProto.StaffDashboardResponse> {
    return this.reportingService.getStaffDashboardData(request);
  }

  @GrpcMethod('ReportingService', 'ExportUsageLogs')
  async exportUsageLogs(
    request: ReportingProto.ExportRequest,
  ): Promise<ReportingProto.ExportResponse> {
    return this.reportingService.exportUsageLogs(request);
  }
}
