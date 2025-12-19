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
  Textarea,
  addToast,
} from "@heroui/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { useFormik } from "formik";
import { useState } from "react";
import { FiCheckCircle, FiPlus } from "react-icons/fi";
import { LuBuilding } from "react-icons/lu";
import * as Yup from "yup";
import { STATUS_OPTIONS } from "../../../consts/filters";
import {
  SOURCE_OPTIONS,
  TREATMENT_OPTIONS,
  URGENCY_OPTIONS,
} from "../../../consts/referral";
import { Referrer } from "../../../types/partner";

interface TrackReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referrers?: Referrer[];
  onCreateNewReferrer: () => void;
  onSubmit: (values: any) => void;
  isLoading?: boolean;
}

const TrackReferralModal = ({
  isOpen,
  onClose,
  referrers = [],
  onCreateNewReferrer,
  onSubmit,
  isLoading,
}: TrackReferralModalProps) => {
  // Mode: 'existing' | 'new'
  const [referrerMode, setReferrerMode] = useState<"existing" | "new">(
    "existing"
  );

  const validationSchema = Yup.object().shape({
    patientName: Yup.string().required("Patient name is required"),
    patientAge: Yup.number()
      .required("Age is required")
      .integer("Age must be a whole number")
      .min(1, "Age must be greater than 0")
      .max(120, "Age must be less than or equal to 120")
      .typeError("Age must be a number"),
    phone: Yup.string().required("Phone number is required"),
    email: Yup.string().email("Invalid email"),
    referrerId: Yup.string().when([], {
      is: () => referrerMode === "existing",
      then: (schema) => schema.required("Please select a referrer"),
    }),
    treatment: Yup.string().required("Reason for referral is required"),
    dateReceived: Yup.date().required("Date received is required"),
    source: Yup.string().required("Referral source is required"),
  });

  const formik = useFormik({
    initialValues: {
      patientName: "",
      patientAge: "",
      phone: "",
      email: "",
      referrerId: "",
      treatment: "",
      dateReceived: new Date().toISOString().split("T")[0],
      scheduledDate: "",
      status: "new",
      urgency: "medium",
      source: "direct",
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
      onSubmit(values);
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-5">
              <h4 className="text-base font-medium">Track Single Referral</h4>
              <p className="text-xs text-gray-500 font-normal">
                Add a new patient referral to your tracking system.
              </p>
            </ModalHeader>

            <ModalBody className="py-0 px-5 gap-3">
              {/* Patient Information Section */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <h4 className="font-medium text-sm">Patient Information</h4>
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
                    value={formik.values.patientName || ""}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!(
                        formik.errors.patientName && formik.touched.patientName
                      )
                    }
                    errorMessage={formik.errors.patientName}
                  />
                  <Input
                    label="Patient Age"
                    labelPlacement="outside"
                    placeholder="e.g., 25"
                    isRequired
                    type="number"
                    size="sm"
                    radius="sm"
                    variant="flat"
                    name="patientAge"
                    value={formik.values.patientAge.toString() || ""}
                    onChange={formik.handleChange}
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
                    value={formik.values.phone || ""}
                    onChange={formik.handleChange}
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
                    value={formik.values.email || ""}
                    onChange={formik.handleChange}
                    isInvalid={!!(formik.errors.email && formik.touched.email)}
                    errorMessage={formik.errors.email}
                  />
                </div>
              </div>

              {/* Referrer Information Section */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <h4 className="font-medium text-sm">Referrer Information</h4>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs">
                      How would you like to track this referrer?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        size="sm"
                        radius="sm"
                        onPress={() => setReferrerMode("existing")}
                        variant={referrerMode === "existing" ? "solid" : "flat"}
                        color={
                          referrerMode === "existing" ? "primary" : "default"
                        }
                        startContent={<FiCheckCircle className="text-[13px]" />}
                      >
                        Select Existing
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        radius="sm"
                        onPress={() => setReferrerMode("new")}
                        variant={referrerMode === "new" ? "solid" : "flat"}
                        color={referrerMode === "new" ? "primary" : "default"}
                        startContent={<FiPlus className="text-[13px]" />}
                      >
                        Create New
                      </Button>
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
                        defaultItems={referrers}
                        selectedKey={formik.values.referrerId}
                        onSelectionChange={(key) =>
                          formik.setFieldValue("referrerId", key)
                        }
                        isInvalid={
                          !!(
                            formik.errors.referrerId &&
                            formik.touched.referrerId
                          )
                        }
                        errorMessage={formik.errors.referrerId}
                      >
                        {(item) => (
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
                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex flex-col items-center gap-3 text-center">
                      <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <LuBuilding className="size-5" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-medium">
                          Create a New Referrer
                        </p>
                        <p className="text-xs text-gray-500">
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
              <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <h4 className="font-medium text-sm">Referral Details</h4>

                <div className="space-y-4">
                  <div className="flex">
                    <Select
                      label="Reason for Referral"
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
                      isInvalid={
                        !!(formik.errors.treatment && formik.touched.treatment)
                      }
                      errorMessage={formik.errors.treatment}
                    >
                      {TREATMENT_OPTIONS.map((option) => (
                        <SelectItem key={option.key}>{option.label}</SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2.5 gap-y-4">
                    <DatePicker
                      label="Date Received"
                      labelPlacement="outside"
                      isRequired
                      variant="flat"
                      radius="sm"
                      size="sm"
                      name="dateReceived"
                      value={
                        formik.values.dateReceived
                          ? parseDate(formik.values.dateReceived)
                          : null
                      }
                      onChange={(date) =>
                        formik.setFieldValue(
                          "dateReceived",
                          date ? date.toString() : ""
                        )
                      }
                      isInvalid={
                        !!(
                          formik.errors.dateReceived &&
                          formik.touched.dateReceived
                        )
                      }
                      errorMessage={formik.errors.dateReceived as string}
                    />

                    <DatePicker
                      label="Scheduled Date"
                      labelPlacement="outside"
                      variant="flat"
                      radius="sm"
                      size="sm"
                      name="scheduledDate"
                      minValue={today(getLocalTimeZone())}
                      value={
                        formik.values.scheduledDate
                          ? parseDate(formik.values.scheduledDate)
                          : null
                      }
                      onChange={(date) =>
                        formik.setFieldValue(
                          "scheduledDate",
                          date ? date.toString() : ""
                        )
                      }
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
                      onChange={(e) =>
                        formik.setFieldValue("status", e.target.value)
                      }
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
                      onChange={(e) =>
                        formik.setFieldValue("urgency", e.target.value)
                      }
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
                      onChange={(e) =>
                        formik.setFieldValue("source", e.target.value)
                      }
                    >
                      {SOURCE_OPTIONS.map((s) => (
                        <SelectItem key={s.key}>{s.label}</SelectItem>
                      ))}
                    </Select>

                    <Input
                      label="Estimated Value"
                      labelPlacement="outside"
                      placeholder="0.00"
                      type="number"
                      startContent={
                        <span className="text-gray-500 text-sm">$</span>
                      }
                      variant="flat"
                      radius="sm"
                      size="sm"
                      name="estimatedValue"
                      value={formik.values.estimatedValue.toString() || ""}
                      onChange={formik.handleChange}
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
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="px-5">
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
