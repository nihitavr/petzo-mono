CREATE TABLE IF NOT EXISTS "slot_availability" (
	"id" serial PRIMARY KEY NOT NULL,
	"slot_id" integer NOT NULL,
	"date" timestamp NOT NULL,
	"total_slots" integer NOT NULL,
	"available_slots" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
DROP TABLE "post";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "slot_availabilities_id_and_date_idx" ON "slot_availability" ("slot_id","date");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "slot_availability" ADD CONSTRAINT "slot_availability_slot_id_slot_id_fk" FOREIGN KEY ("slot_id") REFERENCES "slot"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
