import { boolean, integer, serial, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { cities } from "./city.schema";

export const areas = pgTable("area", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  public_id: varchar("public_id", { length: 40 }).unique(),
  cityId: integer("city_id")
    .notNull()
    .references(() => cities.id),
});
