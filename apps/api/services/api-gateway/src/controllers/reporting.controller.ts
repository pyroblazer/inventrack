import { CurrentUser, JwtAuthGuard } from '@microservices/common';
import { ReportingProto, UsersProto } from '@microservices/proto';
import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  OnModuleInit,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GrpcClientProxy } from '../proxies/grpc-client.proxy';
import { handleGrpcError } from '../utils/grpc-error.util';
import { CACHE_TTL, CacheGroup, CacheTTL } from 'src/caching/cache.decorator';
import { CustomCacheInterceptor } from 'src/caching/custom-cache.interceptor';

/**
 * Controller handling reporting-related operations through gRPC communication
 * with the reporting microservice.
 * @class ReportingController
 */
@ApiTags('Reporting')
@ApiBearerAuth()
@Controller('reporting')
@UseInterceptors(CustomCacheInterceptor)
@CacheGroup('reporting')
export class ReportingController implements OnModuleInit {
  private reportingService: ReportingProto.ReportingServiceClient;

  constructor(
    @Inject('REPORTING_SERVICE') private readonly client: ClientGrpc,
    private readonly grpcClient: GrpcClientProxy,
  ) {}

  public onModuleInit(): void {
    this.reportingService =
      this.client.getService<ReportingProto.ReportingServiceClient>(
        'ReportingService',
      );
  }

  /**
   * Retrieves admin dashboard data for a given date range
   * @param {UsersProto.User} user - The authenticated user (must be admin)
   * @param {string} startDate - Start date for the dashboard data (ISO string)
   * @param {string} endDate - End date for the dashboard data (ISO string)
   * @returns {Promise<ReportingProto.AdminDashboardResponse>} Admin dashboard data
   * @throws {NotFoundException} When user is not found
   * @throws {BadRequestException} When date parameters are invalid
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Get admin dashboard data for date range' })
  @ApiQuery({
    name: 'startDate',
    type: 'string',
    description: 'Start date (ISO format)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    type: 'string',
    description: 'End date (ISO format)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin dashboard data retrieved successfully',
    type: JSON.stringify(ReportingProto.AdminDashboardResponse),
  })
  @ApiResponse({ status: 400, description: 'Invalid date parameters' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @UseGuards(JwtAuthGuard)
  @CacheTTL(CACHE_TTL.FIFTEEN_MINUTES)
  @Get('admin-dashboard')
  public async getAdminDashboard(
    @CurrentUser() user: UsersProto.User,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ReportingProto.AdminDashboardResponse> {
    if (!user.id) {
      throw new NotFoundException('Unauthorized: User not found');
    }

    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    // Validate date format
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Use ISO string format',
      );
    }

    if (start >= end) {
      throw new BadRequestException('Start date must be before end date');
    }

    try {
      const request: ReportingProto.DashboardRequest = {
        $type: 'api.reporting.DashboardRequest',
        startDate,
        endDate,
      };

      return await this.grpcClient.call<ReportingProto.AdminDashboardResponse>(
        this.reportingService.getAdminDashboardData(request),
        'Reporting.getAdminDashboardData',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }

  /**
   * Retrieves staff dashboard data for the current user
   * @param {UsersProto.User} user - The authenticated user
   * @returns {Promise<ReportingProto.StaffDashboardResponse>} Staff dashboard data
   * @throws {NotFoundException} When user is not found
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Get staff dashboard data for current user' })
  @ApiResponse({
    status: 200,
    description: 'Staff dashboard data retrieved successfully',
    type: JSON.stringify(ReportingProto.StaffDashboardResponse),
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @UseGuards(JwtAuthGuard)
  @CacheTTL(CACHE_TTL.FIVE_MINUTES)
  @Get('staff-dashboard')
  public async getStaffDashboard(
    @CurrentUser() user: UsersProto.User,
  ): Promise<ReportingProto.StaffDashboardResponse> {
    if (!user.id) {
      throw new NotFoundException('Unauthorized: User not found');
    }

    try {
      const request: ReportingProto.StaffDashboardRequest = {
        $type: 'api.reporting.StaffDashboardRequest',
        userId: user.id.toString(),
      };

      return await this.grpcClient.call<ReportingProto.StaffDashboardResponse>(
        this.reportingService.getStaffDashboardData(request),
        'Reporting.getStaffDashboardData',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }

  /**
   * Exports usage logs in the specified format and date range
   * @param {UsersProto.User} user - The authenticated user (must be admin)
   * @param {ReportingProto.ExportRequest} exportRequest - Export configuration
   * @returns {Promise<ReportingProto.ExportResponse>} Export response with download URL
   * @throws {NotFoundException} When user is not found
   * @throws {BadRequestException} When export parameters are invalid
   * @throws {GrpcException} When gRPC service fails
   */
  @ApiOperation({ summary: 'Export usage logs in CSV or PDF format' })
  @ApiBody({
    type: JSON.stringify(ReportingProto.ExportRequest),
    description: 'Export configuration including format and date range',
  })
  @ApiResponse({
    status: 200,
    description: 'Export initiated successfully, download URL provided',
    type: JSON.stringify(ReportingProto.ExportResponse),
  })
  @ApiResponse({ status: 400, description: 'Invalid export parameters' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'gRPC service error' })
  @UseGuards(JwtAuthGuard)
  @Post('export-usage-logs')
  public async exportUsageLogs(
    @CurrentUser() user: UsersProto.User,
    @Body() exportRequest: ReportingProto.ExportRequest,
  ): Promise<ReportingProto.ExportResponse> {
    if (!user.id) {
      throw new NotFoundException('Unauthorized: User not found');
    }

    // Validate export format
    const validFormats = ['csv', 'pdf'];
    if (
      !exportRequest.format ||
      !validFormats.includes(exportRequest.format.toLowerCase())
    ) {
      throw new BadRequestException('Format must be either "csv" or "pdf"');
    }

    // Validate date range if provided
    if (exportRequest.rangeStart && exportRequest.rangeEnd) {
      const start = new Date(exportRequest.rangeStart);
      const end = new Date(exportRequest.rangeEnd);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException(
          'Invalid date format. Use ISO string format',
        );
      }

      if (start >= end) {
        throw new BadRequestException('Range start must be before range end');
      }
    }

    try {
      const request: ReportingProto.ExportRequest = {
        $type: 'api.reporting.ExportRequest',
        format: exportRequest.format.toLowerCase(),
        rangeStart: exportRequest.rangeStart || '',
        rangeEnd: exportRequest.rangeEnd || '',
      };

      return await this.grpcClient.call<ReportingProto.ExportResponse>(
        this.reportingService.exportUsageLogs(request),
        'Reporting.exportUsageLogs',
      );
    } catch (error) {
      handleGrpcError(error);
    }
  }
}
