"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";

import type { Center, Service } from "@petzo/db";

import { CENTERS_LIST_PAGE_LIMIT, COLOR_MAP } from "~/lib/constants";
import { useOnScreen } from "~/lib/hooks/screen.hooks";
import { getCenterRelativeUrl } from "~/lib/utils/center.utils";
import { api } from "~/trpc/react";
import { LoadingCentersList } from "../loading";

export const CentersList = ({
  initialCentersPromise: centersPromise,
  searchParams,
}: {
  initialCentersPromise: Promise<Center[]>;
  searchParams: {
    city: string;
    serviceType: string;
    search: string;
    area: string;
    rating: string;
  };
}) => {
  const initialCenters = use(centersPromise);

  const [pageNumber, setPageNumber] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  const [loadingRef, visible] = useOnScreen({
    threshold: 0,
    rootMargin: "300px",
  });

  const [centers, setCenters] = useState<Center[]>(initialCenters);

  const { city, serviceType, search, area, rating } = searchParams;

  const {
    data: newCenters,
    isLoading,
    isRefetching,
  } = api.center.findByFilters.useQuery(
    {
      city,
      serviceType,
      search,
      area,
      rating: +rating || 0,
      pagination: {
        page: pageNumber,
        limit: CENTERS_LIST_PAGE_LIMIT,
      },
    },
    { enabled: pageNumber > 0 },
  );

  useEffect(() => {
    // If the page number is greater than 0 and the centers are not loading or refetching,
    // append the new centers to the existing centers.
    if (pageNumber > 0 && !isLoading && !isRefetching) {
      setCenters([...centers, ...newCenters!]);
    }

    // If the number of centers fetched is less than the limit, it means it's the last page.
    if (newCenters && newCenters.length < CENTERS_LIST_PAGE_LIMIT) {
      setIsLastPage(true);
    }
  }, [isLoading]);

  // When the loadingRef is visible, increment the page number to fetch the next page.
  useEffect(() => {
    if (visible) {
      setPageNumber((pageNumber) => pageNumber + 1);
    }
  }, [visible]);

  const getLowertCostService = (center: Center) => {
    return center.services.reduce((acc, service) => {
      if (service.price < acc?.price) {
        return service;
      }
      return acc;
    }, center.services[0]!);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {centers.length > 0 &&
        centers.map((center) => {
          return (
            <CenterCard
              key={`center-${center.id}`}
              center={center}
              getLowertCostService={getLowertCostService}
            />
          );
        })}

      {!isLastPage && <LoadingCentersList ref={loadingRef} noOfItems={2} />}
    </div>
  );
};

const CenterCard = ({
  center,
  getLowertCostService,
}: {
  center: Center;
  getLowertCostService: (center: Center) => Service;
}) => {
  const thumbnail = center.images?.[0].url;
  const lowestPriceService = getLowertCostService(center);
  const serviceTypesProvided: string[] = [];

  center.services.forEach((service: Service) => {
    if (!serviceTypesProvided.includes(service.serviceType)) {
      serviceTypesProvided.push(service.serviceType);
    }
  });

  return (
    <div className="flex flex-row rounded-lg md:border md:shadow-sm">
      <div className="flex h-44 w-full gap-2 md:h-60">
        {/* Center Image */}
        <Link
          href={getCenterRelativeUrl(center)}
          className="relative h-full w-2/5 cursor-pointer overflow-hidden rounded-lg"
        >
          {thumbnail ? (
            <Image src={thumbnail} alt="" fill style={{ objectFit: "cover" }} />
          ) : (
            <div
              className={`flex size-full items-center justify-center rounded-lg text-center ${COLOR_MAP[center.name[0]!.toLowerCase()]?.bgColor} bg-opacity-75`}
            >
              <div
                className={`text-7xl ${COLOR_MAP[center.name[0]!.toLowerCase()]?.textColor}`}
              >
                {center.name[0]}
              </div>
            </div>
          )}
        </Link>

        {/* Center Details */}
        <div className="flex w-3/5 flex-col gap-1 px-1 md:gap-1.5 md:p-2.5">
          {/* Center Name */}
          <Link
            href={getCenterRelativeUrl(center)}
            className="line-clamp-2 cursor-pointer text-base font-semibold hover:underline md:text-xl"
          >
            {center.name}
          </Link>

          {/* Rating and Reviews */}
          <div className="md:text-md flex items-center gap-2 text-sm text-foreground/80">
            <div className="flex items-center gap-1">
              <span className="">{center.averageRating}</span>
              <FaStar className="h-3.5 w-3.5 text-yellow-600" />
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-foreground/80"></div>
            <div className="flex cursor-pointer items-center gap-1 hover:underline">
              <span>{center.reviewCount} reviews</span>
            </div>
          </div>

          {/* Area */}
          <div className="flex items-center gap-1">
            <GrLocation />
            <span className="line-clamp-1 text-sm font-medium capitalize md:text-base">
              {center.centerAddress.area.name}
            </span>
          </div>

          {/* Services Provided */}
          <span className="md:text-md line-clamp-1 break-all text-xs font-semibold capitalize text-primary">
            {serviceTypesProvided.join(", ")}
          </span>

          {/* Lowest Service Price */}
          <div className="mt-auto flex justify-between rounded-r-full bg-gradient-to-r from-background to-primary/40 px-2 py-1">
            <div className="flex flex-col ">
              <span className="text-xs capitalize text-foreground/80 md:text-sm">
                {lowestPriceService.serviceType}
              </span>
              <span>Starting at </span>
            </div>
            <div className="text-md flex items-center justify-between md:text-lg">
              <span className="text-lg font-semibold md:text-xl">
                &#8377; {lowestPriceService.price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
