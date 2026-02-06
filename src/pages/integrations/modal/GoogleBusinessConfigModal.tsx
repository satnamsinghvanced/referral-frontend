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
import { useGenerateGoogleBusinessAuthUrl } from "../../../hooks/integrations/useGoogleBusiness";

// --- Yup Validation Schema ---
const validationSchema = Yup.object().shape({
  clientId: Yup.string().required("Client ID is required."),
  clientSecret: Yup.string().required("Client Secret is required."),
  redirectUri: Yup.string()
    .url("Must be a valid URL")
    .required("Redirect URI is required."),
});

export default function GoogleBusinessConfigModal({
  userId,
  isOpen,
  onClose,
  existingConfig,
  isLoading,
}: {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  existingConfig: any;
  isLoading: boolean;
}) {
  const [showSecret, setShowSecret] = useState(false);

  // Save (Generate Auth URL) Mutation
  const generateAuthUrlMutation = useGenerateGoogleBusinessAuthUrl();

  // Determine if we are in update mode
  const isUpdateMode = !!existingConfig?._id;

  // Determine global loading state
  const isGlobalLoading = isLoading;

  // Determine submitting state
  const isSubmitting = generateAuthUrlMutation.isPending;

  // 2. Formik Setup
  const formik = useFormik<any>({
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
        const savePayload = {
          userId: userId,
          clientId: values.clientId,
          clientSecret: values.clientSecret,
          redirectUri: values.redirectUri,
        };

        const response = await generateAuthUrlMutation.mutateAsync(savePayload);

        if (response?.authUrl) {
          window.open(response.authUrl, "_blank");
          onClose();
        } else {
          throw new Error("Failed to generate authorization URL.");
        }
      } catch (error) {
        console.error("Google Business Configuration Error:", error);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

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
          <ModalHeader className="p-4 pb-0 flex-col">
            <h2 className="leading-none font-medium text-base text-foreground">
              Google Business Profile Integration
            </h2>
            <p className="text-xs text-gray-600 dark:text-foreground/60 mt-2 font-normal">
              Connect your Google Business Profile to sync reviews and manage
              your practice listing.
            </p>
          </ModalHeader>

          <ModalBody className="px-4 py-4">
            <div className="space-y-4">
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
                  !!(formik.touched.clientId && formik.errors.clientId)
                }
                errorMessage={
                  formik.touched.clientId &&
                  (formik.errors.clientId as React.ReactNode)
                }
              />

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
                  !!(formik.touched.clientSecret && formik.errors.clientSecret)
                }
                errorMessage={
                  formik.touched.clientSecret &&
                  (formik.errors.clientSecret as React.ReactNode)
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
                  !!(formik.touched.redirectUri && formik.errors.redirectUri)
                }
                errorMessage={
                  formik.touched.redirectUri &&
                  (formik.errors.redirectUri as React.ReactNode)
                }
              />

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
                      <li>
                        Enable <strong>Google Business Profile API</strong>.
                      </li>
                      <li>Create OAuth 2.0 Client credentials.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {isUpdateMode && existingConfig?.status === "Connected" && (
                <div className="p-3 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 text-xs rounded-lg border border-green-200 dark:border-green-500/30">
                  ✅ Google Business Profile is active and synchronized.
                </div>
              )}
            </div>
          </ModalBody>

          <ModalFooter className="flex justify-end gap-2 px-4 pb-4 pt-0">
            <Button
              size="sm"
              radius="sm"
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
