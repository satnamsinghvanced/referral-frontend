import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  Select,
  SelectItem,
  TimeInput,
} from "@heroui/react";
import {
  getLocalTimeZone,
  now,
  parseDate,
  Time,
  today,
} from "@internationalized/date";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BiCar } from "react-icons/bi";
import { FiChevronRight, FiClock, FiDownload, FiMapPin } from "react-icons/fi";
import { LuRoute } from "react-icons/lu";
import { RiErrorWarningLine } from "react-icons/ri";
import { PER_VISIT_DURATION_OPTIONS } from "../../../../consts/practice";
import { useDirectionsMutation } from "../../../../hooks/useDirections";
import { MapboxRoute } from "../../../../types/mapbox";
import { Partner, RouteOptimizationResults } from "../../../../types/partner";
import { formatCalendarDate } from "../../../../utils/formatCalendarDate";
import { formatRouteData } from "./formatRouteData";
import { parseStringTime } from "../../../../utils/parseStringTime";
import { downloadJson } from "../../../../utils/jsonDownloader";

interface RoutePlanningTabProps {
  planState: any;
  onStateChange: any;
  errors: any;
  selectedReferrerObjects: Partner[];
  routeOptimizationResults: RouteOptimizationResults | null;
  setRouteOptimizationResults: React.Dispatch<
    React.SetStateAction<RouteOptimizationResults | null>
  >;
}

const haversineDistance = (
  [lng1, lat1]: number[],
  [lng2, lat2]: number[]
): number => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const getOptimizedCoordinates = (
  initialCoords: number[][]
): { optimizedOrder: number[][]; orderMap: number[] } => {
  if (initialCoords.length < 2) {
    return {
      optimizedOrder: initialCoords,
      orderMap: initialCoords.map((_, i) => i),
    };
  }

  const startPoint = initialCoords[0];
  const stopsWithOriginalIndex = initialCoords
    .slice(1)
    .map((coord, index) => ({ coord, originalIndex: index + 1 }));

  const optimizedOrder: number[][] = [startPoint];
  const optimizedOrderMap: number[] = [0];
  let currentPoint = startPoint;

  let remainingStops = [...stopsWithOriginalIndex];

  while (remainingStops.length > 0) {
    let nearestIndexInRemaining = -1;
    let minDistance = Infinity;

    for (let i = 0; i < remainingStops.length; i++) {
      const distance = haversineDistance(currentPoint, remainingStops[i].coord);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndexInRemaining = i;
      }
    }

    if (nearestIndexInRemaining !== -1) {
      const nearestStop = remainingStops[nearestIndexInRemaining];
      currentPoint = nearestStop.coord;
      optimizedOrder.push(currentPoint);
      optimizedOrderMap.push(nearestStop.originalIndex);
      remainingStops.splice(nearestIndexInRemaining, 1);
    } else {
      break;
    }
  }

  return { optimizedOrder, orderMap: optimizedOrderMap };
};

