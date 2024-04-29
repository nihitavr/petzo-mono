import { relations, sql } from "drizzle-orm";
import {
  customType,
  integer,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import wkx from "wkx";

import type { Point } from "../types/types";
import { pgTable } from "./_table";
import { areas } from "./area.schema";
import { cities } from "./city.schema";
import { states } from "./state.schema";

function parseEWKB(wkb: string): Point | null {
  const buffer = Buffer.from(wkb, "hex");

  const geometry = wkx.Geometry.parse(buffer) as unknown as {
    x: number;
    y: number;
  };

  if (geometry.x === undefined || geometry.y === undefined) {
    return null;
  }

  return {
    latitude: geometry.y,
    longitude: geometry.x,
  };
}

export const point = customType<{
  data: Point | null;
  driverData: string;
}>({
  toDriver(point: Point | null) {
    if (point?.latitude === undefined || point?.longitude === undefined) {
      return "";
    }

    return sql`ST_SetSRID(ST_MakePoint(${point.longitude}, ${point.latitude}), 4326)`;
  },

  fromDriver(value: string): Point | null {
    return parseEWKB(value);
  },
  dataType() {
    return "geography(Point)";
  },
});

export const centerAddresses = pgTable(
  "center_address",
  {
    id: serial("id").primaryKey(),
    line1: varchar("line1", { length: 256 }).notNull(),
    pincode: varchar("pincode", { length: 6 }).notNull(),
    geocode: point("geocode"),
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
