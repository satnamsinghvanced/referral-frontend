import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
} from "@heroui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  useCreateGoogleAnalyticsIntegration,
  useUpdateGoogleAnalyticsIntegration,
} from "../../../hooks/integrations/useGoogleAnalytics";
import { GoogleAnalyticsIntegration } from "../../../types/integrations/googleAnalytics";

// --- Yup Validation Schema ---
const validationSchema = Yup.object().shape({
  propertyId: Yup.string().required("Property ID is required."),
  email: Yup.string()
    .email("Invalid email format")
    .required("Service Account Email is required."),
  privateKey: Yup.string().required("Private Key is required."),
});

export default function GoogleAnalyticsConfigModal({
  userId,
  isOpen,
  onClose,
  existingConfig,
  isLoading,
}: {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  existingConfig?: GoogleAnalyticsIntegration | undefined;
  isLoading?: boolean;
}) {
  const [showKey, setShowKey] = useState(false);

  const createMutation = useCreateGoogleAnalyticsIntegration();
  const updateMutation = useUpdateGoogleAnalyticsIntegration();

  const isUpdateMode = !!existingConfig?.id;

  const formik = useFormik({
    initialValues: {
      propertyId: existingConfig?.propertyId || "",
      email: existingConfig?.email || "",
      privateKey: existingConfig?.privateKey || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // if (isUpdateMode) {
        //   await updateMutation.mutateAsync({
        //     id: existingConfig.id as string,
        //     data: values as UpdateGoogleAnalyticsRequest,
        //   });
        // } else {
        await createMutation.mutateAsync({
          userId,
          ...values,
          // status: "Connected",
        });
        // }
        onClose();
      } catch (error) {
        console.error("Google Analytics Configuration Error:", error);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
      setShowKey(false);
    }
  }, [isOpen]);

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

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

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
              Google Analytics Integration
            </h2>
            <p className="text-xs text-gray-600 dark:text-foreground/60 mt-2 font-normal">
              Connect your Google Analytics 4 property using a service account
              to sync performance data and referral insights.
            </p>
          </ModalHeader>

          <ModalBody className="px-4 py-4">
            <div className="space-y-4">
              <Input
                size="sm"
                radius="sm"
                label="Property ID"
                labelPlacement="outside-top"
                name="propertyId"
                type="text"
                placeholder="e.g. 519125114"
                isRequired
                value={formik.values.propertyId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!(formik.touched.propertyId && formik.errors.propertyId)
                }
                errorMessage={formik.errors.propertyId}
              />

              <Input
                size="sm"
                radius="sm"
                label="Service Account Email"
                labelPlacement="outside-top"
                name="email"
                type="email"
                placeholder="practice-roi@xxxxxx.iam.gserviceaccount.com"
                isRequired
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.email && formik.errors.email)}
                errorMessage={formik.errors.email}
              />

              <Textarea
                size="sm"
                radius="sm"
                label="Private Key"
                labelPlacement="outside-top"
                name="privateKey"
                type="text"
                placeholder="-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----"
                isRequired
                minRows={10}
                value={formik.values.privateKey}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!(formik.touched.privateKey && formik.errors.privateKey)
                }
                errorMessage={formik.errors.privateKey}
                classNames={{
                  input:
                    "text-xs font-mono [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
                  inputWrapper: "py-2",
                }}
              />

              <div className="text-xs text-gray-700 dark:text-foreground/80 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-500/30 mt-4">
                <p className="font-semibold mb-1 text-gray-900 dark:text-foreground">
                  Setup Instructions:
                </p>
                <ul className="space-y-1 ml-1 text-gray-700 dark:text-foreground/70 list-disc list-inside">
                  <li>
                    Find your <strong>Property ID</strong> in GA4 Admin {">"}{" "}
                    Property Settings.
                  </li>
                  <li>
                    Create a <strong>Service Account</strong> in Google Cloud
                    Console.
                  </li>
                  <li>
                    Generate a <strong>JSON Key</strong> for the service account
                    and copy the <code>private_key</code> and{" "}
                    <code>client_email</code>.
                  </li>
                  <li>
                    Add the service account email as a <strong>Viewer</strong>{" "}
                    in your GA4 property.
                  </li>
                </ul>
              </div>

              {isUpdateMode && existingConfig?.status === "Connected" && (
                <div className="p-2.5 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 text-xs rounded-lg border border-green-200 dark:border-green-500/30">
                  ✅ Google Analytics is active and connected.
                </div>
              )}
            </div>
          </ModalBody>

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
              {isUpdateMode ? "Update Integration" : "Connect Integration"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
