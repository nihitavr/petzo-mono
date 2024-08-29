import {
  addDays,
  addMinutes,
  differenceInMinutes,
  format,
  intervalToDuration,
  isAfter,
  isBefore,
  isEqual,
  parse,
  parseISO,
  setHours,
  setMinutes,
  subMinutes,
} from "date-fns";
import { format as formatTz, toZonedTime } from "date-fns-tz";

import type { DAYS_TYPE } from "@petzo/constants";
import { SLOT_DURATION_IN_MINS } from "@petzo/constants";

import { stringUtils } from ".";

/**
 * Get all slots start times before and after the booked time within the given duration.
 *
 * @param time - The booked slot start time in 'HH:mm:ss' format.
 * @param duration - The duration in minutes to consider before and after the booked time.
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
    currentTime = addMinutes(currentTime, SLOT_DURATION_IN_MINS);
  }

  return slots;
}

export function isTimeBefore(time1?: string, time2?: string): boolean {
  if (!time1 || !time2) {
    return false;
  }

  const date1 = parse(time1, "HH:mm:ss", new Date());
  const date2 = parse(time2, "HH:mm:ss", new Date());

  return isBefore(date1, date2);
}

export function isTimeBeforeOrEqual(time1: string, time2: string): boolean {
  const date1 = parse(time1, "HH:mm:ss", new Date());
  const date2 = parse(time2, "HH:mm:ss", new Date());

  return isBefore(date1, date2) || isEqual(date1, date2);
}

export function isTimeAfter(time1: string, time2: string): boolean {
  const date1 = parse(time1, "HH:mm:ss", new Date());
  const date2 = parse(time2, "HH:mm:ss", new Date());

  return isAfter(date1, date2);
}

export function isTimeAfterOrEqual(time1: string, time2: string): boolean {
  const date1 = parse(time1, "HH:mm:ss", new Date());
  const date2 = parse(time2, "HH:mm:ss", new Date());

  return isAfter(date1, date2) || isEqual(date1, date2);
}

function sortDays(days: DAYS_TYPE[]): DAYS_TYPE[] {
  const order = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return days.sort((a, b) => {
    return order.indexOf(a) - order.indexOf(b);
  });
}

// Get string like this Mon - Wed, Fri - Sun : 09:00 AM - 05:00 PM
export function getTimings(
  operatingHours?: Record<
    DAYS_TYPE,
    { startTime: string; endTime: string } | undefined | null
  > | null,
) {
  if (!operatingHours) return "";

  const days = sortDays(Object.keys(operatingHours) as DAYS_TYPE[]);

  const dayRanges = [];
  let currentRange = { start: days[0], end: days[0] };

  for (let i = 1; i < days.length; i++) {
    const currentDay = days[i]!;
    const previousDay = days[i - 1]!;

    if (
      isTimeBefore(
        operatingHours[currentDay]?.startTime,
        operatingHours[previousDay]?.endTime,
      )
    ) {
      currentRange.end = currentDay;
    } else {
      dayRanges.push(currentRange);
      currentRange = { start: currentDay, end: currentDay };
    }
  }

  dayRanges.push(currentRange);

  const timings = dayRanges
    .filter((range) => !!operatingHours[range.start!]?.startTime)
    .map((range) => {
      const startTime = convertTime24To12(
        operatingHours[range.start!]?.startTime,
      );
      const endTime = convertTime24To12(operatingHours[range.end!]?.endTime);

      return `${stringUtils.titleCase(range.start)} - ${stringUtils.titleCase(range.end)} | ${startTime} - ${endTime}`;
    });

  return timings.join(", ");
}

export function convertTime24To12(time24?: string): string {
  if (!time24) return "";

  const [hours, minutes] = time24.split(":").map(Number);

  if (hours == undefined || minutes == undefined) return "";

  const suffix = hours >= 12 ? "PM" : "AM";

  // Hours are from 1-12. So if we get 0, we should convert it to 12.
  const hours12 = hours % 12 || 12;

  const hours12Str = hours12.toString().padStart(2, "0");
  const minutesStr = minutes.toString().padStart(2, "0");

  return `${hours12Str}:${minutesStr} ${suffix}`;
}

export const generateTimesForDayHHMM = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      times.push(
        `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`,
      );
    }
  }
  return times;
};

export function getNextNDaysString(
  n: number,
  timeZone = "Asia/Kolkata",
): string[] {
  const dates = [];

  // IST offset in minutes (5 hours 30 minutes) + 0 hrs offset before booking for tomorrow.
  // So basically only before 8PM IST, we should be able to book for tomorrow.
  const offsetInMinutes = 0;

  const today = new Date();
  let istDate = toZonedTime(today, timeZone);

  istDate = addMinutes(istDate, offsetInMinutes);

  for (let i = 0; i < n + 1; i++) {
    const date = addDays(istDate, i);

    const formattedDate = formatTz(date, "yyyy-MM-dd", {
      timeZone: timeZone,
    });

    dates.push(formattedDate);
  }

  return dates;
}

export function getDateString(timeZone = "Asia/Kolkata", date?: Date): string {
  return formatTz(toZonedTime(date ?? new Date(), timeZone), "yyyy-MM-dd", {
    timeZone: timeZone,
  });
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

export function convertMinutesToHoursAndMinutes(totalMinutes: number) {
  const duration = intervalToDuration({
    start: 0,
    end: totalMinutes * 60 * 1000,
  });

  let durationStr = "";

  if (duration.hours == 1) {
    durationStr += `${duration.hours} hr `;
  } else if (duration.hours && duration.hours > 1) {
    durationStr += `${duration.hours} hrs `;
  }

  if (duration.minutes == 1) {
    durationStr += `${duration.minutes} min`;
  } else if (duration.minutes && duration.minutes > 1) {
    durationStr += `${duration.minutes} mins`;
  }

  return durationStr;
}

/* 

 */
export function getDayFromDate(dateString: string, dayFormat = "EEE") {
  const date = new Date(dateString);
  const dayName = format(date, dayFormat);
  return dayName.toLowerCase();
}
