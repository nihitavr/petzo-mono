import type { TRPCRouterRecord } from "@trpc/server";

import type { Center } from "@petzo/db";
import { SERVICE_TYPE_VALUES } from "@petzo/constants";
import { and, desc, eq, gte, inArray, schema, sql } from "@petzo/db";
import { centerValidator } from "@petzo/validators";

import { publicCachedProcedure } from "../trpc";
import { geographyRouterUtils } from "./geography.router";

const NEARBY_DISTANCE_IN_METERS = 5000;

const DEFAULT_PAGE_SIZE = 10;

export const centerRouter = {
  findByPublicId: publicCachedProcedure
    .meta({ cacheTTLInSeconds: 1 })
    .input(centerValidator.FindByPublicId)
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

  findByFilters: publicCachedProcedure
    .meta({ cacheTTLInSeconds: 60 })
    .input(centerValidator.FindByFilters)
    .query(async ({ ctx, input }) => {
      // Get area ids from the input using the static areaMap.
      // const areaIds = input.area?.map((a) => AreaMap[a]! || -1);
      const areaIds = await geographyRouterUtils.getAreaIdsByPublicIds(
        ctx,
        input.area,
      );

      // Get service types from the input using the schema serviceTypeList.
      const serviceTypes = SERVICE_TYPE_VALUES.filter((v) =>
        input.serviceType?.includes(v),
      );

      // If serviceType is provided but not found in the list, return empty array as no center will be found.
      if (!serviceTypes && input.serviceType) {
        return [];
      }

      let centerIdsQuery;

      // If search is provided, get center ids with similarity.
      if (input.search) {
        centerIdsQuery = ctx.db.selectDistinct({
          id: schema.centers.id,
          sim: sql`word_similarity(${schema.centers.name}, ${input.search}) as sim`,
        });
      } else if (input.geoCode) {
        centerIdsQuery = ctx.db.selectDistinct({
          id: schema.centers.id,
          // Calculate distance between center and given geoCode.
          distance: sql`ST_Distance(
              geocode::geography,
              ST_SetSRID(ST_Point(${input.geoCode.longitude}, ${input.geoCode.latitude}), 4326)::geography)
              AS distance`,
        });
      } else {
        centerIdsQuery = ctx.db.selectDistinct({
          id: schema.centers.id,
        });
      }

      // Comman query for centerIds based on filters.
      centerIdsQuery = centerIdsQuery
        .from(schema.centers)
        .innerJoin(
          schema.centerAddresses,
          and(
            eq(schema.centers.centerAddressId, schema.centerAddresses.id),

            // If city is provided, filter by it.
            input.city
              ? eq(
                  schema.centerAddresses.cityId,
                  sql`(SELECT ${schema.cities.id} FROM ${schema.cities} WHERE ${schema.cities.publicId} = ${input.city})`,
                )
              : undefined,

            // If areas are provided, filter by it.
            areaIds?.length
              ? inArray(schema.centerAddresses.areaId, areaIds)
              : undefined,

            // If geoCode is provided, filter by it.
            input.geoCode
              ? sql`ST_DWithin(
            geocode,
            ST_SetSRID(ST_Point(${input.geoCode.longitude}, ${input.geoCode.latitude}), 4326)::geography,
            ${NEARBY_DISTANCE_IN_METERS})`
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
            input.search
              ? sql`word_similarity(${schema.centers.name}, ${input.search}) > 0.1`
              : undefined,

            eq(schema.centers.status, "verified"),
            // If rating is provided, filter centers by averageRating greater than or equal to the given rating.
            input.ratingGte
              ? gte(schema.centers.averageRating, input.ratingGte)
              : undefined,
          ),
        );

      // If search is provided, order by similarity.
      if (input.search) {
        centerIdsQuery = centerIdsQuery.orderBy(desc(sql`sim`));
      } else if (input.geoCode) {
        centerIdsQuery = centerIdsQuery.orderBy(desc(sql`distance`));
      }

      // Pagination logic of the query.
      centerIdsQuery = centerIdsQuery
        .offset(
          input.pagination?.page && input.pagination.limit
            ? input.pagination.page * input.pagination.limit
            : 0,
        )
        .limit(
          input.pagination?.limit ? input.pagination.limit : DEFAULT_PAGE_SIZE,
        );

      const centerIdsData: {
        id: number;
        sim?: number;
        distance?: number;
      }[] = await centerIdsQuery;

      // First get all centerIds given the filter parameters.
      const centerIds = centerIdsData.map((c) => c.id);

      if (!centerIds.length) return [];

      // Then fetch centers using the filtered center ids.
      const centers: Center[] = await ctx.db.query.centers.findMany({
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
        orderBy: sql.raw(
          `ARRAY_POSITION(ARRAY[${centerIds.join(",")}], ${schema.centers.id.name})`,
        ),
      });

      return centers;
    }),
} satisfies TRPCRouterRecord;
