"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignals } from "@preact/signals-react/runtime";

import {
  GEOLOCATION_MAX_AGE_IN_MS,
  GEOLOCATION_TIMEOUT_IN_MS,
} from "@petzo/constants";
import Loader from "@petzo/ui/components/loader";
import { toast } from "@petzo/ui/components/toast";
import { cn } from "@petzo/ui/lib/utils";

import { filtersStore } from "~/lib/storage/global-storage";

export default function NearbySort() {
  useSignals();

  const router = useRouter();
  const searchParams = useSearchParams();
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const hasNearByFilter = useMemo(
    () => searchParams.has("latitude") && searchParams.has("longitude"),
    [searchParams],
  );

  const onClick = () => {
    let filterUrl = `/${filtersStore.city.value}/centers`;

    if (!hasNearByFilter) {
      if (!navigator.geolocation) {
        toast.error(
          "Failed to get your location. Please give permission to access your location.",
        );
        return;
      }
      setFetchingLocation(true);

      const urlQueryParams = new URLSearchParams(searchParams);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          urlQueryParams.set("latitude", `${position.coords.latitude}`);
          urlQueryParams.set("longitude", `${position.coords.longitude}`);

          const urlQueryParamsStr = urlQueryParams.toString();
          if (urlQueryParamsStr) filterUrl += `?${urlQueryParamsStr}`;

          setFetchingLocation(false);
          router.push(filterUrl);
        },
        () => {
          setFetchingLocation(false);
          toast.error(
            "Failed to get your location. Please give permission to access your location.",
          );
        },
        {
          timeout: GEOLOCATION_TIMEOUT_IN_MS,
          maximumAge: GEOLOCATION_MAX_AGE_IN_MS,
        },
      );
    } else {
      console.log("removing nearby filter");

      const urlQueryParams = new URLSearchParams(searchParams);
      urlQueryParams.delete("latitude");
      urlQueryParams.delete("longitude");

      const urlQueryParamsStr = urlQueryParams.toString();
      if (urlQueryParamsStr) filterUrl += `?${urlQueryParamsStr}`;
      console.log("filterUrl", filterUrl);

      router.push(filterUrl);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={fetchingLocation}
      className={cn(
        "flex h-min items-center gap-1 rounded-full border px-3 py-1 text-sm",
        hasNearByFilter ? "border-primary bg-primary/10" : "",
        fetchingLocation ? "cursor-not-allowed opacity-70" : "cursor-pointer",
      )}
    >
      <span>Near By</span>
      {fetchingLocation && (
        <Loader
          className="h-3 w-3 border-2 border-t-gray-400"
          show={fetchingLocation}
        />
      )}
      {hasNearByFilter && (
        <span className="font-semibold hover:scale-110">X</span>
      )}
    </button>
  );
}
