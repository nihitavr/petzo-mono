ALTER TABLE "review" ADD COLUMN "parent_review_id" integer;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reviews_center_id_parent_review_id_index" ON "review" ("center_id","parent_review_id");