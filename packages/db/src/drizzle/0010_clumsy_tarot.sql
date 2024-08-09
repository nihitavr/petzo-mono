ALTER TYPE "center_service_type" ADD VALUE 'mobile_grooming';--> statement-breakpoint
ALTER TABLE "early_access_users" ADD COLUMN "service_type" "center_service_type" NOT NULL;