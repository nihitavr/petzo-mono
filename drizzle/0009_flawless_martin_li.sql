ALTER TABLE "center_address" ALTER COLUMN "pincode" SET DATA TYPE varchar(6);--> statement-breakpoint
ALTER TABLE "center_address" ALTER COLUMN "geocode" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "center" ADD COLUMN "images" json;