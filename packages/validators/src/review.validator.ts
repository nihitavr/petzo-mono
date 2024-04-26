import { z } from "zod";

export const GetUserReviews = z.object({
  centerId: z.number(),
  pagination: z
    .object({
      page: z.number().min(0).default(0),
      limit: z.number().min(0).max(20).default(20),
    })
    .optional(),
});

export const ReviewRatingForm = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  text: z.string(),
});
