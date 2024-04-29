"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import type { Point } from "@petzo/db";

import { LoadingCentersList } from "~/app/[city]/centers/loading";
import { api } from "~/trpc/react";
import HomePageCenterCard from "./homepage-center-card-";

const GEOLOCATION_TIMEOUT_IN_MS = 10000;
const GEOLOCATION_MAX_AGE_IN_MS = 600000;

export default function CentersNearYouSection({
  cityPublicId,
}: {
  cityPublicId?: string;
}) {
  const [geoCode, setGeoCode] = useState<Point>();
  const [isGeoCodeFetchError, setIsGeoCodeFetchError] =
    useState<boolean>(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoCode({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => setIsGeoCodeFetchError(true),
      {
        timeout: GEOLOCATION_TIMEOUT_IN_MS,
        maximumAge: GEOLOCATION_MAX_AGE_IN_MS,
      },
    );
  }, []);

  const {
    data: centers,
    isLoading,
    isPending,
  } = api.center.findByFilters.useQuery(
    { city: cityPublicId!, geoCode: geoCode },
    { enabled: (isGeoCodeFetchError || !!geoCode) && !!cityPublicId },
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-1">
          <Image
            src="/icons/pet-center-near-you-icon.svg"
            alt=""
            width={25}
            height={25}
          />
          <h1 className="flex-shrink-0 text-center text-2xl md:text-3xl">
            Pet centers near you
          </h1>
        </div>
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
                className="flex-shrink-0 basis-[95%] py-4 md:basis-[40%]"
                key={center.id}
              >
                <HomePageCenterCard center={center} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
