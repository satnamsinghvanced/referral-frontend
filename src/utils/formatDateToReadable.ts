export const formatDateToReadable = (
  date: string | null | undefined,
  showTime: boolean = false // Added optional parameter with default value true
): string => {
  if (!date) {
    return "N/A";
  }

  try {
    const JSdate = new Date(date);

    if (isNaN(JSdate.getTime())) {
      return "Invalid Date";
    }

    const baseOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    const dateStr = new Intl.DateTimeFormat(undefined, baseOptions).format(
      JSdate
    );

    if (showTime) {
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      const timeStr = new Intl.DateTimeFormat(undefined, timeOptions).format(
        JSdate
      );
      return `${dateStr} at ${timeStr}`;
    }

    return dateStr;
  } catch (error) {
    return "Error";
  }
};
