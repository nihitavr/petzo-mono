import { nanoid } from "nanoid";

export function generatePublicIdByName(name?: string, replaceWith = "_") {
  if (!name) return "";
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/ /g, replaceWith)
    .toLowerCase();
}

export function generateRandomPublicId(size = 20) {
  return nanoid(size);
}

export function generateRandomSessionId() {
  return nanoid(20);
}

export function getListFromStr(
  str?: string,
  delimiter = ",",
): string[] | undefined {
  return str
    ?.split(delimiter)
    .map((v) => v.trim())
    .filter((v) => !!v);
}
