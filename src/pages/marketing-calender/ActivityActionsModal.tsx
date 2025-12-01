import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { CalendarDate, getLocalTimeZone, now, parseAbsoluteToLocal } from "@internationalized/date";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ACTIVITY_TYPES } from "../../consts/marketing";
import { PRIORITY_LEVELS } from "../../consts/practice";
import { useCreateActivity, useUpdateActivity } from "../../hooks/useMarketing";
import { ActivityItem, ActivityType } from "../../types/marketing";

interface ActivityFormValues {
  title: string;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  time?: string;
  priority: string;
  platform: string;
  budget: number;
  colorId: string;
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
      }
    )
    .optional()
    .nullable(),
  time: Yup.string().optional(),
  priority: Yup.string()
    .oneOf(["high", "medium", "low"])
    .required("Priority is required."),
  platform: Yup.string().optional(),
  budget: Yup.number().min(0, "Budget cannot be negative.").optional(),
});

interface ActivityActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStartDate: CalendarDate | null;
  initialData: ActivityItem | null;
  activityTypes: ActivityType[];
}

export default function ActivityActionsModal({
  isOpen,
  onClose,
  defaultStartDate,
  initialData,
  activityTypes,
}: ActivityActionsModalProps) {
  const isEditing = !!initialData?._id;

  const initialValues: ActivityFormValues = {
    title: initialData?.title || "",
    // @ts-ignore
    type:
      initialData?.type ||
      ACTIVITY_TYPES.find(
        (activity) => activity.color.value === initialData?.colorId
      )?.label ||
      "",
    colorId: initialData?.colorId || "1",
    description: initialData?.description || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    // time: initialData?.time || "09:00",
    priority: initialData?.priority || "medium",
    platform: initialData?.platform || "",
    budget: initialData?.budget || 0,
  };

  const { mutate: createActivity, isPending: isCreating } = useCreateActivity();
  const { mutate: updateActivity, isPending: isUpdating } = useUpdateActivity();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: ActivityValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (isEditing) {
        updateActivity(
          {
            ...values,
            id: initialData?._id,
            googleId: initialData?.googleId,
          },
          // @ts-ignore
          // values,
          {
            onSuccess: onClose,
          }
        );
      } else {
        // @ts-ignore
        createActivity(
          {
            ...values,
            colorId:
              ACTIVITY_TYPES.find(
                (activity) => activity.label === values.type
              )?.color.id.toString() || "1",
          },
          {
            onSuccess: () => {
              onClose();
              formik.resetForm();
            },
          }
        );
      }
    },
  });

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
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="2xl"
    >
      <ModalContent className="p-5">
        <ModalHeader className="flex flex-col gap-2 text-center sm:text-left flex-shrink-0 p-0">
          <div className="flex items-center space-x-2">
            <h4 className="text-base leading-none font-medium">{modalTitle}</h4>
          </div>
          <p className="text-gray-600 text-xs font-normal">
            Schedule a new marketing activity such as social media posts, email
            campaigns, referral activities, or promotional events.
          </p>
        </ModalHeader>

        <form
          onSubmit={formik.handleSubmit}
          className="space-y-4 pt-4 flex-1 overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
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
            <div>
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
                  <SelectItem key={type.label}>{type.label}</SelectItem>
                ))}
              </Select>
              <ErrorText field="type" />
            </div>
          </div>

          <div>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <DatePicker
                id="startDate"
                name="startDate"
                label="Start Date"
                labelPlacement="outside"
                size="sm"
                radius="sm"
                defaultValue={now(getLocalTimeZone())}
                minValue={now(getLocalTimeZone())}
                onChange={(dateObject) => {
                  console.log(getLocalTimeZone(), "JHGSjh")
                  if (dateObject) {
                    const year = dateObject.year;
                    const month = String(dateObject.month).padStart(2, "0");
                    const day = String(dateObject.day).padStart(2, "0");
                    const hour = String(dateObject.hour).padStart(2, "0");
                    const minute = String(dateObject.minute).padStart(2, "0");
                    const second = String(dateObject.second).padStart(2, "0");

                    const millisecond = String(dateObject.millisecond).padStart(
                      3,
                      "0"
                    );

                    const localDateTimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}`;
                    formik.setFieldValue("startDate", localDateTimeString);
                  } else {
                    formik.setFieldValue("startDate", null);
                  }
                }}
                granularity="minute"
                onBlur={() => formik.setFieldTouched("startDate", true)}
                isInvalid={!!hasError("startDate")}
                isRequired
                hideTimeZone
              />
              <ErrorText field="startDate" />
            </div>
            <div>
              <DatePicker
                id="endDate"
                name="endDate"
                label="End Date (Optional)"
                labelPlacement="outside"
                size="sm"
                radius="sm"
                defaultValue={null}
                minValue={now(getLocalTimeZone())}
                onChange={(dateObject) => {
                  if (dateObject) {
                    const year = dateObject.year;
                    const month = String(dateObject.month).padStart(2, "0");
                    const day = String(dateObject.day).padStart(2, "0");
                    const hour = String(dateObject.hour).padStart(2, "0");
                    const minute = String(dateObject.minute).padStart(2, "0");
                    const second = String(dateObject.second).padStart(2, "0");

                    const millisecond = String(dateObject.millisecond).padStart(
                      3,
                      "0"
                    );

                    const localDateTimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}`;
                    formik.setFieldValue("endDate", localDateTimeString);
                  } else {
                    formik.setFieldValue("endDate", null);
                  }
                }}
                granularity="minute"
                onBlur={() => formik.setFieldTouched("endDate", true)}
                isInvalid={!!hasError("endDate")}
                hideTimeZone
              />
              <div className="text-[11px] text-gray-500 mt-1">
                Leave empty for single-day activity
              </div>
              <ErrorText field="endDate" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                startContent={<LuClock className="text-gray-400 size-4" />}
              />
              <ErrorText field="time" />
            </div> */}
            <div>
              <Select
                name="priority"
                label="Priority"
                labelPlacement="outside"
                placeholder="Select priority"
                size="sm"
                radius="sm"
                selectedKeys={[formik.values.priority]}
                onSelectionChange={(keys) =>
                  formik.setFieldValue(
                    "priority",
                    Array.from(keys)[0] as string
                  )
                }
                onBlur={() => formik.setFieldTouched("priority", true)}
                isInvalid={!!hasError("priority")}
              >
                {PRIORITY_LEVELS.map((priority) => (
                  <SelectItem key={priority.value}>{priority.label}</SelectItem>
                ))}
              </Select>
              <ErrorText field="priority" />
            </div>
            <div>
              <Input
                id="budget"
                name="budget"
                type="number"
                label="Budget (Optional)"
                labelPlacement="outside-top"
                placeholder="0"
                size="sm"
                radius="sm"
                value={String(formik.values.budget) as string}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!hasError("budget")}
              />
              <ErrorText field="budget" />
            </div>
          </div>

          <div className="col-span-2">
            <div>
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
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <Button
              variant="bordered"
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
      </ModalContent>
    </Modal>
  );
}
