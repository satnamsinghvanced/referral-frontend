import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import React from "react";
import { Partner, RouteOptimizationResults } from "../../../../types/partner";
import { RiErrorWarningLine } from "react-icons/ri";

interface ReviewSaveTabProps {
  planState: {
    planName: string;
    defaultPriority: string;
    enableAutoRoute: boolean;
    defaultVisitPurpose: string;
    customVisitPurpose: string;
    description: string;
  };
  routeOptimizationResults: RouteOptimizationResults | null;
  selectedReferrerObjects: Partner[];
}

export const ReviewSaveTab: React.FC<ReviewSaveTabProps> = ({
  planState,
  routeOptimizationResults,
  selectedReferrerObjects,
}) => {
  const finalVisitPurposeTitle =
    planState.defaultVisitPurpose === "Custom Purpose"
      ? planState.customVisitPurpose
      : planState.defaultVisitPurpose;

  const summary = planState.enableAutoRoute
    ? routeOptimizationResults?.optimized
    : routeOptimizationResults?.original;

  if (!summary) {
    return (
      <Card className="w-full shadow-none border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-500/30 text-center">
        <CardBody className="p-6 space-y-2 text-center">
          <RiErrorWarningLine className="size-10 text-yellow-600 dark:text-yellow-500 mx-auto mb-2.5" />
          <p className="font-medium text-sm text-yellow-900 dark:text-yellow-100">
            No Route Generated
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            Please configure your route and click 'Generate Route' in the Route
            Planning tab.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-none border border-foreground/10 dark:bg-background/50 p-4">
        <CardHeader className="flex-col px-0 pt-0 pb-4 items-start space-y-1">
          <div className="flex items-center gap-2">
            <h5 className="font-medium text-sm dark:text-white">
              {planState.planName || "New Route Plan"}
            </h5>
            {planState.defaultPriority && (
              <Chip
                size="sm"
                radius="sm"
                variant="flat"
                color="warning"
                className="text-[11px] h-5 capitalize"
              >
                {planState.defaultPriority}
              </Chip>
            )}
            {planState.enableAutoRoute && (
              <Chip
                size="sm"
                radius="sm"
                variant="bordered"
                color="success"
                className="text-[11px] h-5 border-small text-green-600 border-green-200 dark:text-green-400 dark:border-green-500/30"
              >
                Optimized
              </Chip>
            )}
          </div>
          {planState.defaultVisitPurpose && (
            <p className="text-xs text-gray-600 dark:text-foreground/60">
              Visit Purpose: {finalVisitPurposeTitle}
            </p>
          )}
          {planState.description && (
            <p className="text-xs text-gray-600 dark:text-foreground/60">
              Schedule notes: {planState.description || "None"}
            </p>
          )}
        </CardHeader>
        <CardBody className="p-0 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 text-center">
          <Card className="shadow-none rounded-md bg-blue-100/50 dark:bg-blue-900/10 dark:border dark:border-blue-500/20">
            <CardBody className="py-3 items-center text-center">
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-400">
                {selectedReferrerObjects.length}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Referrers
              </p>
            </CardBody>
          </Card>

          <Card className="shadow-none rounded-md bg-green-100/50 dark:bg-green-900/10 dark:border dark:border-green-500/20">
            <CardBody className="py-3 items-center text-center">
              <p className="text-sm font-semibold text-green-800 dark:text-green-400">
                {summary.visitDays}
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Visit Days
              </p>
            </CardBody>
          </Card>

          <Card className="shadow-none rounded-md bg-orange-100/50 dark:bg-orange-900/10 dark:border dark:border-orange-500/20">
            <CardBody className="py-3 items-center text-center">
              <p className="text-sm font-semibold text-orange-800 dark:text-orange-400">
                {summary.estimatedTotalTime}
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-300">
                Total Time (H/M)
              </p>
            </CardBody>
          </Card>

          <Card className="shadow-none rounded-md bg-purple-100/50 dark:bg-purple-900/10 dark:border dark:border-purple-500/20">
            <CardBody className="py-3 items-center text-center">
              <p className="text-sm font-semibold text-purple-800 dark:text-purple-400">
                {summary.estimatedDistance}
              </p>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                Distance
              </p>
            </CardBody>
          </Card>
        </CardBody>
      </Card>

      {/* <Card className="shadow-none border border-foreground/10 p-4">
        <CardHeader className="flex-col px-0 pt-0 pb-4 items-start space-y-1">
          <p className="font-medium text-sm">Visit Schedule ({totalScheduleDays} Actual Days)</p>
        </CardHeader>
        <CardBody className="p-0 space-y-3">
          {Object.keys(visitSchedule).map((dateKey) => (
            <Card
              key={dateKey}
              className="shadow-none border border-foreground/10"
            >
              <CardBody className="p-4 space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-sm">
                    {new Date(dateKey).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <Chip
                    size="sm"
                    radius="sm"
                    variant="flat"
                    color="warning"
                    className="text-[11px] h-5"
                  >
                    {planState.defaultPriority}
                  </Chip>
                  {planState.enableAutoRoute && (
                    <Chip
                      size="sm"
                      radius="sm"
                      variant="bordered"
                      color="success"
                      className="text-[11px] h-5 border-small text-green-600 border-green-200"
                    >
                      Optimized
                    </Chip>
                  )}
                </div>
                <p className="text-xs text-gray-600">
                  {finalVisitPurposeTitle}
                </p>
                <p className="text-xs text-gray-600">
                  {visitSchedule[dateKey].totalStops} offices &bull;{" "}
                  {visitSchedule[dateKey].totalVisitDuration} total &bull;{" "}
                  {visitSchedule[dateKey].totalDistance} distance
                </p>
              </CardBody>
            </Card>
          ))}
        </CardBody>
      </Card> */}
    </div>
  );
};
