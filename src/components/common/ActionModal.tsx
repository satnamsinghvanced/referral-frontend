import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

interface ModalButton {
  text: string;
  onPress: () => void;
  color?: "default" | "primary" | "secondary" | "danger" | "success";
  variant?: "solid" | "bordered" | "light" | "ghost" | "flat";
  icon?: React.ReactNode;
  isDisabled?: boolean;
  className?: string;
  isLoading?: boolean;
}

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  heading?: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  buttons?: ModalButton[]; // ⬅ multiple buttons support
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"; // control modal width
  scrollable?: boolean; // enable scroll within body
  footerAlign?: "left" | "center" | "right"; // footer alignment
  classNames?: {
    content?: string;
    header?: string;
    body?: string;
    footer?: string;
  };
}

const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  heading,
  description,
  children,
  buttons = [],
  size = "md",
  scrollable = true,
  footerAlign = "right",
  classNames = {},
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size={size}
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
        ...classNames,
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader
              className={`flex justify-between items-start px-5 font-normal ${
                classNames.header || ""
              }`}
            >
              <div className="flex flex-col gap-1.5">
                {heading && (
                  <h4 className="text-base font-medium leading-snug">{heading}</h4>
                )}
                {description && (
                  <p className="text-xs text-gray-600">{description}</p>
                )}
              </div>
            </ModalHeader>

            {children && (
              <ModalBody
                className={`w-full px-5 py-0 ${
                  scrollable ? "max-h-[70vh] overflow-y-auto" : ""
                } ${classNames.body || ""}`}
              >
                {children}
              </ModalBody>
            )}

            {buttons.length > 0 && (
              <ModalFooter
                className={`flex px-5 ${
                  footerAlign === "center"
                    ? "justify-center"
                    : footerAlign === "left"
                    ? "justify-start"
                    : "justify-end"
                } gap-2 ${classNames.footer || ""}`}
              >
                {buttons.map((btn, idx) => (
                  <Button
                    key={idx}
                    size="sm"
                    color={btn.color || "default"}
                    variant={btn.variant || "solid"}
                    onPress={btn.onPress}
                    className={`capitalize ${btn.className || ""}`}
                    isDisabled={btn.isDisabled ?? false}
                    isLoading={btn.isLoading ?? false}
                  >
                    {btn.icon && <span>{btn.icon}</span>}
                    {btn.text}
                  </Button>
                ))}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ActionModal;
