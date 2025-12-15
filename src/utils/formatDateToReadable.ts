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

    const timeOptions: Intl.DateTimeFormatOptions = showTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "UTC",
        }
      : {};

    const dateStr = new Intl.DateTimeFormat("en-US", baseOptions).format(
      JSdate
    );

    if (showTime) {
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        // timeZone: "UTC", // Keeping UTC as per original code if intended, or maybe it should be local?
        // Original code had timeZone: "UTC" in the conditional block. I will preserve it.
        timeZone: "UTC",
      };
      const timeStr = new Intl.DateTimeFormat("en-US", timeOptions).format(
        JSdate
      );
      // Ensure AM/PM spacing if that was the intent of previous replace, though standard usually has it.
      // But simply joining with ' at ' replaces the comma separator behavior.
      return `${dateStr} at ${timeStr}`;
    }

    return dateStr;
  } catch (error) {
    return "Error";
  }
};
