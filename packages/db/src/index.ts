import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as centerAuth from "./schema/center-app-auth-schema";
import * as common from "./schema/common-schema";
import * as customerAuth from "./schema/customer-app-auth-schema";

export const schema = { ...centerAuth, ...customerAuth, ...common };

export { pgTable, customerPgTable, centerPgTable } from "./schema/_table";

export * from "drizzle-orm";

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(process.env.DATABASE_URL!);
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
