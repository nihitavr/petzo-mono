import { schema } from "@petzo/db";
import { customerApp } from "@petzo/validators";

import { publicProcedure } from "../trpc";

export const earlyAccessUsersRouter = {
  create: publicProcedure
    .input(customerApp.earlyAccessUsers.Create)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(schema.earlyAccessUsers).values(input);
    }),
};
