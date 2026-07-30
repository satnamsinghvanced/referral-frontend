import {
  Button,
  Modal,
  ModalContent,
  ModalBody,
} from "@heroui/react";
import { LuLogOut } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { handleLogoutThunk } from "../../store/authSlice";
import { AppDispatch } from "../../store";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutConfirmationModal = ({
  isOpen,
  onClose,
}: LogoutConfirmationModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await dispatch(handleLogoutThunk());
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      placement="center"
      isDismissable={!isLoading}
      hideCloseButton
      classNames={{
        base: "bg-gradient-to-b from-[#eaf2ff] via-[#f4f8ff] to-white dark:from-[#182030] dark:via-[#131926] dark:to-[#0f131c] border border-blue-100/60 dark:border-zinc-800 shadow-2xl rounded-[28px] max-w-[340px] overflow-hidden",
      }}
    >
      <ModalContent>
        <ModalBody className="flex flex-col items-center justify-center p-7 text-center">
          {/* Centered Circular Icon */}
          <div className="w-16 h-16 rounded-full bg-[#e2ecfd] dark:bg-[#1e293b] flex items-center justify-center mb-4 shrink-0 shadow-inner">
            <LuLogOut className="text-2xl text-[#1e293b] dark:text-[#93c5fd] stroke-[2]" />
          </div>

          {/* Heading & Subtitle */}
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1.5">
            Logout
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-normal mb-7">
            Are you sure you want to logout?
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 w-full pt-1">
            <Button
              size="md"
              radius="lg"
              variant="light"
              onPress={onClose}
              isDisabled={isLoading}
              className="text-[#2b7fff] dark:text-[#60a5fa] hover:bg-blue-50/80 dark:hover:bg-blue-950/50 font-semibold px-5 h-11 text-sm min-w-[80px]"
            >
              Cancel
            </Button>
            <Button
              size="md"
              radius="lg"
              onPress={handleLogout}
              isLoading={isLoading}
              className="bg-[#2b7fff] hover:bg-[#1d6ff3] text-white font-semibold px-7 h-11 text-sm rounded-[14px] shadow-lg shadow-blue-500/25 min-w-[100px]"
            >
              {isLoading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LogoutConfirmationModal;
