import { z } from "zod";

import { eq, schema } from "@petzo/db";

import { protectedProcedure, publicProcedure } from "../trpc";

export const userProfileFormSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
});

export const userRouter = {
  getUserProfile: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(({ ctx, input: { id } }) => {
      return ctx.db.query.customerUsers.findFirst({
        where: eq(schema.customerUsers.id, id),
        columns: { id: true, name: true, phoneNumber: true, email: true },
      });
    }),

  getProtectedUserProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.customerUsers.findFirst({
      where: eq(schema.customerUsers.id, ctx.session.user.id),
      columns: { id: true, name: true, phoneNumber: true, email: true },
    });
  }),

  updateUserProfile: protectedProcedure
    .input(userProfileFormSchema)
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db
          .update(schema.customerUsers)
          .set({
            name: input.name,
            phoneNumber: input.phoneNumber,
          })
          .where(eq(schema.customerUsers.id, ctx.session.user.id))
          .returning({
            id: schema.customerUsers.id,
            name: schema.customerUsers.name,
            phoneNumber: schema.customerUsers.phoneNumber,
            email: schema.customerUsers.email,
          })
      )[0];
    }),
};
