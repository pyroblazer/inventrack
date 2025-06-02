// apps/api/libs/database/src/schemas/audit.ts
import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { createId } from "@paralleldrive/cuid2";

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    action: text("action").notNull(), // e.g., "create_item", "update_item", "delete_booking", "login", "logout"
    entityType: text("entity_type").notNull(), // e.g., "Item", "Booking", "User", "Auth"
    entityId: text("entity_id").notNull(), // ID of the affected resource
    details: text("details"), // Human-readable description of the action
    metadata: jsonb("metadata"), // Additional structured data about the action
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("audit_logs_user_id_idx").on(table.userId),
    actionIdx: index("audit_logs_action_idx").on(table.action),
    entityTypeIdx: index("audit_logs_entity_type_idx").on(table.entityType),
    createdAtIdx: index("audit_logs_created_at_idx").on(table.createdAt),
  }),
);

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
