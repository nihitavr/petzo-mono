import type { Center, Service } from "@petzo/db";

export function convertToUrlFriendlyText(text: string): string {
  // Remove special characters, collapse multiple spaces into a single space, trim leading and trailing spaces, convert to lowercase, and replace spaces with dashes
  return text
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export function getCenterRelativeUrl(center: Center): string {
  const nameParam = convertToUrlFriendlyText(center.name);

  return `/centers/${nameParam}/${center.publicId}`;
}

export function getServiceRelativeUrl(
  service: Service,
  center: Center,
): string {
  const centerNameParam = convertToUrlFriendlyText(center.name);
  const serviceNameParam = convertToUrlFriendlyText(service.name);

  return `/centers/${centerNameParam}/${center.publicId}/${serviceNameParam}/${service.publicId}`;
}

export function getServicesProvidedByCenter(center: Center): string[] {
  const serviceTypesProvided: string[] = [];

  center.services.forEach((service) => {
    if (!serviceTypesProvided.includes(service.serviceType)) {
      serviceTypesProvided.push(service.serviceType);
    }
  });

  return serviceTypesProvided;
}

export function geServiceTypeToServicesByCenterMap(
  center: Center,
): Record<string, Service[]> {
  const servicesMap: Record<string, Service[]> = {};

  center.services.forEach((service: Service) => {
    servicesMap[service.serviceType] = servicesMap[service.serviceType] ?? [];
    servicesMap[service.serviceType]!.push(service);
  });

  return servicesMap;
}
