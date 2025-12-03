import { CalendarDateTime } from "@internationalized/date";

export function keepUTCWallClock(isoString: string) {
  if (!isoString) return null;

  const d = new Date(isoString);

  return new CalendarDateTime(
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds(),
    d.getUTCMilliseconds()
  );
}
