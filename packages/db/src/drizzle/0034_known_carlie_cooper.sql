ALTER TABLE "pet_medical_record" ADD COLUMN "customer_user_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pet_medical_record" ADD CONSTRAINT "pet_medical_record_customer_user_id_customer_user_id_fk" FOREIGN KEY ("customer_user_id") REFERENCES "customer_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
