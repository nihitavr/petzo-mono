import { and, asc, eq, isNull, schema, sql } from "@petzo/db";
import { centerApp } from "@petzo/validators";

import { generateRandomPublicId } from "../../../../packages/utils/src/string.utils";
import { protectedCenterProcedure, protectedProcedure } from "../trpc";

export const centerRouter = {
  getCenter: protectedProcedure
    .input(centerApp.center.CenterAuthorization)
    .query(({ ctx, input }) => {
      return ctx.db.query.centers.findFirst({
        where: and(
          eq(schema.centers.publicId, input.centerPublicId),
          eq(schema.centers.centerUserId, ctx.session.user.id),
          isNull(schema.centers.deletedAt),
        ),
      });
    }),

  getCenters: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.centers.findMany({
      where: and(
        eq(schema.centers.centerUserId, ctx.session.user.id),
        isNull(schema.centers.deletedAt),
      ),
      with: {
        centerAddress: {
          with: {
            area: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: [asc(schema.centers.name)],
    });
  }),

  deleteCenter: protectedCenterProcedure
    .input(centerApp.center.CenterAuthorization)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(schema.centers)
        .set({ deletedAt: sql`CURRENT_TIMESTAMP` })
        .where(and(eq(schema.centers.publicId, input.centerPublicId)));
    }),

  createCenter: protectedProcedure
    .input(centerApp.center.CenterSchema)
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db
          .insert(schema.centers)
          .values({
            publicId: generateRandomPublicId(),
            name: input.name,
            description: input.description,
            images: input.images,
            phoneNumber: input.phoneNumber,
            centerUserId: ctx.session.user.id,
          })
          .returning()
      )?.[0];
    }),

  updateCenter: protectedProcedure
    .input(centerApp.center.CenterSchema)
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db
          .update(schema.centers)
          .set({
            name: input.name,
            description: input.description,
            images: input.images,
            phoneNumber: input.phoneNumber,
            centerUserId: ctx.session.user.id,
          })
          .where(and(eq(schema.centers.publicId, input.publicId!)))
          .returning()
      )?.[0];
    }),
};
