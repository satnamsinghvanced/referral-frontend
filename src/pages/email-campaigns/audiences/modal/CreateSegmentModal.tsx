import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { AUDIENCE_TYPES } from "../../../../consts/campaign";

interface CreateSegmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SegmentFormValues) => void;
  initialValues?: SegmentFormValues | undefined;
}

export interface SegmentFormValues {
  name: string;
  description: string;
  audienceType: string;
  practiceSize?: string | undefined;
  partnerLevel?: string | undefined;
  lastActivity: string;
  location: string;
  status?: string | undefined;
  _id?: string | undefined;
}

const PRACTICE_SIZES = [
  { label: "Solo Practice (1 doctor)", value: "Solo Practice (1 doctor)" },
  { label: "Small Group (2-4 doctors)", value: "Small Group (2-4 doctors)" },
  { label: "Large Group (5+ doctors)", value: "Large Group (5+ doctors)" },
];

const PARTNER_LEVELS = [
  { label: "A-Level", value: "A-Level (10+ referrals/month)" },
  { label: "B-Level", value: "B-Level (5-9 referrals/month)" },
  { label: "C-Level", value: "C-Level (1-4 referrals/month)" },
];

const ACTIVITY_TIMEFRAMES = [
  { label: "Last 7 days", value: "Last 7 days" },
  { label: "Last 30 days", value: "Last 30 days" },
  { label: "Last 90 days", value: "Last 90 days" },
  { label: "60+ days ago", value: "60+ days ago" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required("Segment name is required"),
  description: Yup.string().required("Description is required"),
  audienceType: Yup.string().required("Audience type is required"),
  lastActivity: Yup.string().required("Last activity is required"),
});

