"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { LoadingCentersList } from "~/app/[city]/centers/loading";
import { api } from "~/trpc/react";
import HomePageCenterCard from "./homepage-center-card-";

export default function BestCentersInCity({
  cityPublicId,
  cityName,
}: {
  cityPublicId?: string;
  cityName: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "home_grooming",
  ]);

  const {
    data: centers,
    isLoading,
    isPending,
  } = api.center.findByFilters.useQuery(
    {
      city: cityPublicId!,
      ratingGte: 4,
      serviceType: selectedServices.join(","),
    },
    { enabled: !!cityPublicId },
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-1">
          <Image
            src="/icons/top-rated-in-city-icon.svg"
            alt=""
            width={25}
            height={25}
          />
          <h1 className=" text-center text-2xl md:text-3xl">
            Top rated in {cityName}
          </h1>
        </div>

        {/* <ServiceFilter
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
        /> */}
        {/* <span className="text-center text-sm text-foreground/70 md:text-base">
          Explore list of veterinary, pet grooming, home pet grooming and pet
          boarding centers near you.
        </span> */}
      </div>
      {isPending || isLoading ? (
        <div className="no-scrollbar flex items-center gap-3 overflow-x-auto">
          <div className="flex-shrink-0 basis-[95%] py-2 md:basis-[40%]">
            <LoadingCentersList noOfItems={1} />
          </div>
          <div className="flex-shrink-0 basis-[95%] py-2 md:basis-[40%]">
            <LoadingCentersList noOfItems={1} />
          </div>
          <div className="flex-shrink-0 basis-[95%] py-2 md:basis-[40%]">
            <LoadingCentersList noOfItems={1} />
          </div>
        </div>
      ) : (
        <div className="w-full overflow-hidden">
          <div className="no-scrollbar flex w-full gap-2 overflow-x-auto md:gap-4">
            {centers?.map((center) => (
              <div
                className="flex-shrink-0 basis-[95%] py-3 md:basis-[40%]"
                key={center.id}
              >
                <HomePageCenterCard center={center} />
              </div>
            ))}
            <div className="flex items-center justify-center whitespace-nowrap py-4">
              <Link
                href={`/${cityPublicId}/centers?ratingGte=${4}&serviceType=${selectedServices.join(",")}`}
                className="flex h-full items-center justify-center rounded-xl border px-3 text-center text-sm font-semibold text-foreground/80 hover:bg-muted"
              >
                Explore {">"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
