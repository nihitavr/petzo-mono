import { and, eq, schema } from "@petzo/db";
import { centerApp } from "@petzo/validators";

import { protectedCenterProcedure } from "../trpc";

export const centerAddressRouter = {
  upsertAddress: protectedCenterProcedure
    .input(centerApp.centerAddress.CenterAddressForm)
    .mutation(async ({ ctx, input }) => {
      if (input.id) {
        return (
          await ctx.db
            .update(schema.centerAddresses)
            .set({
              ...input,
            })
            .where(eq(schema.centerAddresses.id, input.id))
            .returning()
        )?.[0];
      } else {
        const address = (
          await ctx.db
            .insert(schema.centerAddresses)
            .values({
              ...input,
            })
            .returning()
        )?.[0];

        if (!address) {
          return null;
        }

        await ctx.db
          .update(schema.centers)
          .set({
            centerAddressId: address.id,
          })
          .where(eq(schema.centers.id, ctx.center.id));
      }
    }),

  getAddress: protectedCenterProcedure.query(({ ctx }) => {
    if (!ctx.center.centerAddressId) {
      return null;
    }

    return ctx.db.query.centerAddresses.findFirst({
      where: and(eq(schema.centerAddresses.id, ctx.center.centerAddressId)),
      with: {
        city: true,
        area: true,
        state: true,
      },
    });
  }),
};
