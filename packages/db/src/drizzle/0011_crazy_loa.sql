ALTER TABLE "center" ADD COLUMN "features" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "pet" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "pet" ADD COLUMN "behaviour_tags" json;--> statement-breakpoint
ALTER TABLE "review" ADD COLUMN "images" json;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "discounted_price" integer DEFAULT 0 NOT NULL;