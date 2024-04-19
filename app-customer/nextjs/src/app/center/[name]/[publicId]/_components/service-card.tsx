import Image from "next/image";

import type { Center, Service } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import { cn } from "@petzo/ui/lib/utils";

import { COLOR_MAP } from "~/lib/constants";
import { ServiceDetailsDialog } from "./service-details-dialog";

export default function ServiceCard({
  service,
  center,
  className,
}: {
  service: Service;
  center: Center;
  className?: string;
}) {
  return (
    <div className={cn("flex justify-between", className)}>
      {/* Service Info */}
      <div className="flex flex-col p-3">
        <h2 className="line-clamp-2 font-semibold md:text-lg">
          {service.name}
        </h2>
        <span className="text-lg font-semibold text-primary">
          &#8377; {service.price}
        </span>
        <span className="line-clamp-2 text-sm md:line-clamp-3">
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
          />
        ) : (
          <div
            className={`relative flex size-full min-h-32 items-center justify-center rounded-lg text-center text-5xl md:min-h-40 md:w-40 ${COLOR_MAP[service.name[0]!.toLowerCase()]?.textColor} ${COLOR_MAP[service.name[0]!.toLowerCase()]?.bgColor} bg-opacity-75`}
          >
            {service.name[0]}
          </div>
        )}

        {/* TODO:  */}
        {/* <div className="absolute bottom-0 flex w-full translate-y-1/2 justify-center">
          <Button variant="outline">Add</Button>
        </div> */}
      </div>
    </div>
  );
}
