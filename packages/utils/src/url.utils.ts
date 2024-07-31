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

export function createCenterUrl(center: Center): string {
  if (!center) return "";

  const nameParam = convertToUrlFriendlyText(center.name);

  return `/center/${nameParam}/${center.publicId}`;
}

export function createServiceUrl(service: Service, center: Center): string {
  const centerNameParam = convertToUrlFriendlyText(center.name);
  const serviceNameParam = convertToUrlFriendlyText(service.name);

  return `/center/${centerNameParam}/${center.publicId}/${serviceNameParam}/${service.publicId}`;
}
