// apps/api/libs/database/src/schemas/inventory.ts
import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { createId } from "@paralleldrive/cuid2";

export const inventoryItems = pgTable("inventory_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
  category: text("category"),
  quantity: integer("quantity").notNull(),
  condition: text("condition"), // e.g., New, Good, Worn
  photoUrl: text("photo_url"),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type NewInventoryItem = typeof inventoryItems.$inferInsert;

export const inventoryRelations = relations(inventoryItems, ({ one }) => ({
  user: one(users, {
    fields: [inventoryItems.userId],
    references: [users.id],
  }),
}));
