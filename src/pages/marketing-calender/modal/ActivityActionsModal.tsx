import {
  Button,
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
import { useEffect, useMemo } from "react";
import * as Yup from "yup";
import { ACTIVITY_STATUSES, ACTIVITY_TYPES, getFilteredActivityTypes } from "../../../consts/marketing";
import { PRIORITY_LEVELS } from "../../../consts/practice";
import { useCreateActivity, useUpdateActivity } from "../../../hooks/useMarketing";
import { ActivityItem, ActivityStatus } from "../../../types/marketing";
import DatePickerWithTimeInput from "../../../components/common/DatePickerWithTimeInput";

import { useCalendarIntegration } from "../../../hooks/integrations/useGoogleCalendar";
import { usePlanGuard } from "../../../hooks/usePlanGuard";
import { useLocationContext } from "../../../providers/LocationContext";
import { DEFAULT_LOCATIONS, getLocationStyle } from "../../../utils/locationTheme";

interface ActivityFormValues {
  title: string;
  type: string;
  locations: string[];
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
  title: Yup.string()
    .max(50, "Activity Title cannot exceed 50 characters.")
    .required("Activity Title is required."),
  type: Yup.string().required("Activity Type is required."),
  locations: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one location.")
    .required("Location is required."),
  description: Yup.string()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),
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
  platform: Yup.string()
    .max(100, "Platform/Location cannot exceed 100 characters.")
    .optional(),
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
  const { hasAccess, openPricingPage } = usePlanGuard();
  const canTrackBudget = hasAccess("budget_tracking");
  const allowedActivityTypes = getFilteredActivityTypes(hasAccess);
  const { locations: contextLocations, selectedLocation: currentSelectedLocation } = useLocationContext();

  const availableLocations = useMemo(() => {
    if (contextLocations && Array.isArray(contextLocations) && contextLocations.length > 0) {
      const names = contextLocations.map((l) => l.name).filter(Boolean);
      if (names.length > 0) return names;
    }
    return DEFAULT_LOCATIONS;
  }, [contextLocations]);

  const { data: googleCalendarConfig } = useCalendarIntegration();
  const configs = Array.isArray(googleCalendarConfig)
    ? googleCalendarConfig
    : googleCalendarConfig
      ? [googleCalendarConfig]
      : [];
  const isEditing = !!initialData?._id || !!initialData?.googleId;

  const getInitialLocations = (): string[] => {
    if (initialData?.locations && Array.isArray(initialData.locations) && initialData.locations.length > 0) {
      return initialData.locations;
    }
    if (initialData?.location) {
      return [initialData.location];
    }
    if (currentSelectedLocation?.name) {
      return [currentSelectedLocation.name];
    }
    const defaultLoc = availableLocations[0] || DEFAULT_LOCATIONS[0]!;
    return [defaultLoc];
  };

  const initialValues: ActivityFormValues = {
    title: initialData?.title || "",
    // @ts-ignore
    type: isEditing
      ? initialData?.type
        ? initialData?.type
        : "googleCalendar"
      : allowedActivityTypes?.[0]?.value || "googleCalendar",
    locations: getInitialLocations(),
    colorId: initialData?.colorId || "7",
    description: initialData?.description || "",
    startDate: initialData?.startDate || defaultStartDate || "",
    endDate: initialData?.endDate || defaultEndDate || "",
    time: initialData?.time || "",
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

      const selectedLocs =
        values.locations && values.locations.length > 0
          ? values.locations
          : [availableLocations[0]];

      if (isEditing) {
        updateActivity(
          {
            ...submitValues,
            id: initialData?._id,
            googleId: initialData?.googleId,
            location: selectedLocs[0] || availableLocations[0] || "",
            locations: selectedLocs,
            calendarId: configs[0]?._id,
            googleCalendarId: configs[0]?.calendarId,
          } as any,
          {
            onSuccess: onClose,
          },
        );
      } else {
        let completedCount = 0;
        selectedLocs.forEach((loc) => {
          // @ts-ignore
          createActivity(
            {
              ...submitValues,
              location: loc,
              locations: [loc],
              colorId:
                ACTIVITY_TYPES.find(
                  (activity) => activity.value === values.type,
                )?.color.id.toString() || "1",
              calendarId: configs[0]?._id,
              googleCalendarId: configs[0]?.calendarId,
            } as any,
            {
              onSuccess: () => {
                completedCount++;
                if (completedCount === selectedLocs.length) {
                  onClose();
                  formik.resetForm();
                }
              },
            },
          );
        });
      }
    },
  });
  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        formik.setFieldValue("startDate", initialData?.startDate || "");
        formik.setFieldValue("endDate", initialData?.endDate || "");
      } else {
        formik.setFieldValue("startDate", defaultStartDate || "");
        formik.setFieldValue("endDate", defaultEndDate || "");
      }
    } else {
      formik.resetForm();
    }
  }, [isOpen, initialData, defaultStartDate, defaultEndDate, isEditing]);
  const hasError = (field: keyof typeof initialValues) =>
    formik.touched[field] && formik.errors[field];
  const ErrorText = ({ field }: { field: keyof typeof initialValues }) =>
    hasError(field) ? (
      <div className="text-xs text-red-500 mt-1">{formik.errors[field] as string}</div>
    ) : null;
  const modalTitle = isEditing
    ? "Edit Marketing Activity"
    : "Create Marketing Activity";
  const buttonText = isEditing ? "Save Changes" : "Create Activity";
  const isSubmitting = isCreating || isUpdating;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
                  maxLength={50}
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!hasError("title")}
                  isRequired
                  endContent={
                    <span className="text-[11px] text-gray-400 dark:text-foreground/40 select-none shrink-0 pointer-events-none">
                      {(formik.values.title || "").length}/50
                    </span>
                  }
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
                  disableAnimation
                  popoverProps={{ disableAnimation: true, shouldCloseOnScroll: false }}
                  selectedKeys={formik.values.type ? [formik.values.type] : []}
                  onSelectionChange={(keys) =>
                    formik.setFieldValue("type", Array.from(keys)[0] as string)
                  }
                  onBlur={() => formik.setFieldTouched("type", true)}
                  isInvalid={!!hasError("type")}
                  isRequired
                >
                  {allowedActivityTypes?.map((type) => (
                    <SelectItem key={type.value} textValue={type.label}>{type.label}</SelectItem>
                  ))}
                </Select>
                <ErrorText field="type" />
              </div>
            </div>

            <div className="flex flex-col items-start w-full space-y-1">
              <label className="text-xs font-medium text-foreground">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="w-full border border-foreground/15 rounded-xl p-3 bg-content1/50 dark:bg-content1/20 flex flex-wrap gap-2.5 items-center">
                {(() => {
                  const selectedLocs = formik.values.locations || [];
                  const isAllSelected =
                    availableLocations.length > 0 &&
                    selectedLocs.length === availableLocations.length;

                  const toggleAll = () => {
                    if (isAllSelected) {
                      formik.setFieldValue("locations", [availableLocations[0]]);
                    } else {
                      formik.setFieldValue("locations", [...availableLocations]);
                    }
                    formik.setFieldTouched("locations", true);
                  };

                  return (
                    <button
                      type="button"
                      onClick={toggleAll}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer select-none ${
                        isAllSelected
                          ? "border-sky-400 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 shadow-2xs"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-content2 text-gray-600 dark:text-foreground/70 hover:border-gray-300"
                      }`}
                    >
                      All Locations
                    </button>
                  );
                })()}

                {availableLocations.map((locName) => {
                  const selectedLocs = formik.values.locations || [];
                  const isSelected = selectedLocs.includes(locName);
                  const { theme, dotColor } = getLocationStyle(locName, availableLocations);

                  const toggleLoc = () => {
                    if (isSelected) {
                      if (selectedLocs.length <= 1) return;
                      formik.setFieldValue(
                        "locations",
                        selectedLocs.filter((l) => l !== locName)
                      );
                    } else {
                      formik.setFieldValue("locations", [...selectedLocs, locName]);
                    }
                    formik.setFieldTouched("locations", true);
                  };

                  return (
                    <button
                      key={locName}
                      type="button"
                      onClick={toggleLoc}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border transition-all cursor-pointer select-none ${
                        isSelected
                          ? `${theme.chipSelected} shadow-2xs`
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-content2 text-gray-600 dark:text-foreground/70 hover:border-gray-300"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0 transition-colors"
                        style={{ backgroundColor: isSelected ? dotColor : "#9ca3af" }}
                      />
                      <span>{locName}</span>
                    </button>
                  );
                })}
              </div>
              {formik.touched.locations && formik.errors.locations && (
                <div className="text-xs text-red-500 mt-1">
                  {typeof formik.errors.locations === "string"
                    ? formik.errors.locations
                    : "Select at least one location"}
                </div>
              )}
            </div>

            <div className="flex flex-col items-start w-full">
              <div className="flex items-center justify-between w-full mb-1">
                <label className="text-xs font-medium text-foreground">
                  Description
                </label>
                <span className="text-[11px] text-gray-400 dark:text-foreground/40 select-none">
                  {(formik.values.description || "").length}/500
                </span>
              </div>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the marketing activity and objectives"
                size="sm"
                radius="sm"
                rows={3}
                maxLength={500}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="resize-none min-h-16 w-full"
                isInvalid={!!hasError("description")}
                classNames={{ inputWrapper: "py-2" }}
              />
              <ErrorText field="description" />
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-4 max-md:space-y-4">
              <div className="flex flex-col items-start w-full">
                <DatePickerWithTimeInput
                  id="startDate"
                  name="startDate"
                  label="Start Date"
                  value={formik.values.startDate}
                  onChange={(val) => {
                    formik.setFieldValue("startDate", val);
                  }}
                  onBlur={() => formik.setFieldTouched("startDate", true)}
                  isInvalid={!!hasError("startDate")}
                  errorMessage={formik.errors.startDate}
                  isRequired
                />
              </div>
              <div className="flex flex-col items-start w-full">
                <DatePickerWithTimeInput
                  id="endDate"
                  name="endDate"
                  label="End Date"
                  value={formik.values.endDate}
                  minValue={formik.values.startDate}
                  onChange={(val) => {
                    formik.setFieldValue("endDate", val);
                  }}
                  onBlur={() => formik.setFieldTouched("endDate", true)}
                  isInvalid={!!hasError("endDate")}
                  errorMessage={formik.errors.endDate}
                />
                <div className="text-[11px] text-gray-500 dark:text-foreground/40 mt-1">
                  Leave empty for single-day activity
                </div>
              </div>
            </div>
            <div className={`md:grid ${canTrackBudget ? "md:grid-cols-2" : "md:grid-cols-1"} md:gap-4 max-md:space-y-4`}>
              <div className="flex flex-col items-start">
                <Select
                  name="priority"
                  label="Priority"
                  labelPlacement="outside"
                  placeholder="Select priority"
                  size="sm"
                  radius="sm"
                  disableAnimation
                  popoverProps={{ disableAnimation: true, shouldCloseOnScroll: false }}
                  selectedKeys={formik.values.priority ? [formik.values.priority] : []}
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
                    <SelectItem key={priority.value} textValue={priority.label}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </Select>
                <ErrorText field="priority" />
              </div>
              {canTrackBudget && (
                <div className="flex flex-col items-start w-full">
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
              )}
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
                  maxLength={100}
                  value={formik.values.platform}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!hasError("platform")}
                  endContent={
                    <span className="text-[11px] text-gray-400 dark:text-foreground/40 select-none shrink-0 pointer-events-none">
                      {(formik.values.platform || "").length}/100
                    </span>
                  }
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
                    disableAnimation
                    popoverProps={{ disableAnimation: true, shouldCloseOnScroll: false }}
                    selectedKeys={formik.values.status ? [formik.values.status as string] : []}
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
                      <SelectItem key={status.value} textValue={status.label}>{status.label}</SelectItem>
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
