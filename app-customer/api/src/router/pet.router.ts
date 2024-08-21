import { z } from "zod";

import { and, asc, eq, isNull, schema, sql } from "@petzo/db";
import { petValidator } from "@petzo/validators";

import { generateRandomPublicId } from "../../../../packages/utils/src/string.utils";
import { protectedProcedure } from "../trpc";

export const petRouter = {
  deletePet: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(schema.pets)
        .set({ deletedAt: sql`CURRENT_TIMESTAMP` })
        .where(
          and(
            eq(schema.pets.id, input.id),
            eq(schema.pets.customerUserId, ctx.session.user.id),
          ),
        );
    }),

  addPetProfile: protectedProcedure
    .input(petValidator.ProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db
          .insert(schema.pets)
          .values({
            name: input.name,
            publicId: generateRandomPublicId(),
            customerUserId: ctx.session.user.id,
            description: input.description,
            behaviourTags: input.behaviourTags,
            type: input.type,
            gender: input.gender,
            images: input.images,
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
            description: input.description,
            behaviourTags: input.behaviourTags,
            images: input.images,
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

  getPetProfiles: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.pets.findMany({
      where: and(
        eq(schema.pets.customerUserId, ctx.session.user.id),
        isNull(schema.pets.deletedAt),
      ),
      orderBy: [asc(schema.pets.name)],
    });
  }),

  getPetProfile: protectedProcedure
    .input(
      z.object({
        publicId: z.string().max(20),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.pets.findFirst({
        where: and(
          eq(schema.pets.customerUserId, ctx.session.user.id),
          eq(schema.pets.publicId, input.publicId),
          isNull(schema.pets.deletedAt),
        ),
        orderBy: [asc(schema.pets.name)],
      });
    }),
};
