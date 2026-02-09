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

interface TagModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSave: (config: any) => void;
  initialData?: any;
}

const TAG_ACTIONS = [
  { label: "Add Tag", value: "add" },
  { label: "Remove Tag", value: "remove" },
];

const TagModal: React.FC<TagModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  initialData,
}) => {
  const validationSchema = Yup.object().shape({
    action: Yup.string().required("Action is required"),
    tagName: Yup.string().trim().required("Tag name is required"),
  });

  const formik = useFormik({
    initialValues: {
      action: initialData?.action || "add",
      tagName: initialData?.tagName || "",
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
        action: initialData.action || "add",
        tagName: initialData.tagName || "",
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
                Configure Tags
              </h3>
              <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal">
                Set up the parameters for this automation step
              </p>
            </ModalHeader>
            <ModalBody className="p-4 pt-0">
              <Select
                label="Action"
                labelPlacement="outside"
                selectedKeys={[formik.values.action]}
                onSelectionChange={(keys) =>
                  formik.setFieldValue("action", Array.from(keys)[0] as string)
                }
                variant="flat"
                size="sm"
                radius="sm"
              >
                {TAG_ACTIONS.map((a) => (
                  <SelectItem key={a.value} textValue={a.label}>
                    {a.label}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="Tag Name"
                labelPlacement="outside"
                placeholder="Enter tag name..."
                value={formik.values.tagName}
                onValueChange={(val) => formik.setFieldValue("tagName", val)}
                variant="flat"
                size="sm"
                radius="sm"
                isInvalid={!!(formik.touched.tagName && formik.errors.tagName)}
                errorMessage={formik.errors.tagName as string}
              />
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

export default TagModal;
