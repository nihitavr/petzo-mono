import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { customerPgTable, point } from "./_table";
import { areas } from "./area.schema";
import { cities } from "./city.schema";
import { customerUsers } from "./customer-app-auth.schema";
import { states } from "./state.schema";

export const customerAddresses = customerPgTable(
  "address",
  {
    id: serial("id").primaryKey(),
    customerUserId: varchar("customer_user_id", { length: 255 })
      .notNull()
      .references(() => customerUsers.id),
    name: varchar("name", { length: 256 }).notNull(),
    houseNo: varchar("house_no", { length: 256 }).notNull(), // This is the house/flat/block number that the user can enter.
    line1: varchar("line1", { length: 256 }).notNull(), // This is address string(neighbourhood) that we get from Reverse GeoCoding api.
    line2: varchar("line2", { length: 256 }).notNull(), // This is optional area/road/appartment name that the user can enter.
    pincode: varchar("pincode", { length: 6 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 10 }).notNull(),
    geocode: point("geocode").notNull(),
    areaId: integer("area_id")
      .notNull()
      .references(() => areas.id),
    cityId: integer("city_id")
      .notNull()
      .references(() => cities.id),
    stateId: integer("state_id")
      .notNull()
      .references(() => states.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (customerAddresses) => ({
    customerUserIdx: index("customer_address_user_id_idx").on(
      customerAddresses.customerUserId,
    ),
  }),
);

export const customerAddressRelations = relations(
  customerAddresses,
  ({ one }) => ({
    area: one(areas, {
      fields: [customerAddresses.areaId],
      references: [areas.id],
    }),
    city: one(cities, {
      fields: [customerAddresses.cityId],
      references: [cities.id],
    }),
    state: one(states, {
      fields: [customerAddresses.stateId],
      references: [states.id],
    }),
  }),
);
