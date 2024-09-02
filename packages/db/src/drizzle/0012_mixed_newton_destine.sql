DROP INDEX IF EXISTS "center_status_average_rating_idx";--> statement-breakpoint
ALTER TABLE "center" ADD COLUMN "is_claimed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "center" ADD COLUMN "google_rating" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "center" ADD COLUMN "google_rating_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "center" ADD COLUMN "operating_hours" json DEFAULT '{"sun":null,"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null}'::json;--> statement-breakpoint
ALTER TABLE "center" ADD COLUMN "cta_buttons" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "is_booking_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_address_city_id_area_id_idx" ON "center_address" USING btree ("city_id","area_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_address_id_idx" ON "center" USING btree ("center_address_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_status_average_rating_google_rating_idx" ON "center" USING btree ("status","average_rating","google_rating");