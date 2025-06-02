// apps/api/libs/database/src/schemas/notification.ts
import { boolean } from "drizzle-orm/pg-core";
import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";

export const notifications = pgTable("notifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  type: text("type").notNull(), // e.g., 'email', 'sms'
  content: jsonb("content").notNull(),
  status: text("status").notNull(), // e.g., 'pending', 'sent', 'failed'
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  sentAt: timestamp("sent_at"),
});
