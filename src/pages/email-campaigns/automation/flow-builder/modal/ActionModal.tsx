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

interface ActionModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSave: (config: any) => void;
  initialData?: any;
}

const ACTION_TYPES = [
  { label: "Update Field", value: "update_field" },
  { label: "Send Notification", value: "send_notification" },
  { label: "Create Task", value: "create_task" },
];

const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  initialData,
}) => {
  const [actionType, setActionType] = React.useState(
    initialData?.actionType || "update_field",
  );

  const handleSave = () => {
    onSave({ actionType });
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
                Configure Action
              </h3>
              <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal">
                Set up the parameters for this automation step
              </p>
            </ModalHeader>
            <ModalBody className="p-4 pt-0">
              <Select
                label="Action Type"
                labelPlacement="outside"
                placeholder="Select action type..."
                selectedKeys={[actionType]}
                onSelectionChange={(keys) =>
                  setActionType(Array.from(keys)[0] as string)
                }
                variant="flat"
                size="sm"
                radius="sm"
              >
                {ACTION_TYPES.map((type) => (
                  <SelectItem key={type.value} textValue={type.label}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>
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

export default ActionModal;
