"use client";

import { useState } from "react";
import Image from "next/image";

import type { Center, CustomerUser, Service } from "@petzo/db";
import { cn } from "@petzo/ui/lib/utils";
import { timeUtils } from "@petzo/utils";

import Price from "~/app/_components/price";
import { COLOR_MAP } from "~/lib/constants";
import { trackCustom } from "~/web-analytics/react";
import { BookServiceDialog } from "./book-service-modal";
import { ServiceDetailsModal } from "./service-details-modal";

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
  const [openDetails, setOpenDetails] = useState(false);

  return (
    <div className={cn("flex justify-between bg-muted", className)}>
      {/* Service Info */}
      <div className="flex flex-col gap-1 p-2">
        <h2 className="line-clamp-2 text-sm font-semibold md:text-base">
          {service.name}
        </h2>

        <div className="flex items-center gap-1.5">
          <span className="text-base font-semibold md:text-base">
            <Price price={service.price} className="text-primary" />
            {/* &#8377; {getCommaPrice(service.price)} */}
          </span>
          <div className="size-1 rounded-full bg-foreground/80"></div>
          <span className="text-sm">
            {timeUtils.convertMinutesToHoursAndMinutes(service.duration)}
          </span>
        </div>

        <span className="mt-1 line-clamp-2 whitespace-pre-wrap text-xs md:line-clamp-3 md:text-sm">
          {service.description}
        </span>

        <ServiceDetailsModal
          service={service}
          center={center}
          open={openDetails}
          setOpen={setOpenDetails}
          user={user}
        />
      </div>

      {/* Service Image */}
      <div className="relative min-h-32 w-32 flex-shrink-0 md:min-h-40 md:w-40">
        {service.images?.[0]?.url ? (
          <Image
            src={service.images?.[0]?.url}
            onClick={() => {
              trackCustom("click_service_details_image", {
                servicePublicId: service.publicId,
              });
              setOpenDetails(true);
            }}
            fill
            style={{ objectFit: "cover" }}
            alt="Service Image"
            className="cursor-pointer rounded-xl border-[0.5px]"
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
        <div className="absolute bottom-0 flex w-full translate-y-1/2 justify-center">
          <BookServiceDialog service={service} center={center} user={user} />
        </div>
      </div>
    </div>
  );
}