const CreateSegmentModal: React.FC<CreateSegmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const formik = useFormik<SegmentFormValues>({
    initialValues: {
      name: "",
      description: "",
      audienceType: "",
      practiceSize: "",
      partnerLevel: "",
      lastActivity: "",
      location: "",
      status: "Active",
      ...initialValues,
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    },
  });

  // Reset conditional fields when audience type changes
  useEffect(() => {
    if (!initialValues) {
      formik.setFieldValue("practiceSize", "");
      formik.setFieldValue("partnerLevel", "");
    }
  }, [formik.values.audienceType]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const renderConditionalField = () => {
    switch (formik.values.audienceType) {
      case "Dental Practices":
        return (
          <div className="w-full relative">
            <Select
              label="Practice Size"
              labelPlacement="outside"
              placeholder="Select practice size"
              size="sm"
              selectedKeys={
                formik.values.practiceSize ? [formik.values.practiceSize] : []
              }
              disabledKeys={
                formik.values.practiceSize ? [formik.values.practiceSize] : []
              }
              onSelectionChange={(keys) =>
                formik.setFieldValue(
                  "practiceSize",
                  Array.from(keys)[0] as string,
                )
              }
              isInvalid={
                !!(formik.touched.practiceSize && formik.errors.practiceSize)
              }
              errorMessage={
                formik.touched.practiceSize &&
                (formik.errors.practiceSize as string)
              }
              isRequired
            >
              {PRACTICE_SIZES.map((size) => (
                <SelectItem key={size.value}>{size.label}</SelectItem>
              ))}
            </Select>
          </div>
        );
      case "Referral Partners":
        return (
          <div className="w-full relative">
            <Select
              label="Partner Level"
              labelPlacement="outside"
              placeholder="Select partner level"
              size="sm"
              selectedKeys={
                formik.values.partnerLevel ? [formik.values.partnerLevel] : []
              }
              disabledKeys={
                formik.values.partnerLevel ? [formik.values.partnerLevel] : []
              }
              onSelectionChange={(keys) =>
                formik.setFieldValue(
                  "partnerLevel",
                  Array.from(keys)[0] as string,
                )
              }
              isInvalid={
                !!(formik.touched.partnerLevel && formik.errors.partnerLevel)
              }
              errorMessage={
                formik.touched.partnerLevel &&
                (formik.errors.partnerLevel as string)
              }
              isRequired
            >
              {PARTNER_LEVELS.map((level) => (
                <SelectItem key={level.value}>{level.label}</SelectItem>
              ))}
            </Select>
          </div>
        );
      default:
        return null; // No extra field for "Patients" or unselected
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="xl"
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1.5 flex-shrink-0 p-4">
          <h3 className="text-base leading-none font-medium text-foreground">
            {initialValues
              ? "Edit Audience Segment"
              : "Create New Audience Segment"}
          </h3>
          <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal">
            {initialValues
              ? "Update the criteria for your audience segment."
              : "Define the criteria for your new audience segment."}
          </p>
        </ModalHeader>

        <ModalBody className="p-4 py-0">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
            {/* Row 1: Name and Description */}
            <div className="w-full relative">
              <Input
                placeholder="Enter segment name..."
                size="sm"
                name="name"
                label="Segment Name"
                labelPlacement="outside-top"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.name && formik.errors.name)}
                errorMessage={formik.errors.name}
                isRequired
              />
            </div>
            <div className="w-full relative">
              <Input
                placeholder="Describe this segment..."
                size="sm"
                name="description"
                label="Description"
                labelPlacement="outside-top"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!(formik.touched.description && formik.errors.description)
                }
                errorMessage={formik.errors.description}
                isRequired
              />
            </div>

            {/* Row 2: Audience Type */}
            <div className="w-full relative">
              <Select
                placeholder="Select audience type"
                size="sm"
                label="Audience Type"
                labelPlacement="outside"
                selectedKeys={
                  formik.values.audienceType ? [formik.values.audienceType] : []
                }
                disabledKeys={
                  formik.values.audienceType ? [formik.values.audienceType] : []
                }
                onSelectionChange={(keys) =>
                  formik.setFieldValue(
                    "audienceType",
                    Array.from(keys)[0] as string,
                  )
                }
                onBlur={formik.handleBlur}
                isInvalid={
                  !!(formik.touched.audienceType && formik.errors.audienceType)
                }
                errorMessage={
                  formik.touched.audienceType &&
                  (formik.errors.audienceType as string)
                }
                isRequired
              >
                {AUDIENCE_TYPES.map((type) => (
                  <SelectItem key={type.value}>{type.label}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Row 3: Conditional Fields (Practice Size / Partner Level) */}
            {renderConditionalField()}

            {/* Row 4: Last Activity */}
            <div className="w-full relative">
              <Select
                placeholder="Select activity timeframe"
                size="sm"
                label="Last Activity"
                labelPlacement="outside"
                selectedKeys={
                  formik.values.lastActivity ? [formik.values.lastActivity] : []
                }
                disabledKeys={
                  formik.values.lastActivity ? [formik.values.lastActivity] : []
                }
                onSelectionChange={(keys) =>
                  formik.setFieldValue(
                    "lastActivity",
                    Array.from(keys)[0] as string,
                  )
                }
                isInvalid={
                  !!(formik.touched.lastActivity && formik.errors.lastActivity)
                }
                errorMessage={
                  formik.touched.lastActivity &&
                  (formik.errors.lastActivity as string)
                }
                isRequired
              >
                {ACTIVITY_TIMEFRAMES.map((tf) => (
                  <SelectItem key={tf.value}>{tf.label}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Row 5: Location */}
            <div className="w-full relative">
              <Input
                placeholder="e.g., Tulsa, OK"
                size="sm"
                label="Location (Optional)"
                labelPlacement="outside"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* Row 6: Status (Only on Edit) */}
            {initialValues && (
              <div className="w-full relative">
                <Select
                  placeholder="Select status"
                  size="sm"
                  label="Status"
                  labelPlacement="outside"
                  selectedKeys={
                    formik.values.status ? [formik.values.status] : []
                  }
                  onSelectionChange={(keys) =>
                    formik.setFieldValue(
                      "status",
                      Array.from(keys)[0] as string,
                    )
                  }
                >
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value}>{status.label}</SelectItem>
                  ))}
                </Select>
              </div>
            )}
          </form>
        </ModalBody>

        <ModalFooter className="p-4">
          <Button
            variant="ghost"
            color="default"
            onPress={handleClose}
            size="sm"
            radius="sm"
            className="border-small"
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            color="primary"
            type="submit"
            size="sm"
            radius="sm"
            onPress={() => formik.handleSubmit()}
          >
            {initialValues ? "Update Segment" : "Create Segment"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateSegmentModal;
