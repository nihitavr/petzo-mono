import { z } from "zod";

export const Geocode = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
