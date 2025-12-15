import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  addToast,
} from "@heroui/react";
import { FiDownload } from "react-icons/fi";

interface QrCodeDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  referrerName: string;
  qrCodeUrl: string;
}

const QrCodeDownloadModal = ({
  isOpen,
  onClose,
  referrerName,
  qrCodeUrl,
}: QrCodeDownloadModalProps) => {
  const handleDownload = async () => {
    if (!qrCodeUrl) {
      addToast({
        title: "Error",
        description: "QR Code URL is missing.",
        color: "danger",
      });
      return;
    }

    try {
      const img = new window.Image();
      img.crossOrigin = "anonymous"; // IMPORTANT for Canvas usage
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
          // Sanitize filename
          const safeName = referrerName
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
          description:
            "Failed to load image. Enable CORS on server for QR image endpoint.",
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
            <ModalHeader className="flex flex-col gap-1 font-normal p-4">
              <div className="space-y-1">
                <h4 className="text-base font-medium">{referrerName}</h4>
                <p className="text-gray-500 text-xs p-0">
                  Preview and download the unique QR code for this referrer.
                </p>
              </div>
            </ModalHeader>
            <ModalBody className="flex justify-center items-center p-4 py-0">
              <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center bg-primary/5 py-4">
                <Image
                  src={qrCodeUrl}
                  alt={`${referrerName} QR Code`}
                  className="object-contain"
                  radius="none"
                />
              </div>
            </ModalBody>
            <ModalFooter className="p-4">
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                color="default"
                onPress={onClose}
                className="border-small"
              >
                Close
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="solid"
                color="primary"
                onPress={handleDownload}
                startContent={<FiDownload className="size-3.5" />}
              >
                Download
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default QrCodeDownloadModal;
