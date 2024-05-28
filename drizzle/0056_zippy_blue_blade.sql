ALTER TABLE "city" ADD CONSTRAINT "city_external_id_unique" UNIQUE("external_id");--> statement-breakpoint
ALTER TABLE "state" ADD CONSTRAINT "state_external_id_unique" UNIQUE("external_id");