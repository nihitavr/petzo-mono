import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";

import type { schema } from "../index";

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
// Area Type
export type Area = InferResultType<"areas">;

// City Type
export type City = InferResultType<"cities">;

// Center Type
export type Center = InferResultType<"centers"> & {
  centerAddress: CenterAddress;
  services?: Service[];
};

// Center Address Type
export type CenterAddress = InferResultType<"centerAddresses"> & {
  area: Area;
  city: City;
};

// Service Type
export type Service = InferResultType<"services"> & {
  slots?: Slot[];
};

// Slot Type
export type Slot = InferResultType<"slots"> & {
  slotAvailabilities: SlotAvailability[];
};

// Slot Availability Type
export type SlotAvailability = InferResultType<"slotAvailabilities">;

export type Pet = InferResultType<"pets">;

// This is to export all the default types from index.ts file as when
// you add type in package.json it will not be exported by default
export * from "../index";
