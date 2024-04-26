import { z } from "zod";

import type { Review } from "@petzo/db";
import { and, desc, eq, isNull, schema } from "@petzo/db";
import { reviewValidator } from "@petzo/validators";

import { protectedProcedure, publicProcedure } from "../trpc";

export const reviewsRouter = {
  getCurrentUserReview: protectedProcedure
    .input(reviewValidator.GetUserReviews)
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.db
        .select()
        .from(schema.reviews)
        .where(
          and(
            eq(schema.reviews.centerId, input.centerId),
            eq(schema.reviews.customerUserId, ctx.session.user.id),
            isNull(schema.reviews.parentReviewId),
          ),
        )
        .leftJoin(
          schema.ratings,
          and(
            eq(schema.reviews.centerId, schema.ratings.centerId),
            eq(schema.reviews.customerUserId, schema.ratings.customerUserId),
          ),
        );

      if (!reviews || reviews.length === 0) return undefined;

      return {
        ...reviews[0]!.review,
        rating: { ...reviews[0]?.rating },
        user: { ...ctx.session.user, phoneNumber: null },
      } as Review;
    }),
  getReviews: publicProcedure
    .input(reviewValidator.GetUserReviews)
    .query(async ({ ctx, input }) => {
      const reviewsAndRatings = await ctx.db
        .select()
        .from(schema.reviews)
        .where(
          and(
            eq(schema.reviews.centerId, input.centerId),
            isNull(schema.reviews.parentReviewId),
          ),
        )
        .leftJoin(
          schema.customerUsers,
          eq(schema.reviews.customerUserId, schema.customerUsers.id),
        )
        .leftJoin(
          schema.ratings,
          and(
            eq(schema.reviews.centerId, schema.ratings.centerId),
            eq(schema.reviews.customerUserId, schema.ratings.customerUserId),
          ),
        )
        .orderBy(desc(schema.reviews.createdAt))
        .offset((input.pagination?.page ?? 0) * (input.pagination?.limit ?? 0))
        .limit(input.pagination?.limit ?? 20);

      const reviews = reviewsAndRatings.map((reviewAndRating) => {
        return {
          ...reviewAndRating.review,
          rating: reviewAndRating.rating,
          user: { ...reviewAndRating.user, phoneNumber: null },
        };
      });

      return reviews as Review[];
    }),

  upsertReview: protectedProcedure
    .input(
      z.object({
        centerId: z.number(),
        reviewText: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the user has already reviewed the center
      const currentReview = await ctx.db.query.reviews.findFirst({
        where: and(
          eq(schema.reviews.centerId, input.centerId),
          eq(schema.reviews.customerUserId, ctx.session.user.id),
          isNull(schema.reviews.parentReviewId),
        ),
      });

      let updatedReviews;

      // If the user has already reviewed the center, update the review
      if (currentReview?.id) {
        updatedReviews = await ctx.db
          .update(schema.reviews)
          .set({
            text: input.reviewText,
          })
          .where(
            and(
              eq(schema.reviews.centerId, input.centerId),
              eq(schema.reviews.customerUserId, ctx.session.user.id),
              isNull(schema.reviews.parentReviewId),
            ),
          )
          .returning();
      } else {
        // If the user has not reviewed the center, insert a new review
        updatedReviews = await ctx.db
          .insert(schema.reviews)
          .values({
            centerId: input.centerId,
            customerUserId: ctx.session.user.id,
            text: input.reviewText,
          })
          .returning();
      }

      return updatedReviews?.[0];
    }),
};
