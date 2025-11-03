import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import React from "react";
import { ReviewSaveTabProps } from "../../../../types/partner";

export const ReviewSaveTab: React.FC<ReviewSaveTabProps> = ({
  formik,
  data,
  selectedReferrerObjects,
}) => {
  const finalVisitPurposeTitle =
    formik.values.defaultVisitPurpose === "Custom Purpose"
      ? formik.values.customVisitPurpose
      : formik.values.defaultVisitPurpose;

  return (
    <div className="space-y-4">
      <Card className="shadow-none border border-primary/15 p-4">
        <CardHeader className="flex-col px-0 pt-0 pb-4 items-start space-y-1">
          <h5 className="font-medium text-sm">{formik.values.planName}</h5>
          {/* <FiList className="size-4 text-gray-500" /> */}
          <p className="text-xs text-gray-500">
            Schedule visits for {formik.values.notes}
          </p>
        </CardHeader>
        <CardBody className="p-0 grid grid-cols-4 gap-3 text-center">
          <Card className="shadow-none rounded-md bg-blue-100/50">
            <CardBody className="py-3 items-center">
              <p className="text-sm font-semibold text-blue-800">
                {selectedReferrerObjects.length}
              </p>
              <p className="text-xs text-blue-700">Referrers</p>
            </CardBody>
          </Card>
          <Card className="shadow-none rounded-md bg-green-100/50">
            <CardBody className="py-3 items-center">
              <p className="text-sm font-semibold text-green-800">2</p>
              <p className="text-xs text-green-700">Visit Days</p>
            </CardBody>
          </Card>
          <Card className="shadow-none rounded-md bg-orange-100/50">
            <CardBody className="py-3 items-center">
              <p className="text-sm font-semibold text-orange-800">
                {data.estimatedTotalTime}
              </p>
              <p className="text-xs text-orange-700">Total Time</p>
            </CardBody>
          </Card>
          <Card className="shadow-none rounded-md bg-purple-100/50">
            <CardBody className="py-3 items-center">
              <p className="text-sm font-semibold text-purple-800">
                {data.estimatedDistance}
              </p>
              <p className="text-xs text-purple-700">Distance</p>
            </CardBody>
          </Card>
        </CardBody>
      </Card>

      <Card className="shadow-none border border-primary/15 p-4">
        <CardHeader className="flex-col px-0 pt-0 pb-4 items-start space-y-1">
          <p className="font-medium text-sm">Visit Schedule</p>
        </CardHeader>
        <CardBody className="p-0 space-y-3">
          {Object.keys(data.visitSchedule).map((dateKey) => (
            <Card
              key={dateKey}
              className="shadow-none border border-primary/15"
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
                    {formik.values.defaultPriority}
                  </Chip>
                  <Chip
                    size="sm"
                    radius="sm"
                    variant="bordered"
                    color="success"
                    className="text-[11px] h-5 border-small text-green-600 border-green-200"
                  >
                    Optimized
                  </Chip>
                </div>
                <p className="text-xs text-gray-600">
                  {finalVisitPurposeTitle}
                </p>
                <p className="text-xs text-gray-500">
                  2 offices &bull; 143.4387614264083min total &bull; 6.9mi
                  distance
                </p>
              </CardBody>
            </Card>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};
