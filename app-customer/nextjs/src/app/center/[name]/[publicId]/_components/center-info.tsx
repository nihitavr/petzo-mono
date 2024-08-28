import { getFormattedAddresses } from "node_modules/@petzo/utils/src/addresses.utils";
import { GrLocation } from "react-icons/gr";

import type { Center } from "@petzo/db";
import { cn } from "@petzo/ui/lib/utils";
import { centerUtils, getGoogleLocationLink } from "@petzo/utils";

import Features from "~/app/_components/center-features";
import CenterDescriptionAndButtons from "./center-description-and-buttons";
import CenterInfoShareButton from "./center-info-share-button";
import Rating from "./rating-display";

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
        <CenterInfoShareButton center={center} />
      </div>

      {/* Rating and Reviews */}
      {(!!center.averageRating || !!center.googleRating) && (
        <a href="#reviews">
          <Rating
            rating={center.averageRating}
            ratingCount={center.ratingCount}
            googleRating={center.googleRating}
            googleRatingCount={center.googleRatingCount}
          />
        </a>
      )}

      {/* Services Provided */}
      <span className="space-x-1 text-2sm md:text-sm">
        <span className="line-clamp-2 inline font-semibold capitalize text-primary md:text-sm">
          {centerUtils.getServiceTypeNamesStr(center.services)}
        </span>
      </span>

      <div className="font-medium">
        <Features features={center.features} />
      </div>

      {/* Address */}
      {centerUtils.hasAtCenterServices(center.services) && (
        <a
          href={getGoogleLocationLink(center.centerAddress?.geocode)}
          target="_blank"
          rel="noreferrer"
          className="flex items-start gap-1 hover:underline"
        >
          <GrLocation className="mt-0.5 !size-4 shrink-0" />
          <span className="line-clamp-2 text-2sm font-medium capitalize md:text-sm">
            {getFormattedAddresses(center?.centerAddress, ["line1", "area"])}
          </span>
        </a>
      )}

      {/* Center Description */}
      <CenterDescriptionAndButtons center={center} />
    </div>
  );
};
