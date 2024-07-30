CREATE TABLE IF NOT EXISTS "customer_address" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_user_id" varchar(255) NOT NULL,
	"house_no" varchar(256) NOT NULL,
	"line1" varchar(256),
	"line2" varchar(256),
	"pincode" varchar(6) NOT NULL,
	"phone_number" varchar(15),
	"geocode" "geography(Point,4326)",
	"city_id" integer NOT NULL,
	"state_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_user_id" ON "customer_address" ("customer_user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_customer_user_id_customer_user_id_fk" FOREIGN KEY ("customer_user_id") REFERENCES "customer_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_state_id_state_id_fk" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
