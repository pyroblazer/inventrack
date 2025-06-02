//apps/api/libs/database/src/schemas/reporting.ts
import { pgTable, serial, timestamp, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";
import { inventoryItems } from "./inventory";
import { bookings } from "./booking";

export const usageLogs = pgTable("usage_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  itemId: text("item_id")
    .references(() => inventoryItems.id)
    .notNull(),
  action: text("action").notNull(), // 'CHECKOUT' | 'RETURN'
  performedAt: timestamp("performed_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type UsageLog = typeof usageLogs.$inferSelect;
export type NewUsageLog = typeof usageLogs.$inferInsert;

export const usageLogRelations = relations(usageLogs, ({ one }) => ({
  user: one(users, {
    fields: [usageLogs.userId],
    references: [users.id],
  }),
  item: one(inventoryItems, {
    fields: [usageLogs.itemId],
    references: [inventoryItems.id],
  }),
}));

export const categoryStats = pgTable("category_stats", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  category: text("category").notNull(),
  totalUses: integer("total_uses").default(0).notNull(),
  reportDate: timestamp("report_date", { withTimezone: true }).notNull(),
});

export type CategoryStat = typeof categoryStats.$inferSelect;
export type NewCategoryStat = typeof categoryStats.$inferInsert;

export const usageTrends = pgTable("usage_trends", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  date: timestamp("date", { withTimezone: true }).notNull(),
  totalBookings: integer("total_bookings").default(0).notNull(),
  totalReturns: integer("total_returns").default(0).notNull(),
  totalItems: integer("total_items").default(0).notNull(),
});

export type UsageTrend = typeof usageTrends.$inferSelect;
export type NewUsageTrend = typeof usageTrends.$inferInsert;

export const overdueReturns = pgTable("overdue_returns", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  bookingId: text("booking_id")
    .references(() => bookings.id)
    .notNull(),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  detectedAt: timestamp("detected_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type OverdueReturn = typeof overdueReturns.$inferSelect;
export type NewOverdueReturn = typeof overdueReturns.$inferInsert;

export const overdueReturnRelations = relations(overdueReturns, ({ one }) => ({
  booking: one(bookings, {
    fields: [overdueReturns.bookingId],
    references: [bookings.id],
  }),
}));

export const staffActivities = pgTable("staff_activities", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type StaffActivity = typeof staffActivities.$inferSelect;
export type NewStaffActivity = typeof staffActivities.$inferInsert;

export const staffActivityRelations = relations(staffActivities, ({ one }) => ({
  user: one(users, {
    fields: [staffActivities.userId],
    references: [users.id],
  }),
}));
