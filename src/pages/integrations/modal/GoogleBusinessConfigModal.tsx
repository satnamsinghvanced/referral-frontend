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
import { useMemo, useState } from "react";
import { FiExternalLink, FiEye, FiEyeOff } from "react-icons/fi";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useInitiateAuthIntegration } from "../../../hooks/useSocial";
import {
  PlatformAuthParams,
  SocialMediaCredential,
} from "../../../types/social";

// --- Google Business Specific Config ---
const GOOGLE_BUSINESS_CONFIG = {
  title: "Google Business Profile Integration",
  description:
    "Connect your Google Business Profile to manage reviews, posts, and business information directly.",
  infoLink: "https://console.cloud.google.com/apis/credentials",
  linkText: "Google Cloud Console",
};

// --- Yup Validation Schema ---
const validationSchema = Yup.object().shape({
  clientId: Yup.string().required("Client ID is required."),
  clientSecret: Yup.string().required("Client Secret is required."),
  redirectUri: Yup.string()
    .url("Must be a valid URL")
    .required("Redirect URI is required."),
});

export default function GoogleBusinessConfigModal({
  isOpen,
  onClose,
  allCredentials,
  isGlobalLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  allCredentials: any;
  isGlobalLoading: boolean;
}) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [showSecret, setShowSecret] = useState(false);
  const platformName = "googleBusiness";
  const config = GOOGLE_BUSINESS_CONFIG;

  const existingConfig = useMemo(
    () => allCredentials?.[platformName] as SocialMediaCredential | undefined,
    [allCredentials, platformName]
  );

  const initiateAuthMutation = useInitiateAuthIntegration();
  const isSubmitting = initiateAuthMutation.isPending;

  const isConfigured = !!existingConfig?.clientId;
  const isAuthorized = !!existingConfig?.refreshToken;

  const formik = useFormik<Omit<PlatformAuthParams, "platform">>({
    initialValues: {
      userId: user?.userId || "",
      clientId: existingConfig?.clientId || "",
      clientSecret: existingConfig?.clientSecret || "",
      redirectUri: existingConfig?.redirectUri || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const savePayload: PlatformAuthParams = {
          platform: "googleBusiness",
          userId: user?.userId || "",
          clientId: values.clientId,
          clientSecret: values.clientSecret,
          redirectUri: values.redirectUri,
        };

        await initiateAuthMutation.mutateAsync(savePayload);
        onClose();
      } catch (error) {
        console.error(`${platformName} Configuration Error:`, error);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

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
          <ModalHeader className="p-4 pb-0 flex-col">
            <h2 className="leading-none font-medium text-base">
              {config.title}
            </h2>
            <p className="text-xs text-gray-600 mt-2 font-normal">
              {config.description}
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
                placeholder="Enter Google Client ID"
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

              <Input
                size="sm"
                radius="sm"
                label="Client Secret"
                labelPlacement="outside-top"
                name="clientSecret"
                type={showSecret ? "text" : "password"}
                placeholder="Enter Google Client Secret"
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

              <div>
                <Input
                  size="sm"
                  radius="sm"
                  label="Redirect URI"
                  labelPlacement="outside-top"
                  name="redirectUri"
                  type="url"
                  placeholder="Your Google callback URL"
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
                <p className="text-[11px] text-gray-500 mt-1">
                  Must exactly match the authorized redirect URI in your Google
                  Cloud Console.
                </p>
              </div>

              <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200 mt-4">
                <div className="flex items-start gap-3">
                  <div>
                    <p className="font-semibold mb-1.5 text-gray-900">
                      Setup Instructions:
                    </p>
                    <ul className="text-xs space-y-1 ml-1 text-gray-700 list-disc list-inside">
                      <li>
                        Go to the{" "}
                        <a
                          href={config.infoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium inline-flex items-center"
                        >
                          {config.linkText}{" "}
                          <FiExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </li>
                      <li>Select your project and create OAuth credentials.</li>
                      <li>
                        Configure the <strong>Redirect URI</strong> to match the
                        value above.
                      </li>
                      <li>
                        Retrieve the <strong>Client ID</strong> and{" "}
                        <strong>Client Secret</strong>.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {isConfigured && isAuthorized && (
                <div className="p-3 bg-green-50 text-green-700 text-xs rounded-lg border border-green-200">
                  ✅ Integration is currently <strong>Connected</strong> and
                  configured.
                </div>
              )}
              {isConfigured && !isAuthorized && (
                <div className="p-3 bg-yellow-50 text-yellow-700 text-xs rounded-lg border border-yellow-200">
                  ⚠️ Credentials saved, but{" "}
                  <strong>Authorization is required</strong>. Click 'Save and
                  Authorize' to complete the OAuth flow.
                </div>
              )}
            </div>
          </ModalBody>

          <ModalFooter className="flex justify-end gap-2 px-4 pb-4 pt-0">
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
              {isConfigured && isAuthorized
                ? "Re-authorize"
                : "Save and Authorize"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
