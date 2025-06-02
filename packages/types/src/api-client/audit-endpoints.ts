// packages/types/src/api-client/audit-endpoints.ts
// @shared/types
import type { ProtoTimestamp } from "../others/proto-timestamp";

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: string;
  metadata?: Record<string, any>;
  timestamp: ProtoTimestamp;
}

export interface AuditLogFilters {
  userId?: string;
  action?: string;
  entityType?: string;
  startDate?: ProtoTimestamp;
  endDate?: ProtoTimestamp;
  limit?: number;
  offset?: number;
}

/**
 * API endpoint types for the Audit service
 */
export interface AuditEndpoints {
  /** GET /audits - Admin only */
  getAllAuditLogs: {
    query?: {
      limit?: number;
      offset?: number;
      action?: string;
      entityType?: string;
      userId?: string;
    };
    response: {
      logs: AuditLog[];
      total: number;
    };
  };

  /** GET /audits/me - Current user's logs */
  getMyAuditLogs: {
    query?: {
      limit?: number;
      offset?: number;
    };
    response: {
      logs: AuditLog[];
      total: number;
    };
  };

  /** POST /audits */
  createAuditLog: {
    body: {
      action: string;
      entityType: string;
      entityId: string;
      details?: string;
      metadata?: Record<string, any>;
    };
    response: {
      id: string;
    };
  };
}

// Audit action constants for frontend use
export const AUDIT_ACTIONS = {
  // Authentication
  USER_LOGIN: "user_login",
  USER_LOGOUT: "user_logout",
  USER_REGISTER: "user_register",

  // User Management
  USER_CREATE: "user_create",
  USER_UPDATE: "user_update",
  USER_DELETE: "user_delete",
  USER_PROFILE_CREATE: "user_profile_create",
  USER_PROFILE_UPDATE: "user_profile_update",

  // Item/Inventory Management
  ITEM_CREATE: "item_create",
  ITEM_UPDATE: "item_update",
  ITEM_DELETE: "item_delete",
  ITEM_BULK_UPLOAD: "item_bulk_upload",

  // Booking Management
  BOOKING_CREATE: "booking_create",
  BOOKING_APPROVE: "booking_approve",
  BOOKING_REJECT: "booking_reject",
  BOOKING_RETURN: "booking_return",
  BOOKING_UPDATE: "booking_update",
  BOOKING_DELETE: "booking_delete",

  // System Actions
  EXPORT_LOGS: "export_logs",
  SYSTEM_CONFIG_UPDATE: "system_config_update",
} as const;

export const AUDIT_ENTITY_TYPES = {
  USER: "User",
  ITEM: "Item",
  BOOKING: "Booking",
  SYSTEM: "System",
} as const;

export type AuditActionType =
  (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];
export type AuditEntityType =
  (typeof AUDIT_ENTITY_TYPES)[keyof typeof AUDIT_ENTITY_TYPES];
