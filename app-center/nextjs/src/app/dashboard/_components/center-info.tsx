import { GrLocation } from "react-icons/gr";

import type { Center } from "@petzo/db";
import { cn } from "@petzo/ui/lib/utils";
import { getGoogleLocationLink } from "@petzo/utils";

import { getServicesNamesStr } from "~/lib/utils/center.utils";

export const CenterInfo = ({
  center,
  className,
}: {
  center: Center;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col gap-1 overflow-y-auto pt-0", className)}>
      {/* Center name */}
      <div className="flex items-start justify-between">
        <h1 className="line-clamp-2 text-base font-semibold md:text-lg">
          {center?.name}
        </h1>
      </div>

      {/* Rating and Reviews */}
      {!!center.averageRating && (
        <a href="#reviews">
          <Rating rating={center.averageRating} />
        </a>
      )}

      {/* Services Provided */}
      <span className="space-x-1 text-2sm md:text-sm">
        <span className="font-medium text-foreground/80">Services:</span>
        <span className="line-clamp-2 inline font-semibold capitalize text-primary md:text-sm">
          {getServicesNamesStr(center)}
        </span>
      </span>

      {/* Address */}
      <a
        href={getGoogleLocationLink(center.centerAddress?.geocode)}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 hover:underline"
      >
        <GrLocation className="!h-4 !w-4" />
        <span className="line-clamp-2 text-2sm font-medium capitalize md:text-sm">
          {center.centerAddress?.line1}, {center.centerAddress?.area?.name}
        </span>
      </a>

      {/* Center Description */}
      <CenterDescriptionAndButtons center={center} />
    </div>
  );
};
