ALTER TABLE "city" DROP CONSTRAINT "city_public_id_and_state_unique_idx";--> statement-breakpoint
ALTER TABLE "booking" ALTER COLUMN "slot_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "center_address" ALTER COLUMN "geocode" SET DATA TYPE geography;--> statement-breakpoint
ALTER TABLE "customer_address" ALTER COLUMN "geocode" SET DATA TYPE geography;--> statement-breakpoint
ALTER TABLE "booking" ADD COLUMN "address_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking" ADD CONSTRAINT "booking_address_id_customer_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."customer_address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "city" ADD CONSTRAINT "city_public_id_state_idx" UNIQUE("public_id","state_id");