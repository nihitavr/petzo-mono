ALTER TABLE "city" DROP CONSTRAINT "city_public_id_unique";--> statement-breakpoint
ALTER TABLE "city" ADD CONSTRAINT "city_public_id_and_state_unique_idx" UNIQUE("public_id","state_id");