import { z } from "zod";

export const ProfileSchema = z.object({
  publicId: z.string().max(20).optional(),
  name: z.string().min(1, "Name is required.").max(255, "Name is too long."),
  description: z.string().optional(),
  type: z.enum(["cat", "small_dog", "big_dog"], {
    errorMap: () => {
      return { message: "Type is required." };
    },
  }),
  behaviourTags: z.array(z.string()),
  gender: z
    .enum(["male", "female"], {
      errorMap: () => {
        return { message: "Gender is required." };
      },
    })
    .optional(),
  images: z.array(z.object({ url: z.string() })).optional(),
  breed: z.string().optional(),
  dateOfBirth: z.coerce
    .date()
    .min(new Date(1965, 1, 1))
    .optional(),
});
