import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import React from "react";

interface TriggerModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSave: (config: any) => void;
  initialData?: any;
}

const TRIGGER_TYPES = [
  { label: "New Partner Added", value: "new_partner" },
  { label: "Treatment Completed", value: "treatment_completed" },
  { label: "No Referral in 30 Days", value: "no_referral" },
];

const TriggerModal: React.FC<TriggerModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  initialData,
}) => {
  const [triggerType, setTriggerType] = React.useState(
    initialData?.triggerType || "",
  );

  const handleSave = () => {
    onSave({ triggerType });
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
                Configure Trigger
              </h3>
              <p className="text-sm font-normal text-default-400">
                Set up the parameters for this automation step
              </p>
            </ModalHeader>
            <ModalBody className="p-4 pt-0">
              <div className="space-y-4">
                <Select
                  label="Trigger Type"
                  labelPlacement="outside"
                  placeholder="Select trigger..."
                  selectedKeys={triggerType ? [triggerType] : []}
                  onSelectionChange={(keys) =>
                    setTriggerType(Array.from(keys)[0] as string)
                  }
                  variant="flat"
                  size="sm"
                  radius="sm"
                >
                  {TRIGGER_TYPES.map((type) => (
                    <SelectItem key={type.value} textValue={type.label}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
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

export default TriggerModal;
