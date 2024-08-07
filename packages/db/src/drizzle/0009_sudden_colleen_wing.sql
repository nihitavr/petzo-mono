DROP INDEX IF EXISTS "center_average_rating_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_status_average_rating_idx" ON "center" USING btree ("status","average_rating");