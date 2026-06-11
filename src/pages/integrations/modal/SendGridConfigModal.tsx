import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff, FiMail, FiKey } from "react-icons/fi";
import * as Yup from "yup";
import {
  useCreateEmailIntegration,
  useUpdateEmailIntegration,
} from "../../../hooks/integrations/useEmailMarketing";
import {
  EmailIntegrationBody,
  EmailIntegrationResponse,
} from "../../../types/integrations/emailMarketing";
import { formatDateToReadable } from "../../../utils/formatDateToReadable";

const validationSchema = Yup.object().shape({
  accountEmail: Yup.string()
    .email("Invalid email address")
    .required("Verified Sender Email is required."),
  password: Yup.string().required("SendGrid API Key is required."),
});

export default function SendGridConfigModal({
  isOpen,
  onOpenChange,
  existingConfig,
  isLoading,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  existingConfig: EmailIntegrationResponse | undefined;
  isLoading: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const createMutation = useCreateEmailIntegration();
  const updateMutation = useUpdateEmailIntegration();

  const isUpdateMode = !!existingConfig?._id && existingConfig.provider === "SendGrid";
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const formik = useFormik({
    initialValues: {
      accountEmail: existingConfig?.provider === "SendGrid" ? existingConfig?.accountEmail || "" : "",
      password: existingConfig?.provider === "SendGrid" ? existingConfig?.password || "" : "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload: EmailIntegrationBody = {
          provider: "SendGrid",
          host: "smtp.sendgrid.net",
          port: 587,
          username: "apikey",
          password: values.password,
          encryption: "TLS",
          accountEmail: values.accountEmail,
          status: "Connected",
        };

        if (isUpdateMode && existingConfig?._id) {
          await updateMutation.mutateAsync({
            id: existingConfig._id,
            data: payload,
          });
        } else {
          await createMutation.mutateAsync(payload);
        }
        onClose();
      } catch (error) {
        console.error("SendGrid Configuration Error:", error);
      }
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  const onClose = () => onOpenChange(false);

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md" placement="center">
        <ModalContent className="py-10">
          <div className="flex flex-col items-center justify-center space-y-3">
            <Spinner size="md" />
            <p className="text-gray-600">Loading configuration...</p>
          </div>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      classNames={{
        base: "max-sm:!m-3 !m-0",
        closeButton: "cursor-pointer",
      }}
      placement="center"
    >
      <ModalContent>
        <form onSubmit={formik.handleSubmit}>
          <ModalHeader className="p-4 pb-0 flex-col">
            <h2 className="leading-none font-medium text-base text-foreground">
              SendGrid Integration
            </h2>
            <p className="text-xs text-gray-600 dark:text-foreground/60 mt-2 font-normal">
              Enter your Twilio SendGrid API key and verified sender email to send marketing campaigns.
            </p>
          </ModalHeader>

          <ModalBody className="px-4 py-4">
            <div className="space-y-4">
              <Input
                size="sm"
                radius="sm"
                label="Verified Sender Email"
                labelPlacement="outside"
                name="accountEmail"
                placeholder="sender@yourpractice.com"
                isRequired
                value={formik.values.accountEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.accountEmail && formik.errors.accountEmail)}
                errorMessage={formik.errors.accountEmail}
                startContent={
                  <FiMail className="text-gray-400 dark:text-foreground/40" />
                }
              />
            </div>
            <div className="">
              <Input
                size="sm"
                radius="sm"
                label="SendGrid API Key"
                labelPlacement="outside"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={isUpdateMode ? "••••••••" : "SG.••••••••"}
                isRequired={!isUpdateMode}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.password && formik.errors.password)}
                errorMessage={formik.errors.password}
                startContent={
                  <FiKey className="text-gray-400 dark:text-foreground/40 " />
                }
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                }
              />
            </div>

            {isUpdateMode && existingConfig?.status === "Connected" && (
              <div className="p-3 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 text-xs rounded-lg border border-green-200 dark:border-green-500/30">
                ✅ SendGrid integration is active. Last verified:{" "}
                {formatDateToReadable(existingConfig.lastTestedAt, true)}
              </div>
            )}

          </ModalBody>

          <ModalFooter className="flex justify-end gap-2 px-4 pb-4 pt-0">
            <Button
              size="sm"
              variant="ghost"
              color="default"
              onPress={onClose}
              className="border-small"
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="solid"
              color="primary"
              type="submit"
              isLoading={isSubmitting}
              isDisabled={isSubmitting || !formik.isValid}
            >
              {isUpdateMode ? "Update Integration" : "Save Integration"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
