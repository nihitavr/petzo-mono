import Link from "next/link";
import { GrLocation } from "react-icons/gr";

import type { Center } from "@petzo/db";
import { SERVICES_CONFIG } from "@petzo/constants";
import { centerUtils, serviceUtils } from "@petzo/utils";

import Rating from "~/app/center/[name]/[publicId]/_components/rating-display";
import { COLOR_MAP } from "~/lib/constants";
import BasicImagesCasousel from "../center/[name]/[publicId]/_components/basic-images-carousel";

export default function CenterCardVertical({
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
      className="flex animate-fade-in flex-row overflow-hidden rounded-2xl border shadow-md "
    >
      <div className="flex h-full w-full flex-col gap-0">
        {/* Center Image */}
        <div className="relative aspect-[13/9] w-full cursor-pointer overflow-hidden rounded-t-2xl border-b object-center">
          {thumbnail ? (
            <BasicImagesCasousel
              images={
                center.images?.slice(0, 5)?.map((image) => image.url) ?? []
              }
              className="aspect-square w-full"
              autoplay={true}
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
                  <div className="line-clamp-2 cursor-pointer text-2base font-semibold hover:underline">
                    {center.name}
                  </div>
                </div>

                {/* Rating and Reviews */}
                {!!center.averageRating && (
                  <Rating
                    rating={center.averageRating}
                    ratingCount={center.ratingCount}
                  />
                )}

                {/* Area */}
                {centerUtils.hasAtCenterServices(center.services) ? (
                  <div className="flex items-center gap-1">
                    <GrLocation />
                    <span className="line-clamp-1 text-2sm font-medium capitalize">
                      {center.centerAddress?.area?.name}
                    </span>
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
                      &#8377; {lowestPriceService.price} /-
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

            {/* <div className="flex items-center gap-1 text-2sm font-medium">
              <span>Includes</span>
              <Image
                width={18}
                height={18}
                src={"/icons/pet-store-icon.svg"}
                alt="pet store"
              ></Image>
              <span>Pet Store</span>
              <span>&</span>
              <Image
                width={18}
                height={18}
                src={"/icons/pet-pharmacy-icon.svg"}
                alt="pet pharmacy"
              ></Image>
              <span>Pharmacy</span>
            </div> */}
          </div>
        </div>
      </div>
    </Link>
  );
}
