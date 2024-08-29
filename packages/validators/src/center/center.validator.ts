import { z } from "zod";

import {
  CENTER_CTA_BUTTONS,
  CENTER_FEATURES,
  CENTER_STATUS,
  DAYS,
  REGEX,
} from "@petzo/constants";
import { timeUtils } from "@petzo/utils";

export const CenterAuthorization = z.object({ centerPublicId: z.string() });

export const CenterSchema = z
  .object({
    publicId: z.string().max(20).optional(),
    name: z.string().min(1, "Name is required.").max(255, "Name is too long."),
    description: z.string().optional(),
    googleRating: z.coerce.number().min(0).max(5),
    googleRatingCount: z.coerce.number().min(0),
    images: z.array(z.object({ url: z.string() })).optional(),
    operatingHours: z.record(
      z.enum(DAYS),
      z
        .object({
          startTime: z.string().optional(),
          endTime: z.string().optional(),
        })
        .nullable(),
    ),

    features: z.array(z.enum(CENTER_FEATURES)),
    ctaButtons: z.array(z.enum(CENTER_CTA_BUTTONS)),
    phoneNumber: z.string().regex(REGEX.mobileNumber, {
      message:
        "Invalid Phone Number. Please provide a valid 10 digits number eg. (9999999999)",
    }),
    startTime: z
      .string()
      .regex(
        REGEX.time24Hour,
        "Invalid time format. Use HH:MM in 24-hour format.",
      )
      .optional(),
    endTime: z
      .string()
      .regex(
        REGEX.time24Hour,
        "Invalid time format. Use HH:MM in 24-hour format.",
      )
      .optional(),
  })
  .superRefine((input, ctx) => {
    const { operatingHours } = input;

    // Check if the last slot time is after the first slot time
    Object.values(operatingHours).forEach((operatingTime) => {
      if (operatingTime && !operatingTime?.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_type,
          expected: "object",
          received: "undefined",
          message: "Start time is required when day is selected.",
          path: ["startTime"],
        });
      } else if (operatingTime && !operatingTime?.endTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_type,
          expected: "object",
          received: "undefined",
          message: "End time is required when day is selected.",
          path: ["endTime"],
        });
      } else if (
        operatingTime?.startTime &&
        operatingTime?.endTime &&
        !timeUtils.isTimeBefore(operatingTime.startTime, operatingTime.endTime)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 1,
          type: "string",
          inclusive: false,
          message: "End time should be after the start time.",
          path: ["endTime"],
        });
      }
    });
  });

export const CenterConfig = CenterAuthorization.extend({
  services: z.object({
    home_grooming: z.object({ noOfParallelServices: z.number() }).optional(),
    grooming: z.object({ noOfParallelServices: z.number() }).optional(),
    veterinary: z.object({ noOfParallelServices: z.number() }).optional(),
    boarding: z.object({ noOfParallelServices: z.number() }).optional(),
  }),
});

export const CenterStatus = CenterAuthorization.extend({
  status: z.enum(CENTER_STATUS),
});
