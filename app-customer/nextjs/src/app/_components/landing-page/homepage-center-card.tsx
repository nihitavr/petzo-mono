import Image from "next/image";
import Link from "next/link";
import { GrLocation } from "react-icons/gr";

import type { Center } from "@petzo/db";
import { SERVICES_OFFERED } from "@petzo/constants";

import Rating from "~/app/center/[name]/[publicId]/_components/rating-display";
import { getCenterUrl, getServicesNamesStr } from "~/lib/utils/center.utils";
import { getLowertCostService } from "~/lib/utils/service.utils";

export default function HomePageCenterCard({ center }: { center: Center }) {
  const thumbnail = center.images?.[0]?.url;
  const lowestPriceService = getLowertCostService(center);

  return (
    <div className="flex flex-row rounded-xl bg-muted md:border">
      <div className="flex h-44 w-full gap-1 md:h-60">
        {/* Center Image */}
        <Link
          href={getCenterUrl(center)}
          className="relative h-full w-2/5 cursor-pointer overflow-hidden rounded-xl"
        >
          {thumbnail ? (
            <Image src={thumbnail} alt="" fill style={{ objectFit: "cover" }} />
          ) : (
            <div
              className={`flex size-full items-center justify-center rounded-lg bg-primary/60 text-center`}
              // className={`flex size-full items-center justify-center rounded-lg text-center ${COLOR_MAP[center.name[0]!.toLowerCase()]?.bgColor} bg-opacity-75`}
            >
              <div className={`text-7xl text-white`}>{center.name[0]}</div>
            </div>
          )}
        </Link>

        {/* Center Details */}
        <div className="flex w-3/5 flex-col gap-1 p-1 pr-1.5 md:gap-1.5 md:p-2.5">
          {/* Center Name */}
          <Link
            href={getCenterUrl(center)}
            className="text-2sm line-clamp-2 cursor-pointer font-semibold hover:underline md:text-base"
          >
            {center.name}
          </Link>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <Rating rating={center.averageRating} />
            <span className="line-clamp-1 text-xs font-semibold">
              (Google Rating)
            </span>
          </div>

          {/* Area */}
          <div className="flex items-center gap-1">
            <GrLocation className="size-3.5" />
            <span className="line-clamp-1 text-xs font-medium capitalize md:text-sm">
              {center.centerAddress.area.name}
            </span>
          </div>

          {/* Services Provided */}
          <span className="line-clamp-1 break-all text-xs font-semibold capitalize text-primary md:text-sm">
            {getServicesNamesStr(center)}
          </span>

          {/* Lowest Service Price */}
          {lowestPriceService && (
            <div className="mt-auto flex justify-between rounded-r-full bg-gradient-to-r from-background to-primary/40 px-2 py-1">
              <div className="flex flex-col ">
                <span className="text-xs capitalize text-foreground/80">
                  {SERVICES_OFFERED[lowestPriceService.serviceType]?.name}
                </span>
                <span className="text-2sm">Starting at </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold md:text-base">
                  &#8377; {lowestPriceService.price}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
