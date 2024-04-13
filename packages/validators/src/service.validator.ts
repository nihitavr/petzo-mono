import { z } from "zod";

export const FindByPublicId = z.object({ publicId: z.string() });
