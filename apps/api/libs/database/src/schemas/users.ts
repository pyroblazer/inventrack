//apps/api/libs/database/src/schemas/users.ts
import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// Role enum for type safety
export const userRoles = ["ADMIN", "STAFF"] as const;
export type UserRole = (typeof userRoles)[number];

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text("email").unique(),
  username: text("username"), // backfill
  password: text("password").notNull(),
  refreshToken: text("refresh_token"),
  role: text("role").$type<UserRole>().notNull().default("STAFF"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const userRelations = relations(users, ({ one }) => ({
  profile: one(profile),
}));

export const profile = pgTable("profile", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  age: integer("age"),
  biography: text("biography"),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  avatar: text("avatar_url"),
});

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(users, { fields: [profile.userId], references: [users.id] }),
}));
