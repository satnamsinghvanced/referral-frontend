import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  DatePicker,
} from "@heroui/react";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { parseDate } from "@internationalized/date";

interface TriggerModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSave: (config: any) => void;
  initialData?: any;
}

const TRIGGER_TYPES = [
  { label: "New Referrer Added", value: "New Referrer Added" },
  { label: "Referral Received", value: "Referral Received" },
  { label: "Specific Date", value: "Specific Date" },
];

const TriggerModal: React.FC<TriggerModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  initialData,
}) => {
  const validationSchema = Yup.object().shape({
    triggerType: Yup.string().required("Trigger type is required"),
    date: Yup.mixed().when("triggerType", {
      is: "Specific Date",
      then: (schema) => schema.required("Date is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      triggerType: initialData?.triggerType || "",
      date: initialData?.date ? parseDate(initialData.date) : null,
    },
    validationSchema,
    onSubmit: (values) => {
      onSave({
        ...values,
        date: values.date ? values.date.toString() : null,
      });
      onOpenChange();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (isOpen && initialData) {
      formik.setValues({
        triggerType: initialData.triggerType || "",
        date: initialData.date ? parseDate(initialData.date) : null,
      });
    } else if (isOpen && !initialData) {
      formik.resetForm();
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
                Configure Trigger
              </h3>
              <p className="text-sm font-normal text-default-400">
                Set up the parameters for this automation step
              </p>
            </ModalHeader>
            <ModalBody className="p-4 pt-0">
              <div className="space-y-4">
                <Select
                  label="Trigger Type"
                  labelPlacement="outside"
                  placeholder="Select trigger..."
                  selectedKeys={
                    formik.values.triggerType ? [formik.values.triggerType] : []
                  }
                  disabledKeys={
                    formik.values.triggerType ? [formik.values.triggerType] : []
                  }
                  onSelectionChange={(keys) =>
                    formik.setFieldValue(
                      "triggerType",
                      Array.from(keys)[0] as string,
                    )
                  }
                  variant="flat"
                  size="sm"
                  radius="sm"
                  isInvalid={
                    !!(formik.touched.triggerType && formik.errors.triggerType)
                  }
                  errorMessage={formik.errors.triggerType as string}
                >
                  {TRIGGER_TYPES.map((type) => (
                    <SelectItem key={type.value} textValue={type.label}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>

                {formik.values.triggerType === "Specific Date" && (
                  <DatePicker
                    label="Select Date"
                    labelPlacement="outside"
                    value={formik.values.date}
                    onChange={(val) => formik.setFieldValue("date", val)}
                    variant="flat"
                    size="sm"
                    radius="sm"
                    isInvalid={!!(formik.touched.date && formik.errors.date)}
                    errorMessage={formik.errors.date as string}
                  />
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

export default TriggerModal;
