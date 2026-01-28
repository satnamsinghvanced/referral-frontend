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

interface ConditionModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSave: (config: any) => void;
  initialData?: any;
}

const CONDITION_TYPES = [
  { label: "Email Opened", value: "email_opened" },
  { label: "Link Clicked", value: "link_clicked" },
  { label: "Tag Applied", value: "tag_applied" },
];

const ConditionModal: React.FC<ConditionModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  initialData,
}) => {
  const [conditionType, setConditionType] = React.useState(
    initialData?.conditionType || "",
  );
  const [whichEmail, setWhichEmail] = React.useState(
    initialData?.whichEmail || "previous",
  );

  const handleSave = () => {
    onSave({ conditionType, whichEmail });
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
                Configure Condition
              </h3>
              <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal">
                Set up the parameters for this automation step
              </p>
            </ModalHeader>
            <ModalBody className="p-4 pt-0">
              <Select
                label="Condition Type"
                labelPlacement="outside"
                placeholder="Select condition..."
                selectedKeys={conditionType ? [conditionType] : []}
                onSelectionChange={(keys) =>
                  setConditionType(Array.from(keys)[0] as string)
                }
                variant="flat"
                size="sm"
                radius="sm"
              >
                {CONDITION_TYPES.map((type) => (
                  <SelectItem key={type.value} textValue={type.label}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Which Email?"
                labelPlacement="outside"
                placeholder="Select email..."
                selectedKeys={[whichEmail]}
                onSelectionChange={(keys) =>
                  setWhichEmail(Array.from(keys)[0] as string)
                }
                variant="flat"
                size="sm"
                radius="sm"
              >
                <SelectItem
                  key="previous"
                  textValue="Previous email in this flow"
                >
                  Previous email in this flow
                </SelectItem>
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

export default ConditionModal;
