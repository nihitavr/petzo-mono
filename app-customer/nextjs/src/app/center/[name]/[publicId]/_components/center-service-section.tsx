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
    <div className={`flex w-full flex-col gap-3`}>
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
        <h3 className="text-center text-lg font-bold md:text-xl">
          {serviceTypeInfo.name} Services
        </h3>
      </div>

      <div className={`grid grid-cols-1 gap-8 md:grid-cols-2`}>
        {services?.map((service) => {
          return (
            // Service Card Container
            <ServiceCard
              className={`${services.length == 1 ? "col-span-2" : "col-span-1"} rounded-xl`}
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
