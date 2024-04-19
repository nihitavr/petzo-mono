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
import { centers } from "./center.schema";
import { customerUsers } from "./customer-app-auth.schema";

export const reviews = pgTable(
  "review",
  {
    id: serial("id").primaryKey(),
    customerUserId: varchar("customer_user_id", { length: 255 })
      .notNull()
      .references(() => customerUsers.id),
    centerId: integer("center_id")
      .notNull()
      .references(() => centers.id),
    text: text("text").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (review) => ({
    reviewsUserCenterIdx: index("reviews_user_center_idx").on(
      review.centerId,
      review.customerUserId,
    ),
  }),
);
