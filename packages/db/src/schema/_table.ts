import { sql } from "drizzle-orm";
import { customType, pgTableCreator } from "drizzle-orm/pg-core";
import wkx from "wkx";

import type { Point } from "../types/types";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM.
 * Use the same database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const pgTable = pgTableCreator((name) => `${name}`);
export const customerPgTable = pgTableCreator((name) => `customer_${name}`);
export const centerPgTable = pgTableCreator((name) => `center_${name}`);

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

// Point custom type cannot be used directly in the schema. It needs to be wrapped in a customType.
// This is because the customType function is used to define the toDriver and fromDriver
// functions to convert the data to and from the database.
export const point = customType<{
  data: Point | null;
  driverData: string;
}>({
  toDriver(point: Point | null) {
    if (point?.latitude === undefined || point?.longitude === undefined)
      return "";

    return sql`ST_SetSRID(ST_MakePoint(${point.longitude}, ${point.latitude}),4326)`;
  },
  fromDriver(value: string): Point | null {
    return parseEWKB(value);
  },
  dataType() {
    return "geography";

    // TODO: geography(Point,4326) is what is in the database. But for some reason drizzle-kit when
    // pulls schema from database it only gets "geography" and not "geography(Point,4326)"
    // So for now, we are returning "geography" here. But this should be fixed in drizzle-kit.
    // return "geography(Point,4326)";
  },
});
