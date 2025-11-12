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

    const options: Intl.DateTimeFormatOptions = {
      ...baseOptions,
      ...timeOptions,
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);

    let formattedDate = formatter.format(JSdate);

    if (showTime) {
      formattedDate = formattedDate.replace("AM", " AM").replace("PM", " PM");
    }

    return formattedDate;
  } catch (error) {
    return "Error";
  }
};
