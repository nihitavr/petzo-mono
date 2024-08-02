import { zodResolver as zr } from "@hookform/resolvers/zod";

import * as centerAppBookingValidator from "./center/booking.validator";
import * as centerAppCenterValidator from "./center/center.validator";
import * as centerAppServiceValidator from "./center/service.validator";
import * as earlyAccessUsersValidator from "./early-access-users.validator";

export const zodResolver = zr;

export * as centerValidator from "./center.validator";
export * as serviceValidator from "./service.validator";
export * as petValidator from "./pet.validator";
export * as petMedicalRecordsValidator from "./pet-medical-records.validator";
export * as reviewValidator from "./review.validator";
export * as mapValidator from "./map.validator";
export * as geographyValidator from "./geography.validator";
export * as customerAddressValidator from "./customer-address.validator";
export * as bookingValidator from "./booking.validator";
export * as Validator from "./booking.validator";

export const centerApp = {
  center: centerAppCenterValidator,
  booking: centerAppBookingValidator,
  service: centerAppServiceValidator,
};

export const customerApp = {
  earlyAccessUsers: earlyAccessUsersValidator,
};
