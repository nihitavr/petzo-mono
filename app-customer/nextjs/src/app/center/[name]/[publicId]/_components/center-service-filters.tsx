"use client";

import Image from "next/image";

import { SERVICES_OFFERED } from "@petzo/constants";

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

export default ServiceFilters;
