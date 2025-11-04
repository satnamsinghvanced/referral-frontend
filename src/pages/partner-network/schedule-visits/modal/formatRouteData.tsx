import { MapboxRoute } from "../../../../types/mapbox";
import { Partner } from "../../../../types/partner";

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.ceil((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
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

// Helper function to format the time and include a day offset if necessary
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

export const formatRouteData = (
  routeDate: string,
  startTime: string,
  mapboxRoute: MapboxRoute,
  selectedReferrers: Partner[],
  visitDurationString: string
) => {
  const visitDurationSeconds = parseVisitDurationToSeconds(visitDurationString);

  const startDateTime = new Date(routeDate + "T" + startTime);
  let currentTimeSeconds = startDateTime.getTime() / 1000;

  let totalTravelTimeSeconds = 0;
  let totalStops = selectedReferrers.length;

  const routeDetails = selectedReferrers.map((referrer, index) => {
    const travelToStopSeconds =
      index === 0 ? 0 : mapboxRoute.legs[index - 1].duration;
    const travelToStopDistance =
      index === 0 ? 0 : mapboxRoute.legs[index - 1].distance;

    totalTravelTimeSeconds += travelToStopSeconds;

    currentTimeSeconds += travelToStopSeconds;
    const arrivalTime = new Date(currentTimeSeconds * 1000);

    currentTimeSeconds += visitDurationSeconds;
    const departureTime = new Date(currentTimeSeconds * 1000);

    // Calculate time strings with day offset indicator
    const { timeString: arrivalTimeString, dayOffset: arrivalDayOffset } =
      formatTimeWithDayOffset(arrivalTime, startDateTime);
    const { timeString: departureTimeString, dayOffset: departureDayOffset } =
      formatTimeWithDayOffset(departureTime, startDateTime);

    const arrivalIndicator =
      arrivalDayOffset > 0 ? ` (+${arrivalDayOffset}d)` : "";
    const departureIndicator =
      departureDayOffset > 0 ? ` (+${departureDayOffset}d)` : "";

    return {
      id: referrer._id,
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

  return {
    routeDetails: routeDetails,
    totalStops: totalStops,
    estimatedTotalTime: formatDuration(estimatedTotalTimeSeconds),
    estimatedDistance: formatDistance(mapboxRoute.distance),
    mileageCost: `$${(mapboxRoute.distance * 0.000621371 * 0.67).toFixed(2)}`,
  };
};

formatRouteData.formatDuration = formatDuration;
formatRouteData.formatDistance = formatDistance;