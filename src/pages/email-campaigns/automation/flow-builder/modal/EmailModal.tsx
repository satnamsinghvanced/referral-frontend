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
} from "@heroui/react";
import React from "react";

interface EmailModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSave: (config: any) => void;
  initialData?: any;
}

const TEMPLATES = [
  { label: "Welcome Template", value: "welcome" },
  { label: "Follow-up Template", value: "follow_up" },
  { label: "Special Offer", value: "special_offer" },
];

const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  initialData,
}) => {
  const [template, setTemplate] = React.useState(initialData?.template || "");
  const [subject, setSubject] = React.useState(initialData?.subject || "");

  const handleSave = () => {
    onSave({ template, subject });
    onOpenChange();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      radius="lg"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-2 flex-shrink-0 p-4">
              <h3 className="text-base leading-none font-medium text-foreground">
                Configure Send Email
              </h3>
              <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal">
                Set up the parameters for this automation step
              </p>
            </ModalHeader>
            <ModalBody className="p-4 pt-0">
              <Select
                label="Email Template"
                labelPlacement="outside"
                placeholder="Select template..."
                selectedKeys={template ? [template] : []}
                onSelectionChange={(keys) =>
                  setTemplate(Array.from(keys)[0] as string)
                }
                variant="flat"
                size="sm"
                radius="sm"
              >
                {TEMPLATES.map((t) => (
                  <SelectItem key={t.value} textValue={t.label}>
                    {t.label}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="Email Subject"
                labelPlacement="outside"
                placeholder="Email subject line..."
                value={subject}
                onValueChange={setSubject}
                variant="flat"
                size="sm"
                radius="sm"
              />
            </ModalBody>
            <ModalFooter className="gap-2 p-4 pt-0">
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                onPress={onClose}
                className="border-small"
              >
                Cancel
              </Button>
              <Button
                radius="sm"
                size="sm"
                variant="solid"
                color="primary"
                onPress={handleSave}
              >
                Save Configuration
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EmailModal;
