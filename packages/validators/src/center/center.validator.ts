import { z } from "zod";

import { REGEX } from "@petzo/constants";

export const CenterAuthorization = z.object({ centerPublicId: z.string() });

export const CenterSchema = z.object({
  publicId: z.string().max(20).optional(),
  name: z.string().min(1, "Name is required.").max(255, "Name is too long."),
  description: z.string().optional(),
  images: z.array(z.object({ url: z.string() })).optional(),
  phoneNumber: z.string().regex(REGEX.mobileNumber, {
    message:
      "Invalid Phone Number. Please provide a valid 10 digits number eg. (9999999999)",
  }),
});

export const CenterConfig = CenterAuthorization.extend({
  services: z.object({
    home_grooming: z.object({ noOfParallelServices: z.number() }).optional(),
    grooming: z.object({ noOfParallelServices: z.number() }).optional(),
    veterinary: z.object({ noOfParallelServices: z.number() }).optional(),
    boarding: z.object({ noOfParallelServices: z.number() }).optional(),
  }),
});
