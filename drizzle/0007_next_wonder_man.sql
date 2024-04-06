ALTER TABLE "center_address" DROP CONSTRAINT "center_address_area_id_city_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "center_address" ADD CONSTRAINT "center_address_area_id_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "area"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
