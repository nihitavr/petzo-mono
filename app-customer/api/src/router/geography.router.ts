import type { Session } from "@petzo/auth-customer-app";
import type { db } from "@petzo/db";
import { eq, inArray, schema } from "@petzo/db";
import { geographyValidator } from "@petzo/validators";

import { publicCachedProcedure } from "../trpc";

interface CTX {
  session: Session | null;
  db: typeof db;
}

export const geographyRouter = {
  getAreasByCity: publicCachedProcedure
    .meta({
      cacheTTLInSeconds: 3000,
    })
    .input(geographyValidator.GetAreasByCity)
    .query(({ ctx, input }) => {
      const city = ctx.db
        .select({ id: schema.cities.id })
        .from(schema.cities)
        .where(eq(schema.cities.publicId, input.city))
        .as("city");

      return ctx.db
        .select({ publicId: schema.areas.publicId, name: schema.areas.name })
        .from(schema.areas)
        .innerJoin(city, eq(schema.areas.cityId, city.id))
        .where(eq(schema.areas.isParent, true));
    }),

  getActiveCities: publicCachedProcedure
    .meta({
      cacheTTLInSeconds: 36000,
    })
    .query(async ({ ctx }) => {
      return await ctx.db.query.cities.findMany({
        where: eq(schema.cities.isActive, true),
      });
    }),
};

export const geographyRouterUtils = {
  getAreaIdsByPublicIds: async (ctx: CTX, publicIds: string[] | undefined) => {
    if (!publicIds) return undefined;

    return (
      await ctx.db
        .select({ id: schema.areas.id })
        .from(schema.areas)
        .where(inArray(schema.areas.publicId, publicIds))
    ).map((area) => area.id);
  },
};
