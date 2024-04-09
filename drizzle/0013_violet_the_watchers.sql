ALTER TABLE "city" ADD COLUMN "public_id" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "city" ADD CONSTRAINT "city_public_id_unique" UNIQUE("public_id");