import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  json,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { centerAddresses } from "./center-address.schema";
import { centerUsers } from "./center-app-auth.schema";
import { services } from "./service.schema";

export const centers = pgTable(
  "center",
  {
    id: serial("id").primaryKey(),
    publicId: varchar("public_id", { length: 15 }).notNull().unique(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    images: json("images").$type<{ url: string }[]>(),
    averageRating: real("average_rating").default(0).notNull(),
    ratingCount: integer("rating_count").default(0).notNull(),
    reviewCount: integer("review_count").default(0).notNull(),
    phoneNumber: varchar("phone_number", { length: 15 }),
    servicesConfig: json("service_config").$type<{
      homeGrooming: { all: { noOfParallelServices: number } };
    }>(),
    centerAddressId: integer("center_address_id")
      .notNull()
      .references(() => centerAddresses.id),
    centerUserId: varchar("center_user_id", { length: 255 })
      .notNull()
      .references(() => centerUsers.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (center) => ({
    centerPublicIdIdx: index("center_public_id_idx").on(center.publicId),
    centerUserIdIdx: index("center_user_idx").on(center.centerUserId),
  }),
);

export const centerRelations = relations(centers, ({ one, many }) => ({
  centerAddress: one(centerAddresses, {
    fields: [centers.centerAddressId],
    references: [centerAddresses.id],
  }),
  services: many(services),
}));
