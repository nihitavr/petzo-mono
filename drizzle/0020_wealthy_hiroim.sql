ALTER TABLE "center" ALTER COLUMN "public_id" SET DATA TYPE varchar(15);--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "public_id" varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE "service" ADD CONSTRAINT "service_public_id_unique" UNIQUE("public_id");