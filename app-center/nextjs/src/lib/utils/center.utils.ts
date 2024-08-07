import type { Center, Service } from "@petzo/db";
import { SERVICES_CONFIG } from "@petzo/constants";

export function convertToUrlFriendlyText(text: string): string {
  // Remove special characters, collapse multiple spaces into a single space, trim leading and trailing spaces, convert to lowercase, and replace spaces with dashes
  return text
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export function getServicesNamesStr(services: Service[]): string {
  const serviceTypesProvided: string[] = [];

  services?.forEach((service) => {
    const serviceName = SERVICES_CONFIG[service.serviceType]?.name;

    if (serviceName && !serviceTypesProvided.includes(serviceName)) {
      serviceTypesProvided.push(serviceName);
    }
  });

  return serviceTypesProvided.join(", ");
}

export function getServicesNamesList(center: Center): string[] {
  const serviceTypesProvided: string[] = [];

  center.services?.forEach((service) => {
    const serviceName = SERVICES_CONFIG[service.serviceType]!.name;

    if (!serviceTypesProvided.includes(serviceName)) {
      serviceTypesProvided.push(serviceName);
    }
  });

  return serviceTypesProvided;
}

export function getServicesTypesList(center: Center): string[] {
  const serviceTypesProvided: string[] = [];

  center.services?.forEach((service) => {
    if (!serviceTypesProvided.includes(service.serviceType)) {
      serviceTypesProvided.push(service.serviceType);
    }
  });

  return serviceTypesProvided;
}

export function getServiceTypeToServicesByCenterMap(
  center: Center,
): Record<string, Service[]> {
  const servicesMap: Record<string, Service[]> = {};

  center.services?.forEach((service: Service) => {
    servicesMap[service.serviceType] = servicesMap[service.serviceType] ?? [];
    servicesMap[service.serviceType]!.push(service);
  });

  return servicesMap;
}
