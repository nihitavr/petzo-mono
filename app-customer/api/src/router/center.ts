import type { TRPCRouterRecord } from "@trpc/server";
import { and, eq, gte, ilike, inArray } from "drizzle-orm";

import { schema } from "@petzo/db";
import { CentersFilterSchema } from "@petzo/validators";

import { publicProcedure } from "../trpc";

// Define a static map for cities to their ids(database ids).
const citiyMap: Record<string, number> = {
  bengaluru: 1,
  mumbai: 2,
};

// Define a static map for areas to their ids(database ids).
const areaMap: Record<string, number> = {
  bommanahalli: 1,
  "hsr-layout": 2,
  koramangala: 3,
};

export const centerRouter = {
  findByFilters: publicProcedure
    .input(CentersFilterSchema)
    .query(async ({ ctx, input }) => {
      const cityId = citiyMap[input.city];
      if (!cityId) {
        return [];
      }

      // Get area ids from the input using the static areaMap.
      const areaIds = input.area?.map((a) => areaMap[a]! || -1);

      const serviceType = schema.serviceTypeList.find(
        (v) => v === input.serviceType,
      );

      // If serviceType is provided but not found in the list, return empty array as no center will be found.
      if (!serviceType && input.serviceType) {
        return [];
      }

      // First get all centerIds given the filter parameters.
      const centerIds = (
        await ctx.db
          .selectDistinct({ id: schema.centers.id })
          .from(schema.centers)
          .innerJoin(
            schema.centerAddresses,
            and(
              eq(schema.centers.centerAddressId, schema.centerAddresses.id),

              // If city is provided, filter by it.
              citiyMap[input.city]
                ? eq(schema.centerAddresses.cityId, citiyMap[input.city]!)
                : undefined,

              // If areas are provided, filter by it.
              areaIds?.length
                ? inArray(schema.centerAddresses.areaId, areaIds)
                : undefined,
            ),
          )
          .innerJoin(
            schema.services,
            and(
              eq(schema.centers.id, schema.services.centerId),

              // If serviceType is provided, filter by it.
              serviceType
                ? eq(schema.services.serviceType, serviceType)
                : undefined,
            ),
          )
          .where(
            and(
              // If search is provided, filter center name by it.
              input.search
                ? ilike(schema.centers.name, `%${input.search}%`)
                : undefined,

              // If rating is provided, filter centers by averageRating greater than or equal to the given rating.
              input.rating
                ? gte(schema.centers.averageRating, input.rating)
                : undefined,
            ),
          )
      ).map((c) => c.id);

      if (!centerIds.length) {
        return [];
      }

      // Then fetch centers using the filtered center ids.
      const centers = await ctx.db.query.centers.findMany({
        where: inArray(schema.centers.id, centerIds),
        with: {
          centerAddress: {
            with: {
              area: true,
              city: true,
              state: true,
            },
          },
          services: true,
        },
      });

      return centers;
    }),
} satisfies TRPCRouterRecord;
