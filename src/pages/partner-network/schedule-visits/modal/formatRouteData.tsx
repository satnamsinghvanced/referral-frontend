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
  if (durationString.includes("hour")) {
    const hours = parseFloat(durationString.split(" ")[0] as string);
    return hours * 3600;
  }
  if (durationString.includes("minute")) {
    const minutes = parseFloat(durationString.split(" ")[0] as string);
    return minutes * 60;
  }
  return 3600;
};

export const formatRouteData = (
  formik: any,
  mapboxRoute: MapboxRoute,
  selectedReferrers: Partner[],
  visitDurationString: string
) => {
  const visitDurationSeconds = parseVisitDurationToSeconds(visitDurationString);
  let currentTimeSeconds =
    new Date(
      formik.values.routeDate + "T" + formik.values.startTime
    ).getTime() / 1000;

  let totalTravelTimeSeconds = 0;
  let totalStops = selectedReferrers.length;

  const routeDetails = selectedReferrers.map((referrer, index) => {
    // Leg duration for travel TO this stop is at index-1
    const travelToStopSeconds =
      index === 0 ? 0 : mapboxRoute.legs[index - 1].duration;
    const travelToStopDistance =
      index === 0 ? 0 : mapboxRoute.legs[index - 1].distance;

    totalTravelTimeSeconds += travelToStopSeconds;

    currentTimeSeconds += travelToStopSeconds;
    const arrivalTime = new Date(currentTimeSeconds * 1000);

    currentTimeSeconds += visitDurationSeconds;
    const departureTime = new Date(currentTimeSeconds * 1000);

    return {
      id: referrer._id,
      name: referrer.name,
      address: referrer.address,
      isFirstStop: index === 0,

      arrivalTime: arrivalTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      departureTime: departureTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),

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