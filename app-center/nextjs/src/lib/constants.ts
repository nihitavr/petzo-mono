export const DEFAULT_MAX_SERVICE_IMAGES = 20;

export const BOOKING_TYPE_TO_STATUS: Record<string, string> = {
  today: "confirmed",
  new: "booked",
  active: "ongoing",
  upcoming: "confirmed",
  completed: "completed",
  cancelled: "cancelled",
};
