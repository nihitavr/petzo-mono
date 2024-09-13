import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { BOOKING_STATUS } from "@petzo/constants";

import { pgTable } from "./_table";
import { bookingItems } from "./booking-items.schema";
import { centers } from "./center.schema";
import { customerAddresses } from "./customer-address.schema";
import { customerUsers } from "./customer-app-auth.schema";

export const bookingStatusEnum = pgEnum("booking_status_type", BOOKING_STATUS);

export const bookings = pgTable(
  "booking",
  {
    id: serial("id").primaryKey(),
    customerUserId: varchar("customer_user_id", { length: 255 })
      .notNull()
      .references(() => customerUsers.id),
    phoneNumber: varchar("phone_number", { length: 10 }),
    addressId: integer("address_id").references(() => customerAddresses.id),
    centerId: integer("center_id")
      .notNull()
      .references(() => centers.id),
    amount: integer("amount").notNull(),
    isPaid: boolean("is_paid").notNull(),
    status: bookingStatusEnum("status").default("booked").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (booking) => ({
    centerIdStatusIdx: index("center_id_and_status_index").on(
      booking.centerId,
      booking.status,
    ),
    customerUserIdStatusIdx: index("customer_user_id_and_status_index").on(
      booking.customerUserId,
    ),
  }),
);

export const bookingRelations = relations(bookings, ({ one, many }) => ({
  user: one(customerUsers, {
    fields: [bookings.customerUserId],
    references: [customerUsers.id],
  }),
  center: one(centers, {
    fields: [bookings.centerId],
    references: [centers.id],
  }),
  address: one(customerAddresses, {
    fields: [bookings.addressId],
    references: [customerAddresses.id],
  }),
  items: many(bookingItems),
}));
