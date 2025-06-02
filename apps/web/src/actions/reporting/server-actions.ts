// apps/web/src/actions/reporting/server-actions.ts

"use server";

import { ReportingService } from "@/actions/reporting/reporting-service";
import { type ReportingEndpoints } from "@shared/types";

/**
 * Fetches admin dashboard data for a given date range
 */
export async function getAdminDashboard(
  request: Readonly<ReportingEndpoints["getAdminDashboard"]["body"]>,
): Promise<ReportingEndpoints["getAdminDashboard"]["response"]> {
  return ReportingService.getAdminDashboard(request);
}

/**
 * Fetches staff dashboard data for a specific user
 */
export async function getStaffDashboard(
  request: Readonly<ReportingEndpoints["getStaffDashboard"]["body"]>,
): Promise<ReportingEndpoints["getStaffDashboard"]["response"]> {
  return ReportingService.getStaffDashboard(request);
}

/**
 * Exports usage logs in the specified format and date range
 */
export async function exportUsageLogs(
  request: Readonly<ReportingEndpoints["exportUsageLogs"]["body"]>,
): Promise<ReportingEndpoints["exportUsageLogs"]["response"]> {
  return ReportingService.exportUsageLogs(request);
}
