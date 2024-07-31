import { z } from "zod";

export const BookService = z.object({
  centerId: z.number(),
  addressId: z.number().optional(),
  items: z.array(
    z.object({ serviceId: z.number(), slotId: z.number(), petId: z.number() }),
  ),
});
