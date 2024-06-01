import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
  tablesFilter: ["!geography_columns", "!geometry_columns", "!spatial_ref_sys"],
} satisfies Config;
