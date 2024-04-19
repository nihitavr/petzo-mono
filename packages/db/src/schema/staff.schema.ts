import { sql } from "drizzle-orm";
import {
  index,
  integer,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { centerUsers } from "./center-app-auth.schema";
import { centers } from "./center.schema";

export const staff = pgTable(
  "staff",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    centerUserId: varchar("center_user_id", { length: 255 })
      .notNull()
      .references(() => centerUsers.id),
    type: varchar("type", { length: 256 }).notNull(),
    centerId: integer("center_id")
      .notNull()
      .references(() => centers.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (staff) => ({
    centerIdx: index("staff_center_idx").on(staff.centerId),
  }),
);
