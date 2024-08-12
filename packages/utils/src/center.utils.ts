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

export function getCenterUrl(center: Center, basePath?: string): string {
  if (!center) return "";

  const nameParam = convertToUrlFriendlyText(center.name);

  const centerUrl = `/center/${nameParam}/${center.publicId}`;

  return basePath ? `${basePath}${centerUrl}` : centerUrl;
}

export function getServiceBookingUrl(
  service: Service,
  center: Center,
  basePath?: string,
): string {
  if (!center || !service) return "";

  const centerNameParam = convertToUrlFriendlyText(center.name);
  const serviceNameParam = convertToUrlFriendlyText(service.name);

  const bookingUrl = `/center/${centerNameParam}/${center.publicId}/${serviceNameParam}/${service.publicId}/book`;

  return basePath ? `${basePath}${bookingUrl}` : bookingUrl;
}

export function getServiceDetailsUrl(
  service: Service,
  center: Center,
  basePath?: string,
): string {
  const centerNameParam = convertToUrlFriendlyText(center.name);
  const serviceNameParam = convertToUrlFriendlyText(service.name);

  const bookingUrl = `/center/${centerNameParam}/${center.publicId}/${serviceNameParam}/${service.publicId}`;

  return basePath ? `${basePath}${bookingUrl}` : bookingUrl;
}

export function getServiceNamesStr(services?: Service[]): string {
  const serviceTypesProvided: string[] = [];

  services?.forEach((service) => {
    serviceTypesProvided.push(service.name);
  });

  return serviceTypesProvided.join(", ");
}

export function getServiceNamePriceStr(services?: Service[]): string {
  const serviceTypesProvided: string[] = [];

  services?.forEach((service) => {
    serviceTypesProvided.push(`${service.name} (${service.price})`);
  });

  return serviceTypesProvided.join(", ");
}

export function getServiceTypeNamesStr(services?: Service[]): string {
  const serviceTypesProvided: string[] = [];

  services?.forEach((service) => {
    const serviceName = SERVICES_CONFIG[service.serviceType]?.name;

    if (serviceName && !serviceTypesProvided.includes(serviceName)) {
      serviceTypesProvided.push(serviceName);
    }
  });

  return serviceTypesProvided.join(", ");
}

export function getServicesTypes(services?: Service[]): string[] {
  const serviceTypesProvided: string[] = [];

  services?.forEach((service) => {
    if (!serviceTypesProvided.includes(service.serviceType)) {
      serviceTypesProvided.push(service.serviceType);
    }
  });

  return serviceTypesProvided;
}

export function getServiceTypeToServicesMap(
  services?: Service[],
): Record<string, Service[]> {
  const servicesMap: Record<string, Service[]> = {};

  services?.forEach((service: Service) => {
    servicesMap[service.serviceType] = servicesMap[service.serviceType] ?? [];
    servicesMap[service.serviceType]!.push(service);
  });

  return servicesMap;
}

export function hasAtHomeServices(services?: Service[]) {
  const servicesProvided = getServicesTypes(services);

  return servicesProvided.some((service) =>
    ["home_grooming", "mobile_grooming"].includes(service),
  );
}

export function hasAtCenterServices(services?: Service[]) {
  const servicesProvided = getServicesTypes(services);

  return servicesProvided.some((service) =>
    ["grooming", "veterinary", "boarding"].includes(service),
  );
}

export function getMetadataTitle(center: Center) {
  const servicesProvided = getServicesTypes(center.services);

  const hasHomeOrMobileGrooing = hasAtHomeServices(center.services);

  const hasAnyOtherServiceType = hasAtCenterServices(center.services);

  const servicesProvidedStr = servicesProvided
    .map((serviceName) => `${SERVICES_CONFIG[serviceName]?.name}`)
    .join(", ");

  if (hasHomeOrMobileGrooing && !hasAnyOtherServiceType) {
    return `${center.name} | ${servicesProvidedStr} services | ${center.centerAddress?.city?.name} | Furclub`;
  } else {
    return `${center.name} at ${center.centerAddress?.area?.name}, ${center.centerAddress?.city?.name} - ${servicesProvidedStr} services | Furclub`;
  }
}

export function getMetadataDescription(center: Center) {
  let description = `Discover best pet care at ${center.name} near ${center.centerAddress?.area?.name}, ${center.centerAddress?.city?.name}. Specializing in `;

  const servicesMap = getServiceTypeToServicesMap(center.services);

  const servicesProvided = getServicesTypes(center.services);
  const servicesProvidedStr = servicesProvided
    .map(
      (serviceName) =>
        `${SERVICES_CONFIG[serviceName]?.name} (${servicesMap[serviceName]?.map((service) => service.name).join(", ")})`,
    )
    .join(", ");

  description += `${servicesProvidedStr}.`;

  return description;
}

export function getMetadataKeywords(center: Center) {
  const servicesProvided = getServicesTypes(center.services);
  const serviceNames = center.services?.map((service) => service.name) ?? [];

  const keywords = [
    center.name,
    center.centerAddress?.area?.name,
    center.centerAddress?.city?.name,
    ...servicesProvided,
    ...serviceNames,
  ];
  return keywords.join(", ");
}
