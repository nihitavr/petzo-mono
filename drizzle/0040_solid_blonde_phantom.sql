ALTER TYPE "center_service_type" ADD VALUE 'home_grooming';--> statement-breakpoint
ALTER TABLE "rating" ALTER COLUMN "rating" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "rating" ALTER COLUMN "rating" SET NOT NULL;