import { zodResolver as zr } from "@hookform/resolvers/zod";
import { z } from "zod";

export const zodResolver = zr;

export const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export * as centerValidator from "./center.validator";
export * as serviceValidator from "./service.validator";
export * as petValidator from "./pet.validator";
export * as petMedicalRecordsValidator from "./pet-medical-records.validator";

export const GetCityAreasSchema = z.object({ city: z.string() });
