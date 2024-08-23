import Link from "next/link";
import { GrLocation } from "react-icons/gr";

import type { Center } from "@petzo/db";
import { SERVICES_CONFIG } from "@petzo/constants";
import { centerUtils, serviceUtils } from "@petzo/utils";

import Rating from "~/app/center/[name]/[publicId]/_components/rating-display";
import { COLOR_MAP } from "~/lib/constants";
import BasicImagesCasousel from "../center/[name]/[publicId]/_components/basic-images-carousel";

export default function CenterCardHorizontal({
  center,
  serviceTypes,
}: {
  center: Center;
  serviceTypes?: string[];
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
      <div className="flex h-44 w-full gap-1 md:h-60">
        {/* Center Image */}
        <div className="relative h-full w-2/5 cursor-pointer overflow-hidden rounded-xl">
          {thumbnail ? (
            <BasicImagesCasousel
              images={
                center.images?.slice(0, 5)?.map((image) => image.url) ?? []
              }
              className="h-44 w-full md:h-60"
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
        <div className="flex w-3/5 flex-col gap-1 p-1 pr-1.5 md:gap-1.5 md:p-1.5">
          {/* Center Name */}
          <div className="line-clamp-2 cursor-pointer text-sm font-semibold hover:underline md:text-base">
            {center.name}
          </div>

          {/* Rating and Reviews */}
          {!!center.averageRating && (
            <Rating
              rating={center.averageRating}
              ratingCount={center.ratingCount}
            />
          )}

          {/* Area */}
          {centerUtils.hasAtCenterServices(center.services) && (
            <div className="flex items-center gap-1">
              <GrLocation />
              <span className="line-clamp-1 text-2sm font-medium capitalize md:text-sm">
                {center.centerAddress?.area?.name}
              </span>
            </div>
          )}

          {/* Services Provided */}
          <span className="line-clamp-1 break-all text-2sm font-semibold capitalize text-primary md:text-sm">
            {centerUtils.getServiceTypeNamesStr(center.services)}
          </span>

          {/* Lowest Service Price */}
          {lowestPriceService && (
            <div className="mt-auto flex justify-between rounded-r-full bg-gradient-to-r from-background to-primary/40 px-2 py-1">
              <div className="flex flex-col ">
                <span className="text-xs capitalize text-foreground/80 md:text-sm">
                  {SERVICES_CONFIG[lowestPriceService.serviceType]?.name}
                </span>
                <span className="text-2sm md:text-sm">Starting at </span>
              </div>
              <div className="text-md flex items-center justify-between md:text-lg">
                <span className="text-base font-semibold md:text-lg">
                  &#8377; {lowestPriceService.price}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
