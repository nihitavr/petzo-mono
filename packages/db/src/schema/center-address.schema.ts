import { relations, sql } from "drizzle-orm";
import { integer, json, serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { areas } from "./area.schema";
import { cities } from "./city.schema";
import { states } from "./state.schema";

export const centerAddresses = pgTable("center_address", {
  id: serial("id").primaryKey(),
  line1: varchar("line1", { length: 256 }).notNull(),
  pincode: varchar("pincode", { length: 6 }).notNull(),
  geocode: json("geocode").$type<{ latitude: number; longitude: number }>(),
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
});

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
