import { CalendarDate } from "@internationalized/date";

export const formatCalendarDate = (dateObj: any): string => {
  if (dateObj?.calendar?.identifier) {
    const date = new CalendarDate(dateObj.year, dateObj.month, dateObj.day);
    return date.toString(); // "YYYY-MM-DD"
  }
  return "";
};
