import { relations, sql } from "drizzle-orm";
import {
  boolean,
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

import type { DAYS_TYPE, PET_TYPE } from "@petzo/constants";
import { SERVICE_TYPE_VALUES } from "@petzo/constants";

import { pgTable } from "./_table";
import { centers } from "./center.schema";
import { slots } from "./slot.schema";

export const serviceTypeEnum = pgEnum(
  "center_service_type",
  SERVICE_TYPE_VALUES,
);

export const services = pgTable(
  "service",
  {
    id: serial("id").primaryKey(),
    publicId: varchar("public_id", { length: 20 }).notNull().unique(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    serviceType: serviceTypeEnum("service_type").notNull(),
    petTypes: json("pet_types").$type<PET_TYPE[]>(),
    isBookingEnabled: boolean("is_booking_enabled").default(false).notNull(),
    price: integer("price").notNull(),
    discountedPrice: integer("discounted_price").default(0).notNull(),
    images: json("images").$type<{ url: string }[]>(),
    config: json("config")
      .$type<{
        operatingHours: Record<
          DAYS_TYPE,
          { startTime: string; startTimeEnd: string } | null
        >;
      }>()
      .default({
        operatingHours: {
          sun: null,
          mon: null,
          tue: null,
          wed: null,
          thu: null,
          fri: null,
          sat: null,
        },
      }),

    startTime: time("start_time").default("09:00").notNull(),

    // Duration in minutes
    duration: integer("duration").default(60).notNull(),
    startTimeEnd: time("start_time_end").default("17:00").notNull(),
    centerId: integer("center_id")
      .notNull()
      .references(() => centers.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at"),
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
