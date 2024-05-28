import { z } from "zod";

export const GetAreasByCity = z.object({ city: z.string() });

export const CreateArea = z.object({
  area: z.object({
    name: z.string(),
    publicId: z.string(),
    externalId: z.string(),
  }),
  city: z.object({
    name: z.string(),
    publicId: z.string(),
    externalId: z.string(),
  }),
  state: z.object({
    name: z.string(),
    publicId: z.string(),
    externalId: z.string(),
  }),
});
