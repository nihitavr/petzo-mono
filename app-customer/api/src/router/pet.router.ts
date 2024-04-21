import { z } from "zod";

import { and, asc, eq, schema } from "@petzo/db";
import { generatePublicId } from "@petzo/utils";
import { petValidator } from "@petzo/validators";

import { protectedProcedure } from "../trpc";

export const petRouter = {
  addPetProfile: protectedProcedure
    .input(petValidator.ProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db
          .insert(schema.pets)
          .values({
            name: input.name,
            publicId: generatePublicId(),
            customerUserId: ctx.session.user.id,
            type: input.type,
            gender: input.gender,
            images: input.images?.map((url) => ({ url })),
            breed: input.breed,
            dateOfBirth: input.dateOfBirth,
          })
          .returning()
      )?.[0];
    }),

  updatePetProfile: protectedProcedure
    .input(petValidator.ProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db
          .update(schema.pets)
          .set({
            name: input.name,
            type: input.type,
            gender: input.gender,
            images: input.images?.map((url) => ({ url })),
            breed: input.breed,
            dateOfBirth: input.dateOfBirth,
          })
          .where(
            and(
              eq(schema.pets.publicId, input.publicId!),
              eq(schema.pets.customerUserId, ctx.session.user.id),
            ),
          )
          .returning()
      )?.[0];
    }),

  getPetProfilePublicIds: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.pets.findMany({
      where: eq(schema.pets.customerUserId, ctx.session.user.id),
      columns: {
        publicId: true,
      },
      orderBy: [asc(schema.pets.name)],
    });
  }),

  getPetProfiles: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.pets.findMany({
      where: eq(schema.pets.customerUserId, ctx.session.user.id),
      orderBy: [asc(schema.pets.name)],
    });
  }),

  getPetProfile: protectedProcedure
    .input(
      z.object({
        publicId: z.string().length(15),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.pets.findFirst({
        where: and(
          eq(schema.pets.customerUserId, ctx.session.user.id),
          eq(schema.pets.publicId, input.publicId),
        ),
        orderBy: [asc(schema.pets.name)],
      });
    }),
};
