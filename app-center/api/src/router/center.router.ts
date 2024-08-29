import { and, asc, eq, isNull, schema, sql } from "@petzo/db";
import { adminUtils } from "@petzo/utils";
import { centerApp } from "@petzo/validators";

import { generateRandomPublicId } from "../../../../packages/utils/src/string.utils";
import { env } from "../env";
import { protectedCenterProcedure, protectedProcedure } from "../trpc";

const DEFAULT_CENTER_CONFIG = {
  services: {
    boarding: { noOfParallelServices: 1 },
    home_grooming: { noOfParallelServices: 1 },
    mobile_grooming: { noOfParallelServices: 1 },
    grooming: { noOfParallelServices: 1 },
    veterinary: { noOfParallelServices: 1 },
  },
};

export const centerRouter = {
  doesAnyServiceExist: protectedCenterProcedure.query(async ({ ctx }) => {
    return (await ctx.db.query.services.findFirst({
      where: and(
        eq(schema.services.centerId, ctx.center.id),
        isNull(schema.services.deletedAt),
      ),
    }))
      ? true
      : false;
  }),

  getCenter: protectedProcedure
    .input(centerApp.center.CenterAuthorization)
    .query(({ ctx, input }) => {
      return ctx.db.query.centers.findFirst({
        where: and(
          eq(schema.centers.publicId, input.centerPublicId),
          !adminUtils.isAdmin(ctx.session.user.id, env.ADMIN_USER_IDS)
            ? eq(schema.centers.centerUserId, ctx.session.user.id)
            : undefined,
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
            features: input.features,
            ctaButtons: input.ctaButtons,
            images: input.images,
            phoneNumber: input.phoneNumber,
            centerUserId: ctx.session.user.id,
            config: DEFAULT_CENTER_CONFIG,
          })
          .returning()
      )?.[0];
    }),

  updateCenterStatus: protectedCenterProcedure
    .input(centerApp.center.CenterStatus)
    .mutation(async ({ ctx, input }) => {
      if (!adminUtils.isAdmin(ctx.session.user.id, env.ADMIN_USER_IDS)) {
        throw new Error("Unauthorized to change center status.");
      }

      return (
        await ctx.db
          .update(schema.centers)
          .set({
            status: input.status,
          })
          .where(eq(schema.centers.publicId, input.centerPublicId))
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
            features: input.features,
            ctaButtons: input.ctaButtons,
            images: input.images,
            phoneNumber: input.phoneNumber,
          })
          .where(
            and(
              eq(schema.centers.publicId, input.publicId!),
              // Admins can update any center.
              !adminUtils.isAdmin(ctx.session.user.id, env.ADMIN_USER_IDS)
                ? eq(schema.centers.centerUserId, ctx.session.user.id)
                : undefined,
            ),
          )
          .returning()
      )?.[0];
    }),

  updateCenterConfig: protectedCenterProcedure
    .input(centerApp.center.CenterConfig)
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db
          .update(schema.centers)
          .set({
            config: { services: input.services },
          })
          .where(and(eq(schema.centers.publicId, input.centerPublicId)))
          .returning()
      )?.[0];
    }),
};
