import { z } from "zod";

import { REGEX } from "@petzo/constants";

export const CustomerAddressForm = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1, { message: "Please enter a address name." }),
  phoneNumber: z.string().regex(REGEX.mobileNumber, {
    message:
      "Invalid Phone Number. Please provide a valid 10 digits number eg. (9999999999)",
  }),
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
    latitude: z.number(),
    longitude: z.number(),
  }),
});
