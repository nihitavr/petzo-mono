CREATE TABLE IF NOT EXISTS "booking_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"pet_id" integer NOT NULL,
	"slot_id" integer,
	"service_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "booking" DROP CONSTRAINT "booking_pet_id_pet_id_fk";
--> statement-breakpoint
ALTER TABLE "booking" DROP CONSTRAINT "booking_slot_id_slot_id_fk";
--> statement-breakpoint
ALTER TABLE "booking" DROP CONSTRAINT "booking_service_id_service_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "bookings_user_pet_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "bookings_service_center_idx";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_booking_id_customer_user_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."customer_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_pet_id_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pet"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_slot_id_slot_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."slot"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_id_index" ON "booking_items" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_id_index" ON "booking" USING btree ("center_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_user_id_index" ON "booking" USING btree ("customer_user_id");--> statement-breakpoint
ALTER TABLE "booking" DROP COLUMN IF EXISTS "pet_id";--> statement-breakpoint
ALTER TABLE "booking" DROP COLUMN IF EXISTS "slot_id";--> statement-breakpoint
ALTER TABLE "booking" DROP COLUMN IF EXISTS "service_id";