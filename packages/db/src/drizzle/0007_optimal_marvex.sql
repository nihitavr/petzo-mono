DO $$ BEGIN
 CREATE TYPE "public"."center_status_type" AS ENUM('created', 'verification_started', 'verified', 'verification_rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "center" ADD COLUMN "status" "center_status_type" DEFAULT 'created' NOT NULL;