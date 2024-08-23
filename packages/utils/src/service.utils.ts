import type { Center, Service } from "@petzo/db";
import { SERVICES_CONFIG } from "@petzo/constants";

export function getMetadataTitle(service: Service, center: Center) {
  return `${service.name} service at ${center.name}, ${center.centerAddress?.area?.name}, ${center.centerAddress?.city?.name} | Furclub`;
}

export function getMetadataDescription(service: Service, center: Center) {
  return `${service.name} service at ${center.name}, ${center.centerAddress?.area?.name}, ${center.centerAddress?.city?.name}. ${service.description}`;
}

export function getMetadataKeywords(service: Service, center: Center) {
  const keywords = [
    center.name,
    center.centerAddress?.area?.name,
    center.centerAddress?.city?.name,
    service.serviceType,
    service.name,
    "pet care",
    "pet services",
  ];
  return keywords.join(", ");
}

export const getLowestCostService = (
  services?: Service[],
  serviceTypes?: string[],
) => {
  return services
    ?.filter((service) => {
      if (serviceTypes) return serviceTypes.includes(service.serviceType);
      return true;
    })
    ?.reduce(
      (acc, service) => {
        if (
          (!acc || service.price < acc?.price) &&
          SERVICES_CONFIG[service.serviceType]
        ) {
          return service;
        }

        return acc;
      },
      undefined as Service | undefined,
    );
};
