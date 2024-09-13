"use client";

import { useState } from "react";
import Image from "next/image";

import type { Center, CustomerUser, Service } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import Price from "@petzo/ui/components/price";
import { toast } from "@petzo/ui/components/toast";
import { cn } from "@petzo/ui/lib/utils";
import { timeUtils } from "@petzo/utils";

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

  const getServicePetTypesComponent = () => {
    const isCatType = service.petTypes?.some((type) => type.includes("cat"));
    const isDogType = service.petTypes?.some((type) => type.includes("dog"));

    const ImageComp = ({ name, src }: { name: string; src: string }) => {
      return (
        <>
          <span className="opacity-70">{name} </span>
          <Image
            width={19}
            height={19}
            src={src}
            alt=""
            className="-mt-0.5 inline-block"
          />
        </>
      );
    };

    if (
      !service.petTypes ||
      service.petTypes.length === 0 ||
      (isCatType && isDogType)
    )
      return (
        <span className="text-2sm font-medium">
          <ImageComp name="For Cats " src="/icons/cat-face-icon.svg" />
          <ImageComp name=", Dogs " src="/icons/dog-face-icon.svg" />
        </span>
      );

    if (isCatType)
      return (
        <span className="text-2sm font-medium">
          <ImageComp name="For Cats " src="/icons/cat-face-icon.svg" />
        </span>
      );
    if (isDogType)
      return (
        <span className="text-2sm font-medium">
          <ImageComp name="For Dogs " src="/icons/dog-face-icon.svg" />
        </span>
      );
  };

  return (
    <div className={cn("flex justify-between bg-muted", className)}>
      {/* Service Info */}
      <div className="flex flex-col gap-1 p-2">
        <div className="flex flex-col">
          <h2 className="line-clamp-1 break-all text-sm font-semibold md:text-base">
            {service.name}
          </h2>

          <span>{getServicePetTypesComponent()}</span>

          {service.price > 0 && (
            <Price
              className="text-2base"
              price={service.price}
              discountedPrice={service.discountedPrice}
            />
          )}
        </div>

        {service.isBookingEnabled && (
          <span className="text-xs md:text-2sm">
            Duration:{" "}
            <span className="font-medium">
              {timeUtils.convertMinutesToHoursAndMinutes(service.duration)}
            </span>
          </span>
        )}

        {/* TODO: Description has been removed as we currently only have  */}
        {!service.isBookingEnabled && (
          <span className="text-xs text-green-700 md:text-sm">
            Call center to know about this service.
          </span>
        )}

        <div className="mt-auto">
          <ServiceDetailsModal
            service={service}
            center={center}
            open={openDetails}
            setOpen={setOpenDetails}
            user={user}
          />
        </div>
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
          <button
            onClick={() => {
              trackCustom("click_service_details_image", {
                servicePublicId: service.publicId,
              });
              setOpenDetails(true);
            }}
            className={`relative flex size-full min-h-32 items-center justify-center rounded-xl text-center text-5xl md:min-h-40 md:w-40 ${COLOR_MAP[service.name[0]!.toLowerCase()]?.textColor} ${COLOR_MAP[service.name[0]!.toLowerCase()]?.bgColor} bg-opacity-75`}
          >
            {service.name[0]}
          </button>
        )}

        {/* TODO:  */}
        <div className="absolute bottom-0 flex w-full translate-y-1/2 justify-center">
          {service.isBookingEnabled && (
            <BookServiceDialog service={service} center={center} user={user} />
          )}
        </div>
      </div>
    </div>
  );
}
