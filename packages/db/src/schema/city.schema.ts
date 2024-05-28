import { boolean, integer, serial, unique, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { states } from "./state.schema";

export const cities = pgTable(
  "city",
  {
    id: serial("id").primaryKey(),
    publicId: varchar("public_id", { length: 30 }).unique(),
    name: varchar("name", { length: 256 }).notNull(),
    isActive: boolean("is_active").default(false).notNull(),
    externalId: varchar("external_id", { length: 256 }).unique(), // This is the id that we get from the external api.
    stateId: integer("state_id")
      .notNull()
      .references(() => states.id),
  },
  (city) => ({
    cityAndStateIdx: unique("city_public_id_and_state_unique_idx").on(
      city.publicId,
      city.stateId,
    ),
  }),
);
