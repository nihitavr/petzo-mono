CREATE TABLE IF NOT EXISTS "pet_medical_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"pet_id" integer NOT NULL,
	"center_id" integer,
	"images" json,
	"appointment_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pet_medical_records_pet_appointment_date_idx" ON "pet_medical_records" ("pet_id","appointment_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pet_medical_records_center_idx" ON "pet_medical_records" ("center_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pet_medical_records" ADD CONSTRAINT "pet_medical_records_pet_id_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "pet"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pet_medical_records" ADD CONSTRAINT "pet_medical_records_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
