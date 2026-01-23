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
import { useState, useEffect } from "react";
import { FiExternalLink, FiEye, FiEyeOff } from "react-icons/fi";
import * as Yup from "yup";
import {
  useGenerateGoogleCalendarAuthUrl,
  useUpdateGoogleCalendarIntegration,
} from "../../../hooks/integrations/useGoogleCalendar";
import {
  GenerateAuthUrlRequest,
  GoogleCalendarIntegrationResponse,
  UpdateGoogleCalendarRequest,
} from "../../../types/integrations/googleCalendar";

// --- Yup Validation Schema ---
const validationSchema = Yup.object().shape({
  clientId: Yup.string()
    .required("Client ID is required.")
    .matches(
      /.apps.googleusercontent.com$/,
      "Invalid Client ID format. Usually ends with '.apps.googleusercontent.com'",
    ),
  clientSecret: Yup.string().required("Client Secret is required."),
  // redirectUri: Yup.string()
  //   .url("Must be a valid URL")
  //   .required("Redirect URI is required."),
});

export default function GoogleCalendarConfigModal({
  userId,
  isOpen,
  onClose,
  existingConfig,
  isLoading,
  isError,
}: {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  existingConfig: GoogleCalendarIntegrationResponse;
  isLoading: boolean;
  isError: boolean;
}) {
  const [showSecret, setShowSecret] = useState(false);

  // Save (Generate Auth URL) Mutation
  const generateAuthUrlMutation = useGenerateGoogleCalendarAuthUrl();
  // Update (Save Credentials) Mutation
  const updateConfigMutation = useUpdateGoogleCalendarIntegration();

  // Determine if we are in update mode based on the presence of existing config data
  const isUpdateMode = !!existingConfig?._id;

  // Determine global loading state
  const isGlobalLoading = isLoading;

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
        // --- INITIAL SAVE MODE: First time setup, generate Auth URL ---
        const savePayload: GenerateAuthUrlRequest = {
          userId: userId,
          clientId: values.clientId,
          clientSecret: values.clientSecret,
          redirectUri: values.redirectUri,
        };

        const response = await generateAuthUrlMutation.mutateAsync(savePayload);

        // On success, redirect the user to Google for authorization
        if (response?.authUrl) {
          window.open(response.authUrl, "_blank");
          onClose(); // Close modal after initiating OAuth flow
        } else {
          throw new Error("Failed to generate authorization URL.");
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

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  // Handle loading state
  if (isGlobalLoading) {
    return (
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        size="md"
        classNames={{ base: `max-sm:!m-3 !m-0`, closeButton: "cursor-pointer" }}
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

  // Handle error state
  // if (isError) {
  //   return (
  //     <Modal
  //       isOpen={isOpen}
  //       onOpenChange={onClose}
  //       size="md"
  //       classNames={{ base: `max-sm:!m-3 !m-0`, closeButton: "cursor-pointer" }}
  //     >
  //       <ModalContent>
  //         <ModalBody className="p-5 text-center">
  //           <p className="text-red-600 text-sm px-5">
  //             Failed to load Google Calendar configuration. Please try again.
  //           </p>
  //           <Button
  //             color="danger"
  //             variant="flat"
  //             onPress={onClose}
  //             size="sm"
  //             className="mt-4"
  //           >
  //             Close
  //           </Button>
  //         </ModalBody>
  //       </ModalContent>
  //     </Modal>
  //   );
  // }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="md"
      placement="center"
    >
      <ModalContent>
        <form onSubmit={formik.handleSubmit}>
          {/* Modal Header */}
          <ModalHeader className="p-4 pb-0 flex-col">
            <h2 className="leading-none font-medium text-base text-foreground">
              Google Calendar Integration
            </h2>
            <p className="text-xs text-gray-600 dark:text-foreground/60 mt-2 font-normal">
              Connect your Google Calendar to sync appointments and manage
              availability.
            </p>
          </ModalHeader>

          {/* Modal Body */}
          <ModalBody className="px-4 py-4">
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
                    className="text-gray-500 focus:outline-none cursor-pointer"
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
                  type="text"
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
                <p className="text-[11px] text-gray-500 dark:text-foreground/40 mt-1">
                  Must match the authorized redirect URI in your Google Cloud
                  Console.
                </p>
              </div>

              {/* Helper Information Box */}
              <div className="text-sm text-gray-700 dark:text-foreground/80 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-500/30 mt-4">
                <div className="flex items-start gap-3">
                  <div>
                    <p className="font-semibold mb-1.5 text-gray-900 dark:text-foreground">
                      Setup Instructions:
                    </p>
                    <ul className="text-xs space-y-1 ml-1 text-gray-700 dark:text-foreground/70 list-disc list-inside">
                      <li>
                        Go to the{" "}
                        <a
                          href="https://console.cloud.google.com/apis/credentials"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center"
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

              {/* Status Message */}
              {isUpdateMode && existingConfig?.status === "Connected" && (
                <div className="p-3 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 text-xs rounded-lg border border-green-200 dark:border-green-500/30">
                  ✅ Google Calendar is active and synchronized.
                </div>
              )}
              {isUpdateMode && existingConfig?.status === "Disconnected" && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 text-xs rounded-lg border border-blue-200 dark:border-blue-500/30">
                  ℹ️ Google Calendar is disconnected. Please reconnect it by
                  using switch.
                </div>
              )}
              {isUpdateMode && existingConfig?.status === "Error" && (
                <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 text-xs rounded-lg border border-red-200 dark:border-red-500/30">
                  ⚠️ Connection failed. Please check your credentials and try
                  again.
                </div>
              )}
              {isUpdateMode &&
                existingConfig?.status !== "Connected" &&
                !existingConfig?.refreshToken && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400 text-xs rounded-lg border border-yellow-200 dark:border-yellow-500/30">
                    ⚠️ Configuration saved, but authorization is pending. Click
                    'Save and Authorize' to complete the OAuth flow.
                  </div>
                )}
            </div>
          </ModalBody>

          {/* Modal Footer */}
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
              type="submit"
              isLoading={isSubmitting}
              isDisabled={isSubmitting || !formik.isValid || !formik.dirty}
            >
              {isUpdateMode ? "Update Credentials" : "Save and Authorize"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
