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

interface WaitModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSave: (config: any) => void;
  initialData?: any;
}

const TIME_UNITS = [
  { label: "Minutes", value: "minutes" },
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
];

const WaitModal: React.FC<WaitModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  initialData,
}) => {
  const [duration, setDuration] = React.useState(initialData?.duration || "1");
  const [unit, setUnit] = React.useState(initialData?.unit || "days");

  const handleSave = () => {
    onSave({ duration, unit });
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
                Configure Wait
              </h3>
              <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal">
                Set up the parameters for this automation step
              </p>
            </ModalHeader>
            <ModalBody className="p-4 pt-0">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    label="Wait Duration"
                    labelPlacement="outside"
                    placeholder="1"
                    value={duration}
                    onValueChange={setDuration}
                    variant="flat"
                    size="sm"
                    radius="sm"
                  />
                </div>
                <div className="w-[120px]">
                  <Select
                    placeholder="Unit"
                    selectedKeys={[unit]}
                    onSelectionChange={(keys) =>
                      setUnit(Array.from(keys)[0] as string)
                    }
                    variant="flat"
                    size="sm"
                    radius="sm"
                  >
                    {TIME_UNITS.map((u) => (
                      <SelectItem key={u.value} textValue={u.label}>
                        {u.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
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

export default WaitModal;
