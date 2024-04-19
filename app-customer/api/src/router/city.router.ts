import { eq, schema } from "@petzo/db";
import { GetCityAreasSchema } from "@petzo/validators";

import { publicCachedProcedure } from "../trpc";

export const cityRouter = {
  getCityAreas: publicCachedProcedure
    .meta({
      cacheTTLInSeconds: 36000,
    })
    .input(GetCityAreasSchema)
    .query(() => {
      return [
        {
          publicId: "hsr-layout",
          name: "HSR Layout",
        },
        {
          publicId: "bommanahalli",
          name: "Bommanahalli",
        },
        {
          publicId: "koramangala",
          name: "Koramangala",
        },
      ];
    }),

  getAllActiveCities: publicCachedProcedure
    .meta({
      cacheTTLInSeconds: 36000,
    })
    .query(async ({ ctx }) => {
      return await ctx.db.query.cities.findMany({
        where: eq(schema.cities.isActive, true),
      });
    }),
};
