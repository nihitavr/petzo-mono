import { zodResolver as zr } from "@hookform/resolvers/zod";

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
