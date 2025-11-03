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
import { FiClock, FiStar } from "react-icons/fi";
import { GoLocation } from "react-icons/go";
import { PlanDetailsTabProps } from "../../../../types/partner";
import { RxTarget } from "react-icons/rx";
import { RiErrorWarningLine } from "react-icons/ri";
import { BiStopwatch } from "react-icons/bi";

export const PlanDetailsTab: React.FC<PlanDetailsTabProps> = ({
  formik,
  data,
  selectedReferrerObjects,
  purposeOptions,
  durationOptions,
}) => {
  return (
    <form>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Input
              name="planName"
              label="Plan Name"
              labelPlacement="outside-top"
              placeholder="e.g., March 2024 Practice Visits"
              size="sm"
              radius="sm"
              value={formik.values.planName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.planName && !!formik.errors.planName}
              errorMessage={formik.touched.planName && formik.errors.planName}
              isRequired
            />
          </div>
          {/* <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Month</label>
            <div className="flex items-center space-x-2">
              <Button
                variant="bordered"
                isIconOnly
                size="sm"
                radius="sm"
                className="text-gray-500 hover:bg-gray-100"
              >
                <FiChevronLeft className="size-4" />
              </Button>
              <span className="font-semibold text-base flex-1 text-center">
                {formik.values.month}
              </span>
              <Button
                variant="bordered"
                isIconOnly
                size="sm"
                radius="sm"
                className="text-gray-500 hover:bg-gray-100"
              >
                <FiChevronRight className="size-4" />
              </Button>
            </div>
          </div> */}
          <div>
            <Select
              name="defaultVisitPurpose"
              label="Default Visit Purpose"
              labelPlacement="outside"
              placeholder="Select purpose"
              size="sm"
              radius="sm"
              selectedKeys={[formik.values.defaultVisitPurpose]}
              onSelectionChange={(keys: any) =>
                formik.setFieldValue(
                  "defaultVisitPurpose",
                  Array.from(keys).join("")
                )
              }
              startContent={<RxTarget className="size-4 text-gray-500" />}
              isInvalid={
                formik.touched.defaultVisitPurpose &&
                !!formik.errors.defaultVisitPurpose
              }
              errorMessage={
                formik.touched.defaultVisitPurpose &&
                formik.errors.defaultVisitPurpose
              }
              isRequired
              classNames={{
                base: "!mt-0 gap-2",
                label: "!translate-0 !static",
              }}
            >
              {purposeOptions.map((opt: any) => (
                <SelectItem key={opt.title} description={opt.duration}>
                  {opt.title}
                </SelectItem>
              ))}
            </Select>
          </div>

          {formik.values.defaultVisitPurpose === "Custom Purpose" && (
            <div>
              <Input
                name="customVisitPurpose"
                label="Custom Purpose"
                labelPlacement="outside-top"
                placeholder="Enter Custom Purpose Title"
                size="sm"
                radius="sm"
                value={formik.values.customVisitPurpose}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.customVisitPurpose &&
                  !!formik.errors.customVisitPurpose
                }
                errorMessage={
                  formik.touched.customVisitPurpose &&
                  formik.errors.customVisitPurpose
                }
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
              selectedKeys={[formik.values.defaultPriority]}
              onSelectionChange={(keys: any) =>
                formik.setFieldValue(
                  "defaultPriority",
                  Array.from(keys).join("")
                )
              }
              startContent={
                <RiErrorWarningLine className="size-4 text-gray-500" />
              }
              isInvalid={
                formik.touched.defaultPriority &&
                !!formik.errors.defaultPriority
              }
              errorMessage={
                formik.touched.defaultPriority && formik.errors.defaultPriority
              }
              isRequired
              classNames={{
                base: "!mt-0 gap-2",
                label: "!translate-0 !static",
              }}
            >
              <SelectItem key="High Priority">High Priority</SelectItem>
              <SelectItem key="Medium Priority">Medium Priority</SelectItem>
              <SelectItem key="Low Priority">Low Priority</SelectItem>
            </Select>
          </div>

          <div>
            <Select
              name="durationPerVisit"
              label="Duration per Visit"
              labelPlacement="outside"
              placeholder="Select duration"
              size="sm"
              radius="sm"
              selectedKeys={[formik.values.durationPerVisit]}
              onSelectionChange={(keys: any) =>
                formik.setFieldValue(
                  "durationPerVisit",
                  Array.from(keys).join("")
                )
              }
              startContent={<BiStopwatch className="size-4 text-gray-500" />}
              isInvalid={
                formik.touched.durationPerVisit &&
                !!formik.errors.durationPerVisit
              }
              errorMessage={
                formik.touched.durationPerVisit &&
                formik.errors.durationPerVisit
              }
              isRequired
              classNames={{
                base: "!mt-0 gap-2",
                label: "!translate-0 !static",
              }}
            >
              {durationOptions.map((duration: any) => (
                <SelectItem key={duration}>{duration}</SelectItem>
              ))}
            </Select>
          </div>

          <Checkbox
            name="enableAutoRoute"
            isSelected={formik.values.enableAutoRoute}
            onValueChange={(checked: boolean) =>
              formik.setFieldValue("enableAutoRoute", checked)
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
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

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
                  <span className="font-medium">{data.estimatedTotalTime}</span>
                </p>
                <p className="flex justify-between">
                  <span>Estimated Distance:</span>{" "}
                  <span className="font-medium">{data.estimatedDistance}</span>
                </p>
                <p className="flex justify-between">
                  <span>Mileage Cost (IRS Rate):</span>{" "}
                  <span className="font-medium">{data.mileageCost}</span>
                </p>
                <p className="pt-3 mt-3 border-t border-primary/15 text-gray-500">
                  * Estimates based on 60min per visit and route optimization
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </form>
  );
};
