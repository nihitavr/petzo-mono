import Link from "next/link";
import { GrLocation } from "react-icons/gr";

import type { Center } from "@petzo/db";
import { DISTANCE_MULTIPLIER, SERVICES_CONFIG } from "@petzo/constants";
import Price from "@petzo/ui/components/price";
import { centerUtils, cn, mapUtils, serviceUtils } from "@petzo/utils";

import Rating from "~/app/center/[name]/[publicId]/_components/rating-display";
import { COLOR_MAP } from "~/lib/constants";
import BasicImagesCasousel from "../center/[name]/[publicId]/_components/basic-images-carousel";
import Features from "./center-features";
import CenterTimings from "./center-timings";

export default function CenterCardHorizontal({
  center,
  serviceTypes,
  onlySummary = false,
}: {
  center: Center;
  serviceTypes?: string[];
  onlySummary?: boolean;
}) {
  const thumbnail = center.images?.[0]?.url;

  const lowestPriceService = serviceUtils.getLowestCostService(
    center.services,
    serviceTypes,
  );

  return (
    <Link
      href={centerUtils.getCenterUrl(center)}
      className="flex animate-fade-in flex-row rounded-xl bg-muted md:border md:shadow-sm"
    >
      <div className="flex h-44 w-full gap-1 md:h-64">
        {/* Center Image */}
        <div className="relative h-full w-2/5 cursor-pointer overflow-hidden rounded-xl">
          {thumbnail ? (
            <BasicImagesCasousel
              images={
                center.images?.slice(0, 8)?.map((image) => image.url) ?? []
              }
              autoplay={true}
              className="h-44 w-full md:h-64"
              autoPlayDelay={3000}
              enableZoomOut={false}
              autoPlatMargin="-10% 0px -10% 0px"
            />
          ) : (
            // <Image src={thumbnail} alt="" fill style={{ objectFit: "cover" }} />
            <div
              className={`flex size-full items-center justify-center rounded-md text-center ${COLOR_MAP[center.name[0]!.toLowerCase()]?.bgColor} bg-opacity-75`}
            >
              <div
                className={`text-7xl ${COLOR_MAP[center.name[0]!.toLowerCase()]?.textColor}`}
              >
                {center.name[0]}
              </div>
            </div>
          )}
        </div>

        {/* Center Details */}
        <div className="flex w-3/5 flex-col gap-1 p-1 pr-1.5 md:gap-1 md:p-1.5">
          {/* Center Name */}
          <div
            className={cn(
              "cursor-pointer text-sm font-semibold hover:underline md:text-base",
              onlySummary ? "line-clamp-1" : "line-clamp-2",
            )}
          >
            {center.name}
          </div>

          {/* Rating and Reviews */}
          {(!!center.averageRating || !!center.googleRating) && (
            <Rating
              rating={center.averageRating}
              ratingCount={center.ratingCount}
              googleRating={center.googleRating}
              googleRatingCount={center.googleRatingCount}
            />
          )}

          {/* Area */}
          {centerUtils.hasAtCenterServices(center.services) && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <GrLocation />
                <span className="line-clamp-1 text-2sm font-medium capitalize md:text-sm">
                  {center.centerAddress?.area?.name}
                </span>
              </div>
              {!!center.distanceInMeters && (
                <>
                  <div className="size-1.5 rounded-full bg-foreground/50" />
                  <div className="text-2sm font-medium text-green-700">
                    {mapUtils.metersToKilometers(
                      center.distanceInMeters * DISTANCE_MULTIPLIER,
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Services Provided */}
          <span className="line-clamp-1 break-all text-2sm font-semibold capitalize text-primary md:text-sm">
            {centerUtils.getServiceTypeNamesStr(center.services)}
          </span>

          {/* Center Features */}
          <Features features={center.features} />

          {/* Center Timings */}
          <CenterTimings center={center} />

          {/* Lowest Service Price */}
          {lowestPriceService && (
            <div className="mt-auto flex justify-between rounded-r-full bg-gradient-to-r from-background to-primary/40 px-2 py-1">
              <div className="flex flex-col">
                <span className="line-clamp-1 text-xs capitalize text-foreground/80 md:text-sm">
                  {SERVICES_CONFIG[lowestPriceService.serviceType]?.name}
                </span>
                <span className="line-clamp-1 text-2sm md:text-sm">
                  Starting at{" "}
                </span>
              </div>
              <div className="flex items-center justify-between text-base md:text-lg">
                <span className="text-base font-semibold md:text-lg">
                  <Price
                    price={lowestPriceService.price}
                    discountedPrice={lowestPriceService.discountedPrice}
                  />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
