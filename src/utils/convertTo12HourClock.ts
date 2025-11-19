/**
 * Converts a time string from 24-hour format (HH:MM) to 12-hour AM/PM format (h:MM AM/PM).
 * * @param time24h The time string in "HH:MM" format (e.g., "13:30", "00:00").
 * @returns The time string in "h:MM AM/PM" format (e.g., "1:30 PM", "12:00 AM").
 */
export function convertTo12HourClock(time24h: string): string {
  // 1. Split the string into hours and minutes
  const parts = time24h.split(":");

  if (parts.length !== 2) {
    // Basic validation
    return time24h;
  }

  const hourStr = parts[0];
  const minuteStr = parts[1];

  const hour24 = parseInt(hourStr, 10);

  // Input validation for hours (0-23)
  if (isNaN(hour24) || hour24 < 0 || hour24 > 23) {
    return time24h;
  }

  // 2. Determine AM or PM
  const ampm = hour24 >= 12 ? "PM" : "AM";

  // 3. Convert hour from 24-hour to 12-hour format
  let hour12 = hour24 % 12;

  // Handle the special case where 00:xx (midnight) and 12:xx (noon) are converted to 12 in 12-hour clock
  hour12 = hour12 === 0 ? 12 : hour12;

  // 4. Construct the final string
  return `${hour12}:${minuteStr} ${ampm}`;
}
