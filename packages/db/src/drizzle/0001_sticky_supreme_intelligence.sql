ALTER TYPE "booking_status_type" ADD VALUE 'ongoing';--> statement-breakpoint
ALTER TABLE "center" ALTER COLUMN "public_id" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "pet" ALTER COLUMN "public_id" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "service" ALTER COLUMN "public_id" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "config" json DEFAULT '{"operatingHours":{"sun":null,"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null}}'::json;