"use client";

import { use, useEffect, useRef, useState } from "react";

import type { Center } from "@petzo/db";
import { useInView } from "@petzo/ui/components/in-view";

import { CENTERS_LIST_PAGE_LIMIT } from "~/lib/constants";
import { api } from "~/trpc/react";
import { LoadingCentersList } from "../loading";
import CenterCard from "./center-card";
import NoCentersFound from "./no-centers.found";

export const CenterFilterList = ({
  initialCentersPromise: centersPromise,
  filterParams: filterParams,
}: {
  initialCentersPromise: Promise<Center[]>;
  filterParams: {
    city: string;
    serviceType: string;
    search: string;
    area: string;
    ratingGte: string;
  };
}) => {
  const { city, serviceType, search, area, ratingGte } = filterParams;

  const initialCenters = use(centersPromise);

  const [pageNumber, setPageNumber] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [centers, setCenters] = useState<Center[]>(initialCenters);

  const loadingRef = useRef<HTMLDivElement>(null);
  const visible = useInView(loadingRef, {
    margin: "200px",
  });

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
      ratingGte: +ratingGte || 0,
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
    if (
      pageNumber > 0 &&
      newCenters &&
      newCenters.length < CENTERS_LIST_PAGE_LIMIT
    ) {
      setIsLastPage(true);
    }
  }, [isLoading, pageNumber]);

  // When the loadingRef is visible, increment the page number to fetch the next page.
  useEffect(() => {
    if (visible) {
      setPageNumber((pageNumber) => pageNumber + 1);
    }
  }, [visible]);

  if (initialCenters.length === 0) return <NoCentersFound />;

  return (
    <div className="flex w-full flex-col gap-4">
      {centers.length > 0 &&
        centers.map((center) => {
          return <CenterCard key={`center-${center.id}`} center={center} />;
        })}

      {!isLastPage && <LoadingCentersList ref={loadingRef} noOfItems={2} />}
    </div>
  );
};
