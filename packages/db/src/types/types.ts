import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";

import * as centerAuth from "../schema/center-app-auth-schema";
import * as common from "../schema/common-schema";
import * as customerAuth from "../schema/customer-app-auth-schema";

const schema = { ...centerAuth, ...customerAuth, ...common };

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

export type Area = InferResultType<"areas">;
export type City = InferResultType<"cities">;

export type Center = InferResultType<"centers"> & {
  centerAddress: CenterAddress;
  services: Service[];
};

export type CenterAddress = InferResultType<"centerAddresses"> & {
  area: Area;
  city: City;
};

export type Service = InferResultType<"services">;

// This is to export all the default types from index.ts file
export * from "../index";
