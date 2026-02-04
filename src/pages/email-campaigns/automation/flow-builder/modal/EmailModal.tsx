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
import { useCampaignTemplates } from "../../../../../hooks/useCampaign";

interface EmailModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSave: (config: any) => void;
  initialData?: any;
}

const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  initialData,
}) => {
  const { data: campaignTemplates } = useCampaignTemplates({
    page: 1,
    limit: 100,
  });
  const templates = campaignTemplates?.templates || [];

  const validationSchema = Yup.object().shape({
    template: Yup.string().required("Email template is required"),
    subject: Yup.string().required("Subject line is required"),
  });

  const formik = useFormik({
    initialValues: {
      template: initialData?.template || "",
      subject: initialData?.subject || "",
    },
    validationSchema,
    onSubmit: (values) => {
      const selectedTemplate = templates.find(
        (t: any) => t._id === values.template,
      );
      onSave({
        ...values,
        templateName: selectedTemplate?.name || "Unknown Template",
      });
      onOpenChange();
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (isOpen && initialData) {
      formik.setValues({
        template: initialData.template || "",
        subject: initialData.subject || "",
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
                Configure Send Email
              </h3>
              <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal">
                Set up the parameters for this automation step
              </p>
            </ModalHeader>
            <ModalBody className="p-4 pt-0">
              <Select
                label="Email Template"
                labelPlacement="outside"
                placeholder="Select template..."
                selectedKeys={
                  formik.values.template ? [formik.values.template] : []
                }
                onSelectionChange={(keys) =>
                  formik.setFieldValue(
                    "template",
                    Array.from(keys)[0] as string,
                  )
                }
                variant="flat"
                size="sm"
                radius="sm"
                isInvalid={
                  !!(formik.touched.template && formik.errors.template)
                }
                errorMessage={formik.errors.template as string}
              >
                {templates.map((t: any) => (
                  <SelectItem key={t._id} textValue={t.name}>
                    {t.name}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="Email Subject"
                labelPlacement="outside"
                placeholder="Email subject line..."
                value={formik.values.subject}
                onValueChange={(val) => formik.setFieldValue("subject", val)}
                variant="flat"
                size="sm"
                radius="sm"
                isInvalid={!!(formik.touched.subject && formik.errors.subject)}
                errorMessage={formik.errors.subject as string}
              />
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

export default EmailModal;
