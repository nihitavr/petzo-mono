import { Suspense } from "react";

import {
  CENTERS_LIST_PAGE_LIMIT,
  DEFAULT_CENTER_FILTERS,
} from "~/lib/constants";
import { api } from "~/trpc/server";
import { RecordEvent } from "~/web-analytics/react";
import { CenterFilterList } from "./_components/center-filter-list";
import { CenterFilters } from "./_components/center-filters";
import { MobileCenterFilters } from "./_components/mobile-center-filters";
import { LoadingCentersList } from "./loading";

export default async function Centers({
  searchParams,
  params,
}: {
  params: {
    city: string;
  };
  searchParams: {
    serviceType: string;
    search: string;
    area: string;
    ratingGte: string;
    latitude: string;
    longitude: string;
  };
}) {
  const {
    serviceType,
    search,
    area,
    ratingGte: ratingGte,
    latitude,
    longitude,
  } = searchParams;
  const { city } = params;

  const centersPromise = api.center.findByFilters({
    city,
    serviceType,
    search,
    area,
    geoCode:
      latitude && longitude
        ? { latitude: +latitude, longitude: +longitude }
        : undefined,
    ratingGte: +ratingGte || 0,
    pagination: {
      page: 0,
      limit: CENTERS_LIST_PAGE_LIMIT,
    },
  });

  const areaData = await api.geography.getAreasByCity({ city });

  const filtersObj = {
    filters: await getCenterFilters(
      {
        serviceType,
        area,
        ratingGte,
        nearby: latitude && longitude ? true : false,
      },
      { area: areaData },
    ),
  };

  return (
    <>
      <RecordEvent
        name="screenview_city_explore_centers_page"
        data={{ city }}
      />
      <div className="container-2">
        <div className="hidden items-end justify-between md:flex">
          {/* <div className="ml-auto h-min rounded-full border px-3 py-1 text-sm">
            Sort (Top Rated)
          </div> */}
        </div>

        <div className="flex gap-2 md:hidden">
          <MobileCenterFilters filters={filtersObj} />
          {/* <div className="h-min rounded-full border px-3 py-1 text-sm">
            Sort (Top Rated)
          </div> */}
        </div>

        <div className="grid grid-cols-12 gap-3">
          {/* Filters */}
          <div className="hidden h-min md:col-span-3 md:inline ">
            <CenterFilters className="rounded-lg border" filters={filtersObj} />
          </div>

          {/* Centers List */}
          <div className="col-span-12 md:col-span-9 ">
            <Suspense
              key={JSON.stringify(searchParams)}
              fallback={<LoadingCentersList />}
            >
              <CenterFilterList
                filterParams={{ ...searchParams, city }}
                initialCentersPromise={centersPromise}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}

async function getCenterFilters(
  {
    serviceType,
    area,
    ratingGte,
    nearby,
  }: {
    serviceType: string;
    area: string;
    ratingGte: string;
    nearby: boolean;
  },
  data: Record<
    string,
    {
      publicId: string;
      name: string;
    }[]
  > = {},
) {
  const serviceTypeQueryParamList = serviceType ? serviceType.split(",") : [];
  const areaQueryParamList = area ? area.split(",") : [];
  const ratingGteQueryParam = ratingGte;

  const filters = structuredClone(DEFAULT_CENTER_FILTERS);

  filters.map((filter) => {
    switch (filter.publicId) {
      case "distance":
        filter.items.map((item) => {
          item.selected = nearby ? item.publicId === "nearby" : false;
        });
        break;
      case "serviceType":
        filter.items.map((item) => {
          item.selected = serviceTypeQueryParamList.includes(item.publicId);
        });
        break;
      case "ratingGte":
        filter.items.map((item) => {
          item.selected = ratingGteQueryParam === item.publicId;
        });
        break;
      case "area":
        filter.items =
          data.area?.map((area) => ({
            publicId: area.publicId,
            label: area.name,
            selected: areaQueryParamList.includes(area.publicId),
          })) ?? [];
        break;
    }
  });

  return filters;
}
