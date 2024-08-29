import { z } from "zod";

export const CenterAddressForm = z.object({
  id: z.number().int().optional(),
  houseNo: z
    .string()
    .min(1, { message: "Please enter a valid house, flat, block no." }),
  line1: z.string().min(0),
  line2: z
    .string()
    .min(1, { message: "Please enter a valid appartment, road, area." }),
  pincode: z
    .string()
    .min(6, { message: "Please enter a valid pincode." })
    .max(15, { message: "Please enter a valid pincode." }),
  areaId: z.number().int(),
  cityId: z.number().int(),
  stateId: z.number().int(),
  geocode: z.object({
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
  }),
});
