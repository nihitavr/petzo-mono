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

export default function CenterCardVertical({
  center,
  serviceTypes,
  onlySummary = false,
  autoplayImages = true,
}: {
  center: Center;
  serviceTypes?: string[];
  userGeoCode?: {
    latitude: number;
    longitude: number;
  };
  onlySummary?: boolean;
  autoplayImages?: boolean;
}) {
  const thumbnail = center.images?.[0]?.url;
  const lowestPriceService = serviceUtils.getLowestCostService(
    center.services,
    serviceTypes,
  );

  return (
    <Link
      href={centerUtils.getCenterUrl(center)}
      className="flex h-full animate-fade-in flex-row overflow-hidden rounded-2xl border shadow-md"
    >
      <div className="flex h-full w-full flex-col gap-0">
        {/* Center Image */}
        <div className="relative aspect-[13/9] w-full cursor-pointer overflow-hidden rounded-t-2xl border-b object-center">
          {thumbnail ? (
            <BasicImagesCasousel
              images={
                center.images?.slice(0, 8)?.map((image) => image.url) ?? []
              }
              className="aspect-square w-full"
              autoplay={autoplayImages}
              enableZoomOut={false}
            />
          ) : (
            // <Image src={thumbnail} alt="" fill style={{ objectFit: "cover" }} />
            <div
              className={`flex size-full items-center justify-center rounded-t-2xl text-center ${COLOR_MAP[center.name[0]!.toLowerCase()]?.bgColor} bg-opacity-75`}
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
        <div className="flex w-full flex-col gap-1">
          {/* Center Name */}
          <div className="flex flex-col gap-1 px-2.5 py-1.5 pb-2">
            <div className="flex items-start justify-between">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "cursor-pointer text-2base font-semibold hover:underline",
                      onlySummary ? "line-clamp-1" : "line-clamp-2",
                    )}
                  >
                    {center.name}
                  </div>
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
                {centerUtils.hasAtCenterServices(center.services) ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <GrLocation />
                      <span className="line-clamp-1 text-2sm font-medium capitalize">
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
                ) : (
                  <span className="line-clamp-2 break-all text-2sm font-semibold capitalize text-primary md:text-sm">
                    {centerUtils.getServiceTypeNamesStr(center.services)}
                  </span>
                )}
              </div>

              {/* Pricing Details */}
              {lowestPriceService && (
                <div className="my-auto -mr-2.5 flex flex-col justify-between rounded-l-xl bg-gradient-to-r from-primary/5 via-primary/15 to-primary/25 px-2 py-1">
                  <div className="flex flex-col">
                    <span className="whitespace-nowrap text-2xs capitalize text-foreground/80">
                      {SERVICES_CONFIG[lowestPriceService.serviceType]?.name}
                    </span>
                    <span className="whitespace-nowrap text-sm">
                      Starting at{" "}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-base">
                    <span className="text-2base font-semibold md:text-lg">
                      <Price
                        price={lowestPriceService.price}
                        discountedPrice={lowestPriceService.discountedPrice}
                      />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Services Provided */}
            {centerUtils.hasAtCenterServices(center.services) && (
              <span className="line-clamp-2 break-all text-2sm font-semibold capitalize text-primary md:text-sm">
                {centerUtils.getServiceTypeNamesStr(center.services)}
              </span>
            )}

            {/* Center Features */}
            <Features features={center.features} />

            <CenterTimings center={center} />
          </div>
        </div>
      </div>
    </Link>
  );
}
