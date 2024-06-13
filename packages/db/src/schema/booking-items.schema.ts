import { sql } from "drizzle-orm";
import { index, integer, serial, timestamp } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { bookings } from "./booking.schema";
import { pets } from "./pet.schema";
import { services } from "./service.schema";
import { slots } from "./slot.schema";

export const bookingItems = pgTable(
  "booking_items",
  {
    id: serial("id").primaryKey(),
    bookingId: integer("booking_id")
      .notNull()
      .references(() => bookings.id),
    petId: integer("pet_id")
      .notNull()
      .references(() => pets.id),
    slotId: integer("slot_id").references(() => slots.id),
    serviceId: integer("service_id")
      .notNull()
      .references(() => services.id),
    amount: integer("amount").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (booking) => ({
    bookingIdIdx: index("bookings_id_index").on(booking.bookingId),
  }),
);
