ALTER TYPE "booking_status_type" ADD VALUE 'ongoing';--> statement-breakpoint
ALTER TYPE "booking_status_type" ADD VALUE 'customer_cancelled';--> statement-breakpoint
ALTER TYPE "booking_status_type" ADD VALUE 'center_cancelled';--> statement-breakpoint
ALTER TABLE "center" ADD COLUMN "deleted_at" timestamp;