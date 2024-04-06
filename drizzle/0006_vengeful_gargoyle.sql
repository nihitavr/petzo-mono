CREATE TABLE IF NOT EXISTS "area" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"city_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "center_address" RENAME COLUMN "city" TO "city_id";--> statement-breakpoint
ALTER TABLE "center_address" RENAME COLUMN "state" TO "state_id";--> statement-breakpoint
ALTER TABLE "center_address" ALTER COLUMN "city_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "center_address" ALTER COLUMN "state_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "center_address" ADD COLUMN "area_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "center_address" ADD CONSTRAINT "center_address_area_id_city_id_fk" FOREIGN KEY ("area_id") REFERENCES "city"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "center_address" ADD CONSTRAINT "center_address_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "center_address" ADD CONSTRAINT "center_address_state_id_state_id_fk" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "area" ADD CONSTRAINT "area_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
