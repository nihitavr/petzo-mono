import { GetCityAreasSchema } from "@petzo/validators";

import { publicProcedure } from "../trpc";

export const cityRouter = {
  getCityAreas: publicProcedure.input(GetCityAreasSchema).query(() => {
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

  getAll: publicProcedure.query(() => {
    return [
      { id: 1, name: "Bengaluru", publicId: "bengaluru" },
      { id: 2, name: "Mumbai", publicId: "mumbai" },
    ];
  }),
};
