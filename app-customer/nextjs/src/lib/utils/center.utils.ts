import type { Center, Service } from "@petzo/db";
import { SERVICES_OFFERED } from "@petzo/constants";

import { DEFAULT_CENTER_FILTERS } from "../constants";

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
  if (!center) return "";

  const nameParam = convertToUrlFriendlyText(center.name);

  return `/center/${nameParam}/${center.publicId}`;
}

export function getServiceBookingRelativeUrl(
  service: Service,
  center: Center,
): string {
  if (!center || !service) return "";

  const centerNameParam = convertToUrlFriendlyText(center.name);
  const serviceNameParam = convertToUrlFriendlyText(service.name);

  return `/center/${centerNameParam}/${center.publicId}/${serviceNameParam}/${service.publicId}/book`;
}

export function getServiceRelativeUrl(
  service: Service,
  center: Center,
): string {
  const centerNameParam = convertToUrlFriendlyText(center.name);
  const serviceNameParam = convertToUrlFriendlyText(service.name);

  return `/center/${centerNameParam}/${center.publicId}/${serviceNameParam}/${service.publicId}`;
}

export function getServicesNamesStr(center: Center): string {
  const serviceTypesProvided: string[] = [];

  center.services?.forEach((service) => {
    const serviceName = SERVICES_OFFERED[service.serviceType]?.name;

    if (serviceName && !serviceTypesProvided.includes(serviceName)) {
      serviceTypesProvided.push(serviceName);
    }
  });

  return serviceTypesProvided.join(", ");
}

export function getServicesNamesList(center: Center): string[] {
  const serviceTypesProvided: string[] = [];

  center.services?.forEach((service) => {
    const serviceName = SERVICES_OFFERED[service.serviceType]!.name;

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

export function getMetadataTitle(center: Center) {
  const servicesProvided = getServicesTypesList(center);
  const servicesProvidedStr = servicesProvided
    .map((serviceName) => `${SERVICES_OFFERED[serviceName]?.name}`)
    .join(", ");

  return `${center.name} in ${center.centerAddress?.area?.name}, ${center.centerAddress?.city?.name} - ${servicesProvidedStr} services | Petzo`;
}

export function getMetadataDescription(center: Center) {
  let description = `Discover exceptional pet care at ${center.name} near ${center.centerAddress?.area?.name}, ${center.centerAddress?.city?.name}. Specializing in `;

  const servicesMap = getServiceTypeToServicesByCenterMap(center);

  const servicesProvided = getServicesTypesList(center);
  const servicesProvidedStr = servicesProvided
    .map(
      (serviceName) =>
        `${SERVICES_OFFERED[serviceName]?.name} (${servicesMap[serviceName]?.map((service) => service.name).join(", ")})`,
    )
    .join(", ");

  description += servicesProvidedStr;
  description += `. ${center.description}`;

  return description;
}

export function getMetadataKeywords(center: Center) {
  const servicesProvided = getServicesTypesList(center);
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

export async function getCenterFilters(
  {
    serviceType,
    area,
    ratingGte,
    nearby,
  }: {
    serviceType: string;
    area: string;
    ratingGte: string;
    nearby: boolean;
  },
  data: Record<
    string,
    {
      publicId: string;
      name: string;
    }[]
  > = {},
) {
  const serviceTypeQueryParamList = serviceType ? serviceType.split(",") : [];
  const areaQueryParamList = area ? area.split(",") : [];
  const ratingGteQueryParam = ratingGte;

  const filters = structuredClone(DEFAULT_CENTER_FILTERS);

  filters.map((filter) => {
    switch (filter.publicId) {
      case "distance":
        filter.items.map((item) => {
          item.selected = nearby ? item.publicId === "nearby" : false;
        });
        break;
      case "serviceType":
        filter.items.map((item) => {
          item.selected = serviceTypeQueryParamList.includes(item.publicId);
        });
        break;
      case "ratingGte":
        filter.items.map((item) => {
          item.selected = ratingGteQueryParam === item.publicId;
        });
        break;
      case "area":
        filter.items =
          data.area?.map((area) => ({
            publicId: area.publicId,
            label: area.name,
            selected: areaQueryParamList.includes(area.publicId),
          })) ?? [];
        break;
    }
  });

  return filters;
}
