import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  json,
  pgEnum,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { CENTER_STATUS } from "@petzo/constants";

import type { CenterConfig } from "../types/types";
import { pgTable } from "./_table";
import { centerAddresses } from "./center-address.schema";
import { centerUsers } from "./center-app-auth.schema";
import { services } from "./service.schema";

export const centerStatusEnum = pgEnum("center_status_type", CENTER_STATUS);

export const centers = pgTable(
  "center",
  {
    id: serial("id").primaryKey(),
    publicId: varchar("public_id", { length: 20 }).notNull().unique(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    images: json("images").$type<{ url: string }[]>(),
    averageRating: real("average_rating").default(0).notNull(),
    ratingCount: integer("rating_count").default(0).notNull(),
    reviewCount: integer("review_count").default(0).notNull(),
    status: centerStatusEnum("status").default("created").notNull(),
    phoneNumber: varchar("phone_number", { length: 15 }),
    config: json("config").$type<CenterConfig>(),
    centerAddressId: integer("center_address_id").references(
      () => centerAddresses.id,
    ),
    centerUserId: varchar("center_user_id", { length: 255 })
      .notNull()
      .references(() => centerUsers.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (center) => ({
    centerPublicIdIdx: index("center_public_id_idx").on(center.publicId),
    centerUserIdIdx: index("center_user_idx").on(center.centerUserId),
    centerAverageRatingIdx: index("center_status_average_rating_idx").on(
      center.status,
      center.averageRating,
    ),
  }),
);

export const centerRelations = relations(centers, ({ one, many }) => ({
  centerAddress: one(centerAddresses, {
    fields: [centers.centerAddressId],
    references: [centerAddresses.id],
  }),
  services: many(services),
}));
