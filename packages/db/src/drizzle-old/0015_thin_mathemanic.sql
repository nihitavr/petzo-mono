ALTER TABLE "area" ADD COLUMN "public_id" varchar(40);--> statement-breakpoint
ALTER TABLE "area" ADD CONSTRAINT "area_public_id_unique" UNIQUE("public_id");