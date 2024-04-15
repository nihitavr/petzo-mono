import { FaStar } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";

import type { Center } from "@petzo/db";
import { cn } from "@petzo/ui/lib/utils";

import { getGoogleLocationLink } from "~/lib/utils";
import { getServicesProvidedByCenter } from "~/lib/utils/center.utils";
import CenterDescriptionAndButtons from "../../../../[city]/centers/_components/center-description-and-buttons";

export const CenterInfo = ({
  center,
  className,
}: {
  center: Center;
  className?: string;
}) => {
  const serviceTypesProvided = getServicesProvidedByCenter(center);

  return (
    <div className={cn("flex flex-col gap-2 overflow-y-auto pt-0", className)}>
      {/* Center name */}
      <h1 className="line-clamp-2 text-lg font-semibold md:text-xl">
        {center?.name}
      </h1>

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

      {/* Services Provided */}
      <span className="line-clamp-1 break-all text-sm font-semibold capitalize text-primary md:text-base">
        {serviceTypesProvided.join(", ")}
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
