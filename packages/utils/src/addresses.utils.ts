import type { CenterAddress, CustomerAddresses } from "@petzo/db";

export function getFullFormattedAddresses(
  addresses?: CustomerAddresses | CenterAddress | null,
) {
  let fullAddress = "";

  if (addresses?.houseNo) fullAddress += `${addresses.houseNo}, `;
  if (addresses?.line1) fullAddress += `${addresses.line1}, `;
  if (addresses?.line2) fullAddress += `${addresses.line2}, `;
  if (addresses?.area) fullAddress += `${addresses.area.name}, `;
  if (addresses?.city) fullAddress += `${addresses.city.name}, `;
  if (addresses?.state) fullAddress += `${addresses.state.name} `;
  if (addresses?.pincode) fullAddress += `${addresses.pincode}`;

  return fullAddress;
}

export function getPlaceFormattedAddresses(
  addresses?: CustomerAddresses | CenterAddress | null,
) {
  let placeAddress = "";

  if (addresses?.line1) placeAddress += `${addresses.line1}, `;
  if (addresses?.area) placeAddress += `${addresses.area.name}, `;
  if (addresses?.city) placeAddress += `${addresses.city.name}, `;
  if (addresses?.state) placeAddress += `${addresses.state.name} `;
  if (addresses?.pincode) placeAddress += `${addresses.pincode}`;

  return placeAddress;
}

export function getFormattedAddresses(
  addresses?: CustomerAddresses | CenterAddress | null,
  fields?: ("line1" | "area" | "city" | "state" | "pincode")[],
) {
  let placeAddress = "";

  if (fields?.includes("line1") && addresses?.line1)
    placeAddress += `${addresses.line1}, `;

  if (fields?.includes("area") && addresses?.area)
    placeAddress += `${addresses.area.name}, `;
  if (fields?.includes("city") && addresses?.city)
    placeAddress += `${addresses.city.name}, `;
  if (fields?.includes("state") && addresses?.state)
    placeAddress += `${addresses.state.name} `;
  if (fields?.includes("pincode") && addresses?.pincode)
    placeAddress += `${addresses.pincode}, `;

  return placeAddress.slice(0, -2);
}
