import { z } from "zod";

import { BOOKING_STATUS } from "@petzo/constants";

import { CenterAuthorization } from "./center.validator";

export const GetBookings = CenterAuthorization.extend({
  status: z.array(z.enum(BOOKING_STATUS)).optional(),
  date: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
});

export const AcceptBooking = CenterAuthorization.extend({
  bookingId: z.number(),
});

export const AcceptBookingItem = CenterAuthorization.extend({
  bookingId: z.number(),
  bookingItemId: z.number(),
});
