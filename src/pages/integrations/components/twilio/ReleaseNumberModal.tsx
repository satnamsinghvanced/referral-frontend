import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { PhoneNumber } from "../a2p/types";

interface ReleaseNumberModalProps {
  numberToRelease: PhoneNumber | null;
  isReleasing: boolean;
  onClose: () => void;
  onConfirmRelease: () => void;
}

export default function ReleaseNumberModal({ numberToRelease, isReleasing, onClose, onConfirmRelease, }: ReleaseNumberModalProps) {
  return (
    <Modal
      isOpen={!!numberToRelease}
      onOpenChange={onClose}
      size="sm"
      classNames={{
        base: "max-sm:!m-3 !m-0 bg-background border border-foreground/10 text-foreground rounded-2xl",
        closeButton: "cursor-pointer text-foreground/50 hover:text-foreground",
      }}
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 p-5 pb-2">
          <h3 className="text-lg font-bold text-foreground">Release Phone Number</h3>
        </ModalHeader>
        <ModalBody className="p-5 pt-2">
          <p className="text-xs text-foreground-500 leading-relaxed">
            Are you sure you want to release the phone number{" "}
            <span className="font-semibold text-foreground">{numberToRelease?.phoneNumber}</span>? This action cannot be undone and inbound calls or messages to this number will fail immediately.
          </p>
        </ModalBody>
        <ModalFooter className="p-5 pt-2 flex gap-3 justify-end border-t border-foreground/5">
          <Button
            variant="bordered"
            isDisabled={isReleasing}
            onPress={onClose}
            className="border border-foreground/10 rounded-lg text-xs font-semibold h-8 px-4"
          >
            Cancel
          </Button>
          <Button
            color="danger"
            isLoading={isReleasing}
            isDisabled={isReleasing}
            onPress={onConfirmRelease}
            className="bg-danger text-white rounded-lg text-xs font-semibold h-8 px-4"
          >
            Confirm Release
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
