import { useMemo } from "react";
import Image from "next/image";

import { SERVICES_CONFIG } from "@petzo/constants";

export default function ServiceFilter({
  serviceTypes,
  selectedServices,
  setSelectedServices,
}: {
  serviceTypes?: string[];
  selectedServices: string[];
  setSelectedServices: (selectedServices: string[]) => void;
}) {
  const allServiceTypes = useMemo(() => {
    return serviceTypes
      ? serviceTypes
      : Object.values(SERVICES_CONFIG).map((service) => service.publicId);
  }, [serviceTypes]);

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
    <div className="mt-4 w-full  overflow-hidden ">
      <div className="no-scrollbar flex gap-2 overflow-x-auto md:justify-center">
        {allServiceTypes.map((serviceType) => {
          const isFilterSelected = selectedServices.includes(serviceType);
          const serviceTypeInfo = SERVICES_CONFIG[serviceType];
          if (!serviceTypeInfo) return null;
          return (
            <button
              className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-sm font-semibold md:py-2 ${isFilterSelected ? "border-foreground/50 bg-foreground/10" : ""}`}
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
              <span className="whitespace-nowrap">{serviceTypeInfo.name}</span>
              {isFilterSelected && (
                <span className="font-semibold hover:scale-125 hover:text-foreground/50">
                  {" X"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
