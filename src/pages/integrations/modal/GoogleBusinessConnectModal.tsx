import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  addToast,
} from "@heroui/react";
import { FaGoogle } from "react-icons/fa";
import { useWindsorAuth } from "../../../hooks/integrations/useGoogleBusiness";

interface GoogleBusinessConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoogleBusinessConnectModal({
  isOpen,
  onClose,
}: GoogleBusinessConnectModalProps) {
  const { mutate: connectWindsor, isPending } = useWindsorAuth();

  const handleConnect = () => {
    connectWindsor(undefined, {
      onError: () => {
        addToast({
          title: "Connection Failed",
          description: "Could not initiate Windsor.ai connection. Please try again.",
          color: "danger",
        });
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      size="md"
      placement="center"
      classNames={{
        base: "bg-background border border-foreground/10 shadow-2xl rounded-2xl max-sm:m-3",
        closeButton: "hover:bg-foreground/10 active:bg-foreground/20 cursor-pointer",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/10 text-cyan-500 rounded-lg">
              <FaGoogle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">
              Connect Google My Business
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-foreground/50 font-normal">
            Securely connect your Google Business Profile via Windsor.ai to sync reviews and manage your listings automatically.
          </p>
        </ModalHeader>

        <ModalBody className="py-6 flex flex-col gap-4">
          <Button
            size="lg"
            color="primary"
            variant="solid"
            className="w-full font-semibold shadow-md"
            isLoading={isPending}
            onPress={handleConnect}
          >
            Connect with Windsor.ai
          </Button>
          <p className="text-xs text-center text-gray-400">
            You will be securely redirected to Windsor.ai to authorize access.
          </p>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}