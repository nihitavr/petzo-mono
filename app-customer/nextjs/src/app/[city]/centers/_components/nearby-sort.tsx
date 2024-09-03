"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignals } from "@preact/signals-react/runtime";

import Loader from "@petzo/ui/components/loader";
import { fetchLocation } from "@petzo/ui/components/location";
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

  const onClick = async () => {
    let filterUrl = `/${filtersStore.city.value}/centers`;

    if (!hasNearByFilter) {
      const urlQueryParams = new URLSearchParams(searchParams);
      setFetchingLocation(true);

      fetchLocation(
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
        },
      );
    } else {
      const urlQueryParams = new URLSearchParams(searchParams);
      urlQueryParams.delete("latitude");
      urlQueryParams.delete("longitude");

      const urlQueryParamsStr = urlQueryParams.toString();
      if (urlQueryParamsStr) filterUrl += `?${urlQueryParamsStr}`;

      router.push(filterUrl);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={fetchingLocation}
      className={cn(
        "flex h-min items-center gap-1 rounded-full border px-3 py-1 text-sm transition-all duration-200",
        hasNearByFilter || fetchingLocation
          ? "border-primary bg-primary/10"
          : "",
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
