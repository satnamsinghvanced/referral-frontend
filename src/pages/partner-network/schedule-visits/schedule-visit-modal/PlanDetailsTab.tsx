import {
  Card,
  CardBody,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import React from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { RxTarget } from "react-icons/rx";
import { PRIORITY_LEVELS, PURPOSE_OPTIONS } from "../../../../consts/practice";

import { Partner } from "../../../../types/partner";

interface PlanDetailsTabProps {
  planState: {
    routeDate: string;
    startTime: string;
    durationPerVisit: string;
    planName: string;
    defaultPriority: string;
    defaultVisitPurpose: string;
    customVisitPurpose: string;
    description: string;
    enableAutoRoute: boolean;
    visitDays: string;
  };
  onStateChange: (key: string, value: string | boolean) => void;
  errors: Record<string, string>;
  data: any;
  selectedReferrerObjects: Partner[];
}

export const PlanDetailsTab: React.FC<PlanDetailsTabProps> = ({
  planState,
  onStateChange,
  errors,
  data,
  selectedReferrerObjects,
}) => {
  const handleSelectChange = (key: string, keys: any) => {
    onStateChange(key, Array.from(keys).join(""));
  };

  return (
    <form>
      <div className="md:grid md:grid-cols-2 md:gap-6 max-md:space-y-4">
        <div className="space-y-4">
          <div>
            <Input
              name="planName"
              label="Plan Name"
              labelPlacement="outside-top"
              placeholder="e.g., March 2024 Practice Visits"
              size="sm"
              radius="sm"
              value={planState.planName}
              onChange={(e) => onStateChange("planName", e.target.value)}
              isInvalid={!!errors.planName}
              errorMessage={errors.planName}
              isRequired
            />
          </div>

          <div>
            <Select
              name="defaultVisitPurpose"
              label="Default Visit Purpose"
              labelPlacement="outside"
              placeholder="Select purpose"
              size="sm"
              radius="sm"
              selectedKeys={[planState.defaultVisitPurpose]}
              disabledKeys={[planState.defaultVisitPurpose]}
              onSelectionChange={(keys: any) =>
                handleSelectChange("defaultVisitPurpose", keys)
              }
              startContent={<RxTarget className="size-4 text-gray-500" />}
              isInvalid={!!errors.defaultVisitPurpose}
              errorMessage={errors.defaultVisitPurpose}
              isRequired
              classNames={{
                base: "!mt-0 gap-2",
                label: "!translate-0 !static",
              }}
            >
              {PURPOSE_OPTIONS.map((opt: any) => (
                <SelectItem key={opt.title} description={opt.duration}>
                  {opt.title}
                </SelectItem>
              ))}
            </Select>
          </div>

          {planState.defaultVisitPurpose === "Custom Purpose" && (
            <div>
              <Input
                name="customVisitPurpose"
                label="Custom Purpose"
                labelPlacement="outside-top"
                placeholder="Enter Custom Purpose Title"
                size="sm"
                radius="sm"
                value={planState.customVisitPurpose}
                onChange={(e) =>
                  onStateChange("customVisitPurpose", e.target.value)
                }
                isInvalid={!!errors.customVisitPurpose}
                errorMessage={errors.customVisitPurpose}
              />
            </div>
          )}

          <div>
            <Select
              name="defaultPriority"
              label="Default Priority"
              labelPlacement="outside"
              placeholder="Select priority"
              size="sm"
              radius="sm"
              selectedKeys={[planState.defaultPriority]}
              disabledKeys={[planState.defaultPriority]}
              onSelectionChange={(keys: any) =>
                handleSelectChange("defaultPriority", keys)
              }
              startContent={
                <RiErrorWarningLine className="size-4 text-gray-500" />
              }
              isInvalid={!!errors.defaultPriority}
              errorMessage={errors.defaultPriority}
              isRequired
              classNames={{
                base: "!mt-0 gap-2",
                label: "!translate-0 !static",
              }}
            >
              {PRIORITY_LEVELS.map((level) => {
                return <SelectItem key={level.value}>{level.label}</SelectItem>;
              })}
            </Select>
          </div>

          <Checkbox
            name="enableAutoRoute"
            isSelected={planState.enableAutoRoute}
            onValueChange={(checked: boolean) =>
              onStateChange("enableAutoRoute", checked)
            }
            size="sm"
          >
            Enable automatic route optimization
          </Checkbox>
        </div>

        <div className="space-y-4">
          <Textarea
            name="description"
            label="Description (Optional)"
            labelPlacement="outside"
            placeholder="Add notes about this plan..."
            size="sm"
            radius="sm"
            minRows={3}
            value={planState.description}
            onChange={(e) => onStateChange("description", e.target.value)}
          />

          {data && (
            <Card className="shadow-none border border-primary/15 bg-blue-50/20">
              <CardBody className="p-4 space-y-2">
                <p className="font-medium text-sm mb-2">Plan Summary</p>
                <div className="text-xs space-y-2">
                  <p className="flex justify-between">
                    <span>Selected Referrers:</span>{" "}
                    <span className="font-medium">
                      {selectedReferrerObjects.length}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>Estimated Total Time:</span>{" "}
                    <span className="font-medium">
                      {data?.estimatedTotalTime}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>Estimated Distance:</span>{" "}
                    <span className="font-medium">
                      {data?.estimatedDistance}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>Mileage Cost (IRS Rate):</span>{" "}
                    <span className="font-medium">{data?.mileageCost}</span>
                  </p>
                  <p className="pt-3 mt-3 border-t border-primary/15 text-gray-500">
                    * Estimates based on {planState.durationPerVisit} per visit
                    and route optimization
                  </p>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </form>
  );
};
