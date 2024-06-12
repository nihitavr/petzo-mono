import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema",
  out: "./src/drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
  extensionsFilters: ["postgis"],
} satisfies Config;
