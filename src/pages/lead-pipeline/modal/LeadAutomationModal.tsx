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
  Textarea,
} from "@heroui/react";
import { useFormik } from "formik";
import { useEffect } from "react";
import { FiSave } from "react-icons/fi";
import * as Yup from "yup";
import { useCreateLeadAutomation, useUpdateLeadAutomation } from "../../../hooks/useLeadAutomation";

interface LeadAutomationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  automation?: any; // If provided, we are editing
}

const TRIGGER_EVENTS = [
  { key: "Lead Created", label: "Lead Created" },
  { key: "Status Changed", label: "Status Changed" },
  { key: "Status Changed to No Show", label: "Status Changed to No Show" },
  { key: "Appointment Scheduled", label: "Appointment Scheduled" },
  { key: "Appointment Confirmed", label: "Appointment Confirmed" },
  { key: "High Value Lead", label: "High Value Lead" },
];

const ACTIONS = [
  { key: "Send SMS", label: "Send SMS" },
  { key: "Send Email", label: "Send Email" },
  { key: "Send Notification", label: "Send Notification" },
];

const DELAY_UNITS = [
  { key: "Minutes", label: "Minutes" },
  { key: "Hours", label: "Hours" },
  { key: "Days", label: "Days" },
  { key: "Weeks", label: "Weeks" },
  { key: "Months", label: "Months" },
];

