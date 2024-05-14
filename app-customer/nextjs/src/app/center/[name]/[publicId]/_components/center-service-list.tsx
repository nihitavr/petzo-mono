"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import type { Center } from "@petzo/db";
import { SERVICES_OFFERED } from "@petzo/constants";

import {
  getServicesTypesList,
  getServiceTypeToServicesByCenterMap,
} from "~/lib/utils/center.utils";
import ServiceCard from "./service-card";

export default function CenterServiceList({ center }: { center: Center }) {
  const serviceTypesProvidedByCenter = useMemo(() => {
    return getServicesTypesList(center);
  }, [center]);

  const [selectedServices, setSelectedServices] = useState<string[]>(
    serviceTypesProvidedByCenter,
  );

  const serviceMap = useMemo(() => {
    return getServiceTypeToServicesByCenterMap(center);
  }, [center]);

  const onClickServicesFilter = (servicePublicId: string) => {
    if (selectedServices.includes(servicePublicId)) {
      setSelectedServices(
        selectedServices.filter((service) => service !== servicePublicId),
      );
    } else {
      setSelectedServices([...selectedServices, servicePublicId]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Service Type Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {serviceTypesProvidedByCenter.map((serviceType) => {
          const isFilterSelected = selectedServices.includes(serviceType);

          const serviceTypeInfo = SERVICES_OFFERED[serviceType];
          if (!serviceTypeInfo) return null;

          return (
            <button
              className={`flex items-center gap-2 rounded-full border px-3 py-1 md:py-2 ${isFilterSelected ? "bg-primary/20" : ""}`}
              key={serviceType}
              onClick={() => onClickServicesFilter(serviceType)}
            >
              {serviceTypeInfo.icon && (
                <Image
                  src={serviceTypeInfo.icon}
                  height={15}
                  width={15}
                  alt=""
                />
              )}
              <span>{serviceTypeInfo.name}</span>
              {isFilterSelected && (
                <span className="font-semibold hover:scale-125 hover:text-foreground/50">
                  {" X"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Services List */}
      <div className="flex flex-col gap-10 pb-5">
        {serviceTypesProvidedByCenter.map((serviceType, idx) => {
          const services = serviceMap[serviceType];
          const isServiceTypeSelected = selectedServices.includes(serviceType);

          const serviceTypeInfo = SERVICES_OFFERED[serviceType];
          if (!serviceTypeInfo) return null;

          return (
            <div
              className={`flex w-full flex-col gap-3 overflow-hidden ${isServiceTypeSelected ? "animate-fade-in" : "animate-fade-out"}`}
              key={`services-${idx}`}
            >
              <div className="flex items-center justify-center gap-2">
                {serviceTypeInfo.icon && (
                  <Image
                    src={serviceTypeInfo.icon}
                    height={25}
                    width={25}
                    alt=""
                  />
                )}
                <h4 className="text-center text-2xl font-semibold md:text-3xl">
                  {serviceTypeInfo.name}
                </h4>
              </div>

              <div className={`grid grid-cols-1 gap-10 md:grid-cols-2`}>
                {services?.map((service) => {
                  return (
                    // Service Card Container
                    <ServiceCard
                      className={`${services.length == 1 ? "col-span-2" : "col-span-1"} rounded-lg  bg-muted`}
                      key={`services-${idx}-${service.id}`}
                      service={service}
                      center={center}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/*  */}
    </div>
  );
}
