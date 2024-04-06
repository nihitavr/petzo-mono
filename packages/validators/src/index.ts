import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const CentersFilterSchema = z.object({
  search: z.string().optional(),
  city: z.string(),
  serviceType: z.string().optional(),
  rating: z.number().optional(),
  area: z
    .string()
    .optional()
    .transform((val) => val?.split(",")),
  geoCode: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});
