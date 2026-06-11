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
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FiEye, FiEyeOff, FiMail, FiServer, FiInfo } from "react-icons/fi";
import * as Yup from "yup";
import {
  useCreateEmailIntegration,
  useUpdateEmailIntegration,
} from "../../../hooks/integrations/useEmailMarketing";
import {
  EmailIntegrationBody,
  EmailIntegrationResponse,
} from "../../../types/integrations/emailMarketing";
import { ENCRYPTION_TYPES, PROVIDERS } from "../../../consts/integrations";
import { formatDateToReadable } from "../../../utils/formatDateToReadable";

// --- Yup Validation Schema ---
const validationSchema = Yup.object().shape({
  provider: Yup.string().required("Provider is required."),
  host: Yup.string().required("Host is required."),
  port: Yup.number()
    .required("Port is required.")
    .positive("Port must be positive")
    .integer("Port must be an integer"),
  username: Yup.string().required("Username is required."),
  password: Yup.string().required("Password is required."),
  encryption: Yup.string()
    .oneOf(["TLS", "SSL", "None"], "Invalid encryption type")
    .required("Encryption is required."),
});

export default function EmailMarketingConfigModal({
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

  // Mutations
  const createMutation = useCreateEmailIntegration();
  const updateMutation = useUpdateEmailIntegration();

  const isUpdateMode = !!existingConfig?._id;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Formik Setup
  const formik = useFormik<EmailIntegrationBody>({
    initialValues: {
      provider: existingConfig?.provider || "SendGrid",
      host: existingConfig?.host || "smtp.sendgrid.net",
      port: existingConfig?.port || 587,
      username: existingConfig?.username || "",
      password: existingConfig?.password || "",
      encryption: existingConfig?.encryption || "TLS",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isUpdateMode && existingConfig?._id) {
          // If password is empty in update mode, we might not want to send it
          // depending on how the backend handles it. Assuming backend handles optional password.
          await updateMutation.mutateAsync({
            id: existingConfig._id,
            data: values,
          });
        } else {
          await createMutation.mutateAsync(values);
        }
        onClose();
      } catch (error) {
        console.error("Email Configuration Error:", error);
      }
    },
  });

  // Manually sync values if existingConfig arrives later
  useEffect(() => {
    if (existingConfig) {
      formik.setValues({
        provider: existingConfig.provider || "SendGrid",
        host: existingConfig.host || "smtp.sendgrid.net",
        port: existingConfig.port || 587,
        username: existingConfig.username || "",
        password: existingConfig.password || "",
        encryption: existingConfig.encryption || "TLS",
      });
    }
  }, [existingConfig]);

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  const onClose = () => onOpenChange(false);

  if (isLoading) {
    return (
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="md"
        placement="center"
      >
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
              Email Marketing Integration
            </h2>
            <p className="text-xs text-gray-600 dark:text-foreground/60 mt-2 font-normal">
              Configure your SMTP settings to enable automated email marketing
              and notifications.
            </p>
          </ModalHeader>

          <ModalBody className="px-4 py-4">
            <div className="space-y-4">
              <Select
                size="sm"
                radius="sm"
                label="Provider"
                labelPlacement="outside"
                name="provider"
                placeholder="Select an email provider"
                selectedKeys={
                  formik.values.provider ? [formik.values.provider] : []
                }
                disabledKeys={
                  formik.values.provider ? [formik.values.provider] : []
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!(formik.touched.provider && formik.errors.provider)
                }
                errorMessage={formik.errors.provider}
              >
                {PROVIDERS.map((provider) => (
                  <SelectItem key={provider.value}>{provider.label}</SelectItem>
                ))}
              </Select>

              <div className="flex gap-3">
                <Input
                  className="flex-[2]"
                  size="sm"
                  radius="sm"
                  label="SMTP Host"
                  labelPlacement="outside"
                  name="host"
                  placeholder="smtp.example.com"
                  isRequired
                  value={formik.values.host}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.host && formik.errors.host)}
                  errorMessage={formik.errors.host}
                  startContent={
                    <FiServer className="text-gray-400 dark:text-foreground/40" />
                  }
                />
                <Input
                  className="flex-1"
                  size="sm"
                  radius="sm"
                  label="Port"
                  labelPlacement="outside"
                  name="port"
                  type="text"
                  placeholder="587"
                  isRequired
                  maxLength={4}
                  value={formik.values.port.toString()}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    formik.setFieldValue("port", value);
                  }}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.port && formik.errors.port)}
                  errorMessage={formik.errors.port}
                />
              </div>

              <div className="flex">
                <Input
                  size="sm"
                  radius="sm"
                  label="Username / Email"
                  labelPlacement="outside"
                  name="username"
                  placeholder="user@example.com"
                  isRequired
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(formik.touched.username && formik.errors.username)
                  }
                  errorMessage={formik.errors.username}
                  startContent={
                    <FiMail className="text-gray-400 dark:text-foreground/40" />
                  }
                />
              </div>

              <Input
                size="sm"
                radius="sm"
                label="Password / API Key"
                labelPlacement="outside-top"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={
                  isUpdateMode ? "••••••••" : "Enter password or API key"
                }
                isRequired={!isUpdateMode}
                value={formik.values.password || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!(formik.touched.password && formik.errors.password)
                }
                errorMessage={formik.errors.password}
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

              <div className="flex">
                <Select
                  size="sm"
                  radius="sm"
                  label="Encryption"
                  labelPlacement="outside"
                  name="encryption"
                  placeholder="Select encryption type"
                  selectedKeys={
                    formik.values.encryption ? [formik.values.encryption] : []
                  }
                  disabledKeys={
                    formik.values.encryption ? [formik.values.encryption] : []
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(formik.touched.encryption && formik.errors.encryption)
                  }
                  errorMessage={formik.errors.encryption}
                >
                  {ENCRYPTION_TYPES.map((type) => (
                    <SelectItem key={type.value}>{type.label}</SelectItem>
                  ))}
                </Select>
              </div>

              {/* Status Message */}
              {isUpdateMode && existingConfig?.status === "Connected" && (
                <div className="p-3 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 text-xs rounded-lg border border-green-200 dark:border-green-500/30">
                  ✅ SMTP configuration is active. Last tested:{" "}
                  {formatDateToReadable(existingConfig.lastTestedAt, true)}
                </div>
              )}
              {isUpdateMode && existingConfig?.status === "Disconnected" && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 text-xs rounded-lg border border-blue-200 dark:border-blue-500/30">
                  ℹ️ Email Marketing is disconnected. Please reconnect it by
                  using switch.
                </div>
              )}
              {isUpdateMode && existingConfig?.status === "Error" && (
                <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 text-xs rounded-lg border border-red-200 dark:border-red-500/30">
                  ⚠️ Connection failed. Please check your credentials and try
                  again.
                </div>
              )}
            </div>
          </ModalBody>

          <ModalFooter className="flex justify-between items-center px-4 pb-4 pt-0">
            <Popover placement="top-start" showArrow>
              <PopoverTrigger>
                <Button variant="light" size="sm" className="text-gray-500 flex items-center gap-1">
                  <FiInfo size={16} /> 
                  <span>Info</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="px-1 py-2 text-xs">
                  <div className="text-sm font-semibold mb-2 flex items-center gap-2 text-foreground">
                    <FiMail className="text-primary" /> Gmail Setup Guide
                  </div>
                  <ol className="list-decimal pl-4 space-y-1 text-gray-600 dark:text-foreground/70 mb-3">
                    <li>Open a new tab and go directly to: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-primary hover:underline">https://myaccount.google.com/apppasswords</a></li>
                    <li>Ensure 2 step verification is enabled.</li>
                    <li>Type a name (like Referral App) into the box and click Create.</li>
                    <li>Copy the 16-letter code that appears on your screen.</li>
                  </ol>
                  <div className="bg-gray-50 dark:bg-default-100/50 p-2 rounded border border-foreground/10 space-y-1">
                    <p><span className="font-semibold">SMTP Host:</span> smtp.gmail.com</p>
                    <p><span className="font-semibold">Port:</span> 587</p>
                    <p><span className="font-semibold">Username:</span> Your full Gmail address</p>
                    <p><span className="font-semibold">Password:</span> Paste the 16-letter code here</p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex gap-2">
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
                {isUpdateMode ? "Update Configuration" : "Save Integration"}
              </Button>
            </div>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
