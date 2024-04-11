"use client";

import Image from "next/image";
import { useSignals } from "@preact/signals-react/runtime";
import { FaStar } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";

import type { Service } from "@petzo/db";

import { MIN_SEARCH_TEXT_LENGTH } from "~/app/_components/global-search-input";
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
    <div className="mx-auto mt-3 flex w-full flex-col gap-3 md:w-2/3 xl:w-1/2">
      <h3 className="text-center text-lg">
        Search centers in{" "}
        <span className="font-semibold capitalize text-primary">
          {filtersStore.city.value}
        </span>
      </h3>

      {isLoading ? (
        <CenterSearchListLoading />
      ) : (
        <div className="flex flex-col gap-3 overflow-auto">
          {!!filtersStore.city.value &&
            centers?.map((center) => {
              const thumbnail = center.images?.[0].url;

              const serviceTypesProvided: string[] = [];

              center.services.forEach((service: Service) => {
                if (!serviceTypesProvided.includes(service.serviceType)) {
                  serviceTypesProvided.push(service.serviceType);
                }
              });

              return (
                <div key={center.publicId} className="flex gap-2">
                  <div className="relative size-28 md:size-32">
                    {thumbnail ? (
                      <Image
                        fill
                        style={{ objectFit: "cover" }}
                        src={thumbnail}
                        alt=""
                        className="aspect-square rounded-lg"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center rounded-lg bg-primary/60 text-center">
                        <div className="text-5xl">{center.name[0]}</div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold md:text-base">
                      {center.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-foreground/80 md:text-sm">
                      <div className="flex items-center gap-1">
                        <span className="">{center.averageRating}</span>
                        <FaStar className="size-3 text-yellow-600" />
                      </div>
                      <div className="h-1.5 w-1.5 rounded-full bg-foreground/80"></div>
                      <div className="flex cursor-pointer items-center gap-1 hover:underline">
                        <span>{center.averageRating} reviews</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <GrLocation />
                      <span className="line-clamp-1 text-xs font-medium capitalize md:text-sm">
                        {center.centerAddress.area.name}
                      </span>
                    </div>
                    {/* Services Provided */}
                    <span className="line-clamp-1 break-all text-xs font-semibold capitalize text-primary md:text-sm">
                      {serviceTypesProvided.join(", ")}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
