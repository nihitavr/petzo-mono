ALTER TABLE "area" ADD COLUMN "is_main" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "area" ADD COLUMN "main_area_id" integer;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "area_and_parent_idx" ON "area" ("main_area_id");