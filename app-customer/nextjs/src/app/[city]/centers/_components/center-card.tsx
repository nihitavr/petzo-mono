import Image from "next/image";
import Link from "next/link";
import { GrLocation } from "react-icons/gr";

import type { Center, Service } from "@petzo/db";

import Rating from "~/app/center/[name]/[publicId]/_components/rating";
import { COLOR_MAP } from "~/lib/constants";
import { getCenterRelativeUrl } from "~/lib/utils/center.utils";
import { getLowertCostService } from "~/lib/utils/service.utils";

export default function CenterCard({ center }: { center: Center }) {
  const thumbnail = center.images?.[0].url;
  const lowestPriceService = getLowertCostService(center);
  const serviceTypesProvided: string[] = [];

  center.services?.forEach((service: Service) => {
    if (!serviceTypesProvided.includes(service.serviceType)) {
      serviceTypesProvided.push(service.serviceType);
    }
  });

  return (
    <div className="flex flex-row rounded-lg md:border md:shadow-sm">
      <div className="flex h-44 w-full gap-2 md:h-60">
        {/* Center Image */}
        <Link
          href={getCenterRelativeUrl(center)}
          className="relative h-full w-2/5 cursor-pointer overflow-hidden rounded-lg"
        >
          {thumbnail ? (
            <Image src={thumbnail} alt="" fill style={{ objectFit: "cover" }} />
          ) : (
            <div
              className={`flex size-full items-center justify-center rounded-lg text-center ${COLOR_MAP[center.name[0]!.toLowerCase()]?.bgColor} bg-opacity-75`}
            >
              <div
                className={`text-7xl ${COLOR_MAP[center.name[0]!.toLowerCase()]?.textColor}`}
              >
                {center.name[0]}
              </div>
            </div>
          )}
        </Link>

        {/* Center Details */}
        <div className="flex w-3/5 flex-col gap-1 px-1 md:gap-1.5 md:p-2.5">
          {/* Center Name */}
          <Link
            href={getCenterRelativeUrl(center)}
            className="line-clamp-2 cursor-pointer text-base font-semibold hover:underline md:text-xl"
          >
            {center.name}
          </Link>

          {/* Rating and Reviews */}
          <div className="md:text-md flex items-center gap-2 text-sm text-foreground/80">
            {/* <div className="flex items-center gap-1">
              <span className="">{center.averageRating}</span>
              <FaStar className="h-3.5 w-3.5 text-yellow-600" />
            </div> */}
            <Rating rating={center.averageRating} />

            {/* <div className="h-1.5 w-1.5 rounded-full bg-foreground/80"></div>
            <div className="flex cursor-pointer items-center gap-1 hover:underline">
              <span>{center.reviewCount} reviews</span>
            </div> */}
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
            {serviceTypesProvided.join(", ")}
          </span>

          {/* Lowest Service Price */}
          {lowestPriceService && (
            <div className="mt-auto flex justify-between rounded-r-full bg-gradient-to-r from-background to-primary/40 px-2 py-1">
              <div className="flex flex-col ">
                <span className="text-xs capitalize text-foreground/80 md:text-sm">
                  {lowestPriceService.serviceType}
                </span>
                <span>Starting at </span>
              </div>
              <div className="text-md flex items-center justify-between md:text-lg">
                <span className="text-lg font-semibold md:text-xl">
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
