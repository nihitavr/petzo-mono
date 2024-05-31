"use client";

import Image from "next/image";

import type { Center, CustomerUser, Service } from "@petzo/db";
import { cn } from "@petzo/ui/lib/utils";

import { COLOR_MAP } from "~/lib/constants";
import { getCommaPrice } from "~/lib/utils/price.utils";
import { BookServiceDialog } from "./book-service-modal";
import { ServiceDetailsDialog } from "./service-details-modal";

export default function ServiceCard({
  service,
  center,
  className,
  user,
}: {
  service: Service;
  center: Center;
  className?: string;
  user?: CustomerUser;
}) {
  return (
    <div className={cn("flex justify-between", className)}>
      {/* Service Info */}
      <div className="flex flex-col gap-1 p-3">
        <h2 className="line-clamp-2 text-sm font-semibold md:text-base">
          {service.name}
        </h2>

        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-primary md:text-base">
            &#8377; {getCommaPrice(service.price)}
          </span>
          <div className="size-1 rounded-full bg-foreground/80"></div>
          <span className="text-sm">2 hrs 30 mins</span>
        </div>

        <span className="mt-1 line-clamp-2 whitespace-pre-wrap text-sm md:line-clamp-3">
          {service.description}
        </span>

        <ServiceDetailsDialog service={service} center={center} />
      </div>

      {/* Service Image */}
      <div className="relative min-h-32 w-32 flex-shrink-0 rounded-lg md:min-h-40 md:w-40">
        {service.images?.[0]?.url ? (
          <Image
            src={service.images?.[0]?.url}
            fill
            style={{ objectFit: "cover" }}
            alt="Service Image"
            className="rounded-lg"
            sizes="(min-width: 780px) 160px, 128px"
          />
        ) : (
          <div
            className={`relative flex size-full min-h-32 items-center justify-center rounded-lg text-center text-5xl md:min-h-40 md:w-40 ${COLOR_MAP[service.name[0]!.toLowerCase()]?.textColor} ${COLOR_MAP[service.name[0]!.toLowerCase()]?.bgColor} bg-opacity-75`}
          >
            {service.name[0]}
          </div>
        )}

        {/* TODO:  */}
        <BookServiceDialog service={service} center={center} user={user} />
      </div>
    </div>
  );
}
