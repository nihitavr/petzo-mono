CREATE TABLE IF NOT EXISTS "early_access_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"phone_number" varchar(10) NOT NULL
);
