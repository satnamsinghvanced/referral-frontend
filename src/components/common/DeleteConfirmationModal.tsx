import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { LuTriangleAlert, LuTrash } from "react-icons/lu";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Confirm Deletion",
  description = "This action cannot be undone. Are you absolutely sure you want to proceed?",
}: DeleteConfirmationModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      placement="center"
      isDismissable={!isLoading}
      classNames={{
        base: "bg-[#18181b] border border-[#27272a] text-white",
        closeButton: "hover:bg-white/5 active:bg-white/10 transition-colors",
      }}
    >
      <ModalContent className="p-2">
        <ModalHeader className="flex flex-row items-center gap-3 pt-4 pb-2 px-4">
          <LuTriangleAlert className="text-red-500 text-xl flex-shrink-0" />
          <h4 className="text-lg font-semibold tracking-tight">{title}</h4>
        </ModalHeader>
        <ModalBody className="px-4 py-2">
          <p className="text-[#a1a1aa] text-[15px] leading-relaxed">
            {description}
          </p>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-3 pt-4 pb-4 px-4">
          <Button
            size="md"
            radius="sm"
            variant="bordered"
            onPress={onClose}
            isDisabled={isLoading}
            className="border-[#27272a] text-white hover:bg-white/5 font-medium min-w-[80px]"
          >
            Cancel
          </Button>
          <Button
            size="md"
            radius="sm"
            color="danger"
            startContent={!isLoading && <LuTrash className="size-4" />}
            onPress={onConfirm}
            isLoading={isLoading}
            className="bg-[#ef4444] hover:bg-[#dc2626] font-medium min-w-[120px]"
          >
            {isLoading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
