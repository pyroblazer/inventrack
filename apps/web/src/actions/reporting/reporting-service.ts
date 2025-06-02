// apps/web/src/actions/reporting/reporting-service.ts

import { ApiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/get-error-message";
import { type ReportingEndpoints } from "@shared/types";

/**
 * Service class for reporting-related API calls
 */
export class ReportingService {
  private static readonly BASE_PATH = "/reporting";

  /**
   * Fetches admin dashboard data for a given date range
   */
  static async getAdminDashboard(
    request: Readonly<ReportingEndpoints["getAdminDashboard"]["body"]>,
  ): Promise<ReportingEndpoints["getAdminDashboard"]["response"]> {
    try {
      const response = await ApiClient.post<
        ReportingEndpoints["getAdminDashboard"]["body"],
        ReportingEndpoints["getAdminDashboard"]["response"]
      >(`${this.BASE_PATH}/admin-dashboard`, {
        body: request,
      });

      if (!response.success) {
        throw new Error("Failed to fetch admin dashboard data");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to fetch admin dashboard data:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Fetches staff dashboard data for a specific user
   */
  static async getStaffDashboard(
    request: Readonly<ReportingEndpoints["getStaffDashboard"]["body"]>,
  ): Promise<ReportingEndpoints["getStaffDashboard"]["response"]> {
    try {
      const response = await ApiClient.post<
        ReportingEndpoints["getStaffDashboard"]["body"],
        ReportingEndpoints["getStaffDashboard"]["response"]
      >(`${this.BASE_PATH}/staff-dashboard`, {
        body: request,
      });

      if (!response.success) {
        throw new Error("Failed to fetch staff dashboard data");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to fetch staff dashboard data:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Exports usage logs in the specified format and date range
   */
  static async exportUsageLogs(
    request: Readonly<ReportingEndpoints["exportUsageLogs"]["body"]>,
  ): Promise<ReportingEndpoints["exportUsageLogs"]["response"]> {
    try {
      const response = await ApiClient.post<
        ReportingEndpoints["exportUsageLogs"]["body"],
        ReportingEndpoints["exportUsageLogs"]["response"]
      >(`${this.BASE_PATH}/export-usage-logs`, {
        body: request,
      });

      if (!response.success) {
        throw new Error("Failed to export usage logs");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to export usage logs:", error);
      throw new Error(getErrorMessage(error));
    }
  }
}
