import { boolean, integer, serial, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { states } from "./state.schema";

export const cities = pgTable("city", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  publicId: varchar("public_id", { length: 30 }).unique(),
  stateId: integer("state_id")
    .notNull()
    .references(() => states.id),
});
