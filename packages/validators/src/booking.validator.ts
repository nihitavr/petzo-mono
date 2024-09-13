import { z } from "zod";

import { REGEX } from "@petzo/constants";

export const BookService = z.object({
  centerId: z.number(),
  addressId: z.number().optional(),
  phoneNumber: z
    .string()
    .regex(REGEX.mobileNumber, {
      message:
        "Invalid Phone Number. Please provide a valid 10 digits number eg. (9999999999)",
    })
    .optional(),
  items: z.array(
    z.object({ serviceId: z.number(), slotId: z.number(), petId: z.number() }),
  ),
});
