DO $$ BEGIN
 CREATE TYPE "public"."booking_status_type" AS ENUM('booked', 'confirmed', 'ongoing', 'cancelled', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."gender_enum_type" AS ENUM('male', 'female');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."pet_type_enum_type" AS ENUM('cat', 'small_dog', 'big_dog');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."center_service_type" AS ENUM('veterinary', 'grooming', 'boarding', 'home_grooming');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "area" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(40) NOT NULL,
	"name" varchar(256) NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"external_id" varchar(256),
	"is_parent" boolean DEFAULT false NOT NULL,
	"parent_area_id" integer,
	"city_id" integer NOT NULL,
	CONSTRAINT "area_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "area_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "city_id_area_idx_idx" UNIQUE("city_id","public_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "booking_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"pet_id" integer NOT NULL,
	"slot_id" integer,
	"service_id" integer NOT NULL,
	"status" "booking_status_type" DEFAULT 'booked' NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "booking" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_user_id" varchar(255) NOT NULL,
	"address_id" integer,
	"center_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"is_paid" boolean NOT NULL,
	"status" "booking_status_type" DEFAULT 'booked' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "center_address" (
	"id" serial PRIMARY KEY NOT NULL,
	"line1" varchar(256) NOT NULL,
	"pincode" varchar(6) NOT NULL,
	"geocode" "geography",
	"area_id" integer NOT NULL,
	"city_id" integer NOT NULL,
	"state_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "center_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" varchar(255),
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "center_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "center_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "center_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"phone_number" varchar(15),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp DEFAULT CURRENT_TIMESTAMP(3),
	"image" varchar(255),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "center_verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "center_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "center" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(15) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"images" json,
	"average_rating" real DEFAULT 0 NOT NULL,
	"rating_count" integer DEFAULT 0 NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"phone_number" varchar(15),
	"service_config" json,
	"center_address_id" integer NOT NULL,
	"center_user_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "center_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "city" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(30),
	"name" varchar(256) NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"external_id" varchar(256),
	"state_id" integer NOT NULL,
	CONSTRAINT "city_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "city_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "city_public_id_state_idx" UNIQUE("public_id","state_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_address" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_user_id" varchar(255) NOT NULL,
	"name" varchar(256) NOT NULL,
	"house_no" varchar(256) NOT NULL,
	"line1" varchar(256) NOT NULL,
	"line2" varchar(256) NOT NULL,
	"pincode" varchar(6) NOT NULL,
	"phone_number" varchar(10) NOT NULL,
	"geocode" "geography" NOT NULL,
	"area_id" integer NOT NULL,
	"city_id" integer NOT NULL,
	"state_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" varchar(255),
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "customer_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"phone_number" varchar(15),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp DEFAULT CURRENT_TIMESTAMP(3),
	"image" varchar(255),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "customer_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pet_medical_record" (
	"id" serial PRIMARY KEY NOT NULL,
	"pet_id" integer NOT NULL,
	"center_id" integer,
	"customer_user_id" varchar(255),
	"description" text,
	"images" json DEFAULT '[]'::json NOT NULL,
	"appointment_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pet" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(15) NOT NULL,
	"customer_user_id" varchar(255) NOT NULL,
	"name" varchar(256) NOT NULL,
	"type" "pet_type_enum_type",
	"gender" "gender_enum_type",
	"images" json,
	"breed" varchar(256),
	"date_of_birth" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "pet_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rating" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_user_id" varchar(255) NOT NULL,
	"center_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "review" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_review_id" integer,
	"customer_user_id" varchar(255) NOT NULL,
	"center_id" integer NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(15) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"service_type" "center_service_type" NOT NULL,
	"pet_types" json,
	"price" integer NOT NULL,
	"images" json,
	"start_time" time DEFAULT '09:00' NOT NULL,
	"duration" integer DEFAULT 60 NOT NULL,
	"start_time_end" time DEFAULT '17:00' NOT NULL,
	"center_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "service_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "slot" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" integer NOT NULL,
	"center_id" integer NOT NULL,
	"date" date NOT NULL,
	"start_time" time NOT NULL,
	"total_slots" integer NOT NULL,
	"available_slots" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "slots_service_id_date_starttime_idx" UNIQUE("service_id","date","start_time")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"center_user_id" varchar(255) NOT NULL,
	"type" varchar(256) NOT NULL,
	"center_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "state" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"alpha2_code" varchar(5) NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"external_id" varchar(256),
	CONSTRAINT "state_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vet" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"center_user_id" varchar(255) NOT NULL,
	"center_id" integer NOT NULL,
	"qualifications" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "area" ADD CONSTRAINT "area_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_booking_id_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_pet_id_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pet"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_slot_id_slot_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."slot"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking" ADD CONSTRAINT "booking_customer_user_id_customer_user_id_fk" FOREIGN KEY ("customer_user_id") REFERENCES "public"."customer_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking" ADD CONSTRAINT "booking_address_id_customer_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."customer_address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking" ADD CONSTRAINT "booking_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "public"."center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "center_address" ADD CONSTRAINT "center_address_area_id_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."area"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "center_address" ADD CONSTRAINT "center_address_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "center_address" ADD CONSTRAINT "center_address_state_id_state_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."state"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "center" ADD CONSTRAINT "center_center_address_id_center_address_id_fk" FOREIGN KEY ("center_address_id") REFERENCES "public"."center_address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "center" ADD CONSTRAINT "center_center_user_id_center_user_id_fk" FOREIGN KEY ("center_user_id") REFERENCES "public"."center_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "city" ADD CONSTRAINT "city_state_id_state_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."state"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_customer_user_id_customer_user_id_fk" FOREIGN KEY ("customer_user_id") REFERENCES "public"."customer_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_area_id_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."area"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_state_id_state_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."state"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pet_medical_record" ADD CONSTRAINT "pet_medical_record_pet_id_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pet"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pet_medical_record" ADD CONSTRAINT "pet_medical_record_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "public"."center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pet_medical_record" ADD CONSTRAINT "pet_medical_record_customer_user_id_customer_user_id_fk" FOREIGN KEY ("customer_user_id") REFERENCES "public"."customer_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pet" ADD CONSTRAINT "pet_customer_user_id_customer_user_id_fk" FOREIGN KEY ("customer_user_id") REFERENCES "public"."customer_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rating" ADD CONSTRAINT "rating_customer_user_id_customer_user_id_fk" FOREIGN KEY ("customer_user_id") REFERENCES "public"."customer_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rating" ADD CONSTRAINT "rating_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "public"."center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review" ADD CONSTRAINT "review_customer_user_id_customer_user_id_fk" FOREIGN KEY ("customer_user_id") REFERENCES "public"."customer_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review" ADD CONSTRAINT "review_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "public"."center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service" ADD CONSTRAINT "service_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "public"."center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "slot" ADD CONSTRAINT "slot_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "slot" ADD CONSTRAINT "slot_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "public"."center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "staff" ADD CONSTRAINT "staff_center_user_id_center_user_id_fk" FOREIGN KEY ("center_user_id") REFERENCES "public"."center_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "staff" ADD CONSTRAINT "staff_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "public"."center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vet" ADD CONSTRAINT "vet_center_user_id_center_user_id_fk" FOREIGN KEY ("center_user_id") REFERENCES "public"."center_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vet" ADD CONSTRAINT "vet_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "public"."center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "area_and_parent_idx" ON "area" USING btree ("parent_area_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_id_index" ON "booking_items" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_id_and_status_index" ON "booking" USING btree ("center_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_user_id_and_status_index" ON "booking" USING btree ("customer_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_app_accounts_userId_idx" ON "center_account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_app_sessions_userId_idx" ON "center_session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_public_id_idx" ON "center" USING btree ("public_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_user_idx" ON "center" USING btree ("center_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_address_user_id_idx" ON "customer_address" USING btree ("customer_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_app_accounts_userId_idx" ON "customer_account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_app_sessions_userId_idx" ON "customer_session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pet_medical_records_pet_appointment_date_idx" ON "pet_medical_record" USING btree ("pet_id","appointment_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pet_medical_records_center_idx" ON "pet_medical_record" USING btree ("center_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pets_user_idx" ON "pet" USING btree ("customer_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ratings_user_center_idx" ON "rating" USING btree ("customer_user_id","center_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reviews_center_id_user_id_index" ON "review" USING btree ("center_id","customer_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reviews_center_id_parent_review_id_index" ON "review" USING btree ("center_id","parent_review_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_center_idx" ON "service" USING btree ("center_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "slots_service_center_idx" ON "slot" USING btree ("service_id","center_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "staff_center_idx" ON "staff" USING btree ("center_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "state_alpha2_code_idx" ON "state" USING btree ("alpha2_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vet_center_idx" ON "vet" USING btree ("center_id");