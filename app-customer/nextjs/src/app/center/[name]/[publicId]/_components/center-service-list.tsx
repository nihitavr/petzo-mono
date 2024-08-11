"use client";

import { useMemo, useState } from "react";

import type { Center, CustomerUser } from "@petzo/db";
import { SERVICES_CONFIG } from "@petzo/constants";
import { centerUtils } from "@petzo/utils";

import ServiceFilters from "~/app/_components/service-filter";
import ServicesSection from "./center-service-section";

export default function CenterServiceList({
  center,
  user,
}: {
  center: Center;
  user?: CustomerUser;
}) {
  const serviceTypesProvidedByCenter = useMemo(() => {
    return centerUtils.getServicesTypes(center.services);
  }, [center]);

  const [selectedServices, setSelectedServices] = useState<string[]>(
    serviceTypesProvidedByCenter,
  );

  const serviceMap = useMemo(() => {
    return centerUtils.getServiceTypeToServicesMap(center.services);
  }, [center]);

  return (
    <div className="flex flex-col gap-3">
      {/* Service Type Filters */}
      <ServiceFilters
        serviceTypes={serviceTypesProvidedByCenter}
        selectedServices={selectedServices}
        setSelectedServices={setSelectedServices}
      />

      {/* Services List */}
      <div className="flex flex-col gap-10 pb-5">
        {serviceTypesProvidedByCenter.map((serviceType, idx) => {
          const isServiceTypeSelected = selectedServices.includes(serviceType);

          const servicesForCats =
            serviceMap[serviceType]
              ?.filter((service) => service.petTypes?.includes("cat"))
              .sort((a, b) => a.price - b.price) ?? [];

          const servicesForOthers =
            serviceMap[serviceType]
              ?.filter((service) => !service.petTypes?.includes("cat"))
              .sort((a, b) => a.price - b.price) ?? [];

          const services = [...servicesForOthers, ...servicesForCats];

          const serviceTypeInfo = SERVICES_CONFIG[serviceType];
          if (!serviceTypeInfo || !services || services.length === 0)
            return null;

          return (
            <div
              key={`services-section-${idx}`}
              className={`${isServiceTypeSelected ? "animate-fade-in" : "animate-fade-out"}`}
            >
              <ServicesSection
                center={center}
                services={services}
                serviceTypeInfo={serviceTypeInfo}
                user={user}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
