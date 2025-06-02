import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ReportingService } from './reporting.service';
import { ReportingProto } from '@microservices/proto';

@Controller()
export class ReportingController {
  private readonly logger = new Logger(ReportingController.name);

  constructor(private readonly reportingService: ReportingService) {}

  @GrpcMethod('ReportingService', 'GetAdminDashboardData')
  async getAdminDashboardData(
    request: ReportingProto.DashboardRequest,
  ): Promise<ReportingProto.AdminDashboardResponse> {
    this.logger.log('GetAdminDashboardData request received:', request);
    try {
      const response =
        await this.reportingService.getAdminDashboardData(request);
      this.logger.log('GetAdminDashboardData response:', { success: true });
      return response;
    } catch (error) {
      this.logger.error('GetAdminDashboardData error:', error);
      throw error;
    }
  }

  @GrpcMethod('ReportingService', 'GetStaffDashboardData')
  async getStaffDashboardData(
    request: ReportingProto.StaffDashboardRequest,
  ): Promise<ReportingProto.StaffDashboardResponse> {
    this.logger.log('GetStaffDashboardData request received:', request);
    try {
      const response =
        await this.reportingService.getStaffDashboardData(request);
      this.logger.log('GetStaffDashboardData response:', { success: true });
      return response;
    } catch (error) {
      this.logger.error('GetStaffDashboardData error:', error);
      throw error;
    }
  }

  @GrpcMethod('ReportingService', 'ExportUsageLogs')
  async exportUsageLogs(
    request: ReportingProto.ExportRequest,
  ): Promise<ReportingProto.ExportResponse> {
    this.logger.log('ExportUsageLogs request received:', request);
    try {
      const response = await this.reportingService.exportUsageLogs(request);
      this.logger.log('ExportUsageLogs response:', { success: true });
      return response;
    } catch (error) {
      this.logger.error('ExportUsageLogs error:', error);
      throw error;
    }
  }
}
