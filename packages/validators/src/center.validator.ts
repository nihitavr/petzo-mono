import { z } from "zod";

export const FindByPublicId = z.object({ publicId: z.string() });

export const FindByFilters = z.object({
  search: z
    .string()
    .optional(),
    // .transform((val) =>
    //   val
    //     ?.trim()
    //     .split(" ")
    //     .map((v) => `${v.trim()}`),
    // ),
  city: z.string(),
  serviceType: z
    .string()
    .optional()
    .transform((val) => val?.split(",")),
  ratingGte: z.number().optional(),
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

  pagination: z
    .object({
      page: z.number().min(0).optional(),
      limit: z.number().min(0).max(20).optional(),
    })
    .optional(),
});

export const FormFilters = z.object({
  filters: z.array(
    z.object({
      publicId: z.string(),
      label: z.string(),
      items: z.array(
        z.object({
          label: z.string(),
          publicId: z.string(),
          selected: z.boolean(),
        }),
      ),
    }),
  ),
});
