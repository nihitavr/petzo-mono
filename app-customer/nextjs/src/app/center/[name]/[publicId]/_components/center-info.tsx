import { getFormattedAddresses } from "node_modules/@petzo/utils/src/addresses.utils";
import { GrLocation } from "react-icons/gr";

import type { Center } from "@petzo/db";
import { cn } from "@petzo/ui/lib/utils";
import { centerUtils, getGoogleLocationLink } from "@petzo/utils";

import Features from "~/app/_components/center-features";
import CenterTimings from "~/app/_components/center-timings";
import CenterDescriptionAndButtons from "./center-description-and-buttons";
import CenterInfoShareButton from "./center-info-share-button";
import OnlineBookingAvailable from "./online-booking-available";
import PaymentTypesAvailable from "./payment-types-available";
import Rating from "./rating-display";

export const CenterInfo = ({
  center,
  className,
}: {
  center: Center;
  className?: string;
}) => {
  const isBookingEnabledForAnyService = center.services?.some(
    (service) => service.isBookingEnabled,
  );
  return (
    <div
      className={cn(
        "flex flex-col gap-1 overflow-y-auto pt-0 transition-all duration-300 md:gap-1.5",
        className,
      )}
    >
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

      {!!center.features?.length && (
        <div className="font-medium">
          <Features features={center.features} />
        </div>
      )}

      {/* Center Timings */}
      <CenterTimings center={center} />

      {isBookingEnabledForAnyService && (
        <div className="flex items-center gap-1">
          <OnlineBookingAvailable />
          <div className="size-1.5 rounded-full bg-foreground/80"></div>
          <PaymentTypesAvailable />
        </div>
      )}

      {/* Address */}
      {centerUtils.hasAtCenterServices(center.services) && (
        <a
          href={getGoogleLocationLink(center.centerAddress?.geocode)}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-1 py-0.5 hover:underline"
        >
          <GrLocation className="!size-5 shrink-0 text-foreground/80 hover:scale-110 group-hover:text-foreground/60" />
          <span className="line-clamp-1 text-2sm font-medium capitalize md:text-sm">
            {getFormattedAddresses(center?.centerAddress, [
              "line2",
              "line1",
              "area",
            ])}
          </span>
        </a>
      )}

      <hr className="my-1 border-dashed border-foreground/40 " />

      {/* Center Description */}
      <CenterDescriptionAndButtons center={center} />
    </div>
  );
};
