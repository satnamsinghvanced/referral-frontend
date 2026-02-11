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

interface WaitModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSave: (config: any) => void;
  initialData?: any;
}

const TIME_UNITS = [
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
];

const WaitModal: React.FC<WaitModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  initialData,
}) => {
  const validationSchema = Yup.object().shape({
    duration: Yup.number()
      .typeError("Duration must be a number")
      .required("Duration is required")
      .positive("Duration must be positive")
      .integer("Duration must be an integer"),
    unit: Yup.string().required("Unit is required"),
  });

  const formik = useFormik({
    initialValues: {
      duration: initialData?.duration || "1",
      unit: initialData?.unit || "days",
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
          duration: initialData?.duration || "1",
          unit: initialData?.unit || "days",
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
                Configure Wait
              </h3>
              <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal">
                Set up the parameters for this automation step
              </p>
            </ModalHeader>
            <ModalBody className="p-4 pt-0">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    label="Wait Duration"
                    labelPlacement="outside"
                    placeholder="1"
                    value={formik.values.duration}
                    onValueChange={(val) =>
                      formik.setFieldValue("duration", val)
                    }
                    variant="flat"
                    size="sm"
                    radius="sm"
                    isRequired
                    isInvalid={
                      !!(formik.touched.duration && formik.errors.duration)
                    }
                    errorMessage={
                      formik.touched.duration &&
                      (formik.errors.duration as string)
                    }
                  />
                </div>
                <div className="w-[120px]">
                  <Select
                    placeholder="Unit"
                    isRequired
                    selectedKeys={[formik.values.unit]}
                    disabledKeys={[formik.values.unit]}
                    onSelectionChange={(keys) =>
                      formik.setFieldValue(
                        "unit",
                        Array.from(keys)[0] as string,
                      )
                    }
                    variant="flat"
                    size="sm"
                    radius="sm"
                    isInvalid={!!(formik.touched.unit && formik.errors.unit)}
                    errorMessage={
                      formik.touched.unit && (formik.errors.unit as string)
                    }
                  >
                    {TIME_UNITS.map((u) => (
                      <SelectItem key={u.value} textValue={u.label}>
                        {u.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
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

export default WaitModal;
