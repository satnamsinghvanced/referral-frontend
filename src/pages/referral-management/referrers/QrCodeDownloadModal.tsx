import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  addToast,
} from "@heroui/react";
import { useState } from "react";
import { FiDownload, FiShare2, FiUsers } from "react-icons/fi";
import { Referrer } from "../../../types/partner";

interface QrCodeDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  referrer: Referrer;
}

const QrCodeDownloadModal = ({
  isOpen,
  onClose,
  referrer,
}: QrCodeDownloadModalProps) => {
  const referralLink =
    referrer.qrUrl || `https://practiceroi.com/refer/${referrer._id}`;

  const handleDownload = async () => {
    if (!referrer.qrCode) {
      addToast({
        title: "Error",
        description: "QR Code URL is missing.",
        color: "danger",
      });
      return;
    }

    try {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = referrer.qrCode;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) return;

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          const safeName = referrer.name
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase();
          link.download = `${safeName}_qr_code.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        });
      };

      img.onerror = () => {
        addToast({
          title: "Error",
          description: "Failed to load image. Enable CORS.",
          color: "danger",
        });
      };
    } catch (error) {
      console.error("Error downloading QR code:", error);
      addToast({
        title: "Error",
        description: "Unable to download QR Code.",
        color: "danger",
      });
    }
  };

  const [isCopied, setIsCopied] = useState(false);

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
          text: `Use this link to refer patients to ${referrer.name}`,
          url: referralLink,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <div className="flex flex-col items-center p-5 pb-1">
              <ModalHeader className="flex flex-col items-start gap-1 p-0 w-full">
                <h4 className="text-base font-medium dark:text-white">
                  QR Code for {referrer.name}
                </h4>
                <p className="text-xs text-gray-500 font-normal dark:text-foreground/60">
                  Share this QR code with patients for easy referrals from{" "}
                  {referrer.name}
                </p>
              </ModalHeader>
            </div>

            <ModalBody className="flex flex-col gap-5 p-5 overflow-visible">
              {/* QR Code Container Box */}
              <div className="flex justify-center">
                <div className="w-36 h-36 relative bg-white dark:bg-background border border-foreground/10 rounded-xl flex items-center justify-center overflow-hidden">
                  {referrer.qrCode ? (
                    <Image
                      src={referrer.qrCode}
                      alt={`${referrer.name} QR Code`}
                      className="w-full h-full object-contain"
                      radius="none"
                      disableSkeleton={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                      <span className="text-xs">No QR</span>
                    </div>
                  )}
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

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  radius="sm"
                  color="primary"
                  startContent={<FiDownload className="size-3.5" />}
                  onPress={handleDownload}
                >
                  Download QR
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
                    Total Scans
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

export default QrCodeDownloadModal;
