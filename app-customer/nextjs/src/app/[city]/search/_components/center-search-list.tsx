"use client";

import Image from "next/image";
import Link from "next/link";
import { useSignals } from "@preact/signals-react/runtime";
import { GrLocation } from "react-icons/gr";

import { centerUtils } from "@petzo/utils";

import Features from "~/app/_components/center-features";
import DogGroomingAnimation from "~/app/_components/dog-grooming-animation";
import { MIN_SEARCH_TEXT_LENGTH } from "~/app/_components/global-search-input";
import Rating from "~/app/center/[name]/[publicId]/_components/rating-display";
import { filtersStore } from "~/lib/storage/global-storage";
import { api } from "~/trpc/react";
import { CenterSearchListLoading } from "./center-search-list-loading";

export default function CenterSearchList() {
  useSignals();

  const { data: centers, isLoading } = api.center.findByFilters.useQuery(
    {
      city: filtersStore.city.value,
      search: filtersStore.search.value,
    },
    {
      enabled:
        !!filtersStore.search.value &&
        filtersStore.search.value.length >= MIN_SEARCH_TEXT_LENGTH,
    },
  );

  return (
    <div className="mx-auto mt-0 flex w-full flex-col gap-3 md:w-2/3 xl:w-1/2">
      <h3 className="text-center text-lg">
        {`${!isLoading && !centers?.length && !!filtersStore.search.value ? "No centers found in" : "Search centers in"} `}
        <span className="font-semibold capitalize text-primary">
          {filtersStore.city.value}
        </span>

        {!isLoading && !centers?.length && !filtersStore.search.value && (
          <DogGroomingAnimation withPlaceholder={true} />
        )}
      </h3>

      {isLoading ? (
        <CenterSearchListLoading />
      ) : (
        <div className="flex flex-col gap-3 overflow-auto">
          {!!filtersStore.city.value &&
            centers?.map((center) => {
              const thumbnail = center?.images?.[0]?.url;
              const serviceNames = centerUtils.getServiceTypeNamesStr(
                center.services,
              );

              return (
                <Link
                  href={centerUtils.getCenterUrl(center)}
                  key={center.publicId}
                  className="grid grid-cols-6 gap-2 rounded-lg bg-muted hover:bg-muted/80"
                >
                  <div className="relative col-span-2 min-h-28 w-full md:min-h-32">
                    {thumbnail ? (
                      <Image
                        fill
                        src={thumbnail}
                        alt=""
                        className="aspect-square rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center rounded-lg bg-primary/60 text-center">
                        <div className="text-5xl">{center.name[0]}</div>
                      </div>
                    )}
                  </div>
                  <div className="col-span-4 flex flex-col items-start space-y-1 py-0.5">
                    <h3 className="text-sm font-semibold md:text-base">
                      {center.name}
                    </h3>
                    {(!!center.averageRating || !!center.googleRating) && (
                      <div className="-translate-x-[5%] -translate-y-[5%] scale-90">
                        <Rating
                          rating={center.averageRating}
                          ratingCount={center.ratingCount}
                          googleRating={center.googleRating}
                          googleRatingCount={center.googleRatingCount}
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <GrLocation />
                      <span className="line-clamp-1 text-xs font-medium capitalize md:text-sm">
                        {center.centerAddress?.area?.name}
                      </span>
                    </div>
                    {/* Services Provided */}
                    <span className="line-clamp-1 break-all text-xs font-semibold capitalize text-primary md:text-sm">
                      {serviceNames}
                    </span>
                    <Features features={center.features} />
                  </div>
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
}
