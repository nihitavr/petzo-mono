ALTER TABLE "center_address" ALTER COLUMN "geocode" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "center_address" ADD COLUMN "house_no" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "center_address" ADD COLUMN "line2" varchar(256) NOT NULL;