import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  onVerify: (otp: string) => void;
  onResend?: (() => void | Promise<void>) | undefined;
  phoneNumber?: string | undefined;
  error?: string | undefined;
  onClearError?: (() => void) | undefined;
  title?: string | undefined;
}

const maskPhoneForDisplay = (phone: string | undefined): string => {
  if (!phone) return "";
  const clean = phone.replace(/\D/g, "");
  const localNumber = clean.length > 10 ? clean.slice(-10) : clean;
  if (localNumber.length < 4) return localNumber;
  return `${localNumber.slice(0, 2)}xxxxxx${localNumber.slice(-2)}`;
};

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  onVerify,
  onResend,
  phoneNumber,
  error,
  onClearError,
  title = "Verify OTP",
}) => {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setCountdown(30);
    }
  }, [isOpen]);

  useEffect(() => {
    if (countdown > 0 && isOpen) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isOpen]);

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  const handleResend = async () => {
    if (onResend) {
      await onResend();
      setCountdown(30);
      setOtp("");
      if (onClearError) onClearError();
    }
  };
  const displayPhone = maskPhoneForDisplay(phoneNumber);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody>
          <p className="text-sm text-foreground/70 mb-4">
            Enter the 6-digit verification code sent to your phone{" "}
            {displayPhone ? `(${displayPhone})` : ""}.
          </p>
          <Input
            label="Verification Code"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onValueChange={(val) => {
              if (/^\d*$/.test(val)) {
                setOtp(val);
                if (error && onClearError) {
                  onClearError();
                }
              }
            }}
            variant="flat"
            maxLength={6}
            isRequired
            autoFocus
            isInvalid={!!error}
            errorMessage={error}
          />
          <div className="flex justify-end text-xs mt-1">
            {countdown > 0 ? (
              <span className="text-foreground/50">
                Resend code in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-primary hover:underline font-medium focus:outline-none"
              >
                Resend Code
              </button>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="primary"
            isLoading={isLoading}
            isDisabled={otp.length !== 6 || isLoading}
            onPress={handleVerify}
          >
            Verify
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
