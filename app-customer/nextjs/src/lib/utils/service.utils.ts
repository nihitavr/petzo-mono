import type { Center, Service } from "@petzo/db";

export function getMetadataTitle(service: Service, center: Center) {
  return `${service.name} service at ${center.name}, ${center.centerAddress.area.name}, ${center.centerAddress.city.name} | Petzo`;
}

export function getMetadataDescription(service: Service, center: Center) {
  return `${service.name} service at ${center.name}, ${center.centerAddress.area.name}, ${center.centerAddress.city.name}. ${service.description}`;
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

export const getLowertCostService = (center: Center) => {
  return center.services?.reduce((acc, service) => {
    if (service.price < acc?.price) {
      return service;
    }
    return acc;
  }, center.services[0]!);
};
