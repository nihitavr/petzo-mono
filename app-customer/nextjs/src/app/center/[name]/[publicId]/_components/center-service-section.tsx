"use client";

import Image from "next/image";

import type { Center, CustomerUser, Service } from "@petzo/db";

import ServiceCard from "./service-card";

const ServicesSection = ({
  center,
  services,
  serviceTypeInfo,
  user,
}: {
  center: Center;
  serviceTypeInfo: { name: string; publicId: string; icon?: string };
  services: Service[];
  user?: CustomerUser;
}) => {
  return (
    <div className={`overflow-hidden1 flex w-full flex-col gap-3`}>
      <div className="flex items-center justify-center gap-1">
        {serviceTypeInfo.icon && (
          <Image
            className="-mt-0.5"
            src={serviceTypeInfo.icon}
            height={20}
            width={20}
            alt=""
          />
        )}
        <h4 className="text-center text-lg font-semibold md:text-xl">
          {serviceTypeInfo.name}
        </h4>
      </div>

      <div className={`grid grid-cols-1 gap-10 md:grid-cols-2`}>
        {services?.map((service) => {
          return (
            // Service Card Container
            <ServiceCard
              className={`${services.length == 1 ? "col-span-2" : "col-span-1"} rounded-md bg-muted`}
              key={`services-${serviceTypeInfo.publicId}-${service.id}`}
              service={service}
              center={center}
              user={user}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ServicesSection;
