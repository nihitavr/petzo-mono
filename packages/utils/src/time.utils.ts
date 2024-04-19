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
