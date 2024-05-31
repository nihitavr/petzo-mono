import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as area from "./schema/area.schema";
import * as booking from "./schema/booking.schema";
import * as centerAddress from "./schema/center-address.schema";
import * as centerAuth from "./schema/center-app-auth.schema";
import * as center from "./schema/center.schema";
import * as city from "./schema/city.schema";
import * as customerAddress from "./schema/customer-address.schema";
import * as customerAuth from "./schema/customer-app-auth.schema";
import * as petMedicalRecords from "./schema/pet-medical-records.schema";
import * as pet from "./schema/pet.schema";
import * as ratings from "./schema/rating.schema";
import * as reviews from "./schema/review.schema";
import * as service from "./schema/service.schema";
import * as slot from "./schema/slot.schema";
import * as staff from "./schema/staff.schema";
import * as state from "./schema/state.schema";
import * as vet from "./schema/vet.schema";

export const schema = {
  ...centerAuth,
  ...customerAuth,
  ...customerAddress,
  ...area,
  ...booking,
  ...center,
  ...centerAddress,
  ...city,
  ...pet,
  ...reviews,
  ...ratings,
  ...service,
  ...slot,
  ...staff,
  ...state,
  ...vet,
  ...petMedicalRecords,
};

export { pgTable, customerPgTable, centerPgTable } from "./schema/_table";

export * from "drizzle-orm";

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(process.env.DATABASE_URL!);
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
