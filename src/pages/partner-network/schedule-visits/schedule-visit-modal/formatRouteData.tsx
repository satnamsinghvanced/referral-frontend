import { MapboxRoute } from "../../../../types/mapbox";
import { Partner } from "../../../../types/partner";

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const remainingSecondsAfterHours = seconds % 3600;
  const minutes = Math.floor(remainingSecondsAfterHours / 60);
  const remainingSeconds = Math.round(remainingSecondsAfterHours % 60);

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  if (hours === 0 && minutes === 0) {
    parts.push(`${remainingSeconds}s`);
  } else if (remainingSeconds > 0) {
    parts.push(`${remainingSeconds}s`);
  }

  if (parts.length === 0) {
    return "0s";
  }

  return parts.join(" ");
};

export const formatDistance = (meters: number): string => {
  const miles = meters * 0.000621371;
  return `${miles.toFixed(1)}mi`;
};

const parseVisitDurationToSeconds = (durationString: string): number => {
  if (durationString.includes("hour") || durationString.includes("hours")) {
    const hours = parseFloat(durationString.split(" ")[0] as string);
    return hours * 3600;
  }
  if (durationString.includes("minute") || durationString.includes("minutes")) {
    const minutes = parseFloat(durationString.split(" ")[0] as string);
    return minutes * 60;
  }
  return 3600;
};

const formatTimeWithDayOffset = (
  time: Date,
  startDate: Date
): { timeString: string; dayOffset: number } => {
  const dayOffset = Math.floor(
    (time.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const timeString = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { timeString, dayOffset };
};

const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const hoursMatch = timeStr.match(/(\d+)\s*h/);
  const minutesMatch = timeStr.match(/(\d+)\s*m/);
  const hours = hoursMatch ? parseInt(hoursMatch[1] as string) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1] as string) : 0;
  return hours * 60 + minutes;
};

const convertTimeToDaysHoursMinutes = (timeStr: string): string => {
  const totalMinutes = parseTimeToMinutes(timeStr);
  if (totalMinutes === 0) return "0d 0h 0m";
  const MINUTES_IN_A_DAY = 24 * 60;
  const days = Math.floor(totalMinutes / MINUTES_IN_A_DAY);
  const remainingMinutesAfterDays = totalMinutes % MINUTES_IN_A_DAY;
  const hours = Math.floor(remainingMinutesAfterDays / 60);
  const minutes = remainingMinutesAfterDays % 60;
  let result = [];
  result.push(`${days}d`);
  result.push(`${hours}h`);
  result.push(`${minutes}m`);
  return result.join(" ");
};

export const formatRouteData = (
  routeDate: string,
  startTime: string,
  mapboxRoute: MapboxRoute,
  selectedReferrers: Partner[],
  visitDurationString: string
) => {
  const visitDurationSeconds = parseVisitDurationToSeconds(visitDurationString);
  const startDateTime = new Date(routeDate.split("T")[0] + "T" + startTime);
  let currentTimeSeconds = startDateTime.getTime() / 1000;
  let totalTravelTimeSeconds = 0;
  let totalStops = selectedReferrers.length;

  const routeDetails = selectedReferrers.map((referrer, index) => {
    const travelToStopSeconds =
      index === 0 ? 0 : mapboxRoute?.legs[index - 1]?.duration || 0;
    const travelToStopDistance =
      index === 0 ? 0 : mapboxRoute?.legs[index - 1]?.distance || 0;

    totalTravelTimeSeconds += travelToStopSeconds;

    currentTimeSeconds += travelToStopSeconds;
    const arrivalTime = new Date(currentTimeSeconds * 1000);

    currentTimeSeconds += visitDurationSeconds;
    const departureTime = new Date(currentTimeSeconds * 1000);

    const { timeString: arrivalTimeString, dayOffset: arrivalDayOffset } =
      formatTimeWithDayOffset(arrivalTime, startDateTime);
    const { timeString: departureTimeString, dayOffset: departureDayOffset } =
      formatTimeWithDayOffset(departureTime, startDateTime);

    const arrivalIndicator =
      arrivalDayOffset > 0 ? ` (+${arrivalDayOffset}d)` : "";
    const departureIndicator =
      departureDayOffset > 0 ? ` (+${departureDayOffset}d)` : "";

    return {
      name: referrer.name,
      address: referrer.address,
      isFirstStop: index === 0,
      arrivalTime: arrivalTimeString + arrivalIndicator,
      departureTime: departureTimeString + departureIndicator,
      travelTime: formatDuration(travelToStopSeconds),
      travelDistance: formatDistance(travelToStopDistance),
    };
  });

  const estimatedTotalTimeSeconds =
    totalTravelTimeSeconds + totalStops * visitDurationSeconds;

  const convertedTotalTime = convertTimeToDaysHoursMinutes(
    formatDuration(estimatedTotalTimeSeconds)
  );

  return {
    routeDetails: routeDetails,
    totalStops: totalStops,
    estimatedTotalTime: formatDuration(estimatedTotalTimeSeconds),
    estimatedDistance: formatDistance(mapboxRoute.distance),
    mileageCost: `$${(mapboxRoute.distance * 0.000621371 * 0.67).toFixed(2)}`,
    visitDays: convertedTotalTime,
  };
};

formatRouteData.formatDuration = formatDuration;
formatRouteData.formatDistance = formatDistance;
