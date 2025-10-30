import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import { FiExternalLink } from "react-icons/fi";
import {
  useFetchTwilioConfig,
  useSaveTwilioConfig,
  useUpdateTwilioConfig,
} from "../../hooks/useTwilio";
import { TwilioConfigRequest } from "../../types/call";

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
}: {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  // 1. TanStack Query Hooks
  const {
    data: existingConfig,
    isLoading,
    isError,
  } = useFetchTwilioConfig(userId);
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
      const payload = {
        userId: userId,
        data: {
          accountId: values.accountId,
          authToken: values.authToken,
          phone: values.phone,
        },
      };

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
      <Modal isOpen={isOpen} onOpenChange={onClose} size="md">
        <ModalContent className="py-10">
          <div className="flex flex-col items-center justify-center space-y-3">
            <Spinner size="md" />
            <p className="text-gray-600">Loading configuration...</p>
          </div>
        </ModalContent>
      </Modal>
    );
  }

  if (isError) {
    return (
      <Modal isOpen={isOpen} onOpenChange={onClose} size="md">
        <ModalContent>
          <ModalBody className="p-5 text-center">
            <p className="text-red-600 text-sm px-5">
              Failed to load Twilio configuration. Please try again.
            </p>
            <Button color="danger" variant="flat" onPress={onClose} size="sm">
              Close
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

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
          <ModalHeader className="p-5 pb-0 flex-col">
            <h2
              data-slot="dialog-title"
              className="leading-none font-medium text-base"
            >
              Twilio Configuration
            </h2>
            <p
              data-slot="dialog-description"
              className="text-xs text-gray-600 mt-2 font-normal"
            >
              Configure your Twilio account credentials to enable call tracking
              and recording features.
            </p>
          </ModalHeader>

          {/* Modal Body (Form Fields) */}
          <ModalBody className="px-5 py-5">
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
                // Formik Props
                value={formik.values.accountId}
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
                type="password"
                placeholder="••••••••••••••••••••••••••••••••"
                isRequired
                // Formik Props
                value={formik.values.authToken}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  (formik.touched.authToken as boolean) &&
                  (!!formik.errors.authToken as boolean)
                }
                errorMessage={
                  formik.touched.authToken && formik.errors.authToken
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
                // Formik Props
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  (formik.touched.phone as boolean) &&
                  (!!formik.errors.phone as boolean)
                }
                errorMessage={formik.touched.phone && formik.errors.phone}
              />

              {/* Information Box */}
              <div className="text-sm text-gray-700 bg-blue-50 p-3.5 rounded-lg border border-blue-200 mt-4">
                <div className="flex items-start gap-3">
                  <div>
                    <p className="font-semibold mb-1.5 text-gray-900">
                      Where to find these credentials:
                    </p>
                    <ul className="text-xs space-y-1 ml-1 text-gray-700">
                      <li className="flex items-center gap-1">
                        • Account SID & Auth Token:
                        <a
                          href="https://console.twilio.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
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
            </div>
          </ModalBody>

          {/* Modal Footer (Action Buttons) */}
          <ModalFooter className="flex justify-end gap-2 px-5 pb-5 pt-0">
            <Button
              size="sm"
              variant="ghost"
              onPress={onClose}
              className="border border-gray-300 text-gray-700 hover:bg-gray-50"
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
