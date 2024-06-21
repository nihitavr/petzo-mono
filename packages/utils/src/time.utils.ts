import {
  addMinutes,
  differenceInMinutes,
  format,
  isAfter,
  isBefore,
  parse,
  parseISO,
  setHours,
  setMinutes,
  subMinutes,
} from "date-fns";

/**
 * Get all slots start times before and after the booked time within the given duration.
 *
 * @param time - The booked slot start time in 'HH:mm:ss' format.
 * @param duration - The duration of the service in minutes.
 * @returns - An array of slot start times within the duration before and after the booked time.
 */
export function getSurroundingTime(time: string, duration: number): string[] {
  // Parse the bookedTime into a Date object

  const startTimeHours = parseInt(time.split(":")[0]!);
  const startTimeMinutes = parseInt(time.split(":")[1]!);

  const baseDate = setMinutes(
    setHours(new Date("1970-01-01"), startTimeHours),
    startTimeMinutes,
  );

  // Calculate the start and end time considering the duration
  const startTime = subMinutes(baseDate, duration);
  const endTime = addMinutes(baseDate, duration);

  // Generate the slots between startTime and endTime at 30-minute intervals
  const slots: string[] = [];
  let currentTime = startTime;

  while (currentTime <= endTime) {
    slots.push(format(currentTime, "HH:mm:ss"));
    currentTime = addMinutes(currentTime, 30);
  }

  return slots;
}

export function convertTime24To12(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);

  if (hours == undefined || minutes == undefined) {
    return "";
  }

  const suffix = hours >= 12 ? "PM" : "AM";

  // Hours are from 1-12. So if we get 0, we should convert it to 12.
  const hours12 = hours % 12 || 12;

  const hours12Str = hours12.toString().padStart(2, "0");
  const minutesStr = minutes.toString().padStart(2, "0");

  return `${hours12Str}:${minutesStr} ${suffix}`;
}

export function getNextNDays(n: number): Date[] {
  const dates = [];
  for (let i = 0; i < n; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
}

export function getNextNDaysString(n: number): string[] {
  const dates = [];

  for (let i = 0; i < n; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    dates.push(`${year}-${month}-${day}`);
  }

  return dates;
}

export function getNthDate(n: number, type?: "start" | "end"): Date {
  const date = new Date();

  if (type === "start") {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
  } else if (type === "end") {
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMilliseconds(999);
  }

  return date;
}

export function isMorning(timeString: string) {
  const time = parse(timeString, "HH:mm:ss", new Date());

  const twelvePM = new Date();
  twelvePM.setHours(12, 0, 0, 0);

  return isBefore(time, twelvePM);
}

export function isEvening(timeString: string) {
  const time = parse(timeString, "HH:mm:ss", new Date());

  const fourPM = new Date();
  fourPM.setHours(16, 0, 0, 0);

  return isAfter(time, fourPM);
}

export function isAfternoon(timeString: string) {
  return !isMorning(timeString) && !isEvening(timeString);
}

/**
 * Checks if a given timestamp is more than N minutes ago.
 *
 * @param {string} timestamp - The timestamp to check, in ISO 8601 format.
 * @returns {boolean} - Returns true if the timestamp is more than N minutes ago, false otherwise.
 */
export const isMoreThanNMinutesAgo = (
  timestamp: string,
  differenceInMins = 60,
) => {
  // Get the current date and time
  const now = new Date();

  // Parse the given timestamp into a Date object
  const time = parseISO(timestamp);

  // Calculate the difference in minutes between now and the parsed timestamp
  const minutesDifference = differenceInMinutes(now, time);

  // Return true if the difference is greater than 15 minutes, otherwise false
  return minutesDifference > differenceInMins;
};
