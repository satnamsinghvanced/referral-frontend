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
import { useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";
import * as Yup from "yup";
import {
  useFetchGoogleApiKey,
  useSaveGoogleApiKey,
  useUpdateGoogleApiKey,
} from "../../hooks/useGoogle";
import { GoogleApiKeyRequest } from "../../types/google";

const validationSchema = Yup.object().shape({
  googleKey: Yup.string()
    .min(20, "API Key must be at least 20 characters long.")
    .required("API Key is required."),
});

// The main Modal component
export default function GoogleApiConfigurationModal({
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
  } = useFetchGoogleApiKey(userId);
  const saveMutation = useSaveGoogleApiKey();
  const updateMutation = useUpdateGoogleApiKey();

  // Determine if we are updating (config exists) or saving
  const isUpdateMode = !!existingConfig?._id;
  const mutation = isUpdateMode ? updateMutation : saveMutation;

  // 2. Formik Setup
  const formik = useFormik<GoogleApiKeyRequest>({
    initialValues: {
      googleKey: existingConfig?.googleKey || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const payload = {
        userId: userId,
        data: {
          googleKey: values.googleKey,
        },
      };

      try {
        await mutation.mutateAsync(payload);
        onClose();
      } catch (error) {
        console.error("Google API Configuration Error:", error);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  // 3. Effect to set initial form values when data is loaded
  useEffect(() => {
    if (existingConfig) {
      formik.setValues({
        googleKey: existingConfig.googleKey || "",
      });
    }
  }, [existingConfig]);

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

  if (isError) {
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
        <ModalContent>
          <ModalBody className="p-5 text-center">
            <p className="text-red-600 text-sm px-5">
              Failed to load Google API configuration. Please check your
              network.
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
              Google API Integration
            </h2>
            <p
              data-slot="dialog-description"
              className="text-xs text-gray-600 mt-2 font-normal"
            >
              Configure your Google API Key to enable features like mapping,
              routing, and geo-coding.
            </p>
          </ModalHeader>

          {/* Modal Body (Form Fields) */}
          <ModalBody className="px-5 py-5">
            <div className="space-y-4">
              <Input
                size="sm"
                radius="sm"
                label="Google API Key"
                labelPlacement="outside-top"
                name="googleKey"
                type="text"
                placeholder="AIzaSy... (e.g., Maps or Geocoding API)"
                isRequired
                // Formik Props
                value={formik.values.googleKey}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  (formik.touched.googleKey as boolean) &&
                  (!!formik.errors.googleKey as boolean)
                }
                errorMessage={
                  formik.touched.googleKey && formik.errors.googleKey
                }
              />

              {/* Information Box */}
              <div className="text-sm text-gray-700 bg-blue-50 p-3.5 rounded-lg border border-blue-200 mt-4">
                <div className="flex items-start gap-3">
                  <div>
                    <p className="font-semibold mb-1.5 text-gray-900">
                      Where to find your API Key:
                    </p>
                    <ul className="text-xs space-y-1 ml-1 text-gray-700">
                      <li className="flex items-center gap-1">
                        • Create a project and key in the
                        <a
                          href="https://console.cloud.google.com/apis/credentials"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium ml-1"
                        >
                          Google Cloud Console
                          <FiExternalLink className="inline-block h-3 w-3 ml-1" />
                        </a>
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
              type="submit"
              isLoading={isSubmitting}
              isDisabled={isSubmitting || !formik.isValid}
            >
              {isUpdateMode ? "Update API Key" : "Save API Key"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
