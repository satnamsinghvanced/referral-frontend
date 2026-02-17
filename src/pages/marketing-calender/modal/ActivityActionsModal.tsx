import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { getLocalTimeZone, now } from "@internationalized/date";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
import { ACTIVITY_STATUSES, ACTIVITY_TYPES } from "../../../consts/marketing";
import { PRIORITY_LEVELS } from "../../../consts/practice";
import {
  useCreateActivity,
  useUpdateActivity,
} from "../../../hooks/useMarketing";
import { ActivityItem, ActivityStatus } from "../../../types/marketing";
import { keepUTCWallClock } from "../../../utils/keepUTCWallClock";

interface ActivityFormValues {
  title: string;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  time?: string;
  priority: string;
  platform: string;
  budget: number | "";
  colorId: string;
  status?: ActivityStatus;
}

export const ActivityValidationSchema = Yup.object().shape({
  title: Yup.string().required("Activity Title is required."),
  type: Yup.string().required("Activity Type is required."),
  description: Yup.string().optional(),
  startDate: Yup.string().required("Start Date is required."),
  endDate: Yup.string()
    .test(
      "is-after-start",
      "End Date cannot be before Start Date.",
      function (value) {
        const { startDate } = this.parent;
        if (!value || !startDate) return true;
        return new Date(value) >= new Date(startDate);
      },
    )
    .optional()
    .nullable(),
  time: Yup.string().optional(),
  priority: Yup.string()
    .oneOf(["high", "medium", "low"])
    .required("Priority is required."),
  status: Yup.string().optional(),
  platform: Yup.string().optional(),
  budget: Yup.number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value,
    )
    .nullable()
    .min(0, "Budget cannot be negative.")
    .optional(),
});

interface ActivityActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStartDate: string | null;
  defaultEndDate?: string | null;
  initialData: ActivityItem | null;
}

