DO $$ BEGIN
 CREATE TYPE "center_service_type" AS ENUM('veterinary', 'grooming', 'boarding');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "service" RENAME COLUMN "category" TO "service_type";--> statement-breakpoint
ALTER TABLE "service" ALTER COLUMN "service_type" SET DATA TYPE center_service_type;

