import {
  boolean,
  index,
  integer,
  serial,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { cities } from "./city.schema";

export const areas = pgTable(
  "area",
  {
    id: serial("id").primaryKey(),
    publicId: varchar("public_id", { length: 40 }).unique().notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    isActive: boolean("is_active").default(false).notNull(),

    externalId: varchar("external_id", { length: 256 }).unique(), // This is the id that we get from the external api.

    // Only main areas will be shown in the filters.
    isParent: boolean("is_parent").default(false).notNull(),
    parentAreaId: integer("parent_area_id"),

    cityId: integer("city_id")
      .notNull()
      .references(() => cities.id),
  },
  (area) => ({
    areaAndParentIdx: index("area_and_parent_idx").on(area.parentAreaId),
    cityIdIdx: unique("city_id_area_idx_idx").on(area.cityId, area.publicId),
  }),
);
