import { z } from "zod";

import { REGEX } from "@petzo/constants";

export const Create = z.object({
  name: z.string().min(1, { message: "Please enter a name." }),
  phoneNumber: z.string().regex(REGEX.mobileNumber, {
    message:
      "Invalid Phone Number. Please provide a valid 10 digits number eg. (9999999999)",
  }),
});