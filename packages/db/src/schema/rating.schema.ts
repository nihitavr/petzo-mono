import { sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { centers } from "./center.schema";
import { customerUsers } from "./customer-app-auth.schema";

export const ratings = pgTable(
  "rating",
  {
    id: serial("id").primaryKey(),
    customerUserId: varchar("customer_user_id", { length: 255 })
      .notNull()
      .references(() => customerUsers.id),

    centerId: integer("center_id")
      .notNull()
      .references(() => centers.id),
    rating: integer("rating").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (rating) => ({
    userCenterIdx: index("ratings_user_center_idx").on(
      rating.customerUserId,
      rating.centerId,
    ),
  }),
);
