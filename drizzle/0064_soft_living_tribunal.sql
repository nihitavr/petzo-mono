ALTER TABLE "service" ADD COLUMN "start_time" time DEFAULT '09:00' NOT NULL;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "start_time_end" time DEFAULT '17:00' NOT NULL;