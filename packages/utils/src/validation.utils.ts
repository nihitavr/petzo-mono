import { z } from "zod";

import { REGEX } from "@petzo/constants";

import { isAtLeastTomorrow } from "./time.utils";

const phoneNumberValidator = z.string().regex(REGEX.mobileNumber, {
  message:
    "Invalid Phone Number. Please provide a valid 10 digits number eg. (9999999999)",
});

export function validatePhoneNumber(
  phoneNumber?: string,
): [boolean, string | undefined] {
  try {
    phoneNumberValidator.parse(phoneNumber);
    return [true, undefined];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return [false, error.errors[0]?.message];
    }

    return [false, "Invalid Phone Number"];
  }
}

export function validateSlotAvailability(item: {
  slot: { availableSlots: number; date: string; startTime: string };
}): [boolean, string | undefined] {
  if (
    item.slot.availableSlots < 0 ||
    !isAtLeastTomorrow(item.slot.date, item.slot.startTime)
  ) {
    return [false, "Slot is not available"];
  }

  return [true, undefined];
}
