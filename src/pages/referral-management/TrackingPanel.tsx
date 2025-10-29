import { Button, Chip } from "@heroui/react";
import React, { useCallback, useState } from "react";
import { FiCalendar, FiShare2 } from "react-icons/fi";
import { GoGraph } from "react-icons/go";
import { HiOutlineDeviceMobile } from "react-icons/hi";
import { LuCheck, LuCopy, LuDownload, LuQrCode } from "react-icons/lu";
import { RiExternalLinkLine } from "react-icons/ri";
import { Link } from "react-router";
import Input from "../../components/ui/Input";
import { formatDateToMMDDYYYY } from "../../utils/formatDateToMMDDYYYY";

interface TrackingPanelProps {
  trackings?: any;
  onGenerateQR?: () => void;
}

const TrackingPanel: React.FC<TrackingPanelProps> = ({
  trackings,
  onGenerateQR,
}) => {
  const [copied, setCopied] = useState("");

  const handleCopy = async (identifier: string, value?: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(identifier);
      setTimeout(() => setCopied(""), 1000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const openSharingModal = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Referral QR Code - General Practice",
          url: trackings?.referralUrl,
        });
      } catch (error) {
        console.error("Error sharing content:", error);
      }
    } else {
      console.log("Web Share API not supported.");
    }
  }, []);

  if (!trackings?.qrCode) {
    return (
      <div className="border w-full border-primary/20 p-6 rounded-xl bg-background flex flex-col gap-8 items-center justify-center text-sm">
        <LuQrCode className="text-gray-300 text-6xl" />
        <p className="text-gray-600 text-center max-w-xs">
          Generate a personalized QR code and NFC tag for your practice
        </p>
        <Button
          variant="solid"
          color="primary"
          className="w-1/3"
          size="sm"
          onPress={() => onGenerateQR?.()}
        >
          Generate QR Code
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 items-start">
      <div className="border w-full border-primary/20 p-5 rounded-xl bg-background flex flex-col gap-10">
        {/* Header */}
        <div>
          <h6 className="text-sm flex items-center gap-2">
            <LuQrCode className="text-blue-600 text-lg" /> QR & NFC Code
            Generator
          </h6>
          <p className="text-xs mt-1.5 text-gray-600">
            Generate personalized QR codes and NFC tags for General Practice
          </p>
        </div>

        {/* QR Preview */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg border-2 border-gray-200 inline-block overflow-hidden">
            <img
              src={trackings?.qrCode}
              alt="QR Code"
              className="w-48 h-48 mx-auto"
            />
          </div>
          <p className="text-gray-600 mt-3 text-xs">
            Scan to access referral form
          </p>
        </div>

        {/* URLs Section */}
        <div className="space-y-4">
          <Input
            label="Referral Landing Page URL"
            labelPlacement="outside-top"
            value={trackings?.referralUrl || ""}
            endContent={
              <button
                onClick={() =>
                  handleCopy("REFERRAL_URL", trackings?.referralUrl)
                }
                type="button"
                className="text-gray-500 cursor-pointer"
              >
                {copied === "REFERRAL_URL" ? (
                  <LuCheck className="text-green-600" />
                ) : (
                  <LuCopy />
                )}
              </button>
            }
            isReadOnly
          />
          <Input
            label="NFC Data"
            labelPlacement="outside-top"
            value={trackings?.nfcUrl || ""}
            endContent={
              <button
                onClick={() => handleCopy("NFC_URL", trackings?.nfcUrl)}
                type="button"
                className="text-gray-500 cursor-pointer"
              >
                {copied === "NFC_URL" ? (
                  <LuCheck className="text-green-600" />
                ) : (
                  <LuCopy />
                )}
              </button>
            }
            isReadOnly
          />
        </div>

        {/* QR Info Grid */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col gap-0.5 items-center justify-center text-center">
            <GoGraph className="text-blue-600 text-lg mb-1.5" />
            <p className="text-xs font-medium">{trackings?.totalScans}</p>
            <p className="text-[11px] text-gray-600">Total Scans</p>
          </div>
          <div className="flex flex-col gap-0.5 items-center justify-center text-center">
            <FiCalendar className="text-green-600 text-lg mb-1.5" />
            <p className="text-xs font-medium">
              {formatDateToMMDDYYYY(trackings?.createdAt || "")}
            </p>
            <p className="text-[11px] text-gray-600">Created</p>
          </div>
          <div className="text-center">
            <Chip
              size="sm"
              variant="solid"
              color="primary"
              className="capitalize h-5"
              radius="sm"
            >
              Active
            </Chip>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link to={trackings?.qrCode || "#"} target="_blank">
            <Button
              variant="bordered"
              color="default"
              startContent={<LuDownload fontSize={14} />}
              className="border-small"
              size="sm"
              fullWidth
            >
              Download QR
            </Button>
          </Link>
          <Button
            variant="bordered"
            color="default"
            startContent={<FiShare2 fontSize={14} />}
            className="border-small"
            size="sm"
            onPress={openSharingModal}
          >
            Share
          </Button>
          <Link to={trackings?.referralUrl} target="_blank">
            <Button
              variant="bordered"
              color="default"
              startContent={<RiExternalLinkLine fontSize={14} />}
              className="border-small"
              size="sm"
              fullWidth
            >
              Preview Page
            </Button>
          </Link>
          <Button
            variant="bordered"
            color="default"
            startContent={<HiOutlineDeviceMobile fontSize={14} />}
            className="border-small"
            size="sm"
          >
            NFC Setup
          </Button>
        </div>

        {/* Analytics Section */}
      </div>
      <div className="border w-full border-primary/20 p-5 rounded-xl bg-background">
        <h6 className="text-sm flex items-center gap-2">Tracking Analytics</h6>
        <div className="flex flex-col gap-3 mt-4 rounded-md">
          {[
            {
              label: "Total Scans Today",
              value: trackings?.todayScan,
              className: "bg-green-100 text-green-800",
            },
            {
              label: "Active QR Codes",
              value: trackings?.activeQR,
              className: "bg-[#e0f2fe] text-[#0c4a6e]",
            },
            {
              label: "NFC Taps",
              value: trackings?.nfcSetup,
              className: "bg-blue-100 text-blue-800",
            },
            {
              label: "Conversion Rate",
              value: trackings?.conversionRate,
              className: "bg-purple-100 text-purple-800",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-xs p-4 rounded-lg bg-gray-50"
            >
              <p className="font-medium">{item.label}</p>
              <div>
                <span className={`px-1.5 py-0.5 rounded-sm ${item.className}`}>
                  {item.value ?? "-"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackingPanel;
