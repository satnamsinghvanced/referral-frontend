import { Button, Modal, ModalContent, ModalBody } from "@heroui/react";
import { LuLogOut } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { handleLogoutThunk } from "../../store/authSlice";
import { AppDispatch } from "../../store";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutConfirmationModal = ({ isOpen, onClose }: LogoutConfirmationModalProps) => {
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
      classNames={{
        base: "bg-gradient-to-b from-[#eaf2ff] via-[#f4f8ff] to-white dark:from-[#182030] dark:via-[#131926] dark:to-[#0f131c] border border-blue-100/60 dark:border-zinc-800 shadow-2xl rounded-[10px] max-w-[350px] overflow-hidden",
        closeButton: "top-3 right-3 text-gray-400 hover:bg-gray-100 dark:hover:bg-foreground/10 p-1.5 rounded-lg transition-colors cursor-pointer",
      }}
    >
      <ModalContent>
        <ModalBody className="flex flex-col items-center justify-center p-7 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 shrink-0 shadow-inner">
            <LuLogOut className="text-2xl text-red-800 dark:text-red-300 stroke-[2]" />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1.5">
            Sign Out
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-normal mb-7">
            Are you sure you want to sign out?
          </p>

          <div className="flex items-center justify-between gap-3 w-full pt-1">
            <Button
              size="md"
              radius="lg"
              variant="light"
              onPress={onClose}
              isDisabled={isLoading}
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-foreground/10 font-semibold px-5 h-11 text-sm min-w-[80px]"
            >
              Cancel
            </Button>
            <Button
              size="md"
              radius="lg"
              onPress={handleLogout}
              isLoading={isLoading}
              className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 font-semibold px-7 h-11 text-sm rounded-[14px] shadow-lg shadow-blue-500/25 min-w-[100px]"
            >
              {isLoading ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LogoutConfirmationModal;
