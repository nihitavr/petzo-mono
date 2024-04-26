import { z } from "zod";

import { and, eq, schema, sql } from "@petzo/db";

import { protectedProcedure } from "../trpc";

export const ratingsRouter = {
  upsertRating: protectedProcedure
    .input(
      z.object({
        centerId: z.number(),
        rating: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentRating = await ctx.db.query.ratings.findFirst({
        where: and(
          eq(schema.ratings.centerId, input.centerId),
          eq(schema.ratings.customerUserId, ctx.session.user.id),
        ),
      });

      let updatedRating;

      if (currentRating?.id) {
        await ctx.db.transaction(async (tx) => {
          await tx.execute(sql`
            UPDATE ${schema.centers}
            SET average_rating = ((average_rating * rating_count) - ${currentRating.rating} + ${input.rating})/rating_count
            WHERE id = ${input.centerId};
          `);

          updatedRating = await tx
            .update(schema.ratings)
            .set({
              rating: input.rating,
            })
            .where(
              and(
                eq(schema.ratings.centerId, input.centerId),
                eq(schema.ratings.customerUserId, ctx.session.user.id),
              ),
            )
            .returning();
        });
      } else {
        await ctx.db.transaction(async (tx) => {
          await tx.execute(sql`
            UPDATE ${schema.centers}
            SET average_rating = ((average_rating * rating_count) + ${input.rating})/(rating_count + 1), rating_count = rating_count + 1
            WHERE id = ${input.centerId};
        `);

          updatedRating = await tx
            .insert(schema.ratings)
            .values({
              centerId: input.centerId,
              customerUserId: ctx.session.user.id,
              rating: input.rating,
            })
            .returning();
        });
      }

      return updatedRating?.[0];
    }),
};
