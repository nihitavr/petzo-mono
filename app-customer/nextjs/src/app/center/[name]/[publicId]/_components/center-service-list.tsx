"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import type { Center, CustomerUser, Service } from "@petzo/db";
import { SERVICES_OFFERED } from "@petzo/constants";

import {
  getServicesTypesList,
  getServiceTypeToServicesByCenterMap,
} from "~/lib/utils/center.utils";
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
        <h4 className="text-center text-xl font-semibold md:text-2xl">
          {serviceTypeInfo.name}
        </h4>
      </div>

      <div className={`grid grid-cols-1 gap-10 md:grid-cols-2`}>
        {services?.map((service) => {
          return (
            // Service Card Container
            <ServiceCard
              className={`${services.length == 1 ? "col-span-2" : "col-span-1"} rounded-lg  bg-muted`}
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

const ServiceFilters = ({
  serviceTypes,
  selectedServices,
  setSelectedServices,
}: {
  serviceTypes: string[];
  selectedServices: string[];
  setSelectedServices: (selectedServices: string[]) => void;
}) => {
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
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {serviceTypes.map((serviceType) => {
        const isFilterSelected = selectedServices.includes(serviceType);

        const serviceTypeInfo = SERVICES_OFFERED[serviceType];
        if (!serviceTypeInfo) return null;

        return (
          <button
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm md:py-2 ${isFilterSelected ? "bg-muted" : ""}`}
            key={serviceType}
            onClick={() => onClickServicesFilter(serviceType)}
          >
            {serviceTypeInfo.icon && (
              <Image src={serviceTypeInfo.icon} height={15} width={15} alt="" />
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
  );
};
