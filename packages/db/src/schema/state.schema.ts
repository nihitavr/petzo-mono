import { boolean, serial, uniqueIndex, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";

export const states = pgTable(
  "state",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    alpha2Code: varchar("alpha2_code", { length: 5 }).notNull(),
    isActive: boolean("is_active").default(false).notNull(),
  },
  (state) => ({
    alpha2CodeIdx: uniqueIndex("state_alpha2_code_idx").on(state.alpha2Code),
  }),
);
