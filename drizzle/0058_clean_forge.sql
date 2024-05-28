ALTER TABLE "customer_address" ADD COLUMN "area_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_area_id_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "area"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
