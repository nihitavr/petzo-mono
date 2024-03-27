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
	CONSTRAINT "center_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "center_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "center_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp DEFAULT CURRENT_TIMESTAMP(3),
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "center_verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "center_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "booking" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_user_id" varchar(255) NOT NULL,
	"pet_id" integer NOT NULL,
	"slot_id" integer NOT NULL,
	"service_id" integer NOT NULL,
	"center_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"is_paid" boolean NOT NULL,
	"status" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "center_address" (
	"id" serial PRIMARY KEY NOT NULL,
	"line1" varchar(256) NOT NULL,
	"pincode" varchar(20) NOT NULL,
	"geocode" varchar(256),
	"city" varchar(256) NOT NULL,
	"state" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "center" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(13) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"address_id" integer NOT NULL,
	"center_user_id" varchar(255) NOT NULL,
	CONSTRAINT "center_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pet" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(13) NOT NULL,
	"customer_user_id" varchar(255) NOT NULL,
	"name" varchar(256) NOT NULL,
	"type" varchar(256) NOT NULL,
	"breed" varchar(256) NOT NULL,
	"date_of_birth" timestamp,
	"description" text,
	CONSTRAINT "pet_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"content" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rating" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_user_id" varchar(255) NOT NULL,
	"center_id" integer NOT NULL,
	"rating" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "review" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_user_id" varchar(255) NOT NULL,
	"center_id" integer NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"category" varchar(256) NOT NULL,
	"price" integer NOT NULL,
	"description" text,
	"center_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "slot" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" integer NOT NULL,
	"center_id" integer NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"total_slots" integer NOT NULL,
	"available_slots" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"center_user_id" varchar(255) NOT NULL,
	"type" varchar(256) NOT NULL,
	"center_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vet" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"center_user_id" varchar(255) NOT NULL,
	"center_id" integer NOT NULL,
	"qualifications" text
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
	CONSTRAINT "customer_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp DEFAULT CURRENT_TIMESTAMP(3),
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer_verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "customer_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_app_accounts_userId_idx" ON "center_account" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_app_sessions_userId_idx" ON "center_session" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_user_pet_idx" ON "booking" ("customer_user_id","pet_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_service_center_idx" ON "booking" ("service_id","center_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_address_idx" ON "center" ("address_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "center_user_idx" ON "center" ("center_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pets_user_idx" ON "pet" ("customer_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ratings_user_center_idx" ON "rating" ("customer_user_id","center_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reviews_user_center_idx" ON "review" ("center_id","customer_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_center_idx" ON "service" ("center_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "slots_service_center_idx" ON "slot" ("service_id","center_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "staff_center_idx" ON "staff" ("center_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vet_center_idx" ON "vet" ("center_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_app_accounts_userId_idx" ON "customer_account" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_app_sessions_userId_idx" ON "customer_session" ("userId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking" ADD CONSTRAINT "booking_customer_user_id_customer_user_id_fk" FOREIGN KEY ("customer_user_id") REFERENCES "customer_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking" ADD CONSTRAINT "booking_pet_id_pet_id_fk" FOREIGN KEY ("pet_id") REFERENCES "pet"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking" ADD CONSTRAINT "booking_slot_id_slot_id_fk" FOREIGN KEY ("slot_id") REFERENCES "slot"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking" ADD CONSTRAINT "booking_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking" ADD CONSTRAINT "booking_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "center" ADD CONSTRAINT "center_address_id_center_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "center_address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "center" ADD CONSTRAINT "center_center_user_id_center_user_id_fk" FOREIGN KEY ("center_user_id") REFERENCES "center_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pet" ADD CONSTRAINT "pet_customer_user_id_customer_user_id_fk" FOREIGN KEY ("customer_user_id") REFERENCES "customer_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rating" ADD CONSTRAINT "rating_customer_user_id_customer_user_id_fk" FOREIGN KEY ("customer_user_id") REFERENCES "customer_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rating" ADD CONSTRAINT "rating_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review" ADD CONSTRAINT "review_customer_user_id_customer_user_id_fk" FOREIGN KEY ("customer_user_id") REFERENCES "customer_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review" ADD CONSTRAINT "review_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service" ADD CONSTRAINT "service_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "slot" ADD CONSTRAINT "slot_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "slot" ADD CONSTRAINT "slot_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "staff" ADD CONSTRAINT "staff_center_user_id_center_user_id_fk" FOREIGN KEY ("center_user_id") REFERENCES "center_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "staff" ADD CONSTRAINT "staff_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vet" ADD CONSTRAINT "vet_center_user_id_center_user_id_fk" FOREIGN KEY ("center_user_id") REFERENCES "center_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vet" ADD CONSTRAINT "vet_center_id_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "center"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
