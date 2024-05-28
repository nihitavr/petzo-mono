DROP INDEX IF EXISTS "customer_user_id";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_address_user_id_idx" ON "customer_address" ("customer_user_id");