export default function ActivityActionsModal({
  isOpen,
  onClose,
  defaultStartDate,
  defaultEndDate,
  initialData,
}: ActivityActionsModalProps) {
  const isEditing = !!initialData?._id || !!initialData?.googleId;

  const initialValues: ActivityFormValues = {
    title: initialData?.title || "",
    // @ts-ignore
    type: isEditing
      ? initialData?.type
        ? initialData?.type
        : "googleCalendar"
      : ACTIVITY_TYPES?.[0]?.value,
    colorId: initialData?.colorId || "7",
    description: initialData?.description || "",
    startDate: initialData?.startDate || defaultStartDate || "",
    endDate: initialData?.endDate || defaultEndDate || "",
    // time: initialData?.time || "09:00",
    priority: initialData?.priority || "medium",
    platform: initialData?.platform || "",
    budget: initialData?.budget || "",
    status: initialData?.status || "scheduled",
  };

  const { mutate: createActivity, isPending: isCreating } = useCreateActivity();
  const { mutate: updateActivity, isPending: isUpdating } = useUpdateActivity();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: ActivityValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const submitValues = {
        ...values,
        budget: values.budget === "" ? 0 : values.budget,
      };

      if (isEditing) {
        updateActivity(
          {
            ...submitValues,
            id: initialData?._id,
            googleId: initialData?.googleId,
          },
          // @ts-ignore
          // values,
          {
            onSuccess: onClose,
          },
        );
      } else {
        // @ts-ignore
        createActivity(
          {
            ...submitValues,
            colorId:
              ACTIVITY_TYPES.find(
                (activity) => activity.value === values.type,
              )?.color.id.toString() || "1",
          },
          {
            onSuccess: () => {
              onClose();
              formik.resetForm();
            },
          },
        );
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (!isEditing) {
        formik.setFieldValue("startDate", defaultStartDate || "");
        formik.setFieldValue("endDate", defaultEndDate || "");
      }
    } else {
      formik.resetForm();
      formik.setFieldValue("startDate", "");
      formik.setFieldValue("endDate", "");
    }
  }, [isOpen, defaultStartDate, defaultEndDate, isEditing]);

  const hasError = (field: keyof typeof initialValues) =>
    formik.touched[field] && formik.errors[field];

  const ErrorText = ({ field }: { field: keyof typeof initialValues }) =>
    hasError(field) ? (
      <div className="text-xs text-red-500 mt-1">{formik.errors[field]}</div>
    ) : null;

  const modalTitle = isEditing
    ? "Edit Marketing Activity"
    : "Create Marketing Activity";
  const buttonText = isEditing ? "Save Changes" : "Create Activity";
  const isSubmitting = isCreating || isUpdating;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        base: `max-lg:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="2xl"
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-2 flex-shrink-0 p-4">
          <div className="flex items-center space-x-2">
            <h4 className="text-base leading-none font-medium text-foreground">
              {modalTitle}
            </h4>
          </div>
          <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal">
            Schedule a new marketing activity such as social media posts, email
            campaigns, referral activities, or promotional events.
          </p>
        </ModalHeader>

        <ModalBody className="p-4 pt-0">
          <form onSubmit={formik.handleSubmit} className="space-y-4 flex-1">
            <div className="md:grid md:grid-cols-2 md:gap-4 max-md:space-y-4">
              <div className="flex flex-col items-start">
                <Input
                  id="title"
                  name="title"
                  label="Activity Title"
                  labelPlacement="outside-top"
                  placeholder="Enter activity name"
                  size="sm"
                  radius="sm"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!hasError("title")}
                  isRequired
                />
                <ErrorText field="title" />
              </div>
              <div className="flex flex-col items-start">
                <Select
                  name="type"
                  label="Activity Type"
                  labelPlacement="outside"
                  placeholder="Select type"
                  size="sm"
                  radius="sm"
                  selectedKeys={formik.values.type ? [formik.values.type] : []}
                  disabledKeys={formik.values.type ? [formik.values.type] : []}
                  onSelectionChange={(keys) =>
                    formik.setFieldValue("type", Array.from(keys)[0] as string)
                  }
                  onBlur={() => formik.setFieldTouched("type", true)}
                  isInvalid={!!hasError("type")}
                  isRequired
                >
                  {ACTIVITY_TYPES?.map((type) => (
                    <SelectItem key={type.value}>{type.label}</SelectItem>
                  ))}
                </Select>
                <ErrorText field="type" />
              </div>
            </div>

            <div className="flex flex-col items-start">
              <Textarea
                id="description"
                name="description"
                label="Description"
                labelPlacement="outside-top"
                placeholder="Describe the marketing activity and objectives"
                size="sm"
                radius="sm"
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="resize-none min-h-16"
                isInvalid={!!hasError("description")}
                classNames={{ inputWrapper: "py-2" }}
              />
              <ErrorText field="description" />
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-4 max-md:space-y-4">
              <div className="flex flex-col items-start">
                <DatePicker
                  id="startDate"
                  name="startDate"
                  label="Start Date"
                  labelPlacement="outside"
                  size="sm"
                  radius="sm"
                  value={
                    formik.values.startDate
                      ? keepUTCWallClock(formik.values.startDate)
                      : null
                  }
                  minValue={now(getLocalTimeZone())}
                  onChange={(dateObject) => {
                    formik.setFieldValue(
                      "startDate",
                      dateObject ? dateObject.toString() + "Z" : null,
                    );
                  }}
                  granularity="minute"
                  onBlur={() => formik.setFieldTouched("startDate", true)}
                  isInvalid={!!hasError("startDate")}
                  isRequired
                />

                <ErrorText field="startDate" />
              </div>
              <div className="flex flex-col items-start">
                <DatePicker
                  id="endDate"
                  name="endDate"
                  label="End Date"
                  labelPlacement="outside"
                  size="sm"
                  radius="sm"
                  value={
                    formik.values.endDate
                      ? keepUTCWallClock(formik.values.endDate)
                      : null
                  }
                  minValue={
                    formik.values.startDate
                      ? keepUTCWallClock(formik.values.startDate)
                      : now(getLocalTimeZone())
                  }
                  onChange={(dateObject) => {
                    formik.setFieldValue(
                      "endDate",
                      dateObject ? dateObject.toString() + "Z" : null,
                    );
                  }}
                  granularity="minute"
                  onBlur={() => formik.setFieldTouched("endDate", true)}
                  isInvalid={!!hasError("endDate")}
                />

                <div className="text-[11px] text-gray-500 dark:text-foreground/40 mt-1">
                  Leave empty for single-day activity
                </div>
                <ErrorText field="endDate" />
              </div>
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-4 max-md:space-y-4">
              {/* <div>
              <Input
                id="time"
                name="time"
                type="time"
                label="Time"
                labelPlacement="outside-top"
                size="sm"
                radius="sm"
                value={formik.values.time}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!hasError("time")}
                startContent={<LuClock className="text-gray-400 dark:text-foreground/40 size-4" />}
              />
              <ErrorText field="time" />
            </div> */}
              <div className="flex flex-col items-start">
                <Select
                  name="priority"
                  label="Priority"
                  labelPlacement="outside"
                  placeholder="Select priority"
                  size="sm"
                  radius="sm"
                  selectedKeys={[formik.values.priority]}
                  disabledKeys={[formik.values.priority]}
                  onSelectionChange={(keys) =>
                    formik.setFieldValue(
                      "priority",
                      Array.from(keys)[0] as string,
                    )
                  }
                  onBlur={() => formik.setFieldTouched("priority", true)}
                  isInvalid={!!hasError("priority")}
                  isRequired
                >
                  {PRIORITY_LEVELS.map((priority) => (
                    <SelectItem key={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </Select>
                <ErrorText field="priority" />
              </div>
              <div className="flex flex-col items-start">
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  label="Budget"
                  labelPlacement="outside-top"
                  placeholder="0"
                  size="sm"
                  radius="sm"
                  value={String(formik.values.budget) as string}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!hasError("budget")}
                  startContent={
                    <span className="text-gray-500 dark:text-foreground/40">
                      $
                    </span>
                  }
                />
                <ErrorText field="budget" />
              </div>
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-4 max-md:space-y-4">
              <div
                className={`${isEditing ? "col-span-1" : "col-span-2"} flex flex-col items-start`}
              >
                <Input
                  id="platform"
                  name="platform"
                  label="Platform/Location"
                  labelPlacement="outside-top"
                  placeholder="Facebook, Instagram, Email, etc."
                  size="sm"
                  radius="sm"
                  value={formik.values.platform}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!hasError("platform")}
                />
                <ErrorText field="platform" />
              </div>
              {isEditing && (
                <div className="flex flex-col items-start">
                  <Select
                    name="status"
                    label="Status"
                    labelPlacement="outside"
                    placeholder="Select status"
                    size="sm"
                    radius="sm"
                    selectedKeys={[formik.values.status as any]}
                    disabledKeys={[formik.values.status as any]}
                    onSelectionChange={(keys) =>
                      formik.setFieldValue(
                        "status",
                        Array.from(keys)[0] as string,
                      )
                    }
                    onBlur={() => formik.setFieldTouched("status", true)}
                    isInvalid={!!hasError("status")}
                  >
                    {ACTIVITY_STATUSES.map((status) => (
                      <SelectItem key={status.value}>{status.label}</SelectItem>
                    ))}
                  </Select>
                  <ErrorText field="status" />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-1">
              <Button
                variant="ghost"
                color="default"
                size="sm"
                radius="sm"
                className="border-small"
                onPress={onClose}
                type="button"
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                color="primary"
                size="sm"
                radius="sm"
                type="submit"
                isLoading={isSubmitting}
                isDisabled={!formik.isValid || !formik.dirty || isSubmitting}
              >
                {buttonText}
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