const LeadAutomationModal = ({ isOpen, onOpenChange, automation }: LeadAutomationModalProps) => {
  const { mutateAsync: createAutomation, isPending: creating } = useCreateLeadAutomation();
  const { mutateAsync: updateAutomation, isPending: updating } = useUpdateLeadAutomation();

  const isEditMode = !!automation;
  const loading = creating || updating;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().nullable(),
    triggerEvent: Yup.string().required("Trigger event is required"),
    action: Yup.string().required("Action is required"),
    delayAmount: Yup.number().typeError("Delay must be a number").min(0, "Cannot be negative").required("Delay amount is required"),
    delayUnit: Yup.string().required("Delay unit is required"),
    landingPageUrl: Yup.string().nullable(),
    messageTemplate: Yup.string().required("Message template is required"),
    condition: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      triggerEvent: "Lead Created",
      action: "Send SMS",
      delayAmount: 0,
      delayUnit: "Minutes",
      landingPageUrl: "",
      messageTemplate: "",
      condition: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          ...values,
          delayAmount: Number(values.delayAmount) || 0,
        };

        if (isEditMode) {
          await updateAutomation({
            id: automation._id || automation.id,
            data: payload,
          });
        } else {
          await createAutomation(payload);
        }

        onOpenChange(false);
        resetForm();
      } catch (error) {
        console.error("Failed to submit automation:", error);
      }
    },
  });

  // Reset/populate form when automation changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (automation) {
        formik.setValues({
          name: automation.name || "",
          description: automation.description || "",
          triggerEvent: automation.triggerEvent || "Lead Created",
          action: automation.action || "Send SMS",
          delayAmount: automation.delayAmount !== undefined ? automation.delayAmount : 0,
          delayUnit: automation.delayUnit || "Minutes",
          landingPageUrl: automation.landingPageUrl || "",
          messageTemplate: automation.messageTemplate || "",
          condition: automation.condition || "",
        });
      } else {
        formik.resetForm();
      }
    }
  }, [isOpen, automation]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="xl"
      placement="center"
      scrollBehavior="inside"
      classNames={{
        base: "max-sm:!m-3 !m-0",
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-4">
              <h4 className="text-base font-medium dark:text-white">
                {isEditMode ? "Edit Lead Automation" : "Create Lead Automation"}
              </h4>
              <p className="text-xs text-gray-500 font-normal dark:text-foreground/60">
                Configure when and how to automatically follow up with leads
              </p>
            </ModalHeader>
            <ModalBody className="py-0 px-4 gap-3">
              <div className="border border-foreground/10 rounded-xl p-4 space-y-3 bg-gray-50/30 dark:bg-white/5">
                <h4 className="font-medium text-sm dark:text-white">General Info</h4>
                <div className="flex flex-col gap-3">
                  <Input
                    label="Automation Name"
                    labelPlacement="outside"
                    placeholder="e.g. Speed to Lead SMS"
                    variant="flat"
                    size="sm"
                    radius="sm"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.touched.name && formik.errors.name)}
                    errorMessage={formik.touched.name && (formik.errors.name as string)}
                    isRequired
                  />
                  <Input
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Briefly describe what this automation does"
                    variant="flat"
                    size="sm"
                    radius="sm"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.touched.description && formik.errors.description)}
                    errorMessage={formik.touched.description && (formik.errors.description as string)}
                  />
                </div>
              </div>

              <div className="border border-foreground/10 rounded-xl p-4 space-y-3 bg-gray-50/30 dark:bg-white/5">
                <h4 className="font-medium text-sm dark:text-white">Trigger & Logic</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Select
                    label="Trigger Event"
                    labelPlacement="outside"
                    placeholder="Select event"
                    variant="flat"
                    size="sm"
                    radius="sm"
                    classNames={{
                      trigger: "h-auto py-1.5",
                      value: "whitespace-normal break-words text-left",
                    }}
                    selectedKeys={new Set([formik.values.triggerEvent])}
                    onSelectionChange={(keys) =>
                      formik.setFieldValue("triggerEvent", Array.from(keys)[0] as string)
                    }
                    onBlur={() => formik.setFieldTouched("triggerEvent", true)}
                    isInvalid={!!(formik.touched.triggerEvent && formik.errors.triggerEvent)}
                    errorMessage={formik.touched.triggerEvent && (formik.errors.triggerEvent as string)}
                    isRequired
                    items={TRIGGER_EVENTS}
                  >
                    {(item) => (
                      <SelectItem
                        key={item.key}
                        classNames={{
                          title: "whitespace-normal break-words",
                        }}
                      >
                        {item.label}
                      </SelectItem>
                    )}
                  </Select>

                  <Select
                    label="Action To Take"
                    labelPlacement="outside"
                    placeholder="Select action"
                    variant="flat"
                    size="sm"
                    radius="sm"
                    classNames={{
                      trigger: "h-auto py-1.5",
                      value: "whitespace-normal break-words text-left",
                    }}
                    selectedKeys={new Set([formik.values.action])}
                    onSelectionChange={(keys) =>
                      formik.setFieldValue("action", Array.from(keys)[0] as string)
                    }
                    onBlur={() => formik.setFieldTouched("action", true)}
                    isInvalid={!!(formik.touched.action && formik.errors.action)}
                    errorMessage={formik.touched.action && (formik.errors.action as string)}
                    isRequired
                    items={ACTIONS}
                  >
                    {(item) => (
                      <SelectItem
                        key={item.key}
                        classNames={{
                          title: "whitespace-normal break-words",
                        }}
                      >
                        {item.label}
                      </SelectItem>
                    )}
                  </Select>

                  <Input
                    label="Delay Amount"
                    labelPlacement="outside"
                    placeholder="0"
                    variant="flat"
                    size="sm"
                    radius="sm"
                    type="number"
                    name="delayAmount"
                    value={formik.values.delayAmount.toString()}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.touched.delayAmount && formik.errors.delayAmount)}
                    errorMessage={formik.touched.delayAmount && (formik.errors.delayAmount as string)}
                    isRequired
                  />

                  <Select
                    label="Delay Unit"
                    labelPlacement="outside"
                    placeholder="Select unit"
                    variant="flat"
                    size="sm"
                    radius="sm"
                    classNames={{
                      trigger: "h-auto py-1.5",
                      value: "whitespace-normal break-words text-left",
                    }}
                    selectedKeys={new Set([formik.values.delayUnit])}
                    onSelectionChange={(keys) =>
                      formik.setFieldValue("delayUnit", Array.from(keys)[0] as string)
                    }
                    onBlur={() => formik.setFieldTouched("delayUnit", true)}
                    isInvalid={!!(formik.touched.delayUnit && formik.errors.delayUnit)}
                    errorMessage={formik.touched.delayUnit && (formik.errors.delayUnit as string)}
                    isRequired
                    items={DELAY_UNITS}
                  >
                    {(item) => (
                      <SelectItem
                        key={item.key}
                        classNames={{
                          title: "whitespace-normal break-words",
                        }}
                      >
                        {item.label}
                      </SelectItem>
                    )}
                  </Select>
                </div>
              </div>

              <div className="border border-foreground/10 rounded-xl p-4 space-y-3 bg-gray-50/30 dark:bg-white/5">
                <h4 className="font-medium text-sm dark:text-white">Content & Rules</h4>
                <div className="flex flex-col gap-3">

                  <Textarea
                    label="Message Template"
                    labelPlacement="outside"
                    placeholder="Write your automated message template..."
                    variant="flat"
                    size="sm"
                    radius="sm"
                    minRows={4}
                    name="messageTemplate"
                    value={formik.values.messageTemplate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.touched.messageTemplate && formik.errors.messageTemplate)}
                    errorMessage={formik.touched.messageTemplate && (formik.errors.messageTemplate as string)}
                    isRequired
                  />
                  
                  <div className="p-2 bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 rounded-lg">
                    <p className="text-[10px] text-sky-700 dark:text-sky-400 font-medium leading-normal">
                      <strong>Supported placeholders:</strong><br />
                      {"{{firstName}}"} - Lead's first name<br />
                      {"{{lastName}}"} - Lead's last name<br />
                      {"{{practice_name}}"} - Your practice name<br />
                      {"{{treatment}}"} - Lead's treatment interest<br />
                      {"{{estimated_value}}"} - Lead's estimated value<br />
                      {"{{landing_page_url}}"} - Landing page link
                    </p>
                  </div>
                </div>
              </div>
              <div className="border border-foreground/10 rounded-xl p-4 space-y-3 bg-gray-50/30 dark:bg-white/5">
                <div className="flex flex-col gap-3">
                  <Input
                    label="Condition (Optional)"
                    labelPlacement="outside"
                    placeholder="e.g. estimatedValue >= 5000"
                    variant="flat"
                    size="sm"
                    radius="sm"
                    name="condition"
                    value={formik.values.condition}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.touched.condition && formik.errors.condition)}
                    errorMessage={formik.touched.condition && (formik.errors.condition as string)}
                  />
                  <Input
                    label="Landing Page URL (Optional)"
                    labelPlacement="outside"
                    placeholder="e.g. https://yourpractice.com/book"
                    variant="flat"
                    size="sm"
                    radius="sm"
                    name="landingPageUrl"
                    value={formik.values.landingPageUrl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.touched.landingPageUrl && formik.errors.landingPageUrl)}
                    errorMessage={formik.touched.landingPageUrl && (formik.errors.landingPageUrl as string)}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="px-4">
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                color="default"
                onPress={onClose}
                className="border-small"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="solid"
                color="primary"
                onPress={() => formik.handleSubmit()}
                isLoading={loading}
                startContent={!loading && <FiSave className="text-[15px]" />}
                isDisabled={loading || !formik.isValid}
              >
                {isEditMode ? "Save Changes" : "Create"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LeadAutomationModal;
