import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { centers } from "./center.schema";
import { customerUsers } from "./customer-app-auth.schema";
import { pets } from "./pet.schema";
import { services } from "./service.schema";
import { slots } from "./slot.schema";

export const bookings = pgTable(
  "booking",
  {
    id: serial("id").primaryKey(),
    customerUserId: varchar("customer_user_id", { length: 255 })
      .notNull()
      .references(() => customerUsers.id),

    petId: integer("pet_id")
      .notNull()
      .references(() => pets.id),
    slotId: integer("slot_id")
      .notNull()
      .references(() => slots.id),
    serviceId: integer("service_id")
      .notNull()
      .references(() => services.id),
    centerId: integer("center_id")
      .notNull()
      .references(() => centers.id),
    amount: integer("amount").notNull(),
    isPaid: boolean("is_paid").notNull(),
    status: varchar("status", { length: 256 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (booking) => ({
    userPetIdx: index("bookings_user_pet_idx").on(
      booking.customerUserId,
      booking.petId,
    ),
    serviceCenterIdx: index("bookings_service_center_idx").on(
      booking.serviceId,
      booking.centerId,
    ),
  }),
);
