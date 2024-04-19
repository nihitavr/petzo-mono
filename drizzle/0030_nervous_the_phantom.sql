DO $$ BEGIN
 CREATE TYPE "gender_enum_type" AS ENUM('male', 'female');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "pet_type_enum_type" AS ENUM('cat', 'small_dog', 'big_dog');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "pet" ALTER COLUMN "public_id" SET DATA TYPE varchar(15);--> statement-breakpoint
ALTER TABLE "pet" ALTER COLUMN "type" SET DATA TYPE pet_type_enum_type;--> statement-breakpoint
ALTER TABLE "pet" ALTER COLUMN "type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pet" ALTER COLUMN "breed" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pet" ADD COLUMN "gender" "gender_enum_type";--> statement-breakpoint
ALTER TABLE "pet" ADD COLUMN "images" json;--> statement-breakpoint
ALTER TABLE "pet" DROP COLUMN IF EXISTS "description";