import { relations, sql } from "drizzle-orm";
import { integer, serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { centerPgTable, point } from "./_table";
import { areas } from "./area.schema";
import { cities } from "./city.schema";
import { states } from "./state.schema";

export const centerAddresses = centerPgTable(
  "address",
  {
    id: serial("id").primaryKey(),
    houseNo: varchar("house_no", { length: 256 }).notNull(), // This is the house/flat/block number that the user can enter.
    line1: varchar("line1", { length: 256 }).notNull(), // This is address string(neighbourhood) that we get from Reverse GeoCoding api.
    line2: varchar("line2", { length: 256 }).notNull(), // This is optional area/road/appartment name that the user can enter.
    pincode: varchar("pincode", { length: 6 }).notNull(),
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
  },

  // TODO: This index need to be added manually to the database
  (centerAddresses) => ({
    centerAddressGeocodeGistIndex: sql`CREATE INDEX center_address_geocode_gist_index ON ${centerAddresses} USING GIST (${centerAddresses.geocode})`,
  }),
);

export const centerAddressRelations = relations(centerAddresses, ({ one }) => ({
  area: one(areas, {
    fields: [centerAddresses.areaId],
    references: [areas.id],
  }),
  city: one(cities, {
    fields: [centerAddresses.cityId],
    references: [cities.id],
  }),
  state: one(states, {
    fields: [centerAddresses.stateId],
    references: [states.id],
  }),
}));
