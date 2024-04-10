import { Suspense } from "react";

import { api } from "~/trpc/server";
import GlobalSearchInput from "../_components/global-search-input";
import { CenterFilters } from "./_components/center-filters";
import { CentersList } from "./_components/centers-list";
import { MobileCenterFilters } from "./_components/mobile-center-filters";
import { LoadingCentersList } from "./loading";

export default async function Centers({
  searchParams,
}: {
  searchParams: {
    city: string;
    serviceType: string;
    search: string;
    area: string;
    rating: string;
  };
}) {
  const { city, serviceType, search, area, rating } = searchParams;

  const centersPromise = api.center.findByFilters({
    city,
    serviceType,
    search,
    area,
    rating: +rating || 0,
  });

  const areasFromDb = await api.city.getCityAreas({ city });

  const serviceTypeQueryParamList = serviceType ? serviceType.split(",") : [];
  const areaQueryParamList = area ? area.split(",") : [];

  const filtersObj = {
    filters: [
      {
        publicId: "serviceType",
        label: "Service Type",
        items: [
          {
            publicId: "veterinary",
            label: "Veterinary",
            selected: serviceTypeQueryParamList.includes("veterinary"),
          },
          {
            publicId: "grooming",
            label: "Grooming",
            selected: serviceTypeQueryParamList.includes("grooming"),
          },
          {
            publicId: "boarding",
            label: "Boarding",
            selected: serviceTypeQueryParamList.includes("boarding"),
          },
        ],
      },
      {
        publicId: "rating",
        label: "Rating",
        items: [
          {
            publicId: "4",
            label: ">= 4",
            selected: rating === "4",
          },
        ],
      },
      {
        publicId: "area",
        label: "Area",
        items: areasFromDb.map((area) => ({
          publicId: area.publicId,
          label: area.name,
          selected: areaQueryParamList.includes(area.publicId),
        })),
      },
    ],
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="mt-3 flex items-end justify-between md:mt-4">
        <GlobalSearchInput />
        <div className="hidden h-min rounded-full border px-3 py-1 text-sm md:inline">
          Sort (Top Rated)
        </div>
      </div>

      <div className="flex gap-2 md:hidden">
        {/* <div className="h-min rounded-full border px-3 py-1">Filter By</div> */}
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
            <CentersList centersPromise={centersPromise} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
