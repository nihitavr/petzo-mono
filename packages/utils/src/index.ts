import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get time passed in years and months(eg 2 Years 5 Months) given datetime.
export function getTimePassed(startDate?: Date | null) {
  if (!startDate) return "";
  const currentDate = new Date();

  const start = new Date(startDate);
  const end = new Date(currentDate);

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (years === 0 && months === 0 && days === 0) {
    return "0 days";
  }

  if (days < 0) {
    months--;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  let result = "";

  if (years > 0) {
    result += years + (years === 1 ? " Year " : " Years ");
  }

  if (months > 0) {
    result += months + (months === 1 ? " Month" : " Months");
  } else if (years === 0 && days > 0) {
    result += days + (days === 1 ? " Day" : " Days");
  }

  return result.trim();
}

export function titleCase(str?: string | null) {
  if (!str) return "";

  return str[0]?.toUpperCase() + str.slice(1);
}

export function getInstagramUsername(url?: string) {
  if (!url) return "";
  const username = url.split("/")[3];
  return username;
}
export function getInstagramUrl(username?: string) {
  if (!username) return "";
  return `https://www.instagram.com/${username}`;
}

export function removeLastSlash(url?: string) {
  if (!url) return "";
  return url.replace(/\/$/, "");
}

export function dateToISTString(date: Date) {
  if (!date) return "";

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
}

export function isValidCuid(cuid: string) {
  const zobParse = z.string().cuid().safeParse(cuid);

  if (zobParse.success === false) {
    return false;
  }

  return true;
}

export function getNRandomCuteImage() {
  const images = ["/paw.svg", "/stars.svg", "/bowtie.svg"];
  const randomImages = [];
  // Random number between 4-6
  const n = Math.floor(Math.random() * 3) + 4;

  // loop n
  for (let i = 0; i < n; i++) {
    const m = Math.floor(Math.random() * 3);

    randomImages.push({
      src: images[m],
      alt: "cute image",
      top: `${Math.floor(Math.random() * 100)}%`,
      left: `${Math.floor(Math.random() * 100)}%`,
    });
  }

  return randomImages;
}

export function getGoogleLocationLink(
  geoCode?: {
    latitude: number;
    longitude: number;
  } | null,
) {
  if (!geoCode) return "";
  return `https://www.google.com/maps/search/${geoCode?.latitude},${geoCode?.longitude}`;
}

export function generatePublicId(size = 15) {
  return nanoid(size);
}

export * as timeUtils from "./time.utils";
export * as stringUtils from "./string.utils";
export * as addressUtils from "./addresses.utils";
export * as mapUtils from "./map.utils";
export * as slackUtils from "./slack.utils";
export * as urlUtils from "./url.utils";
export * as centerUtils from "./center.utils";
export * as serviceUtils from "./service.utils";
export * as priceUtils from "./price.utils";
export * as adminUtils from "./admin.utils";
export * as validationUtils from "./validation.utils";
