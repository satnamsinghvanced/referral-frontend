import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { FiAlertTriangle, FiTrash2 } from "react-icons/fi";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteConfirmationModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      isDismissable={!isLoading}
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-red-500 text-xl" />
            <h4 className="text-base font-medium">Confirm Deletion</h4>
          </div>
        </ModalHeader>
        <ModalBody className="py-1">
          <p className="text-sm">
            This action cannot be undone. Are you absolutely sure you want to
            proceed?
          </p>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-3">
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            color="default"
            onPress={onClose}
            isDisabled={isLoading}
            className="border-small"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            radius="sm"
            color="danger"
            startContent={<FiTrash2 fontSize={15} />}
            onPress={onConfirm}
            isLoading={isLoading}
          >
            {isLoading ? "Deleting" : "Yes, Delete"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
