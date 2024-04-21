ALTER TABLE "pet_medical_records" RENAME TO "pet_medical_record";--> statement-breakpoint
ALTER TABLE "pet_medical_record" DROP CONSTRAINT "pet_medical_records_pet_id_pet_id_fk";
--> statement-breakpoint
ALTER TABLE "pet_medical_record" DROP CONSTRAINT "pet_medical_records_center_id_center_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pet_medical_record" ADD CONSTRAINT "pet_medical_record_pet_id_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "pet"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pet_medical_record" ADD CONSTRAINT "pet_medical_record_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
