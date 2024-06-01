import { GrLocation } from "react-icons/gr";

import type { Center } from "@petzo/db";
import { cn } from "@petzo/ui/lib/utils";
import { getGoogleLocationLink } from "@petzo/utils";

import { getServicesNamesStr } from "~/lib/utils/center.utils";
import CenterDescriptionAndButtons from "./center-description-and-buttons";
import Rating from "./rating-display";

export const CenterInfo = ({
  center,
  className,
}: {
  center: Center;
  className?: string;
}) => {
  return (
    <div
      className={cn("flex flex-col gap-1.5 overflow-y-auto pt-0", className)}
    >
      {/* Center name */}
      <h1 className="line-clamp-2 text-base font-semibold md:text-lg">
        {center?.name}
      </h1>

      {/* Rating and Reviews */}
      <div className="md:text-md flex items-center gap-2 text-sm text-foreground/80">
        <div className="flex items-center gap-1">
          <a href="#reviews">
            <Rating rating={center.averageRating} />
          </a>
          <span className="line-clamp-1 text-xs font-semibold">
            (Google Rating)
          </span>
        </div>
      </div>

      {/* Services Provided */}
      <span className="space-x-1 text-sm md:text-base">
        <span className="font-medium text-foreground/80">Services:</span>
        <span className="line-clamp-2 inline text-sm font-semibold capitalize text-primary md:text-base">
          {getServicesNamesStr(center)}
        </span>
      </span>

      {/* address */}

      <a
        href={getGoogleLocationLink(center.centerAddress.geocode)}
        target="_blank"
        rel="noreferrer"
        className="flex items-start gap-1 hover:underline"
      >
        <GrLocation className="size-5" />
        <span className="line-clamp-2 text-sm font-medium capitalize md:text-base">
          {center.centerAddress.line1}, {center.centerAddress.area.name}
        </span>
      </a>

      {/* Center Description */}
      <CenterDescriptionAndButtons center={center} />
    </div>
  );
};
