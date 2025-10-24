export const formatDateToReadable = (date: string | null | undefined): string => {
  if (!date) {
    return "N/A";
  }

  try {
    const JSdate = new Date(date);

    if (isNaN(JSdate.getTime())) {
      return "Invalid Date";
    }

    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });

    let formattedDate = formatter.format(JSdate);

    formattedDate = formattedDate.replace("AM", " AM").replace("PM", " PM");

    return formattedDate;
  } catch (error) {
    return "Error";
  }
};
