import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  Input,
  Select,
  SelectItem,
  TimeInput,
} from "@heroui/react";
import {
  getLocalTimeZone,
  now,
  parseDate,
  parseTime,
  Time,
  today,
} from "@internationalized/date";
import React, { useEffect, useState } from "react";
import { BiCar } from "react-icons/bi";
import { FiChevronRight, FiClock, FiDownload, FiMapPin } from "react-icons/fi";
import { LuRoute } from "react-icons/lu";
import { RiErrorWarningLine } from "react-icons/ri";
import { useDirectionsMutation } from "../../../../hooks/useDirections";
import { Partner, RouteOptimizationResults } from "../../../../types/partner";
import { formatRouteData } from "./formatRouteData";
import { formatCalendarDate } from "../../../../utils/formatCalendarDate";

interface RoutePlanningTabProps {
  planState: any;
  onStateChange: (key: string, value: any) => void;
  errors: any;
  selectedReferrerObjects: Partner[];
  durationOptions: string[];
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
  durationOptions,
  routeOptimizationResults,
  setRouteOptimizationResults,
}) => {
  const [coordinateString, setCoordinateString] = useState<string>("");

  const summary = routeOptimizationResults?.bestRoute;
  const routeDetailsList =
    routeOptimizationResults?.bestRoute?.routeDetails || [];

  const todayNow = new Date();

  const currentHour = todayNow.getHours();
  const currentMinute = todayNow.getMinutes();
  const currentTimeObject = new Time(currentHour, currentMinute);

  const currentTimeString = `${String(currentTimeObject.hour).padStart(
    2,
    "0"
  )}:${String(currentTimeObject.minute).padStart(2, "0")}`;

  useEffect(() => {
    if (!planState.startTime) {
      onStateChange("startTime", currentTimeString);
    }
  }, [planState.startTime, onStateChange, currentTimeString]);

  useEffect(() => {
    if (!selectedReferrerObjects || selectedReferrerObjects.length === 0) {
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

  const optimizedOrderObjects = (
    referrers: Partner[],
    orderMap: number[]
  ): Partner[] => {
    return orderMap.map((index) => referrers[index]);
  };

  const handleGenerateRoute = () => {
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

        const originalRoute = routes[0];
        let optimizedRoute = routes[0];

        if (routes.length > 1) {
          for (let i = 1; i < routes.length; i++) {
            if (routes[i].duration < optimizedRoute.duration) {
              optimizedRoute = routes[i];
            }
          }
        }

        const optimizedOrderMap = optimizedRoute.waypoints
          ? optimizedRoute.waypoints.map(
              (waypoint: any) => waypoint.waypoint_index
            )
          : null;

        const originalRouteMetrics: any = formatRouteData(
          planState.routeDate,
          planState.startTime,
          originalRoute,
          selectedReferrerObjects,
          planState?.durationPerVisit
        );

        const optimizedReferrerOrder = optimizedOrderMap
          ? optimizedOrderObjects(selectedReferrerObjects, optimizedOrderMap)
          : selectedReferrerObjects;

        const optimizedRouteMetrics: any = formatRouteData(
          planState.routeDate,
          planState.startTime,
          optimizedRoute,
          optimizedReferrerOrder,
          planState?.durationPerVisit
        );

        const finalResults: RouteOptimizationResults = {
          original: {
            ...originalRouteMetrics,
            travelTime: formatRouteData.formatDuration(originalRoute?.duration),
            travelDistance: formatRouteData.formatDistance(
              originalRoute?.distance
            ),
          },
          optimized: {
            ...optimizedRouteMetrics,
            travelTime: formatRouteData.formatDuration(
              optimizedRoute?.duration
            ),
            travelDistance: formatRouteData.formatDistance(
              optimizedRoute?.distance
            ),
          },
          bestRoute:
            optimizedRouteMetrics.estimatedTotalTime <=
            originalRouteMetrics.estimatedTotalTime
              ? optimizedRouteMetrics
              : originalRouteMetrics,
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
      });
      return;
    }

    const firstStop = routeDetailsList[0].address.addressLine1;
    const lastStop =
      routeDetailsList[routeDetailsList.length - 1].address.addressLine1;

    const waypoints = routeDetailsList
      .slice(1, -1)
      .map((stop) => stop.address.addressLine1)
      .join("|");

    let url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      firstStop
    )}&destination=${encodeURIComponent(lastStop)}`;

    if (waypoints) {
      url += `&waypoints=${encodeURIComponent(waypoints)}`;
    }

    url += `&travelmode=driving`;

    window.open(url, "_blank");
  };

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
    <div className="space-y-4">
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
                  minValue={today(getLocalTimeZone())}
                  hideTimeZone
                  granularity="day"
                  value={
                    planState?.routeDate
                      ? parseDate(planState.routeDate)
                      : // ✅ FIX: Use today() to get only the date part, matching granularity="day"
                        today(getLocalTimeZone())
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
                  // Value is now guaranteed to be the current time if not previously set
                  value={
                    planState.startTime
                      ? parseTime(planState.startTime)
                      : currentTimeObject // Use the calculated Time object for the default
                  }
                  onChange={(timeValue) => {
                    const timeString = timeValue
                      ? `${String(timeValue.hour).padStart(2, "0")}:${String(
                          timeValue.minute
                        ).padStart(2, "0")}`
                      : currentTimeString; // Fallback to current time string
                    onStateChange("startTime", timeString);
                  }}
                  errorMessage={errors.startTime}
                  isInvalid={!!errors.startTime}
                  className="w-[100px]"
                  classNames={{
                    inputWrapper:
                      "border border-primary/15 bg-background px-2 py-1 shadow-none",
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
                      : durationOptions.length > 0
                      ? [durationOptions[0]]
                      : []
                  }
                  disabledKeys={
                    planState.durationPerVisit
                      ? [planState.durationPerVisit]
                      : durationOptions.length > 0
                      ? [durationOptions[0]]
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
                  {durationOptions.map((duration: string) => (
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
                selectedReferrerObjects.length < 2
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
                      {routeOptimizationResults.optimized.travelDistance}
                    </div>
                    <div className="text-xs text-gray-600">Travel Distance</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="font-semibold text-green-600">
                      {routeOptimizationResults.optimized.travelTime}
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
                  Route Details (
                  {routeOptimizationResults.original.travelTime >=
                  routeOptimizationResults.optimized.travelTime
                    ? "Optimized"
                    : "Original"}
                  )
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
                  >
                    <FiDownload className="size-3.5" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardBody className="px-5 pb-5">
              <div className="space-y-3">
                {routeDetailsList.map((stop: any, index: number) => (
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
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
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
