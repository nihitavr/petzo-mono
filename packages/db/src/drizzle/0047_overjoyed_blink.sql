ALTER TABLE "area" RENAME COLUMN "is_main" TO "is_parent";--> statement-breakpoint
ALTER TABLE "area" RENAME COLUMN "main_area_id" TO "parent_area_id";--> statement-breakpoint
DROP INDEX IF EXISTS "area_and_parent_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "area_and_parent_idx" ON "area" ("parent_area_id");