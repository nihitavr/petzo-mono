import { Suspense } from "react";

import { CENTERS_LIST_PAGE_LIMIT } from "~/lib/constants";
import { getCenterFilters } from "~/lib/utils/center.utils";
import { api } from "~/trpc/server";
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
  };
}) {
  const { serviceType, search, area, ratingGte: ratingGte } = searchParams;
  const { city } = params;

  const centersPromise = api.center.findByFilters({
    city,
    serviceType,
    search,
    area,
    ratingGte: +ratingGte || 0,
    pagination: {
      page: 0,
      limit: CENTERS_LIST_PAGE_LIMIT,
    },
  });

  const areaFromDb = await api.city.getCityAreas({ city });

  const filtersObj = {
    filters: await getCenterFilters(
      {
        serviceType,
        area,
        ratingGte,
      },
      { area: areaFromDb },
    ),
  };

  return (
    <div className="container-2">
      <div className="hidden items-end justify-between md:flex">
        <div className="ml-auto h-min rounded-full border px-3 py-1 text-sm">
          Sort (Top Rated)
        </div>
      </div>

      <div className="flex gap-2 md:hidden">
        <MobileCenterFilters filters={filtersObj} />
        <div className="h-min rounded-full border px-3 py-1 text-sm">
          Sort (Top Rated)
        </div>
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
  );
}
