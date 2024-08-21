import { sql } from "drizzle-orm";
import {
  index,
  integer,
  json,
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
    parentReviewId: integer("parent_review_id"),
    images: json("images").$type<{ url: string }[]>(),
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
    reviewsUserCenterIdx: index("reviews_center_id_user_id_index").on(
      review.centerId,
      review.customerUserId,
    ),
    reviewsParentReviewId: index("reviews_center_id_parent_review_id_index").on(
      review.centerId,
      review.parentReviewId,
    ),
  }),
);
