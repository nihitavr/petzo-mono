import { z } from "zod";

export const ProfileSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  gender: z.enum(["male", "female"]),
  images: z.array(z.string().url()),
  type: z.enum(["cat", "small_dog", "big_dog"]),
  breed: z.string().optional(),
  dateOfBirth: z.coerce.date().min(new Date(1965, 1, 1)),
});
