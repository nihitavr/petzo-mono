import type {
  GeocodingFeatureContextComponent,
  GeocodingResponse,
} from "@mapbox/search-js-core";
import { GeocodingCore } from "@mapbox/search-js-core";

import type { Session } from "@petzo/auth-customer-app";
import type { db } from "@petzo/db";
import { schema } from "@petzo/db";
import { stringUtils } from "@petzo/utils";
import { mapValidator } from "@petzo/validators";

import { publicCachedProcedure } from "../trpc";

interface CTX {
  session: Session | null;
  db: typeof db;
}

type MapboxContext = GeocodingFeatureContextComponent & {
  alpha2Code?: string;
  publicId?: string;
  externalId: string;
};

const geocode = new GeocodingCore({
  accessToken: process.env.MAPBOX_ACCESS_TOKEN!,
});

export const mapRouter = {
  reverseGeocode: publicCachedProcedure
    .input(mapValidator.Geocode)
    .mutation(async ({ ctx, input }) => {
      const geoCodingResponse = await geocode.reverse({
        lat: input.latitude,
        lng: input.longitude,
      });

      const area = mapRouterUtils.getMapboxArea(geoCodingResponse);
      const city = mapRouterUtils.getMapboxCity(geoCodingResponse);
      const state = mapRouterUtils.getMapboxState(geoCodingResponse);
      const pincode = mapRouterUtils.getMapboxPincode(geoCodingResponse);

      if (!area || !city || !state || !pincode)
        throw new Error("Invalid geocoding response");

      const stateData = await mapRouterUtils.upsertState(ctx, state);
      if (!stateData) throw new Error("Invalid state data");

      const cityData = await mapRouterUtils.upsertCity(ctx, city, stateData.id);
      if (!cityData) throw new Error("Invalid city data");

      const areaData = await mapRouterUtils.upsertArea(ctx, area, cityData?.id);
      if (!areaData) throw new Error("Invalid area data");

      const line1String = mapRouterUtils.getMapboxLine1(geoCodingResponse);

      let placeFormatted = line1String ? `${line1String}, ` : "";
      placeFormatted += `${area?.name}, ${city?.name}, ${state?.name} ${pincode.name}`;

      return {
        placeFormatted,
        context: {
          line1: line1String!,
          area: areaData,
          city: cityData,
          state: stateData,
          pincode: pincode,
        },
      };
    }),
};

export const mapRouterUtils = {
  async upsertState(ctx: CTX, state: MapboxContext) {
    return (
      await ctx.db
        .insert(schema.states)
        .values({
          name: state.name,
          externalId: state.externalId,
          alpha2Code: state.alpha2Code!,
        })
        .onConflictDoUpdate({
          target: schema.states.alpha2Code,
          set: {
            externalId: state.externalId,
          },
        })
        .returning()
    )?.[0];
  },

  async upsertCity(ctx: CTX, city: MapboxContext, stateId: number) {
    return (
      await ctx.db
        .insert(schema.cities)
        .values({
          publicId: city.publicId,
          name: city.name,
          externalId: city.externalId,
          stateId: stateId,
        })
        .onConflictDoUpdate({
          target: schema.cities.publicId,
          set: {
            externalId: city.externalId,
          },
        })
        .returning()
    )?.[0];
  },

  async upsertArea(ctx: CTX, area: MapboxContext, cityId: number) {
    return (
      await ctx.db
        .insert(schema.areas)
        .values({
          publicId: area.publicId!,
          name: area.name,
          externalId: area.externalId,
          cityId: cityId,
        })
        .onConflictDoUpdate({
          target: schema.areas.publicId,
          set: {
            externalId: area.externalId,
          },
        })
        .returning()
    )?.[0];
  },

  getMapboxLine1(geocodingResponse: GeocodingResponse): string | undefined {
    const area = mapRouterUtils.getMapboxArea(geocodingResponse);
    const line1 =
      geocodingResponse.features[0]?.properties.context.neighborhood;

    return !line1 || line1.name == area.name ? "" : line1.name;
  },

  getMapboxArea(geocodingResponse: GeocodingResponse): MapboxContext {
    const area =
      geocodingResponse.features[0]?.properties.context.locality ??
      geocodingResponse.features[0]?.properties.context.neighborhood;

    const city = mapRouterUtils.getMapboxCity(geocodingResponse);

    if (!area || !city) throw new Error("Invalid area or city data");

    return {
      ...area,
      externalId: `mb_${area?.mapbox_id}`,
      publicId: stringUtils.generatePublicIdByName(
        `${area?.name} ${city?.name}`,
      ),
    };
  },

  getMapboxCity(geocodingResponse: GeocodingResponse): MapboxContext {
    const city = geocodingResponse.features[0]?.properties.context.place;
    const state = mapRouterUtils.getMapboxState(geocodingResponse);

    if (!city || !state) throw new Error("Invalid city or state data");

    return {
      ...city,
      externalId: `mb_${city?.mapbox_id}`,
      publicId: stringUtils.generatePublicIdByName(`${city?.name}`),
    };
  },

  getMapboxState(geocodingResponse: GeocodingResponse): MapboxContext {
    const state = geocodingResponse.features[0]?.properties.context
      .region as GeocodingFeatureContextComponent & {
      region_code_full: string;
    };

    if (!state) throw new Error("Invalid state data");

    return {
      ...state,
      externalId: `mb_${state?.mapbox_id}`,
      alpha2Code: state?.region_code_full,
    };
  },

  getMapboxPincode(geocodingResponse: GeocodingResponse) {
    return geocodingResponse.features[0]?.properties.context.postcode;
  },
};
