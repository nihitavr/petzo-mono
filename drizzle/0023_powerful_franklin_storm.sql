ALTER TABLE "service" ALTER COLUMN "public_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "service" ADD CONSTRAINT "service_public_id_unique" UNIQUE("public_id");