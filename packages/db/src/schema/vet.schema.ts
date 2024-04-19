import { sql } from "drizzle-orm";
import {
  index,
  integer,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { centerUsers } from "./center-app-auth.schema";
import { centers } from "./center.schema";

export const vets = pgTable(
  "vet",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    centerUserId: varchar("center_user_id", { length: 255 })
      .notNull()
      .references(() => centerUsers.id),
    centerId: integer("center_id")
      .notNull()
      .references(() => centers.id),
    qualifications: text("qualifications"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (vet) => ({
    cetCenterIdx: index("vet_center_idx").on(vet.centerId),
  }),
);
