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

interface ConditionModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSave: (config: any) => void;
  initialData?: any;
}

const CONDITION_TYPES = [
  { label: "Email Opened", value: "Email Opened" },
  { label: "Link Clicked", value: "Link Clicked" },
  { label: "Referral Count", value: "Referral Count" },
  { label: "Rating Level", value: "Rating Level" },
];

const COMPARISONS = [
  { label: "Greater than", value: "Greater than" },
  { label: "Greater than or equal to", value: "Greater than or equal to" },
  { label: "Equal to", value: "Equal to" },
  { label: "Less than", value: "Less than" },
  { label: "Less than or equal to", value: "Less than or equal to" },
];

const TIME_PERIODS = [
  { label: "Last 30 Days", value: "Last 30 Days" },
  { label: "Last 60 Days", value: "Last 60 Days" },
  { label: "Last 90 Days", value: "Last 90 Days" },
  { label: "Last 6 Months", value: "Last 6 Months" },
  { label: "Last Year", value: "Last Year" },
  { label: "All Time", value: "All Time" },
];

const RATING_VALUES = [
  { label: "1 Star", value: "1 Star" },
  { label: "2 Stars", value: "2 Stars" },
  { label: "3 Stars", value: "3 Stars" },
  { label: "4 Stars", value: "4 Stars" },
  { label: "5 Stars", value: "5 Stars" },
];

