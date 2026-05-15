export function convertTo12HourClock(time24h: string): string {
  const parts = time24h.split(":");
  if (parts.length !== 2) {
    return time24h;
  }
  const hourStr: any = parts[0];
  const minuteStr = parts[1];
  const hour24 = parseInt(hourStr, 10);
  if (isNaN(hour24) || hour24 < 0 || hour24 > 23) {
    return time24h;
  }
  const ampm = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  hour12 = hour12 === 0 ? 12 : hour12;
  return `${hour12}:${minuteStr} ${ampm}`;
}