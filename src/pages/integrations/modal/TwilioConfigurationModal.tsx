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
import { FiExternalLink, FiEye, FiEyeOff } from "react-icons/fi";
import * as Yup from "yup";
import {
  useSaveTwilioConfig,
  useUpdateTwilioConfig,
} from "../../../hooks/integrations/useTwilio";
import {
  TwilioConfigResponse,
  TwilioConfigRequest,
} from "../../../types/integrations/twilio";

// --- Yup Validation Schema ---
const validationSchema = Yup.object().shape({
  accountId: Yup.string()
    .matches(
      /^AC[0-9a-fA-F]{32}$/,
      'Invalid Account SID format. Must start with "AC" followed by 32 hex characters.'
    )
    .required("Account SID is required."),
  authToken: Yup.string()
    .min(32, "Auth Token must be at least 32 characters.")
    .required("Auth Token is required."),
  phone: Yup.string()
    .matches(
      /^\+[1-9]\d{1,14}$/,
      "Invalid phone number format. Must include country code (e.g., +15551234567)."
    )
    .required("Twilio Phone Number is required."),
});

// The main Modal component using the Hero UI structure
// NOTE: We now require a 'userId' to fetch/save the config.
export default function TwilioConfigurationModal({
  userId,
  isOpen,
  onClose,
  existingConfig,
  isLoading,
}: // isError,
{
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  existingConfig?: TwilioConfigResponse | undefined;
  isLoading?: boolean;
  isError?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const saveMutation = useSaveTwilioConfig();
  const updateMutation = useUpdateTwilioConfig();

  // Determine if we are updating (config exists) or saving (config is null/undefined)
  const isUpdateMode = !!existingConfig?.accountId;
  const mutation = isUpdateMode ? updateMutation : saveMutation;

  // 2. Formik Setup
  const formik = useFormik<TwilioConfigRequest>({
    initialValues: {
      accountId: existingConfig?.accountId || "",
      authToken: existingConfig?.authToken || "",
      phone: existingConfig?.phone || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      let payload: any = {
        userId: userId,
        data: {
          accountId: values.accountId,
          authToken: values.authToken,
          phone: values.phone,
        },
      };

      if (isUpdateMode) {
        payload = {
          id: existingConfig._id,
          data: {
            ...payload.data,
          },
        };
      }

      try {
        await mutation.mutateAsync(payload);
        onClose();
      } catch (error) {
        console.error("Twilio Configuration Error:", error);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true, // Allows initialValues to update when existingConfig changes
  });

  // 3. Effect to set initial form values when data is loaded
  useEffect(() => {
    if (existingConfig) {
      formik.setValues({
        accountId: existingConfig.accountId || "",
        authToken: existingConfig.authToken || "",
        phone: existingConfig.phone || "",
      });
    }
  }, [existingConfig]); // Only run when existingConfig changes

  // Handle loading and error states
  if (isLoading) {
    return (
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        size="md"
        classNames={{
          base: `max-sm:!m-3 !m-0`,
          closeButton: "cursor-pointer",
        }}
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

  // if (isError) {
  //   return (
  //     <Modal
  //       isOpen={isOpen}
  //       onOpenChange={onClose}
  //       size="md"
  //       classNames={{
  //         base: `max-sm:!m-3 !m-0`,
  //         closeButton: "cursor-pointer",
  //       }}
  //     >
  //       <ModalContent>
  //         <ModalBody className="p-5 text-center">
  //           <p className="text-red-600 text-sm px-5">
  //             Failed to load Twilio configuration. Please try again.
  //           </p>
  //           <Button color="danger" variant="flat" onPress={onClose} size="sm">
  //             Close
  //           </Button>
  //         </ModalBody>
  //       </ModalContent>
  //     </Modal>
  //   );
  // }

  const isSubmitting = mutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="md"
    >
      <ModalContent>
        <form onSubmit={formik.handleSubmit}>
          {/* Modal Header */}
          <ModalHeader className="p-4 pb-0 flex-col">
            <h2
              data-slot="dialog-title"
              className="leading-none font-medium text-base text-foreground"
            >
              Twilio Configuration
            </h2>
            <p
              data-slot="dialog-description"
              className="text-xs text-gray-600 dark:text-foreground/60 mt-2 font-normal"
            >
              Configure your Twilio account credentials to enable call tracking
              and recording features.
            </p>
          </ModalHeader>

          {/* Modal Body (Form Fields) */}
          <ModalBody className="px-4 py-4">
            <div className="space-y-4">
              <Input
                size="sm"
                radius="sm"
                label="Account SID"
                labelPlacement="outside-top"
                name="accountId" // Changed from 'accountSid' to 'accountId' to match the TwilioConfigRequest type
                type="text"
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                isRequired
                maxLength={34}
                // Formik Props
                value={formik.values.accountId as string}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  (formik.touched.accountId as boolean) &&
                  (!!formik.errors.accountId as boolean)
                }
                errorMessage={
                  formik.touched.accountId && formik.errors.accountId
                }
              />

              <Input
                size="sm"
                radius="sm"
                label="Auth Token"
                labelPlacement="outside-top"
                name="authToken"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••••••••••••••••••••••"
                isRequired
                maxLength={32}
                // Formik Props
                value={formik.values.authToken as string}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  (formik.touched.authToken as boolean) &&
                  (!!formik.errors.authToken as boolean)
                }
                errorMessage={
                  formik.touched.authToken && formik.errors.authToken
                }
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                }
              />

              <Input
                size="sm"
                radius="sm"
                label="Twilio Phone Number"
                labelPlacement="outside-top"
                name="phone" // Changed from 'phoneNumber' to 'phone' to match the TwilioConfigRequest type
                type="tel"
                placeholder="+15551234567"
                isRequired
                maxLength={16}
                // Formik Props
                value={formik.values.phone as string}
                onChange={(e) => {
                  const val = e.target.value;
                  // Allow only '+' at the beginning and digits thereafter
                  const filteredVal = val.startsWith("+")
                    ? "+" + val.slice(1).replace(/\D/g, "")
                    : val.replace(/\D/g, "");
                  formik.setFieldValue("phone", filteredVal);
                }}
                onBlur={formik.handleBlur}
                isInvalid={
                  (formik.touched.phone as boolean) &&
                  (!!formik.errors.phone as boolean)
                }
                errorMessage={formik.touched.phone && formik.errors.phone}
              />

              {/* Information Box */}
              <div className="text-sm text-gray-700 dark:text-foreground/80 bg-blue-50 dark:bg-blue-900/10 p-3.5 rounded-lg border border-blue-200 dark:border-blue-500/30 mt-4">
                <div className="flex items-start gap-3">
                  <div>
                    <p className="font-semibold mb-1.5 text-gray-900 dark:text-foreground">
                      Where to find these credentials:
                    </p>
                    <ul className="text-xs space-y-1 ml-1 text-gray-700 dark:text-foreground/70">
                      <li className="flex items-center gap-1">
                        • Account SID & Auth Token:
                        <a
                          href="https://console.twilio.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          Twilio Console
                          <FiExternalLink className="inline-block h-3 w-3 ml-1" />
                        </a>
                      </li>
                      <li>
                        • Phone Number: Active Twilio phone number from your
                        account
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Status Message */}
              {isUpdateMode && existingConfig?.status === "Connected" && (
                <div className="p-3 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 text-xs rounded-lg border border-green-200 dark:border-green-500/30">
                  ✅ Twilio integration is active and connected.
                </div>
              )}
              {isUpdateMode && existingConfig?.status === "Disconnected" && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 text-xs rounded-lg border border-blue-200 dark:border-blue-500/30">
                  ℹ️ Twilio is disconnected. Please reconnect it by using
                  switch.
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

          {/* Modal Footer (Action Buttons) */}
          <ModalFooter className="flex justify-end gap-2 px-4 pb-4 pt-0">
            <Button
              size="sm"
              variant="ghost"
              onPress={onClose}
              className="border border-gray-300 dark:border-default-200 text-gray-700 dark:text-foreground/70 hover:bg-gray-50 dark:hover:bg-default-100"
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="solid"
              color="primary"
              type="submit" // Important: Trigger Formik submission
              isLoading={isSubmitting}
              isDisabled={isSubmitting || !formik.isValid}
            >
              {isUpdateMode ? "Update Configuration" : "Save Configuration"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
