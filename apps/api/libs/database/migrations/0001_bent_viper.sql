ALTER TABLE "notifications" ALTER COLUMN "read" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'STAFF';