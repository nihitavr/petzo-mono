import { useMemo } from "react";

import { SERVICES_OFFERED } from "@petzo/constants";
import { toast } from "@petzo/ui/components/toast";

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

          return (
            <button
              className={`flex items-center gap-2 rounded-full border px-2 py-0.5 text-sm font-semibold md:py-1 ${isFilterSelected ? "bg-primary/20" : ""}`}
              key={serviceType}
              onClick={() => onClickServicesFilter(serviceType)}
            >
              <span className="whitespace-nowrap">
                {SERVICES_OFFERED[serviceType]?.name}
              </span>
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
