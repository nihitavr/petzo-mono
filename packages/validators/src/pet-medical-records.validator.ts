import { z } from "zod";

export const InsertSchema = z.object({
  petPublicId: z.string().length(15, "Select pet from dropdown"),
  centerId: z.number().int().positive().optional().nullable(),
  description: z.string(),
  images: z
    .array(z.object({ url: z.string() }))
    .min(0)
    .max(5),
  appointmentDate: z.coerce.date().min(new Date(1965, 1, 1)),
});

export const UpdateSchema = z.object({
  id: z.number().int().positive(),
  petPublicId: z.string().length(15, "Select pet from dropdown"),
  centerId: z.number().int().positive().optional().nullable(),
  description: z.string(),
  images: z
    .array(z.object({ url: z.string() }))
    .min(0)
    .max(5),
  appointmentDate: z.coerce.date().min(new Date(1965, 1, 1)),
});
