import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  json,
  pgEnum,
  serial,
  text,
  time,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { centers } from "./center.schema";
import { slots } from "./slot.schema";

export const serviceTypeEnum = pgEnum("center_service_type", [
  "veterinary",
  "grooming",
  "boarding",
  "home_grooming",
]);

export const serviceTypeList = serviceTypeEnum.enumValues;

export const services = pgTable(
  "service",
  {
    id: serial("id").primaryKey(),
    publicId: varchar("public_id", { length: 15 }).notNull().unique(),
    name: varchar("name", { length: 256 }).notNull(),
    serviceType: serviceTypeEnum("service_type").notNull(),
    price: integer("price").notNull(),
    images: json("images").$type<{ url: string }[]>(),
    startTime: time("start_time").default("09:00").notNull(),
    startTimeEnd: time("start_time_end").default("17:00").notNull(),
    description: text("description"),
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
  (service) => ({
    centerIdx: index("services_center_idx").on(service.centerId),
  }),
);

export const servicesRelations = relations(services, ({ one, many }) => ({
  center: one(centers, {
    fields: [services.centerId],
    references: [centers.id],
  }),
  slots: many(slots),
}));
