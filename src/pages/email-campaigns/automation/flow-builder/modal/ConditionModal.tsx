import {
  Button,
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
  { label: "Email Opened", value: "email_opened" },
  { label: "Link Clicked", value: "link_clicked" },
  { label: "Tag Applied", value: "tag_applied" },
];

const ConditionModal: React.FC<ConditionModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  initialData,
}) => {
  const validationSchema = Yup.object().shape({
    conditionType: Yup.string().required("Condition type is required"),
    whichEmail: Yup.string().required("Please select which email to check"),
  });

  const formik = useFormik({
    initialValues: {
      conditionType: initialData?.conditionType || "",
      whichEmail: initialData?.whichEmail || "previous",
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
      onOpenChange();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (isOpen && initialData) {
      formik.setValues({
        conditionType: initialData.conditionType || "",
        whichEmail: initialData.whichEmail || "previous",
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
                Configure Condition
              </h3>
              <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal">
                Set up the parameters for this automation step
              </p>
            </ModalHeader>
            <ModalBody className="p-4 pt-0">
              <Select
                label="Condition Type"
                labelPlacement="outside"
                placeholder="Select condition..."
                selectedKeys={
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
                isInvalid={
                  formik.touched.conditionType && !!formik.errors.conditionType
                }
                errorMessage={formik.errors.conditionType as string}
              >
                {CONDITION_TYPES.map((type) => (
                  <SelectItem key={type.value} textValue={type.label}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Which Email?"
                labelPlacement="outside"
                placeholder="Select email..."
                selectedKeys={
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
                isInvalid={
                  formik.touched.whichEmail && !!formik.errors.whichEmail
                }
                errorMessage={formik.errors.whichEmail as string}
              >
                <SelectItem
                  key="previous"
                  textValue="Previous email in this flow"
                >
                  Previous email in this flow
                </SelectItem>
              </Select>
            </ModalBody>
            <ModalFooter className="gap-2 p-4 pt-0">
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
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
