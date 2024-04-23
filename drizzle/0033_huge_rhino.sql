ALTER TABLE "pet_medical_record" ALTER COLUMN "images" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "pet_medical_record" ALTER COLUMN "images" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pet_medical_record" ADD COLUMN "description" text;