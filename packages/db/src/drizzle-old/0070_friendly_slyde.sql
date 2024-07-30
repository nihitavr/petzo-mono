DO $$ BEGIN
 CREATE TYPE "public"."booking_status_type" AS ENUM('booked', 'confirmed', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DROP INDEX IF EXISTS "area_and_parent_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "bookings_user_pet_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "bookings_service_center_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "center_app_accounts_userId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "center_app_sessions_userId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "center_public_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "center_user_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "customer_address_user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "customer_app_accounts_userId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "customer_app_sessions_userId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "pet_medical_records_pet_appointment_date_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "pet_medical_records_center_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "pets_user_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "ratings_user_center_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "reviews_center_id_user_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "reviews_center_id_parent_review_id_index";--> statement-breakpoint
DROP INDEX IF EXISTS "services_center_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "slots_service_center_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "staff_center_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "state_alpha2_code_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "vet_center_idx";--> statement-breakpoint
ALTER TABLE "booking" ALTER COLUMN "status" SET DATA TYPE booking_status_type;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "area_and_parent_idx" ON "area" USING btree (parent_area_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_user_pet_idx" ON "booking" USING btree (customer_user_id,pet_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_service_center_idx" ON "booking" USING btree (service_id,center_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_app_accounts_userId_idx" ON "center_account" USING btree (userId);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_app_sessions_userId_idx" ON "center_session" USING btree (userId);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_public_id_idx" ON "center" USING btree (public_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_user_idx" ON "center" USING btree (center_user_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_address_user_id_idx" ON "customer_address" USING btree (customer_user_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_app_accounts_userId_idx" ON "customer_account" USING btree (userId);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_app_sessions_userId_idx" ON "customer_session" USING btree (userId);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pet_medical_records_pet_appointment_date_idx" ON "pet_medical_record" USING btree (pet_id,appointment_date);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pet_medical_records_center_idx" ON "pet_medical_record" USING btree (center_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pets_user_idx" ON "pet" USING btree (customer_user_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ratings_user_center_idx" ON "rating" USING btree (customer_user_id,center_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reviews_center_id_user_id_index" ON "review" USING btree (center_id,customer_user_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reviews_center_id_parent_review_id_index" ON "review" USING btree (center_id,parent_review_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_center_idx" ON "service" USING btree (center_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "slots_service_center_idx" ON "slot" USING btree (service_id,center_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "staff_center_idx" ON "staff" USING btree (center_id);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "state_alpha2_code_idx" ON "state" USING btree (alpha2_code);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vet_center_idx" ON "vet" USING btree (center_id);