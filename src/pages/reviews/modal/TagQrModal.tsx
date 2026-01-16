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
import { FiDownload, FiShare2 } from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";
import { NFCDeskCard } from "../../../types/nfcDesk";

interface TagQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag: NFCDeskCard | null;
}

const TagQrModal = ({ isOpen, onClose, tag }: TagQrModalProps) => {
  if (!tag) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    tag.url
  )}`;

  const handleDownload = async () => {
    try {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = qrCodeUrl;

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
          const safeName = tag.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
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
    navigator.clipboard.writeText(tag.url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Review Tag: ${tag.name}`,
          text: `Scan this QR code to leave a review for ${tag.name}`,
          url: tag.url,
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
        {() => (
          <>
            <div className="flex flex-col items-center p-4 pb-1">
              <ModalHeader className="flex flex-col items-start gap-1 p-0 w-full">
                <h4 className="text-base font-medium">
                  QR Code for {tag.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-foreground/60 font-normal">
                  Share this QR code with patients to collect reviews.
                </p>
              </ModalHeader>
            </div>

            <ModalBody className="flex flex-col gap-5 p-4 overflow-visible">
              {/* QR Code Container Box */}
              <div className="flex justify-center">
                <div className="w-36 h-36 relative bg-white dark:bg-content1 border border-foreground/10 rounded-xl flex items-center justify-center overflow-hidden p-2">
                  <Image
                    src={qrCodeUrl}
                    alt={`${tag.name} QR Code`}
                    className="w-full h-full object-contain"
                    radius="none"
                    disableSkeleton={false}
                  />
                </div>
              </div>

              {/* Tag Info Card */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-sky-50 border border-sky-100 dark:bg-sky-500/10 dark:border-sky-500/20">
                <div className="size-8 rounded-md bg-primary text-white flex items-center justify-center shrink-0">
                  <LuQrCode className="size-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium line-clamp-1">
                    {tag.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-foreground/60 line-clamp-1 truncate">
                    {tag.locations.map((l) => l.name).join(", ")}
                  </span>
                </div>
              </div>

              {/* Review Link */}
              <div className="space-y-2">
                <label className="text-xs font-medium block">Review URL</label>
                <div className="flex gap-2">
                  <Input size="sm" radius="sm" value={tag.url} readOnly />
                  <Button
                    size="sm"
                    radius="sm"
                    className={`min-w-fit px-4 border font-medium ${
                      isCopied
                        ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30"
                        : "bg-white border-foreground/10 hover:bg-gray-50 text-gray-700 dark:bg-content1 dark:text-foreground dark:hover:bg-content2"
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
                <div className="bg-gray-50 dark:bg-content1 p-3 rounded-lg border border-foreground/10 space-y-0.5">
                  <span className="text-xs text-gray-500 dark:text-foreground/60 block">
                    Total Interactions
                  </span>
                  <span className="text-sm font-medium">{tag.totalTap}</span>
                </div>
                <div className="bg-gray-50 dark:bg-content1 p-3 rounded-lg border border-foreground/10 space-y-0.5">
                  <span className="text-xs text-gray-500 dark:text-foreground/60 block">
                    Conversion Rate
                  </span>
                  <span className="text-sm font-medium">
                    {tag.conversionRate}%
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

export default TagQrModal;
