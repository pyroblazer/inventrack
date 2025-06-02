//apps/web/src/actions/audit/audit-service.ts
import { ApiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/get-error-message";
import { type AuditEndpoints } from "@shared/types";

/**
 * Service class for audit-related API calls
 */
export class AuditService {
  private static readonly BASE_PATH = "/audits";

  /**
   * Fetch all audit logs (admin only)
   */
  static async getAllAuditLogs(
    query?: AuditEndpoints["getAllAuditLogs"]["query"],
  ): Promise<AuditEndpoints["getAllAuditLogs"]["response"]> {
    try {
      const queryParams = new URLSearchParams();

      if (query?.limit) queryParams.append("limit", query.limit.toString());
      if (query?.offset) queryParams.append("offset", query.offset.toString());
      if (query?.action) queryParams.append("action", query.action);
      if (query?.entityType) queryParams.append("entityType", query.entityType);
      if (query?.userId) queryParams.append("userId", query.userId);

      const url = queryParams.toString()
        ? `${this.BASE_PATH}?${queryParams.toString()}`
        : this.BASE_PATH;

      const response =
        await ApiClient.get<AuditEndpoints["getAllAuditLogs"]["response"]>(url);

      if (!response.success) {
        throw new Error("Failed to fetch audit logs");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Fetch current user's audit logs
   */
  static async getMyAuditLogs(
    query?: AuditEndpoints["getMyAuditLogs"]["query"],
  ): Promise<AuditEndpoints["getMyAuditLogs"]["response"]> {
    try {
      const queryParams = new URLSearchParams();

      if (query?.limit) queryParams.append("limit", query.limit.toString());
      if (query?.offset) queryParams.append("offset", query.offset.toString());

      const url = queryParams.toString()
        ? `${this.BASE_PATH}/me?${queryParams.toString()}`
        : `${this.BASE_PATH}/me`;

      const response =
        await ApiClient.get<AuditEndpoints["getMyAuditLogs"]["response"]>(url);

      if (!response.success) {
        throw new Error("Failed to fetch user audit logs");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to fetch user audit logs:", error);
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Create a new audit log (called internally by services)
   */
  static async createAuditLog(
    request: Readonly<AuditEndpoints["createAuditLog"]["body"]>,
  ): Promise<AuditEndpoints["createAuditLog"]["response"]> {
    try {
      const response = await ApiClient.post<
        AuditEndpoints["createAuditLog"]["body"],
        AuditEndpoints["createAuditLog"]["response"]
      >(this.BASE_PATH, {
        body: request,
      });

      if (!response.success) {
        throw new Error("Failed to create audit log");
      }

      return response.data;
    } catch (error) {
      console.error("Failed to create audit log:", error);
      throw new Error(getErrorMessage(error));
    }
  }
}
