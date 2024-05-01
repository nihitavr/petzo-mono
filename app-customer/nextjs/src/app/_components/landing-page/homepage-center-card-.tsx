import Image from "next/image";
import Link from "next/link";
import { GrLocation } from "react-icons/gr";

import type { Center } from "@petzo/db";
import { SERVICES_OFFERED } from "@petzo/constants";

import Rating from "~/app/center/[name]/[publicId]/_components/rating-display";
import {
  getCenterRelativeUrl,
  getServicesNamesStr,
} from "~/lib/utils/center.utils";
import { getLowertCostService } from "~/lib/utils/service.utils";

export default function HomePageCenterCard({ center }: { center: Center }) {
  const thumbnail = center.images?.[0]?.url;
  const lowestPriceService = getLowertCostService(center);

  return (
    <div className="bg-primary/[7%]1 flex flex-row rounded-xl bg-muted md:border md:shadow-sm">
      <div className="flex h-44 w-full gap-2 md:h-60">
        {/* Center Image */}
        <Link
          href={getCenterRelativeUrl(center)}
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
        <div className="flex w-3/5 flex-col gap-1 py-1.5 pr-2 md:gap-1.5 md:p-2.5">
          {/* Center Name */}
          <Link
            href={getCenterRelativeUrl(center)}
            className="line-clamp-2 cursor-pointer text-sm font-semibold hover:underline md:text-base"
          >
            {center.name}
          </Link>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-2 text-sm text-foreground/80 md:text-base">
            <Rating rating={center.averageRating} />
            <span className="line-clamp-1 text-xs font-semibold">
              (Google Rating)
            </span>
          </div>

          {/* Area */}
          <div className="flex items-center gap-1">
            <GrLocation />
            <span className="line-clamp-1 text-sm font-medium capitalize md:text-base">
              {center.centerAddress.area.name}
            </span>
          </div>

          {/* Services Provided */}
          <span className="md:text-md line-clamp-1 break-all text-xs font-semibold capitalize text-primary">
            {getServicesNamesStr(center)}
          </span>

          {/* Lowest Service Price */}
          {lowestPriceService && (
            <div className="mt-auto flex justify-between rounded-r-full bg-gradient-to-r from-background to-primary/40 px-2 py-1">
              <div className="flex flex-col ">
                <span className="text-xs capitalize text-foreground/80 md:text-sm">
                  {SERVICES_OFFERED[lowestPriceService.serviceType]?.name}
                </span>
                <span className="text-sm md:text-base">Starting at </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold md:text-lg">
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
