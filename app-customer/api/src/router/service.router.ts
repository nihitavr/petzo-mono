import { eq, schema } from "@petzo/db";
import { serviceValidator } from "@petzo/validators";

import { publicCachedProcedure } from "../trpc";

export const serviceRouter = {
  findByPublicId: publicCachedProcedure
    .input(serviceValidator.FindByPublicId)
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.services.findFirst({
        where: eq(schema.services.publicId, input.publicId),
      });
    }),
    
};
