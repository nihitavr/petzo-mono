ALTER TYPE "booking_status_type" ADD VALUE 'ongoing';--> statement-breakpoint
ALTER TYPE "booking_status_type" ADD VALUE 'completed';--> statement-breakpoint
ALTER TABLE "booking_items" DROP CONSTRAINT "booking_items_booking_id_customer_user_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "center_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "customer_user_id_index";--> statement-breakpoint
ALTER TABLE "customer_address" ALTER COLUMN "phone_number" SET DATA TYPE varchar(10);--> statement-breakpoint
ALTER TABLE "customer_address" ALTER COLUMN "phone_number" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "booking_items" ADD COLUMN "status" "booking_status_type" DEFAULT 'booked' NOT NULL;--> statement-breakpoint
ALTER TABLE "customer_address" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "pet" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "pet_types" json;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_id_and_status_index" ON "booking" USING btree ("center_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_user_id_and_status_index" ON "booking" USING btree ("customer_user_id");