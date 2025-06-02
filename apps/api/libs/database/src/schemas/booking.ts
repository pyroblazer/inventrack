//apps/api/libs/database/src/schemas/booking.ts
import { pgTable, serial, integer, timestamp, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { inventoryItems } from "./inventory";
import { createId } from "@paralleldrive/cuid2";

export const bookings = pgTable("bookings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  itemId: text("item_id")
    .references(() => inventoryItems.id)
    .notNull(),
  status: text("status").default("pending"), // pending, approved, rejected, cancelled
  note: text("note"),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export const bookingRelations = relations(bookings, ({ one }) => ({
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
  item: one(inventoryItems, {
    fields: [bookings.itemId],
    references: [inventoryItems.id],
  }),
}));
