import { Time } from "@internationalized/date";

export const parseStringTime = (timeString: string): Time => {
  if (!timeString) {
    return new Time(0, 0);
  }

  const [hourStr, minuteStr] = timeString.split(":");

  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (isNaN(hour) || isNaN(minute)) {
    return new Time(0, 0);
  }

  return new Time(hour, minute);
};
