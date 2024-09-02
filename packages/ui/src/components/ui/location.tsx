import {
  GEOLOCATION_MAX_AGE_IN_MS,
  GEOLOCATION_TIMEOUT_IN_MS,
} from "@petzo/constants";

import { toast } from "./toast";

// location cache expiry time is 1 month
const LOCAL_STORAGE_LOCATION_EXPIRY_IN_MS = 1000 * 60 * 60 * 24 * 60;

export const fetchLocation = (
  success: (position: GeolocationPosition) => void,
  error?: (error: GeolocationPositionError) => void,
  options?: PositionOptions & { nocache?: boolean },
) => {
  if (!navigator.geolocation) {
    toast.error("Failed to get your location. Please try again later");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      localStorage.setItem(
        "geoLocationData",
        JSON.stringify({
          timestamp: new Date().getTime(),
          geoCode: position,
        }),
      );
      success(position);
    },
    (e) => {
      const geoLocationDataString = localStorage.getItem("geoLocation");

      const geoLocationData = (
        geoLocationDataString ? JSON.parse(geoLocationDataString) : null
      ) as {
        timestamp: number;
        geoCode: GeolocationPosition;
      };

      if (
        !options?.nocache &&
        geoLocationData &&
        geoLocationData.timestamp + LOCAL_STORAGE_LOCATION_EXPIRY_IN_MS >
          new Date().getTime()
      ) {
        toast.warning(
          "Failed to get your location. Using last known location.",
        );
        success(geoLocationData.geoCode);
      } else {
        toast.error("Failed to get your location. Please try again later.");
        error?.(e);
      }
    },
    options
      ? options
      : {
          timeout: GEOLOCATION_TIMEOUT_IN_MS,
          maximumAge: GEOLOCATION_MAX_AGE_IN_MS,
          enableHighAccuracy: true,
        },
  );
};
