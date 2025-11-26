import React, { useState } from "react";
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
import { FiExternalLink, FiEye, FiEyeOff } from "react-icons/fi";
import {
  useFetchGoogleCalendarIntegration,
  useGenerateGoogleCalendarAuthUrl,
  useUpdateGoogleCalendarIntegration,
} from "../../../hooks/integrations/useGoogleCalendar";
import {
  GenerateAuthUrlRequest,
  UpdateGoogleCalendarRequest,
} from "../../../types/integrations/googleCalendar";

// --- Yup Validation Schema ---
const validationSchema = Yup.object().shape({
  clientId: Yup.string()
    .required("Client ID is required.")
    // Relaxing regex slightly to avoid environment-specific issues, though the intent remains clear.
    .matches(
      /.apps.googleusercontent.com$/,
      "Invalid Client ID format. Usually ends with '.apps.googleusercontent.com'"
    ),
  clientSecret: Yup.string().required("Client Secret is required."),
  redirectUri: Yup.string()
    .url("Must be a valid URL")
    .required("Redirect URI is required."),
});

/**
 * NOTE: The original code used imports from "@heroui/react" and "react-icons/fi",
 * which could not be resolved in the current environment.
 * For compatibility, I have assumed the original component props and structure,
 * but if these dependencies are not available, this component will fail
 * to render due to unresolved imports.
 * * Assuming the original component library and react-icons are available
 * as they are used extensively throughout the component.
 * I removed the unused 'useEffect' import and fixed the two type imports.
 */

