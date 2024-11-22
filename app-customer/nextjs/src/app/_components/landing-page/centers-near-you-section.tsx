"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DotLottiePlayer } from "@dotlottie/react-player";

import type { Point } from "@petzo/db";
import { fetchLocation } from "@petzo/ui/components/location";

import { LoadingCentersList } from "~/app/[city]/centers/loading";
import { api } from "~/trpc/react";
import CenterCardHorizontal from "../center-card-horizontal";

export default function CentersNearYouSection({
  cityPublicId,
}: {
  cityPublicId?: string;
}) {
  const [fetchingLocation, setFetchingLocation] = useState(true);

  const [geoCode, setGeoCode] = useState<Point>();
  const [isGeoCodeFetchError, setIsGeoCodeFetchError] =
    useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "home_grooming",
  ]);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    setFetchingLocation(true);

    fetchLocation(
      (position) => {
        setGeoCode({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setFetchingLocation(false);
      },
      () => {
        setFetchingLocation(false);
        setIsGeoCodeFetchError(true);
      },
    );
  }, []);

  const {
    data: centers,
    isLoading,
    isPending,
  } = api.center.findByFilters.useQuery(
    {
      city: cityPublicId!,
      geoCode: geoCode,
      serviceType: selectedServices.join(","),
    },
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
            Home groomers near you
            {/* Pet care near you */}
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
      {fetchingLocation ? (
        <div className="flex w-full flex-col items-center justify-center">
          <DotLottiePlayer
            className="size-36"
            src="/location-fetching-animation.lottie"
            loop={true}
            speed={1.5}
            autoplay={true}
          />
          <span className="-mt-4 text-sm font-semibold md:text-base">
            Fetching Location
          </span>
        </div>
      ) : isPending || isLoading ? (
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
                <CenterCardHorizontal center={center} />
              </div>
            ))}
            <div className="flex items-center justify-center whitespace-nowrap py-4">
              <Link
                href={`/${cityPublicId}/centers?serviceType=${selectedServices.join(",")}${geoCode ? "&latitude=" + geoCode.latitude + "&longitude=" + geoCode.longitude : ""}`}
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
