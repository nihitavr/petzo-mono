"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import type { Center, CustomerUser, Service } from "@petzo/db";
import { SERVICES_OFFERED } from "@petzo/constants";

import {
  getServicesTypesList,
  getServiceTypeToServicesByCenterMap,
} from "~/lib/utils/center.utils";
import ServicesSection from "./center-service-section";
import ServiceCard from "./service-card";

export default function CenterServiceList({
  center,
  user,
}: {
  center: Center;
  user?: CustomerUser;
}) {
  const serviceTypesProvidedByCenter = useMemo(() => {
    return getServicesTypesList(center);
  }, [center]);

  const [selectedServices, setSelectedServices] = useState<string[]>(
    serviceTypesProvidedByCenter,
  );

  const serviceMap = useMemo(() => {
    return getServiceTypeToServicesByCenterMap(center);
  }, [center]);

  return (
    <div className="flex flex-col gap-3">
      {/* Service Type Filters */}
      {/* <ServiceFilters
        serviceTypes={serviceTypesProvidedByCenter}
        selectedServices={selectedServices}
        setSelectedServices={setSelectedServices}
      /> */}

      {/* Services List */}
      <div className="flex flex-col gap-10 py-5">
        {serviceTypesProvidedByCenter.map((serviceType, idx) => {
          const isServiceTypeSelected = selectedServices.includes(serviceType);

          const services = serviceMap[serviceType]?.sort(
            (a, b) => a.price - b.price,
          );
          const serviceTypeInfo = SERVICES_OFFERED[serviceType];
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