const ConditionModal: React.FC<ConditionModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  initialData,
}) => {
  const validationSchema = Yup.object().shape({
    conditionType: Yup.string().required("Condition type is required"),
    whichEmail: Yup.string().when("conditionType", {
      is: (val: string) => val === "Email Opened" || val === "Link Clicked",
      then: (schema) => schema.required("Please select which email to check"),
      otherwise: (schema) => schema.nullable(),
    }),
    comparison: Yup.string().when("conditionType", {
      is: (val: string) => val === "Referral Count" || val === "Rating Level",
      then: (schema) => schema.required("Comparison is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    referralCount: Yup.number().when("conditionType", {
      is: "Referral Count",
      then: (schema) =>
        schema
          .required("Referral count is required")
          .min(0, "Must be at least 0"),
      otherwise: (schema) => schema.nullable(),
    }),
    timePeriod: Yup.string().when("conditionType", {
      is: "Referral Count",
      then: (schema) => schema.required("Time period is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    ratingValue: Yup.string().when("conditionType", {
      is: "Rating Level",
      then: (schema) => schema.required("Rating value is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      conditionType: initialData?.conditionType || "",
      whichEmail: initialData?.whichEmail || "previous",
      linkUrl: initialData?.linkUrl || "",
      comparison: initialData?.comparison || "Greater than",
      referralCount: initialData?.referralCount || "0",
      timePeriod: initialData?.timePeriod || "All Time",
      ratingValue: initialData?.ratingValue || "4 Stars",
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
      onOpenChange();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (isOpen) {
      formik.resetForm({
        values: {
          conditionType: initialData?.conditionType || "",
          whichEmail: initialData?.whichEmail || "previous",
          linkUrl: initialData?.linkUrl || "",
          comparison: initialData?.comparison || "Greater than",
          referralCount: initialData?.referralCount || "0",
          timePeriod: initialData?.timePeriod || "All Time",
          ratingValue: initialData?.ratingValue || "4 Stars",
        },
      });
    }
  }, [isOpen, initialData]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      radius="lg"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-2 flex-shrink-0 p-4">
              <h3 className="text-base leading-none font-medium text-foreground">
                Configure Condition
              </h3>
              <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal">
                Set up the parameters for this automation step
              </p>
            </ModalHeader>
            <ModalBody className="p-4 pt-0">
              <div className="flex flex-col gap-4">
                <Select
                  label="Condition Type"
                  labelPlacement="outside"
                  placeholder="Select condition..."
                  selectedKeys={
                    formik.values.conditionType
                      ? [formik.values.conditionType]
                      : []
                  }
                  disabledKeys={
                    formik.values.conditionType
                      ? [formik.values.conditionType]
                      : []
                  }
                  onSelectionChange={(keys) =>
                    formik.setFieldValue(
                      "conditionType",
                      Array.from(keys)[0] as string,
                    )
                  }
                  variant="flat"
                  size="sm"
                  radius="sm"
                  isRequired
                  isInvalid={
                    !!(
                      formik.touched.conditionType &&
                      formik.errors.conditionType
                    )
                  }
                  errorMessage={
                    formik.touched.conditionType &&
                    (formik.errors.conditionType as string)
                  }
                >
                  {CONDITION_TYPES.map((type) => (
                    <SelectItem key={type.value} textValue={type.label}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>

                {(formik.values.conditionType === "Email Opened" ||
                  formik.values.conditionType === "Link Clicked") && (
                  <Select
                    label="Which Email?"
                    labelPlacement="outside"
                    placeholder="Select email..."
                    selectedKeys={
                      formik.values.whichEmail ? [formik.values.whichEmail] : []
                    }
                    disabledKeys={
                      formik.values.whichEmail ? [formik.values.whichEmail] : []
                    }
                    onSelectionChange={(keys) =>
                      formik.setFieldValue(
                        "whichEmail",
                        Array.from(keys)[0] as string,
                      )
                    }
                    variant="flat"
                    size="sm"
                    radius="sm"
                    isRequired
                    isInvalid={
                      !!(formik.touched.whichEmail && formik.errors.whichEmail)
                    }
                    errorMessage={
                      formik.touched.whichEmail &&
                      (formik.errors.whichEmail as string)
                    }
                  >
                    <SelectItem
                      key="previous"
                      textValue="Previous email in this flow"
                    >
                      Previous email in this flow
                    </SelectItem>
                  </Select>
                )}

                {formik.values.conditionType === "Link Clicked" && (
                  <Input
                    label="Link URL (optional)"
                    labelPlacement="outside"
                    placeholder="Leave blank for any link..."
                    value={formik.values.linkUrl}
                    onValueChange={(val) =>
                      formik.setFieldValue("linkUrl", val)
                    }
                    variant="flat"
                    size="sm"
                    radius="sm"
                  />
                )}

                {(formik.values.conditionType === "Referral Count" ||
                  formik.values.conditionType === "Rating Level") && (
                  <Select
                    label="Comparison"
                    labelPlacement="outside"
                    placeholder="Select comparison..."
                    selectedKeys={
                      formik.values.comparison ? [formik.values.comparison] : []
                    }
                    disabledKeys={
                      formik.values.comparison ? [formik.values.comparison] : []
                    }
                    onSelectionChange={(keys) =>
                      formik.setFieldValue(
                        "comparison",
                        Array.from(keys)[0] as string,
                      )
                    }
                    variant="flat"
                    size="sm"
                    radius="sm"
                    isRequired
                    isInvalid={
                      !!(formik.touched.comparison && formik.errors.comparison)
                    }
                    errorMessage={
                      formik.touched.comparison &&
                      (formik.errors.comparison as string)
                    }
                  >
                    {COMPARISONS.map((c) => (
                      <SelectItem key={c.value} textValue={c.label}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}

                {formik.values.conditionType === "Referral Count" && (
                  <>
                    <Input
                      label="Referral Count"
                      labelPlacement="outside"
                      type="number"
                      placeholder="10"
                      value={formik.values.referralCount}
                      onValueChange={(val) =>
                        formik.setFieldValue("referralCount", val)
                      }
                      variant="flat"
                      size="sm"
                      radius="sm"
                      isRequired
                      isInvalid={
                        !!(
                          formik.touched.referralCount &&
                          formik.errors.referralCount
                        )
                      }
                      errorMessage={
                        formik.touched.referralCount &&
                        (formik.errors.referralCount as string)
                      }
                    />
                    <Select
                      label="Time Period"
                      labelPlacement="outside"
                      placeholder="Select time period..."
                      selectedKeys={
                        formik.values.timePeriod
                          ? [formik.values.timePeriod]
                          : []
                      }
                      disabledKeys={
                        formik.values.timePeriod
                          ? [formik.values.timePeriod]
                          : []
                      }
                      onSelectionChange={(keys) =>
                        formik.setFieldValue(
                          "timePeriod",
                          Array.from(keys)[0] as string,
                        )
                      }
                      variant="flat"
                      size="sm"
                      radius="sm"
                      isRequired
                      isInvalid={
                        !!(
                          formik.touched.timePeriod && formik.errors.timePeriod
                        )
                      }
                      errorMessage={
                        formik.touched.timePeriod &&
                        (formik.errors.timePeriod as string)
                      }
                    >
                      {TIME_PERIODS.map((t) => (
                        <SelectItem key={t.value} textValue={t.label}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </>
                )}

                {formik.values.conditionType === "Rating Level" && (
                  <Select
                    label="Rating Value (Stars)"
                    labelPlacement="outside"
                    placeholder="Select rating..."
                    selectedKeys={
                      formik.values.ratingValue
                        ? [formik.values.ratingValue]
                        : []
                    }
                    disabledKeys={
                      formik.values.ratingValue
                        ? [formik.values.ratingValue]
                        : []
                    }
                    onSelectionChange={(keys) =>
                      formik.setFieldValue(
                        "ratingValue",
                        Array.from(keys)[0] as string,
                      )
                    }
                    variant="flat"
                    size="sm"
                    radius="sm"
                    isRequired
                    isInvalid={
                      !!(
                        formik.touched.ratingValue && formik.errors.ratingValue
                      )
                    }
                    errorMessage={
                      formik.touched.ratingValue &&
                      (formik.errors.ratingValue as string)
                    }
                  >
                    {RATING_VALUES.map((r) => (
                      <SelectItem key={r.value} textValue={r.label}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="gap-2 p-4 pt-0">
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
                radius="sm"
                size="sm"
                variant="solid"
                color="primary"
                onPress={() => formik.handleSubmit()}
              >
                Save Configuration
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConditionModal;
