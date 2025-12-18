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
  Switch,
} from "@heroui/react";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
// Assuming you have these constants defined in this location
import { EVENTS, SOURCES } from "../../../consts/integrations";

// Updated WebhookConfig interface to reflect UI model
export interface WebhookConfig {
  id?: string; // Present when editing
  url?: string; // Optional: read-only from API, used only for display/pre-population if needed
  source: string; // Maps to API 'type'
  events: string[]; // Maps to API 'action'
  isActive: boolean; // Maps to API 'status'
}

interface AddWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (webhook: WebhookConfig) => void;
  editingWebhook?: WebhookConfig | null;
  isSaving?: boolean; // Added for button loading state
}

const webhookSchema = Yup.object().shape({
  source: Yup.string().required("Source is required"),
  events: Yup.array()
    .of(Yup.string())
    .min(1, "At least one event must be selected")
    .required("Events are required"),
  isActive: Yup.boolean(),
});

export default function AddWebhookModal({
  isOpen,
  onClose,
  onSave,
  editingWebhook,
  isSaving = false,
}: AddWebhookModalProps) {
  const formik = useFormik({
    initialValues: {
      source: editingWebhook?.source || "",
      events: editingWebhook?.events || [],
      isActive: editingWebhook?.isActive ?? true,
    },
    validationSchema: webhookSchema,
    onSubmit: (values) => {
      // The `id` is crucial for the update mutation in the parent component
      const webhook: WebhookConfig = {
        id: editingWebhook?.id as string, // Pass existing ID if editing
        ...values,
      };
      onSave(webhook);
      // The modal closing logic is now handled in the parent component's `onSuccess` handler
      // This prevents the modal from flashing closed and then reopening on an error.
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (isOpen && editingWebhook) {
      formik.setValues({
        source: editingWebhook.source,
        events: editingWebhook.events,
        isActive: editingWebhook.isActive,
      });
    } else if (isOpen && !editingWebhook) {
      // Ensure only the form is reset if adding a new webhook
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingWebhook]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalContent>
        <form onSubmit={formik.handleSubmit}>
          <ModalHeader className="flex flex-col gap-1 p-4">
            <h4 className="text-base font-medium">
              {editingWebhook ? "Edit Webhook" : "Add New Webhook"}
            </h4>
            <p className="text-xs text-gray-500 font-normal">
              Configure webhook to receive real-time event notifications
            </p>
          </ModalHeader>
          <ModalBody className="px-4 py-0 gap-4">
            {/* Source Select (Single) */}
            <Select
              size="sm"
              radius="sm"
              label="Source"
              labelPlacement="outside"
              placeholder="Select a source"
              selectedKeys={formik.values.source ? [formik.values.source] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                formik.setFieldValue("source", selected);
              }}
              isRequired
              // Disable keys if editing an existing webhook
              disabledKeys={
                editingWebhook?.source ? [editingWebhook.source] : []
              }
              {...(formik.touched.source &&
                formik.errors.source && {
                  isInvalid: true,
                  errorMessage: formik.errors.source,
                })}
            >
              {SOURCES.map((source) => (
                <SelectItem key={source.value}>{source.label}</SelectItem>
              ))}
            </Select>

            {/* Events Select (Multiple) */}
            <Select
              size="sm"
              radius="sm"
              label="Events"
              labelPlacement="outside"
              placeholder="Select events"
              selectionMode="multiple"
              selectedKeys={new Set(formik.values.events)}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys) as string[];
                formik.setFieldValue("events", selected);
              }}
              isRequired
              {...(formik.touched.events &&
                typeof formik.errors.events === "string" && {
                  isInvalid: true,
                  errorMessage: formik.errors.events,
                })}
            >
              {EVENTS.map((event) => (
                <SelectItem key={event.value}>{event.label}</SelectItem>
              ))}
            </Select>

            {/* Active Status Switch */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Active Status</p>
                <p className="text-xs text-gray-500">
                  Enable or disable this webhook
                </p>
              </div>
              <Switch
                size="sm"
                isSelected={formik.values.isActive}
                onValueChange={(value) =>
                  formik.setFieldValue("isActive", value)
                }
                color="primary"
              />
            </div>

            {/* Display Read-Only Webhook URL on Edit */}
            {editingWebhook?.url && (
              <Input
                size="sm"
                radius="sm"
                label="Webhook URL (Read-Only)"
                labelPlacement="outside"
                value={editingWebhook.url}
                isReadOnly
                className="pt-1"
                classNames={{ input: "truncate font-mono text-xs" }}
              />
            )}
          </ModalBody>
          <ModalFooter className="p-4">
            <Button
              size="sm"
              radius="sm"
              variant="ghost"
              className="border-small"
              onPress={handleClose}
              type="button"
              isDisabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              radius="sm"
              color="primary"
              type="submit"
              isDisabled={!formik.isValid || formik.isSubmitting || isSaving}
              isLoading={isSaving}
            >
              {editingWebhook ? "Update Webhook" : "Add Webhook"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
