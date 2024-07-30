import type { DAYS_TYPE } from "@petzo/constants";
import { and, asc, eq, isNull, schema, sql } from "@petzo/db";
import { centerApp } from "@petzo/validators";

import { generateRandomPublicId } from "../../../../packages/utils/src/string.utils";
import { protectedCenterProcedure } from "../trpc";

export const serviceRouter = {
  getService: protectedCenterProcedure
    .input(centerApp.service.ServicePublicId)
    .query(({ ctx, input }) => {
      return ctx.db.query.services.findFirst({
        where: and(
          eq(schema.services.centerId, ctx.center.id),
          eq(schema.services.publicId, input.servicePublicId),
          isNull(schema.services.deletedAt),
        ),
      });
    }),

  getServices: protectedCenterProcedure.query(({ ctx }) => {
    return ctx.db.query.services.findMany({
      where: and(
        eq(schema.services.centerId, ctx.center.id),
        isNull(schema.services.deletedAt),
      ),
      orderBy: [asc(schema.services.serviceType), asc(schema.services.price)],
    });
  }),

  deleteService: protectedCenterProcedure
    .input(centerApp.service.ServicePublicId)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(schema.services)
        .set({ deletedAt: sql`CURRENT_TIMESTAMP` })
        .where(
          and(
            eq(schema.services.publicId, input.servicePublicId),
            eq(schema.services.centerId, ctx.center.id),
          ),
        );
    }),

  createService: protectedCenterProcedure
    .input(centerApp.service.ServiceSchema)
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db
          .insert(schema.services)
          .values({
            name: input.name,
            centerId: ctx.center.id,
            publicId: generateRandomPublicId(),
            description: input.description,
            serviceType: input.serviceType,
            petTypes: input.petTypes,
            config: input.config as {
              operatingHours: Record<
                DAYS_TYPE,
                { startTime: string; startTimeEnd: string } | null
              >;
            },
            price: input.price,
            images: input.images,
            duration: input.duration,
            startTime: input.startTime,
            startTimeEnd: input.startTimeEnd,
          })
          .returning()
      )?.[0];
    }),

  updateService: protectedCenterProcedure
    .input(centerApp.service.ServiceSchema)
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db
          .update(schema.services)
          .set({
            name: input.name,
            description: input.description,
            serviceType: input.serviceType,
            petTypes: input.petTypes,
            config: input.config as {
              operatingHours: Record<
                DAYS_TYPE,
                { startTime: string; startTimeEnd: string } | null
              >;
            },
            price: input.price,
            images: input.images,
            duration: input.duration,
            startTime: input.startTime,
            startTimeEnd: input.startTimeEnd,
          })
          .where(
            and(
              eq(schema.services.publicId, input.publicId!),
              eq(schema.services.centerId, ctx.center.id),
            ),
          )
          .returning()
      )?.[0];
    }),
};
