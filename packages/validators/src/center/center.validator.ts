import { z } from "zod";

import {
  CENTER_CTA_BUTTONS,
  CENTER_FEATURES,
  CENTER_STATUS,
  REGEX,
} from "@petzo/constants";

export const CenterAuthorization = z.object({ centerPublicId: z.string() });

export const CenterSchema = z.object({
  publicId: z.string().max(20).optional(),
  name: z.string().min(1, "Name is required.").max(255, "Name is too long."),
  description: z.string().optional(),
  googleRating: z.coerce.number().min(0).max(5),
  googleRatingCount: z.coerce.number().min(0),
  images: z.array(z.object({ url: z.string() })).optional(),
  features: z.array(z.enum(CENTER_FEATURES)),
  ctaButtons: z.array(z.enum(CENTER_CTA_BUTTONS)),
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

export const CenterStatus = CenterAuthorization.extend({
  status: z.enum(CENTER_STATUS),
});
