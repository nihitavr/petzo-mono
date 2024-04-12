import type { TRPCRouterRecord } from "@trpc/server";
import { and, eq, gte, inArray, sql } from "drizzle-orm";

import { schema } from "@petzo/db";
import { CenterByPublicIdSchema, CentersFilterSchema } from "@petzo/validators";

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
  findByPublicId: publicProcedure
    .input(CenterByPublicIdSchema)
    .query(async ({ ctx, input }) => {
      const center = await ctx.db.query.centers.findFirst({
        where: eq(schema.centers.publicId, input.publicId),
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

      return center;
    }),

  findByFilters: publicProcedure
    .input(CentersFilterSchema)
    .query(async ({ ctx, input }) => {
      // Search Conditions
      const searchConditions = input.search?.map(
        (value) => sql`${schema.centers.name} ILIKE ${"%" + value + "%"}`,
      );
      const combinedConditions = searchConditions
        ? sql.join(searchConditions, sql` AND `)
        : undefined;

      // Get city id from the input using the static cityMap.
      const cityId = citiyMap[input.city];
      if (!cityId) {
        return [];
      }

      // Get area ids from the input using the static areaMap.
      const areaIds = input.area?.map((a) => areaMap[a]! || -1);

      // Get service types from the input using the schema serviceTypeList.
      const serviceTypes = schema.serviceTypeList.filter((v) =>
        input.serviceType?.includes(v),
      );

      // If serviceType is provided but not found in the list, return empty array as no center will be found.
      if (!serviceTypes && input.serviceType) {
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
              serviceTypes?.length
                ? inArray(schema.services.serviceType, serviceTypes)
                : undefined,
            ),
          )
          .where(
            and(
              // If search is provided, filter center name by it.
              combinedConditions,

              // If rating is provided, filter centers by averageRating greater than or equal to the given rating.
              input.rating
                ? gte(schema.centers.averageRating, input.rating)
                : undefined,
            ),
          )
          .offset(
            input.pagination?.page && input.pagination.limit
              ? input.pagination.page * input.pagination.limit
              : 0,
          )
          .limit(input.pagination?.limit ? input.pagination.limit : 3)
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
