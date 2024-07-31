import { z } from "zod";

export const CenterAuthorization = z.object({ centerPublicId: z.string() });

export const CenterSchema = z.object({
  publicId: z.string().max(20).optional(),
  name: z.string().min(1, "Name is required.").max(255, "Name is too long."),
  description: z.string().optional(),
  images: z.array(z.object({ url: z.string() })).optional(),
  phoneNumber: z
    .string()
    .min(1, "Phone is required.")
    .max(15, "Phone is too long."),
});
