ALTER TABLE "center" RENAME COLUMN "address_id" TO "center_address_id";--> statement-breakpoint
ALTER TABLE "center" DROP CONSTRAINT "center_address_id_center_address_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "center" ADD CONSTRAINT "center_center_address_id_center_address_id_fk" FOREIGN KEY ("center_address_id") REFERENCES "center_address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