export default function GoogleCalendarConfigModal({
  userId,
  isOpen,
  onClose,
}: {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [showSecret, setShowSecret] = useState(false);

  // TanStack Query Hooks
  const {
    data: existingConfig,
    isLoading: isConfigLoading,
    isError: isConfigError,
  } = useFetchGoogleCalendarIntegration();

  // Save (Generate Auth URL) Mutation
  const generateAuthUrlMutation = useGenerateGoogleCalendarAuthUrl();
  // Update (Save Credentials) Mutation
  const updateConfigMutation = useUpdateGoogleCalendarIntegration();

  // Determine if we are in update mode based on the presence of existing config data
  const isUpdateMode = !!existingConfig?._id;

  // Determine global loading state
  const isGlobalLoading = isConfigLoading;

  // Determine submitting state
  const isSubmitting =
    generateAuthUrlMutation.isPending || updateConfigMutation.isPending;

  // 2. Formik Setup
  const formik = useFormik<GenerateAuthUrlRequest>({
    initialValues: {
      userId: userId || "",
      clientId: existingConfig?.clientId || "",
      clientSecret: existingConfig?.clientSecret || "",
      redirectUri: existingConfig?.redirectUri || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        if (isUpdateMode && existingConfig) {
          // --- UPDATE MODE: User is updating credentials for an existing integration ---
          const updateData: UpdateGoogleCalendarRequest = {
            platform: "google_calendar", // Assuming a fixed platform value
            clientId: values.clientId,
            clientSecret: values.clientSecret,
            redirectUri: values.redirectUri,
            // Tokens are deliberately excluded here as they are managed by the backend.
          };

          await updateConfigMutation.mutateAsync({
            id: existingConfig._id,
            data: updateData,
          });

          // On successful update, TanStack Query automatically refetches the config.
          onClose();
        } else {
          // --- INITIAL SAVE MODE: First time setup, generate Auth URL ---
          const savePayload: GenerateAuthUrlRequest = {
            userId: userId,
            clientId: values.clientId,
            clientSecret: values.clientSecret,
            redirectUri: values.redirectUri,
          };

          const response = await generateAuthUrlMutation.mutateAsync(
            savePayload
          );

          // On success, redirect the user to Google for authorization
          if (response?.authUrl) {
            window.open(response.authUrl, "_blank");
            onClose(); // Close modal after initiating OAuth flow
          } else {
            throw new Error("Failed to generate authorization URL.");
          }
        }
      } catch (error) {
        // Display a general error message or log
        console.error("Google Calendar Configuration Error:", error);
        // Note: In a real app, you would show a toast/alert here.
      } finally {
        setSubmitting(false);
      }
    },
    // Reinitialize form values when existingConfig changes (i.e., when data loads)
    enableReinitialize: true,
  });

  // Handle loading state
  if (isGlobalLoading) {
    return (
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        size="md"
        classNames={{ base: `max-sm:!m-3 !m-0`, closeButton: "cursor-pointer" }}
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

  // Handle error state
  if (isConfigError) {
    return (
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        size="md"
        classNames={{ base: `max-sm:!m-3 !m-0`, closeButton: "cursor-pointer" }}
      >
        <ModalContent>
          <ModalBody className="p-5 text-center">
            <p className="text-red-600 text-sm px-5">
              Failed to load Google Calendar configuration. Please try again.
            </p>
            <Button
              color="danger"
              variant="flat"
              onPress={onClose}
              size="sm"
              className="mt-4"
            >
              Close
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

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
            <h2 className="leading-none font-medium text-base">
              Google Calendar Integration
            </h2>
            <p className="text-xs text-gray-600 mt-2 font-normal">
              Connect your Google Calendar to sync appointments and manage
              availability.
            </p>
          </ModalHeader>

          {/* Modal Body */}
          <ModalBody className="px-5 py-5">
            <div className="space-y-4">
              {/* Client ID */}
              <Input
                size="sm"
                radius="sm"
                label="Client ID"
                labelPlacement="outside-top"
                name="clientId"
                type="text"
                placeholder="xxxxxxxxxxxx-xxxxxxxx.apps.googleusercontent.com"
                isRequired
                value={formik.values.clientId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  (formik.touched.clientId as boolean) &&
                  (!!formik.errors.clientId as boolean)
                }
                errorMessage={formik.touched.clientId && formik.errors.clientId}
              />

              {/* Client Secret */}
              <Input
                size="sm"
                radius="sm"
                label="Client Secret"
                labelPlacement="outside-top"
                name="clientSecret"
                type={showSecret ? "text" : "password"}
                placeholder="Enter your Client Secret"
                isRequired
                value={formik.values.clientSecret}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  (formik.touched.clientSecret as boolean) &&
                  (!!formik.errors.clientSecret as boolean)
                }
                errorMessage={
                  formik.touched.clientSecret && formik.errors.clientSecret
                }
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="text-gray-500 focus:outline-none"
                  >
                    {showSecret ? <FiEyeOff /> : <FiEye />}
                  </button>
                }
              />

              {/* Redirect URI */}
              <div>
                <Input
                  size="sm"
                  radius="sm"
                  label="Redirect URI"
                  labelPlacement="outside-top"
                  name="redirectUri"
                  type="url"
                  placeholder="https://your-app.com/api/auth/callback/google"
                  isRequired
                  value={formik.values.redirectUri}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    (formik.touched.redirectUri as boolean) &&
                    (!!formik.errors.redirectUri as boolean)
                  }
                  errorMessage={
                    formik.touched.redirectUri && formik.errors.redirectUri
                  }
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Must match the authorized redirect URI in your Google Cloud
                  Console.
                </p>
              </div>

              {/* Helper Information Box */}
              <div className="text-sm text-gray-700 bg-blue-50 p-3.5 rounded-lg border border-blue-200 mt-4">
                <div className="flex items-start gap-3">
                  <div>
                    <p className="font-semibold mb-1.5 text-gray-900">
                      Setup Instructions:
                    </p>
                    <ul className="text-xs space-y-1 ml-1 text-gray-700 list-disc list-inside">
                      <li>
                        Go to the{" "}
                        <a
                          href="https://console.cloud.google.com/apis/credentials"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium inline-flex items-center"
                        >
                          Google Cloud Console{" "}
                          <FiExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </li>
                      <li>Create a new project or select an existing one.</li>
                      <li>
                        Enable the <strong>Google Calendar API</strong>.
                      </li>
                      <li>Create OAuth 2.0 Client credentials.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Status Message for Configured Integration */}
              {isUpdateMode && existingConfig?.refreshToken && (
                <div className="p-3 bg-green-50 text-green-700 text-xs rounded-lg border border-green-200 font-medium">
                  ✅ Integration is currently active and configured. Tokens are
                  stored securely.
                </div>
              )}
              {isUpdateMode && !existingConfig?.refreshToken && (
                <div className="p-3 bg-yellow-50 text-yellow-700 text-xs rounded-lg border border-yellow-200 font-medium">
                  ⚠️ Configuration saved, but authorization is pending. Click
                  'Save and Authorize' to complete the OAuth flow.
                </div>
              )}
            </div>
          </ModalBody>

          {/* Modal Footer */}
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
              type="submit"
              isLoading={isSubmitting}
              isDisabled={isSubmitting || !formik.isValid}
            >
              {isUpdateMode ? "Update Credentials" : "Save and Authorize"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
