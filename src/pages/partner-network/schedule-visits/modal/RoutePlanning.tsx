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

export const RoutePlanningTab: React.FC<RoutePlanningTabProps> = ({
  planState,
  onStateChange,
  errors,
  selectedReferrerObjects,
  routeOptimizationResults,
  setRouteOptimizationResults,
}) => {
  const [coordinateString, setCoordinateString] = useState<string>("");
  const [isTimeInPastError, setIsTimeInPastError] = useState(false);

  const localTimeZone = getLocalTimeZone();
  const todayDateString = today(localTimeZone).toString();

  // ZonedDateTime representing the current moment (used for comparison)
  const currentZonedDateTime = useMemo(
    () => now(localTimeZone),
    [localTimeZone]
  );

  // Time object representing the current time of day
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
        // Use parseStringTime imported utility
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
      return;
    }

    const coordinateStrings = selectedReferrerObjects.map(
      (referrer: Partner) => {
        const { lat, long } = referrer?.address?.coordinates;
        return `${long},${lat}`;
      }
    );

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
    if (selectedReferrerObjects.length < 2) {
      addToast({
        title: "Error",
        description: "Please select at least two referrers to continue.",
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

    // Check if durationPerVisit has a valid selection
    if (!planState.durationPerVisit) {
      addToast({
        title: "Validation Error",
        description: "Please select a duration per visit.",
        color: "danger",
      });
      return;
    }

    generateRouteMutate(coordinateString, {
      onSuccess: (data) => {
        const routes = data?.routes;

        if (!routes || routes.length === 0) {
          addToast({
            title: "Error",
            description: "No routes found for the selected practices.",
            color: "danger",
          });
          return;
        }

        const originalRoute = routes.reduce((maxRoute, currentRoute) => {
          const currentDuration = Math.round(currentRoute.duration);
          const maxDuration = Math.round(maxRoute.duration);

          return currentDuration > maxDuration ? currentRoute : maxRoute;
        });

        const optimizedRoute = routes.reduce((minRoute, currentRoute) => {
          const currentDuration = Math.round(currentRoute.duration);
          const minDuration = Math.round(minRoute.duration);

          if (currentDuration < minDuration) {
            return currentRoute;
          } else {
            return minRoute;
          }
        });

        const optimizedOrderMap = optimizedRoute?.waypoints
          ? optimizedRoute?.waypoints?.map(
              (waypoint: any) => waypoint.waypoint_index
            )
          : null;

        const originalRouteMetrics: any = formatRouteData(
          planState.routeDate,
          planState.startTime,
          originalRoute as MapboxRoute,
          selectedReferrerObjects,
          planState?.durationPerVisit
        );

        const optimizedReferrerOrder = optimizedOrderMap
          ? optimizedOrderObjects(selectedReferrerObjects, optimizedOrderMap)
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
      onError: (error) => {
        addToast({
          title: "Route Error",
          description:
            error.response?.data?.message ||
            "Failed to calculate route. Check inputs and API key.",
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

    // Reconstruct the coordinate string based on the active/optimized route order
    const activeCoordinateString = routeDetailsList
      .map(
        (stop: any) =>
          `${stop.address.coordinates.long},${stop.address.coordinates.lat}`
      )
      .join(";");

    // The base URL specified by the user
    const baseUrl = `${import.meta.env.VITE_URL_PREFIX}/visit-map`;

    // Construct the final URL with coordinates as a query parameter
    const url = `${baseUrl}?coordinates=${encodeURIComponent(
      activeCoordinateString
    )}&optimized=${planState.enableAutoRoute}`;

    window.open(url, "_blank");
  };

  const exportRoute = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      reportTitle: "route",
      details: routeDetailsList,
    };

    // Trigger the download
    downloadJson(exportData, "route");
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
                    // Using the established safe parsing for ISO date string
                    planState?.routeDate
                      ? parseDate(planState.routeDate.split("T")[0])
                      : today(localTimeZone)
                  }
                  onChange={(value) => {
                    // Uses formatCalendarDate to ensure the output is the full ISO string
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
                    // Using parseStringTime for 24-hour string to Time object conversion
                    planState.startTime
                      ? parseStringTime(planState.startTime)
                      : new Time(9, 0)
                  }
                  onChange={(timeValue) => {
                    // Converting Time object back to 24-hour string (HH:MM)
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
                    // Use the stored value or the first option as default
                    planState.durationPerVisit
                      ? [planState.durationPerVisit]
                      : PER_VISIT_DURATION_OPTIONS.length > 0
                      ? [PER_VISIT_DURATION_OPTIONS[0]]
                      : []
                  }
                  disabledKeys={
                    // Use the stored value or the first option as default
                    planState.durationPerVisit
                      ? [planState.durationPerVisit]
                      : PER_VISIT_DURATION_OPTIONS.length > 0
                      ? [PER_VISIT_DURATION_OPTIONS[0]]
                      : []
                  }
                  // OPTIMIZATION 3: Removed redundant and incorrect disabledKeys
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
                    <SelectItem key={duration}>{duration}</SelectItem>
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
                !coordinateString ||
                isTimeInPastError ||
                // Check for existence of durationPerVisit state value
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

      {/* ... (Rest of the JSX remains the same) ... */}
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
