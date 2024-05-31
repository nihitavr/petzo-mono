import { z } from "zod";

import { and, asc, eq, schema } from "@petzo/db";
import { customerAddressValidator } from "@petzo/validators";

import { protectedProcedure } from "../trpc";

export const customerAddressRouter = {
  deleteAddress: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(schema.customerAddresses)
        .where(
          and(
            eq(schema.customerAddresses.id, input.id),
            eq(schema.customerAddresses.customerUserId, ctx.session.user.id),
          ),
        );
    }),

  upsertAddress: protectedProcedure
    .input(customerAddressValidator.CustomerAddressForm)
    .mutation(({ ctx, input }) => {
      if (input.id) {
        return ctx.db
          .update(schema.customerAddresses)
          .set({
            customerUserId: ctx.session.user.id,
            ...input,
          })
          .where(eq(schema.customerAddresses.id, input.id))
          .returning();
      } else {
        return ctx.db
          .insert(schema.customerAddresses)
          .values({
            customerUserId: ctx.session.user.id,
            ...input,
          })
          .returning();
      }
    }),

  getAddresses: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.customerAddresses.findMany({
      where: eq(schema.customerAddresses.customerUserId, ctx.session.user.id),
      orderBy: [asc(schema.customerAddresses.name)],
      with: {
        city: true,
        area: true,
        state: true,
      },
    });
  }),

  getAddress: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.customerAddresses.findFirst({
        where: and(
          eq(schema.customerAddresses.customerUserId, ctx.session.user.id),
          eq(schema.customerAddresses.id, input.id),
        ),
        orderBy: [asc(schema.customerAddresses.name)],
        with: {
          city: true,
          area: true,
          state: true,
        },
      });
    }),
};
