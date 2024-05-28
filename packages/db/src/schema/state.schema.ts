import { boolean, serial, uniqueIndex, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";

export const states = pgTable(
  "state",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    alpha2Code: varchar("alpha2_code", { length: 5 }).notNull(),
    isActive: boolean("is_active").default(false).notNull(),
    externalId: varchar("external_id", { length: 256 }).unique(), // This is the id that we get from the external api.
  },
  (state) => ({
    alpha2CodeIdx: uniqueIndex("state_alpha2_code_idx").on(state.alpha2Code),
  }),
);
