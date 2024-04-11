import { zodResolver as zr } from "@hookform/resolvers/zod";
import { z } from "zod";

export const zodResolver = zr;

export const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const CentersFilterSchema = z.object({
  search: z
    .string()
    .optional()
    .transform((val) =>
      val
        ?.trim()
        .split(" ")
        .map((v) => `%${v.trim()}%`),
    ),
  city: z.string(),
  serviceType: z
    .string()
    .optional()
    .transform((val) => val?.split(",")),
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

export const CentersFilterFormSchema = z.object({
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

export const GetCityAreasSchema = z.object({ city: z.string() });
