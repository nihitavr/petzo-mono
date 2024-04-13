"use client";

import { useMemo, useState } from "react";

import type { Center } from "@petzo/db";

import { SERVICES_OFFERED } from "~/lib/constants";
import {
  geServiceTypeToServicesByCenterMap,
  getServicesProvidedByCenter,
} from "~/lib/utils/center.utils";
import ServiceCard from "./service-card";

export default function CenterServiceList({ center }: { center: Center }) {
  const serviceTypesProvidedByCenter = useMemo(() => {
    return getServicesProvidedByCenter(center);
  }, [center]);

  const [selectedServices, setSelectedServices] = useState<string[]>(
    serviceTypesProvidedByCenter,
  );

  const serviceMap = useMemo(() => {
    return geServiceTypeToServicesByCenterMap(center);
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
      {/* <h3 className="text-center text-3xl font-semibold">Our Services</h3> */}

      {/* Service Type Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {serviceTypesProvidedByCenter.map((serviceType) => {
          const isFilterSelected = selectedServices.includes(serviceType);

          return (
            <button
              className={`flex items-center gap-2 rounded-full border px-4 py-1 md:py-2 ${isFilterSelected ? "bg-primary/20" : ""}`}
              key={serviceType}
              onClick={() => onClickServicesFilter(serviceType)}
            >
              <span>{SERVICES_OFFERED[serviceType]?.name}</span>
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
      <div className="flex flex-col gap-10">
        {serviceTypesProvidedByCenter.map((serviceType, idx) => {
          const services = serviceMap[serviceType];

          return (
            selectedServices.includes(serviceType) && (
              <div
                className="flex w-full flex-col gap-3"
                key={`services-${idx}`}
              >
                <h4 className="text-center text-2xl font-semibold md:text-3xl">
                  {SERVICES_OFFERED[serviceType]?.name}
                </h4>

                <div className={`grid grid-cols-1 gap-10 md:grid-cols-2`}>
                  {services?.map((service) => {
                    return (
                      // Service Card Container
                      <ServiceCard
                        className={`${services.length == 1 ? "col-span-2" : "col-span-1"} rounded-lg bg-primary/[7%]`}
                        key={`services-${idx}-${service.id}`}
                        service={service}
                        center={center}
                      />
                    );
                  })}
                </div>
              </div>
            )
          );
        })}
      </div>

      {/*  */}
    </div>
  );
}
