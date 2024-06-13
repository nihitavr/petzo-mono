import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { centers } from "./center.schema";
import { customerAddresses } from "./customer-address.schema";
import { customerUsers } from "./customer-app-auth.schema";

export const bookingStatusEnum = pgEnum("booking_status_type", [
  "booked",
  "confirmed",
  "cancelled",
]);

export const bookings = pgTable(
  "booking",
  {
    id: serial("id").primaryKey(),
    customerUserId: varchar("customer_user_id", { length: 255 })
      .notNull()
      .references(() => customerUsers.id),

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
    centerIdIdx: index("center_id_index").on(booking.centerId),
    customerUserIdIdx: index("customer_user_id_index").on(
      booking.customerUserId,
    ),
  }),
);
