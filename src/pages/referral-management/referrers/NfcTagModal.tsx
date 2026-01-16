import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  addToast,
} from "@heroui/react";
import { useState } from "react";
import { FiShare2, FiUsers } from "react-icons/fi";
import { LuNfc } from "react-icons/lu";
import { Referrer } from "../../../types/partner";

interface NfcTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  referrer: Referrer;
}

const NfcTagModal = ({ isOpen, onClose, referrer }: NfcTagModalProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const referralLink =
    referrer.nfcUrl || `https://practiceroi.com/refer/${referrer._id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Referral for ${referrer.name}`,
          text: `Tap to refer patients to ${referrer.name}`,
          url: referralLink,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWriteToNfc = async () => {
    if ("NDEFReader" in window) {
      try {
        // @ts-ignore - Web NFC API type defs might be missing
        const ndef = new window.NDEFReader();
        addToast({
          title: "Ready to Write",
          description: "Tap your NFC tag now to write the referral link.",
          color: "primary",
        });

        await ndef.write({
          records: [{ recordType: "url", data: referralLink }],
        });

        addToast({
          title: "Success",
          description: "Successfully wrote to NFC tag!",
          color: "success",
        });
      } catch (error) {
        console.error("NFC Write Error:", error);
        addToast({
          title: "Error",
          description:
            "Failed to write to NFC tag. Ensure permission is granted.",
          color: "danger",
        });
      }
    } else {
      addToast({
        title: "Not Supported",
        description: "Your browser or device does not support Web NFC.",
        color: "warning",
        classNames: {
          title: "text-warning-800",
          description: "text-warning-700",
        },
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      classNames={{
        base: "bg-white dark:bg-background rounded-2xl",
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <div className="flex flex-col items-center p-5 pb-1">
              <ModalHeader className="flex flex-col items-start gap-1 p-0 w-full">
                <h4 className="text-base font-medium dark:text-white">
                  NFC Tag for {referrer.name}
                </h4>
                <p className="text-xs text-gray-500 font-normal dark:text-foreground/60">
                  Write this referral link to an NFC tag for easy tap-to-refer
                  functionality
                </p>
              </ModalHeader>
            </div>

            <ModalBody className="flex flex-col gap-5 p-5 overflow-visible">
              {/* NFC Icon Container - The big blue card */}
              <div className="flex justify-center">
                <div className="w-36 h-36 relative bg-[#007AFF] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <LuNfc className="size-20 text-white" />
                </div>
              </div>

              {/* Profile Card */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/30">
                <div className="size-8 rounded-md bg-primary text-white flex items-center justify-center shrink-0">
                  <FiUsers className="size-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium line-clamp-1 dark:text-white">
                    {referrer.name}
                  </span>
                  <span className="text-xs text-gray-500 line-clamp-1 dark:text-foreground/60">
                    {referrer.practice?.name || "No Practice Assigned"}
                  </span>
                </div>
              </div>

              {/* Referral Link */}
              <div className="space-y-2">
                <label className="text-xs font-medium block dark:text-foreground/60">
                  Referral Link
                </label>
                <div className="flex gap-2">
                  <Input size="sm" radius="sm" value={referralLink} readOnly />
                  <Button
                    size="sm"
                    radius="sm"
                    className={`min-w-fit px-4 border font-medium ${
                      isCopied
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-white dark:bg-content2 border-foreground/10 hover:bg-gray-50 dark:hover:bg-content3 text-gray-700 dark:text-foreground"
                    }`}
                    onPress={handleCopyLink}
                  >
                    {isCopied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              {/* Instructions Box */}
              <div className="bg-[#FFFBF0] dark:bg-yellow-900/10 border border-[#FFEeba] dark:border-yellow-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-3 text-yellow-900 dark:text-yellow-400 font-medium text-sm">
                  <LuNfc className="size-4" />
                  <span>How to use NFC</span>
                </div>
                <ol className="text-xs text-yellow-800 dark:text-yellow-500/80 space-y-1 list-decimal list-inside leading-relaxed">
                  <li>Get a blank NFC tag (sticker, bracelet or card, etc)</li>
                  <li>Tap "Write to NFC Tag" below</li>
                  <li>Hold your device near the NFC tag</li>
                  <li>Place the tag where patients can tap it</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  radius="sm"
                  color="primary"
                  startContent={<LuNfc className="size-3.5" />}
                  onPress={handleWriteToNfc}
                >
                  Write to NFC Tag
                </Button>
                <Button
                  size="sm"
                  radius="sm"
                  variant="bordered"
                  startContent={<FiShare2 className="size-3.5" />}
                  onPress={handleShare}
                  className="border-small"
                >
                  Share
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 dark:bg-background/50 p-3 rounded-lg border border-foreground/10 space-y-0.5">
                  <span className="text-xs text-gray-500 dark:text-foreground/40 block">
                    Total Taps
                  </span>
                  <span className="text-sm font-medium dark:text-white">
                    {referrer.referrals?.length || 0}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-background/50 p-3 rounded-lg border border-foreground/10 space-y-0.5">
                  <span className="text-xs text-gray-500 dark:text-foreground/40 block">
                    This Month
                  </span>
                  <span className="text-sm font-medium dark:text-white">
                    {referrer.thisMonthReferralCount || 0}
                  </span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="p-0" />
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default NfcTagModal;
