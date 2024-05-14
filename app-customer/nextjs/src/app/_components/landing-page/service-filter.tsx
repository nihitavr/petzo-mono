import { useMemo } from "react";
import Image from "next/image";

import { SERVICES_OFFERED } from "@petzo/constants";

export default function ServiceFilter({
  selectedServices,
  setSelectedServices,
}: {
  selectedServices: string[];
  setSelectedServices: (selectedServices: string[]) => void;
}) {
  const allServiceTypes = useMemo(() => {
    return Object.values(SERVICES_OFFERED).map((service) => service.publicId);
  }, []);

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
    <div className="w-full overflow-hidden">
      <div className="no-scrollbar mt-4 flex flex-wrap justify-center gap-2 overflow-x-auto">
        {allServiceTypes.map((serviceType) => {
          const isFilterSelected = selectedServices.includes(serviceType);
          const serviceTypeInfo = SERVICES_OFFERED[serviceType];
          if (!serviceTypeInfo) return null;
          return (
            <button
              className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-sm font-semibold md:py-1 ${isFilterSelected ? "bg-primary/20" : ""}`}
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
