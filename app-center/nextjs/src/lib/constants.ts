import { BOOKING_STATUS_CONFIG } from "@petzo/constants";

export const DEFAULT_MAX_SERVICE_IMAGES = 20;

export const BOOKING_TYPE_TO_STATUS: Record<string, string[]> = {
  today: [BOOKING_STATUS_CONFIG.confirmed.id],
  new: [BOOKING_STATUS_CONFIG.booked.id],
  active: [BOOKING_STATUS_CONFIG.ongoing.id],
  upcoming: [BOOKING_STATUS_CONFIG.confirmed.id],
  completed: [BOOKING_STATUS_CONFIG.completed.id],
  cancelled: [
    BOOKING_STATUS_CONFIG.customer_cancelled.id,
    BOOKING_STATUS_CONFIG.center_cancelled.id,
  ],
};
