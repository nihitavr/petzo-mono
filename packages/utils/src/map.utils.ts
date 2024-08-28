export function metersToKilometers(meters?: number) {
  if (!meters) return "";

  return `${(meters / 1000).toFixed(1)} KM`;
}
