import { serial, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";

export const earlyAccessUsers = pgTable("early_access_users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 10 }).notNull(),
});
