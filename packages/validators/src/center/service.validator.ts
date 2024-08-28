import { z } from "zod";

import { DAYS, REGEX, SERVICE_TYPE_VALUES } from "@petzo/constants";
import { timeUtils } from "@petzo/utils";

import { CenterAuthorization } from "./center.validator";

export const ServicePublicId = CenterAuthorization.extend({
  servicePublicId: z.string(),
});

export const ServiceSchema = CenterAuthorization.extend({
  serviceId: z.number().optional(),
  publicId: z.string().max(20).optional(),
  name: z.string().min(1, "Name is required.").max(255, "Name is too long."),
  description: z.string().optional(),
  serviceType: z.enum(SERVICE_TYPE_VALUES, {
    errorMap: () => {
      return { message: "Service Type is required." };
    },
  }),
  config: z.object({
    operatingHours: z.record(
      z.enum(DAYS),
      z
        .object({
          startTime: z.string().optional(),
          startTimeEnd: z.string().optional(),
        })
        .nullable(),
    ),
  }),
  petTypes: z.array(z.string()).optional(),
  price: z.coerce.number().min(0),
  discountedPrice: z.coerce.number().min(0),
  isBookingEnabled: z.boolean(),

  images: z.array(z.object({ url: z.string() })).optional(),
  startTime: z
    .string()
    .regex(
      REGEX.time24Hour,
      "Invalid time format. Use HH:MM in 24-hour format.",
    )
    .optional(),
  startTimeEnd: z
    .string()
    .regex(
      REGEX.time24Hour,
      "Invalid time format. Use HH:MM in 24-hour format.",
    )
    .optional(),
  duration: z.coerce.number().min(0),
})
  .superRefine((input, ctx) => {
    const { config } = input;
    const operatingHours = config?.operatingHours;

    // Check if the last slot time is after the first slot time
    Object.values(operatingHours).forEach((operatingTime) => {
      if (
        operatingTime?.startTime &&
        operatingTime?.startTimeEnd &&
        !timeUtils.isTimeBefore(
          operatingTime.startTime,
          operatingTime.startTimeEnd,
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 1,
          type: "string",
          inclusive: false,
          message: "Last slot time should be after first slot time.",
          path: ["startTimeEnd"],
        });
      }
    });

    // Check if atleast one operating day is selected
    const hasNoOperatingDays = Object.values(operatingHours).every(
      (operatingTime) => !operatingTime,
    );

    if (input.isBookingEnabled && hasNoOperatingDays) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: "object",
        received: "undefined",
        message: "Atleast one operating day is required.",
        path: ["config"],
      });
    }
  })
  .refine((data) => data.discountedPrice <= data.price, {
    message: "This must be less or equal to the Price above",
    path: ["discountedPrice"], // This specifies which field the error is associated with
  })
  .refine((data) => (data.isBookingEnabled ? data.duration > 0 : true), {
    message: "Duration must be greater than zero when booking is enabled",
    path: ["duration"],
  })
  .refine((data) => (data.isBookingEnabled ? data.price > 0 : true), {
    message: "Price must be greater than zero when booking is enabled",
    path: ["price"],
  })
  .refine((data) => (data.isBookingEnabled ? data.discountedPrice > 0 : true), {
    message:
      "Price after discount must be greater than zero when booking is enabled",
    path: ["discountedPrice"],
  });