export const RoutePlanningTab: React.FC<RoutePlanningTabProps> = ({
  planState,
  onStateChange,
  errors,
  selectedReferrerObjects,
  routeOptimizationResults,
  setRouteOptimizationResults,
}) => {
  const [coordinateString, setCoordinateString] = useState<string>("");
  const [initialCoordinates, setInitialCoordinates] = useState<number[][]>([]);
  const [isTimeInPastError, setIsTimeInPastError] = useState(false);

  const [userStartLocation, setUserStartLocation] = useState<number[] | null>(
    null
  );

  const localTimeZone = getLocalTimeZone();
  const todayDateString = today(localTimeZone).toString();

  const currentZonedDateTime = useMemo(
    () => now(localTimeZone),
    [localTimeZone]
  );

  const currentTimeObject = new Time(
    currentZonedDateTime.hour,
    currentZonedDateTime.minute
  );

  const isToday = planState.routeDate?.split("T")[0] === todayDateString;

  const { summary, routeDetailsList } = useMemo(() => {
    if (!routeOptimizationResults) {
      return { summary: {}, routeDetailsList: [] };
    }

    const activeRoute = planState.enableAutoRoute
      ? routeOptimizationResults?.optimized
      : routeOptimizationResults?.original;

    return {
      summary: activeRoute,
      routeDetailsList: activeRoute.routeDetails || [],
    };
  }, [routeOptimizationResults, planState.enableAutoRoute]);

  useEffect(() => {
    if (planState.routeDate && planState.startTime) {
      if (isToday) {
        const selectedTimeObject = parseStringTime(planState.startTime);

        const selectedTimeInMinutes =
          selectedTimeObject.hour * 60 + selectedTimeObject.minute;
        const currentTimeInMinutes =
          currentTimeObject.hour * 60 + currentTimeObject.minute;

        if (selectedTimeInMinutes < currentTimeInMinutes) {
          setIsTimeInPastError(true);
        } else {
          setIsTimeInPastError(false);
        }
      } else {
        setIsTimeInPastError(false);
      }
    }
  }, [planState.routeDate, planState.startTime, isToday, currentTimeObject]);

  useEffect(() => {
    if (!selectedReferrerObjects || selectedReferrerObjects.length === 0) {
      setCoordinateString("");
      setInitialCoordinates([]);
      return;
    }

    const initialCoords: number[][] = selectedReferrerObjects.map(
      (referrer: Partner) => {
        const { lat, long } = referrer?.address?.coordinates;
        return [long, lat];
      }
    );

    setInitialCoordinates(initialCoords);
    const coordinateStrings = initialCoords.map((c) => c.join(","));
    setCoordinateString(coordinateStrings.join(";"));
  }, [selectedReferrerObjects]);

  const { mutate: generateRouteMutate, isPending } = useDirectionsMutation();

  const optimizedOrderObjects = useCallback(
    (referrers: Partner[], orderMap: number[]): Partner[] => {
      return orderMap.map((index) => referrers[index]);
    },
    []
  );

  const handleGenerateRoute = () => {
    if (selectedReferrerObjects.length < 1) {
      addToast({
        title: "Error",
        description: "Please select at least one referrer to continue.",
        color: "danger",
      });
      return;
    }

    if (isTimeInPastError) {
      addToast({
        title: "Validation Error",
        description: "The selected start time is in the past.",
        color: "danger",
      });
      return;
    }

    if (!planState.durationPerVisit) {
      addToast({
        title: "Validation Error",
        description: "Please select a duration per visit.",
        color: "danger",
      });
      return;
    }

    // --- SINGLE REFERRER LOGIC ---
    if (selectedReferrerObjects.length === 1) {
      const visitDurationSeconds = parseFloat(planState.durationPerVisit) * 60;

      const fallbackToStaticDestination = () => {
        setUserStartLocation(null);

        const originalRouteMetrics: any = formatRouteData(
          planState.routeDate,
          planState.startTime,
          { distance: 0, duration: 0 } as MapboxRoute,
          selectedReferrerObjects,
          planState?.durationPerVisit
        );

        // The only time spent is the visit duration. Travel time/distance is 0.
        const formattedResult = {
          ...originalRouteMetrics,
          travelTime: "0 min",
          travelDistance: "0 km",
          // FIX: Ensure estimatedTotalTime is the visit duration when no travel is calculated.
          estimatedTotalTime:
            formatRouteData.formatDuration(visitDurationSeconds),
          estimatedDistance: "0 km",
          mileageCost:
            routeOptimizationResults?.original?.mileageCost || "0.00",
        };

        setRouteOptimizationResults({
          original: formattedResult,
          optimized: formattedResult,
        });
      };

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserStartLocation([
              position.coords.longitude,
              position.coords.latitude,
            ]);

            const userCoords = `${position.coords.longitude},${position.coords.latitude}`;
            const referrer = selectedReferrerObjects[0];
            const destinationCoords = `${referrer.address.coordinates.long},${referrer.address.coordinates.lat}`;

            const singleStopCoordString = `${userCoords};${destinationCoords}`;

            generateRouteMutate(singleStopCoordString, {
              onSuccess: (data) => {
                const route = data?.routes?.[0];
                if (!route) {
                  addToast({
                    title: "Error",
                    description: "Could not generate route.",
                    color: "danger",
                  });
                  return;
                }

                const routeMetrics: any = formatRouteData(
                  planState.routeDate,
                  planState.startTime,
                  route as MapboxRoute,
                  selectedReferrerObjects,
                  planState?.durationPerVisit
                );

                // Calculate totals for the single stop with travel time
                const totalTravelDurationSeconds = route?.duration || 0;
                const totalTravelDistanceMeters = route?.distance || 0;
                const totalDuration =
                  totalTravelDurationSeconds + visitDurationSeconds;

                // FIX: Ensure estimatedTotalTime is the sum of travel time and visit time.
                const formattedResult = {
                  ...routeMetrics,
                  // These are the *travel-only* metrics for the top cards
                  travelTime: formatRouteData.formatDuration(
                    totalTravelDurationSeconds
                  ),
                  travelDistance: formatRouteData.formatDistance(
                    totalTravelDistanceMeters
                  ),
                  // These are the *total* metrics for the bottom summary
                  estimatedTotalTime:
                    formatRouteData.formatDuration(totalDuration),
                  estimatedDistance: formatRouteData.formatDistance(
                    totalTravelDistanceMeters
                  ),
                };

                setRouteOptimizationResults({
                  original: formattedResult,
                  optimized: formattedResult,
                });
              },
              onError: (e) => {
                addToast({
                  title: "API Error",
                  description: `Error calculating route from your location: ${e.message}`,
                  color: "danger",
                });
              },
            });
          },
          (error) => {
            console.warn("Geolocation denied or error:", error);
            fallbackToStaticDestination();

            if (error.code === error.PERMISSION_DENIED) {
              addToast({
                title: "Location Access Denied",
                description: "Showing destination only.",
                color: "warning",
              });
            }
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 15000,
          }
        );
      } else {
        fallbackToStaticDestination();
      }
      return;
    }

    // --- MULTI REFERRER LOGIC (>1 stops) --- (Unchanged)
    setUserStartLocation(null);

    let originalCoordString = coordinateString;
    let optimizedCoordString = coordinateString;
    let optimizedOrderMap: number[] | null = null;
    let hasCustomOptimization = false;

    if (initialCoordinates.length > 2) {
      const { optimizedOrder, orderMap } =
        getOptimizedCoordinates(initialCoordinates);

      optimizedCoordString = optimizedOrder.map((c) => c.join(",")).join(";");
      optimizedOrderMap = orderMap;
      hasCustomOptimization = true;
    }

    generateRouteMutate(originalCoordString, {
      onSuccess: (originalData) => {
        const originalRoute = originalData?.routes?.[0];

        if (!originalRoute) {
          addToast({
            title: "Error",
            description: "Could not generate original route.",
            color: "danger",
          });
          return;
        }

        const originalRouteMetrics: any = formatRouteData(
          planState.routeDate,
          planState.startTime,
          originalRoute as MapboxRoute,
          selectedReferrerObjects,
          planState?.durationPerVisit
        );

        generateRouteMutate(optimizedCoordString, {
          onSuccess: (optimizedData) => {
            let optimizedRoute = optimizedData?.routes?.[0];

            if (!optimizedRoute) {
              addToast({
                title: "Error",
                description: "Could not generate optimized route.",
                color: "danger",
              });
              return;
            }

            optimizedRoute = optimizedData.routes.reduce(
              (best: MapboxRoute, current: MapboxRoute) =>
                current.duration < best.duration ? current : best,
              optimizedRoute as MapboxRoute
            );

            const optimizedReferrerOrder =
              hasCustomOptimization && optimizedOrderMap
                ? optimizedOrderObjects(
                    selectedReferrerObjects,
                    optimizedOrderMap
                  )
                : selectedReferrerObjects;

            const optimizedRouteMetrics: any = formatRouteData(
              planState.routeDate,
              planState.startTime,
              optimizedRoute as MapboxRoute,
              optimizedReferrerOrder,
              planState?.durationPerVisit
            );

            const finalResults: RouteOptimizationResults = {
              original: {
                ...originalRouteMetrics,
                travelTime: formatRouteData.formatDuration(
                  originalRoute?.duration || 0
                ),
                travelDistance: formatRouteData.formatDistance(
                  originalRoute?.distance || 0
                ),
              },
              optimized: {
                ...optimizedRouteMetrics,
                travelTime: formatRouteData.formatDuration(
                  optimizedRoute?.duration || 0
                ),
                travelDistance: formatRouteData.formatDistance(
                  optimizedRoute?.distance || 0
                ),
              },
            };

            setRouteOptimizationResults(finalResults);
          },
          onError: (e) => {
            addToast({
              title: "API Error",
              description: `Error fetching optimized route: ${e.message}`,
              color: "danger",
            });
          },
        });
      },
      onError: (e) => {
        addToast({
          title: "API Error",
          description: `Error fetching original route: ${e.message}`,
          color: "danger",
        });
      },
    });
  };

  const handleOpenInMaps = () => {
    if (routeDetailsList.length === 0) {
      addToast({
        title: "Error",
        description: "No route details available to open in maps.",
        color: "danger",
      });
      return;
    }

    let activeCoordinateString = routeDetailsList
      .map(
        (stop: any) =>
          `${stop.address.coordinates.long},${stop.address.coordinates.lat}`
      )
      .join(";");

    // Extract names from routeDetailsList, replacing semicolons for safe URL encoding
    const referrerNames = routeDetailsList
      .map((stop: any) => stop.name.replace(/;/g, ",")) // Replace ';' with ',' or another safe character
      .join(";");

    if (selectedReferrerObjects.length === 1 && userStartLocation) {
      const userCoordsStr = `${userStartLocation[0]},${userStartLocation[1]}`;
      activeCoordinateString = `${userCoordsStr};${activeCoordinateString}`;
    }

    const baseUrl = `${import.meta.env.VITE_URL_PREFIX}/visit-map`;

    // Updated URL to include referrerNames
    const url = `${baseUrl}?coordinates=${encodeURIComponent(
      activeCoordinateString
    )}&optimized=${planState.enableAutoRoute}`;

    window.open(url, "_blank");
  };

  const exportRoute = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      reportTitle: `${routeType.toLowerCase()}_route`,
      details: routeDetailsList,
    };

    downloadJson(exportData, `${routeType.toLowerCase()}_route`);
  };

  const routeType = planState.enableAutoRoute ? "Optimized" : "Original";

  if (selectedReferrerObjects.length <= 0) {
    return (
      <div className="flex justify-center items-center w-full">
        <Card className="w-full shadow-none border border-yellow-200 bg-yellow-50 text-center">
          <CardBody className="p-6 space-y-2 text-center">
            <RiErrorWarningLine className="size-10 text-yellow-600 mx-auto mb-2.5" />
            <p className="font-medium text-sm text-yellow-900">
              No Practices Selected
            </p>
            <p className="text-xs text-yellow-700">
              Please select at least one practice from the "Select Referrers"
              tab to optimize your route.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-auto">
      <Card className="shadow-none border border-primary/15">
        <CardHeader className="pt-5 px-5 pb-1">
          <h4 className="text-sm font-medium">Route Configuration</h4>
        </CardHeader>
        <CardBody className="px-5 pb-5">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <DatePicker
                  name="routeDate"
                  label="Route Date"
                  labelPlacement="outside"
                  size="sm"
                  radius="sm"
                  minValue={today(localTimeZone)}
                  hideTimeZone
                  granularity="day"
                  value={
                    planState?.routeDate
                      ? parseDate(planState.routeDate.split("T")[0])
                      : today(localTimeZone)
                  }
                  onChange={(value) => {
                    onStateChange("routeDate", formatCalendarDate(value));
                  }}
                  errorMessage={errors.routeDate}
                  isInvalid={!!errors.routeDate}
                  classNames={{
                    inputWrapper:
                      "border border-primary/15 bg-background shadow-none min-w-[150px]",
                  }}
                />
              </div>
              <div>
                <TimeInput
                  name="startTime"
                  label="Start Time"
                  labelPlacement="outside"
                  size="sm"
                  radius="sm"
                  value={
                    planState.startTime
                      ? parseStringTime(planState.startTime)
                      : new Time(9, 0)
                  }
                  onChange={(timeValue) => {
                    const timeString = `${String(timeValue?.hour).padStart(
                      2,
                      "0"
                    )}:${String(timeValue?.minute).padStart(2, "0")}`;
                    onStateChange("startTime", timeString);
                  }}
                  errorMessage={
                    isTimeInPastError
                      ? "Cannot be in the past."
                      : errors.startTime
                  }
                  isInvalid={isTimeInPastError || !!errors.startTime}
                  className="w-[140px]"
                  classNames={{
                    base: "!pb-0",
                    inputWrapper:
                      "border border-primary/15 bg-background px-2 py-1 shadow-none",
                    helperWrapper: "pl-0 pt-0.5",
                  }}
                />
              </div>
              <div>
                <Select
                  name="durationPerVisit"
                  label="Duration per visit"
                  labelPlacement="outside"
                  placeholder="Select duration"
                  size="sm"
                  radius="sm"
                  selectedKeys={
                    planState.durationPerVisit
                      ? [planState.durationPerVisit]
                      : PER_VISIT_DURATION_OPTIONS.length > 0
                      ? [PER_VISIT_DURATION_OPTIONS[0]]
                      : []
                  }
                  onSelectionChange={(keys: any) =>
                    onStateChange("durationPerVisit", Array.from(keys).join(""))
                  }
                  errorMessage={errors.durationPerVisit}
                  isInvalid={!!errors.durationPerVisit}
                  classNames={{
                    base: "!mt-0 gap-2 w-38",
                    label: "!translate-0 !static",
                    trigger:
                      "border border-primary/15 bg-background shadow-none",
                  }}
                >
                  {PER_VISIT_DURATION_OPTIONS.map((duration: string) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <Button
              size="sm"
              radius="sm"
              color="primary"
              className="mt-1 data-disabled:!opacity-80"
              onPress={handleGenerateRoute}
              isLoading={isPending}
              isDisabled={
                isPending ||
                selectedReferrerObjects.length < 1 ||
                !coordinateString ||
                isTimeInPastError ||
                !planState.durationPerVisit ||
                !!errors.durationPerVisit
              }
            >
              <LuRoute className="size-4" />
              {isPending ? "Calculating..." : "Generate Route"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {routeOptimizationResults && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-none border border-primary/15">
              <CardHeader className="pt-5 px-5 pb-1">
                <h4 className="text-sm font-medium">Original Route</h4>
              </CardHeader>
              <CardBody className="px-5 pb-5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="font-medium">
                      {routeOptimizationResults.original.travelDistance}
                    </div>
                    <div className="text-xs text-gray-600">Travel Distance</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="font-medium">
                      {routeOptimizationResults.original.travelTime}
                    </div>
                    <div className="text-xs text-gray-600">Travel Time</div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="shadow-none border border-green-200">
              <CardHeader className="pt-5 px-5 pb-1">
                <h4 className="text-sm font-medium text-green-600">
                  Optimized Route
                </h4>
              </CardHeader>
              <CardBody className="px-5 pb-5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="font-semibold text-green-600">
                      {routeOptimizationResults?.optimized.travelDistance}
                    </div>
                    <div className="text-xs text-gray-600">Travel Distance</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="font-semibold text-green-600">
                      {routeOptimizationResults?.optimized.travelTime}
                    </div>
                    <div className="text-xs text-gray-600">Travel Time</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <Card className="shadow-none border border-primary/15">
            <CardHeader className="pt-5 px-5 pb-1">
              <div className="flex items-center justify-between w-full">
                <h4 className="text-sm font-medium">
                  Route Details ({routeType})
                </h4>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="bordered"
                    radius="sm"
                    className="border-small"
                    onPress={handleOpenInMaps}
                  >
                    <FiMapPin className="size-3.5" />
                    Open in Maps
                  </Button>
                  <Button
                    size="sm"
                    variant="bordered"
                    radius="sm"
                    className="border-small"
                    onPress={exportRoute}
                  >
                    <FiDownload className="size-3.5" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardBody className="px-5 pb-5">
              <div className="space-y-3">
                {routeDetailsList?.map((stop: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      {index < routeDetailsList.length - 1 && (
                        <FiChevronRight className="size-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{stop.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {stop.address.addressLine1}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <FiClock className="h-3 w-3" />
                          {stop.arrivalTime} - {stop.departureTime}
                        </span>

                        {!stop.isFirstStop && (
                          <>
                            <span className="flex items-center gap-1">
                              <BiCar className="h-3 w-3" />
                              {stop.travelTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiMapPin className="h-3 w-3" />
                              {stop.travelDistance}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <h4 className="text-sm font-medium text-blue-900 mb-3">
                  Route Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">
                      {summary?.totalStops}
                    </div>
                    <div className="text-xs text-gray-600">Stops</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">
                      {summary?.estimatedDistance}
                    </div>
                    <div className="text-xs text-gray-600">Total Distance</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">
                      {summary?.estimatedTotalTime}
                    </div>
                    <div className="text-xs text-gray-600">Total Time</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">
                      {summary?.mileageCost}
                    </div>
                    <div className="text-xs text-gray-600">Mileage Cost</div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
};
