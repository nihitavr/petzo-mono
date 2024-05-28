ALTER TABLE "customer_address" DROP CONSTRAINT "customer_address_area_id_area_id_fk";
--> statement-breakpoint
ALTER TABLE "customer_address" DROP COLUMN IF EXISTS "area_id";