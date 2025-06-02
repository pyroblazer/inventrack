//apps/web/src/actions/audit/server-actions.ts
"use server";

import { AuditService } from "@/actions/audit/audit-service";
import { type AuditEndpoints } from "@shared/types";

/**
 * Fetches all audit logs (admin only)
 */
export async function getAllAuditLogs(
  query?: AuditEndpoints["getAllAuditLogs"]["query"],
): Promise<AuditEndpoints["getAllAuditLogs"]["response"]> {
  return AuditService.getAllAuditLogs(query);
}

/**
 * Fetches current user's audit logs
 */
export async function getMyAuditLogs(
  query?: AuditEndpoints["getMyAuditLogs"]["query"],
): Promise<AuditEndpoints["getMyAuditLogs"]["response"]> {
  return AuditService.getMyAuditLogs(query);
}

/**
 * Creates a new audit log entry
 */
export async function createAuditLog(
  request: Readonly<AuditEndpoints["createAuditLog"]["body"]>,
): Promise<AuditEndpoints["createAuditLog"]["response"]> {
  return AuditService.createAuditLog(request);
}
