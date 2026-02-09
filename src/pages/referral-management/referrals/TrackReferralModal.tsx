import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Textarea,
  addToast,
} from "@heroui/react";
import {
  getLocalTimeZone,
  parseDate,
  parseDateTime,
  today,
} from "@internationalized/date";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiPlus } from "react-icons/fi";
import { LuBuilding } from "react-icons/lu";
import * as Yup from "yup";
import { EMAIL_REGEX, PHONE_REGEX, NAME_REGEX } from "../../../consts/consts";
import { STATUS_OPTIONS } from "../../../consts/filters";
import {
  SOURCE_OPTIONS,
  TREATMENT_OPTIONS,
  URGENCY_OPTIONS,
} from "../../../consts/referral";
import { useCreateReferral } from "../../../hooks/useReferral";
import { Referrer } from "../../../types/partner";
import { CreateReferralPayload, ReferralStatus } from "../../../types/referral";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { useTypedSelector } from "../../../hooks/useTypedSelector";

interface TrackReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referrers?: Referrer[];
  onCreateNewReferrer: () => void;
}

const TrackReferralModal = ({
  isOpen,
  onClose,
  referrers = [],
  onCreateNewReferrer,
}: TrackReferralModalProps) => {
  const { user } = useTypedSelector((state) => state.auth);
  const userId = user?.userId;

  const { mutate: createReferral, isPending: isLoading } = useCreateReferral();
  // Mode: 'existing' | 'new'
  const [referrerMode, setReferrerMode] = useState<"existing" | "new">(
    "existing",
  );

  const validationSchema = Yup.object().shape({
    patientName: Yup.string()
      .trim()
      .required("Patient name is required")
      .matches(
        NAME_REGEX,
        "Name can only contain letters, spaces, hyphens, apostrophes, and full stops",
      )
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    patientAge: Yup.number()
      .required("Age is required")
      .integer("Age must be a whole number")
      .min(1, "Age must be greater than 0")
      .max(120, "Age must be less than or equal to 120")
      .typeError("Age must be a number"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(PHONE_REGEX, "Phone must be in format (XXX) XXX-XXXX"),
    email: Yup.string()
      .required("Email is required")
      .matches(EMAIL_REGEX, "Invalid email format"),
    referrerId: Yup.string().when([], {
      is: () => referrerMode === "existing",
      then: (schema) => schema.required("Please select a referrer"),
    }),
    treatment: Yup.string().required("Reason for referral is required"),
    source: Yup.string().required("Referral source is required"),
    status: Yup.string().required("Status is required"),
    urgency: Yup.string().required("Urgency is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      patientName: "",
      patientAge: "",
      phone: "",
      email: "",
      referrerId: "",
      treatment: TREATMENT_OPTIONS[0]?.key,
      scheduledDate: "",
      status: "new",
      urgency: "medium",
      source: "Direct",
      estimatedValue: "",
      notes: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (referrerMode === "new") {
        addToast({
          title: "Action Required",
          description:
            "Please create the referrer first before adding the referral.",
          color: "warning",
          classNames: {
            title: "text-warning-800",
            description: "text-warning-700",
          },
        });
        return;
      }

      const payload: CreateReferralPayload = {
        name: values.patientName,
        age: Number(values.patientAge),
        phone: values.phone,
        email: values.email || undefined,
        referredBy: values.referrerId,
        treatment: values.treatment as string,
        addedVia: values.source,
        priority: values.urgency,
        estValue: Number(values.estimatedValue) || 0,
        notes: values.notes,
        status: values.status as ReferralStatus,
        scheduledDate: values.scheduledDate || undefined,
      };

      createReferral(payload, {
        onSuccess: () => {
          onClose();
          formik.resetForm();
        },
      });
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    type: string,
    maxLength?: number,
  ) => {
    let value: string | number | undefined = event.target.value;

    if (type === "tel") {
      value = formatPhoneNumber(value);
    } else if (type === "number") {
      if (maxLength && value.length > maxLength) {
        return;
      }
      value = value === "" ? "" : value.replace(/\D/g, "");
    }

    formik.setFieldValue(fieldName, value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      placement="center"
      scrollBehavior="inside"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-4">
              <h4 className="text-base font-medium dark:text-white">
                Track Single Referral
              </h4>
              <p className="text-xs text-gray-500 font-normal dark:text-foreground/60">
                Add a new patient referral to your tracking system.
              </p>
            </ModalHeader>

            <ModalBody className="py-0 px-4 gap-3">
              {/* Patient Information Section */}
              <div className="border border-foreground/10 rounded-xl p-4 space-y-3">
                <h4 className="font-medium text-sm dark:text-white">
                  Patient Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2.5 gap-y-4">
                  <Input
                    label="Patient Name"
                    labelPlacement="outside"
                    placeholder="Enter full name"
                    isRequired
                    size="sm"
                    radius="sm"
                    variant="flat"
                    name="patientName"
                    maxLength={100}
                    value={formik.values.patientName || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      !!(
                        formik.errors.patientName && formik.touched.patientName
                      )
                    }
                    errorMessage={formik.errors.patientName}
                  />
                  <Input
                    size="sm"
                    radius="sm"
                    variant="flat"
                    label="Patient Age"
                    labelPlacement="outside"
                    placeholder="e.g., 25"
                    isRequired
                    name="patientAge"
                    maxLength={3}
                    value={formik.values.patientAge.toString() || ""}
                    onChange={(e) =>
                      handleInputChange(
                        e as React.ChangeEvent<HTMLInputElement>,
                        "patientAge",
                        "number",
                        3,
                      )
                    }
                    onBlur={formik.handleBlur}
                    isInvalid={
                      !!(formik.errors.patientAge && formik.touched.patientAge)
                    }
                    errorMessage={formik.errors.patientAge}
                  />
                  <Input
                    label="Phone Number"
                    labelPlacement="outside"
                    placeholder="(123) 456-7890"
                    isRequired
                    size="sm"
                    radius="sm"
                    variant="flat"
                    name="phone"
                    maxLength={14}
                    value={formik.values.phone || ""}
                    onChange={(e) =>
                      handleInputChange(
                        e as React.ChangeEvent<HTMLInputElement>,
                        "phone",
                        "tel",
                      )
                    }
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.phone && formik.touched.phone)}
                    errorMessage={formik.errors.phone}
                  />
                  <Input
                    label="Email Address"
                    labelPlacement="outside"
                    placeholder="e.g., johndoe@gmail.com"
                    size="sm"
                    radius="sm"
                    variant="flat"
                    name="email"
                    maxLength={255}
                    value={formik.values.email || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.email && formik.touched.email)}
                    errorMessage={formik.errors.email}
                    isRequired
                  />
                </div>
              </div>

              {/* Referrer Information Section */}
              <div className="border border-foreground/10 rounded-xl p-4 space-y-3">
                <h4 className="font-medium text-sm dark:text-white">
                  Referrer Information
                </h4>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="block text-xs dark:text-foreground/60">
                      How would you like to track this referrer?
                    </label>
                    <div className="">
                      <Tabs
                        aria-label="Referrer Tracking Mode"
                        selectedKey={referrerMode}
                        onSelectionChange={(key) =>
                          setReferrerMode(key as "existing" | "new")
                        }
                        variant="light"
                        radius="full"
                        classNames={{
                          base: "bg-primary/15 dark:bg-background rounded-full p-1 w-full",
                          tabList: "flex w-full rounded-full p-0 gap-0",
                          tab: "flex-1 h-8 text-sm font-medium transition-all",
                          cursor: "rounded-full bg-white dark:bg-primary",
                          tabContent:
                            "dark:group-data-[selected=true]:text-primary-foreground text-default-500 dark:text-foreground/60 transition-colors",
                        }}
                        className="w-full"
                      >
                        <Tab
                          key="existing"
                          title={
                            <div className="flex items-center gap-2">
                              <FiCheckCircle className="text-[15px]" />
                              <span>Select Existing</span>
                            </div>
                          }
                        />
                        <Tab
                          key="new"
                          title={
                            <div className="flex items-center gap-2">
                              <FiPlus className="text-[16px]" />
                              <span>Create New</span>
                            </div>
                          }
                        />
                      </Tabs>
                    </div>
                  </div>

                  {referrerMode === "existing" ? (
                    <div className="flex">
                      <Autocomplete
                        label="Select Referrer"
                        labelPlacement="outside"
                        placeholder="Search referrers..."
                        isRequired
                        variant="flat"
                        size="sm"
                        radius="sm"
                        items={[
                          {
                            _id: userId,
                            name: "Myself",
                            practice: {
                              name: `${user?.firstName} ${user?.lastName}`,
                            },
                            isMyself: true,
                          },
                          ...referrers,
                        ]}
                        selectedKey={formik.values.referrerId}
                        onSelectionChange={(key) =>
                          formik.setFieldValue("referrerId", key)
                        }
                        onBlur={formik.handleBlur}
                        isInvalid={
                          !!(
                            formik.errors.referrerId &&
                            formik.touched.referrerId
                          )
                        }
                        errorMessage={formik.errors.referrerId}
                      >
                        {(item: any) => (
                          <AutocompleteItem
                            key={item._id}
                            textValue={item.name}
                            description={item.practice?.name}
                          >
                            {item.name}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    </div>
                  ) : (
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/30 rounded-lg p-4 flex flex-col items-center gap-3 text-center">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-500">
                        <LuBuilding className="size-5" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-medium dark:text-white">
                          Create a New Referrer
                        </p>
                        <p className="text-xs text-gray-500 dark:text-foreground/40">
                          Add a new referrer to your system with complete
                          information
                        </p>
                      </div>
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() => {
                          onClose();
                          onCreateNewReferrer();
                        }}
                        startContent={<FiPlus className="text-[15px]" />}
                      >
                        Create New Referrer
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Referral Details Section */}
              <div className="border border-foreground/10 rounded-xl p-4 space-y-3">
                <h4 className="font-medium text-sm dark:text-white">
                  Referral Details
                </h4>

                <div className="flex flex-col gap-y-4">
                  <div className="flex">
                    <Select
                      label="Treatment/Reason for Referral"
                      labelPlacement="outside"
                      placeholder="Select reason"
                      isRequired
                      size="sm"
                      radius="sm"
                      selectedKeys={
                        formik.values.treatment ? [formik.values.treatment] : []
                      }
                      disabledKeys={
                        formik.values.treatment ? [formik.values.treatment] : []
                      }
                      onChange={(e) =>
                        formik.setFieldValue("treatment", e.target.value)
                      }
                      onBlur={formik.handleBlur}
                      isInvalid={
                        !!(formik.errors.treatment && formik.touched.treatment)
                      }
                      errorMessage={formik.errors.treatment}
                      variant="flat"
                    >
                      {TREATMENT_OPTIONS.map((option) => (
                        <SelectItem key={option.key}>{option.label}</SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="flex">
                    <DatePicker
                      label="Scheduled Date"
                      labelPlacement="outside"
                      variant="flat"
                      radius="sm"
                      size="sm"
                      name="scheduledDate"
                      hideTimeZone
                      granularity="minute"
                      minValue={today(getLocalTimeZone())}
                      value={
                        formik.values.scheduledDate
                          ? formik.values.scheduledDate.includes("T")
                            ? parseDateTime(
                                formik.values.scheduledDate.slice(0, 19),
                              )
                            : parseDateTime(
                                `${formik.values.scheduledDate}T00:00:00`,
                              )
                          : null
                      }
                      onChange={(dateObject: any) => {
                        if (dateObject) {
                          const year = dateObject.year;
                          const month = String(dateObject.month).padStart(
                            2,
                            "0",
                          );
                          const day = String(dateObject.day).padStart(2, "0");
                          const hour = String(dateObject.hour).padStart(2, "0");
                          const minute = String(dateObject.minute).padStart(
                            2,
                            "0",
                          );
                          const second = String(dateObject.second).padStart(
                            2,
                            "0",
                          );
                          const millisecond = String(
                            dateObject.millisecond,
                          ).padStart(3, "0");

                          const localDateTimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}`;
                          formik.setFieldValue(
                            "scheduledDate",
                            localDateTimeString,
                          );
                        } else {
                          formik.setFieldValue("scheduledDate", "");
                        }
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2.5 gap-y-4">
                    <Select
                      label="Status"
                      labelPlacement="outside"
                      placeholder="Pending"
                      defaultSelectedKeys={["pending"]}
                      variant="flat"
                      radius="sm"
                      size="sm"
                      selectedKeys={
                        formik.values.status ? [formik.values.status] : []
                      }
                      disabledKeys={
                        formik.values.status ? [formik.values.status] : []
                      }
                      onChange={(e) =>
                        formik.setFieldValue("status", e.target.value)
                      }
                      onBlur={formik.handleBlur}
                      isInvalid={
                        !!(formik.errors.status && formik.touched.status)
                      }
                      errorMessage={formik.errors.status}
                      isRequired
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s.value}>{s.label}</SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Urgency"
                      labelPlacement="outside"
                      placeholder="Medium"
                      defaultSelectedKeys={["medium"]}
                      variant="flat"
                      radius="sm"
                      size="sm"
                      selectedKeys={
                        formik.values.urgency ? [formik.values.urgency] : []
                      }
                      disabledKeys={
                        formik.values.urgency ? [formik.values.urgency] : []
                      }
                      onChange={(e) =>
                        formik.setFieldValue("urgency", e.target.value)
                      }
                      onBlur={formik.handleBlur}
                      isInvalid={
                        !!(formik.errors.urgency && formik.touched.urgency)
                      }
                      errorMessage={formik.errors.urgency}
                      isRequired
                    >
                      {URGENCY_OPTIONS.map((u) => (
                        <SelectItem key={u.key}>{u.label}</SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2.5 gap-y-4">
                    <Select
                      label="Source"
                      labelPlacement="outside"
                      placeholder="Direct Referral"
                      defaultSelectedKeys={["Direct Referral"]}
                      variant="flat"
                      radius="sm"
                      size="sm"
                      selectedKeys={
                        formik.values.source ? [formik.values.source] : []
                      }
                      disabledKeys={
                        formik.values.source ? [formik.values.source] : []
                      }
                      onChange={(e) =>
                        formik.setFieldValue("source", e.target.value)
                      }
                      onBlur={formik.handleBlur}
                      isInvalid={
                        !!(formik.errors.source && formik.touched.source)
                      }
                      errorMessage={formik.errors.source}
                      isRequired
                    >
                      {SOURCE_OPTIONS.map((s) => (
                        <SelectItem key={s.key}>{s.label}</SelectItem>
                      ))}
                    </Select>

                    <Input
                      label="Estimated Value"
                      labelPlacement="outside"
                      placeholder="0"
                      type="number"
                      startContent={
                        <span className="text-gray-500 dark:text-foreground/60 text-sm">
                          $
                        </span>
                      }
                      variant="flat"
                      radius="sm"
                      size="sm"
                      name="estimatedValue"
                      value={formik.values.estimatedValue.toString() || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        !!(
                          formik.errors.estimatedValue &&
                          formik.touched.estimatedValue
                        )
                      }
                      errorMessage={formik.errors.estimatedValue}
                    />
                  </div>

                  <Textarea
                    label="Notes"
                    labelPlacement="outside"
                    placeholder="Add any additional notes..."
                    minRows={3}
                    variant="flat"
                    radius="sm"
                    size="sm"
                    name="notes"
                    value={formik.values.notes || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.notes && formik.touched.notes)}
                    errorMessage={formik.errors.notes}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="px-4">
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                color="default"
                onPress={onClose}
                className="border-small"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="solid"
                color="primary"
                onPress={() => formik.handleSubmit()}
                isLoading={!!isLoading}
                startContent={!isLoading && <FiPlus className="text-[15px]" />}
                isDisabled={isLoading || !formik.isValid || !formik.dirty}
              >
                Add Referral
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TrackReferralModal;
