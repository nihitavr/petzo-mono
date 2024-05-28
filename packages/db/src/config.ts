import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema",
  driver: "pg",
  dbCredentials: { connectionString: process.env.DATABASE_URL! },
  tablesFilter: ["!geography_columns", "!geometry_columns", "!spatial_ref_sys"],
} satisfies Config;
