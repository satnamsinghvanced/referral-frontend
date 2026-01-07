import { addToast, Button, Checkbox, Chip, Input } from "@heroui/react";
import { useState } from "react";
import { FiCalendar, FiShare2 } from "react-icons/fi";
import { GoGraph } from "react-icons/go";
import { HiOutlineDeviceMobile } from "react-icons/hi";
import { LuCheck, LuCopy, LuDownload, LuQrCode } from "react-icons/lu";
import { RiExternalLinkLine } from "react-icons/ri";
import { Link } from "react-router";
import { LoadingState } from "../../components/common/LoadingState";
import {
  useCreateTrackingSetup,
  useFetchTrackings,
} from "../../hooks/useReferral";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { formatDateToMMDDYYYY } from "../../utils/formatDateToMMDDYYYY";

const TrackingPanel = () => {
  const [copied, setCopied] = useState("");
  const [customPath, setCustomPath] = useState("");
  const [isCustomLandingPage, setIsCustomLandingPage] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  const { user } = useTypedSelector((state) => state.auth);
  const userId = user?.userId;

  const { data: trackings, isLoading } = useFetchTrackings(userId as string);
  const { mutate: createTrackingSetup } = useCreateTrackingSetup();

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

  const handleNFCSetup = async (nfcUrl: string) => {
    if (!("NDEFReader" in window)) {
      addToast({
        title: "Error",
        description: "NFC is not supported on this device/browser.",
        color: "danger",
      });
      return;
    }

    try {
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();
      addToast({
        title: "Success",
        description:
          "NFC scan started. Bring your NFC tag close to the device.",
        color: "success",
      });
      ndef.onreading = (event: { message: { records: any[] } }) => {
        const decoder = new TextDecoder();
        const tagMessage = event.message.records
          .map((record) => decoder.decode(record.data))
          .join(", ");

        addToast({
          title: "Success",
          description: `NFC tag detected: ${tagMessage}`,
          color: "success",
        });
      };

      await ndef.write(nfcUrl || "https://example.com");
      addToast({
        title: "Success",
        description: "NFC data written successfully!",
        color: "success",
      });
    } catch (error: any) {
      addToast({
        title: "Error",
        description: `NFC setup failed: ${error.message}`,
        color: "danger",
      });
    }
  };

  const handleDownloadQR = async (imageUrl: string) => {
    if (!imageUrl) {
      addToast({
        title: "Error",
        description: "QR Code URL is missing.",
        color: "danger",
      });
      return;
    }

    try {
      const img = new Image();
      img.crossOrigin = "anonymous"; // IMPORTANT for Canvas usage
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (!blob) return;

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `referral_qr_${user?.userId}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
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
    } catch (e) {
      console.error("QR Download failed", e);
      addToast({
        title: "Error",
        description: "Unable to download QR Code.",
        color: "danger",
      });
    }
  };

  const openSharingModal = async (referralUrl: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Referral QR Code - General Practice",
          url: referralUrl.split("?")[0] as string,
        });
      } catch (error) {
        console.error("Error sharing content:", error);
      }
    } else {
      console.log("Web Share API not supported.");
    }
  };

  const generateTracking = () => {
    createTrackingSetup(
      {
        id: userId as string,
        customPath: (customPath as string) || "referral",
      },
      {
        onSuccess: () => {
          setShowGenerator(false);
          setCustomPath("");
        },
      }
    );
  };

  const latestQr =
    trackings?.personalizedQR && trackings.personalizedQR.length > 0
      ? trackings.personalizedQR[trackings.personalizedQR.length - 1]
      : null;

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-start">
        <div className="border w-full border-primary/20 p-4 md:p-5 rounded-xl bg-background flex flex-col gap-4 md:gap-5 h-full tour-step-qr-area">
          <div>
            <h6 className="text-sm flex items-center gap-2">
              <LuQrCode className="text-blue-600 text-lg" /> QR & NFC Code
              Generator
            </h6>
            <p className="text-xs mt-1.5 text-gray-600">
              Generate personalized QR codes and NFC tags for General Practice
            </p>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <LoadingState />
              </div>
            ) : !latestQr || showGenerator ? (
              <>
                <div>
                  <div className="flex flex-col items-center gap-4 mt-4 mb-8">
                    <LuQrCode className="text-gray-300 text-5xl" />
                    <p className="text-gray-600 text-center text-xs">
                      Generate a personalized QR code and NFC tag for your
                      practice
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex">
                      <Checkbox
                        size="sm"
                        radius="sm"
                        isSelected={isCustomLandingPage}
                        onValueChange={setIsCustomLandingPage}
                      >
                        Use Custom Landing Page URL
                      </Checkbox>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      {!isCustomLandingPage
                        ? "Default: https://practicemarketer.ai/referral"
                        : "Enter your custom referral landing page URL"}
                    </p>
                    {isCustomLandingPage && (
                      <div className="mt-2.5">
                        <Input
                          size="sm"
                          radius="sm"
                          label="Custom Landing Page URL"
                          labelPlacement="outside-top"
                          placeholder="referral"
                          startContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small whitespace-nowrap">
                                {import.meta.env.VITE_LIVE_URL}
                              </span>
                            </div>
                          }
                          type="text"
                          value={customPath}
                          onValueChange={(value) =>
                            setCustomPath(value.replace(/\s+/g, ""))
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="solid"
                    color="primary"
                    size="sm"
                    onPress={generateTracking}
                    fullWidth
                  >
                    Generate QR Code
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4 md:space-y-5 mt-2">
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-background rounded-lg border-2 border-gray-200 inline-block overflow-hidden">
                    <img
                      src={latestQr.qrCode}
                      alt="QR Code"
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                  <p className="text-gray-600 mt-3 text-xs">
                    Scan to access referral form
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Referral Landing Page URL"
                    labelPlacement="outside-top"
                    value={latestQr.referralUrl || ""}
                    endContent={
                      <button
                        onClick={() =>
                          handleCopy("REFERRAL_URL", latestQr.referralUrl)
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
                    value={latestQr.nfcUrl || ""}
                    endContent={
                      <button
                        onClick={() => handleCopy("NFC_URL", latestQr.nfcUrl)}
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

                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-col gap-0.5 items-center justify-center text-center">
                    <GoGraph className="text-blue-600 text-lg mb-1.5" />
                    <p className="text-xs font-medium">{latestQr.totalScan}</p>
                    <p className="text-[11px] text-gray-600">Total Scans</p>
                  </div>
                  <div className="flex flex-col gap-0.5 items-center justify-center text-center">
                    <FiCalendar className="text-green-600 text-lg mb-1.5" />
                    <p className="text-xs font-medium">
                      {formatDateToMMDDYYYY(latestQr.createdAt || "")}
                    </p>
                    <p className="text-[11px] text-gray-600">Created</p>
                  </div>
                  <div className="text-center">
                    <Chip
                      size="sm"
                      variant="solid"
                      color={latestQr.active ? "primary" : "default"}
                      className="capitalize h-5"
                      radius="sm"
                    >
                      {latestQr.active ? "Active" : "Inactive"}
                    </Chip>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <Button
                    variant="bordered"
                    color="default"
                    startContent={<LuDownload fontSize={14} />}
                    className="border-small"
                    size="sm"
                    radius="sm"
                    fullWidth
                    onPress={() => handleDownloadQR(latestQr.qrCode)}
                  >
                    Download QR
                  </Button>
                  <Button
                    variant="bordered"
                    color="default"
                    startContent={<FiShare2 fontSize={14} />}
                    className="border-small"
                    size="sm"
                    radius="sm"
                    onPress={() => openSharingModal(latestQr.referralUrl)}
                  >
                    Share
                  </Button>
                  <Link
                    to={latestQr.referralUrl.split("?")[0] || ""}
                    target="_blank"
                  >
                    <Button
                      variant="bordered"
                      color="default"
                      startContent={<RiExternalLinkLine fontSize={14} />}
                      className="border-small"
                      size="sm"
                      radius="sm"
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
                    radius="sm"
                    onPress={() => handleNFCSetup(latestQr.nfcUrl)}
                  >
                    NFC Setup
                  </Button>
                  <div className="col-span-full">
                    <Button
                      variant="bordered"
                      color="default"
                      size="sm"
                      radius="sm"
                      fullWidth
                      onPress={() => setShowGenerator(true)}
                      className="border-small"
                    >
                      Generate New QR Code
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="border w-full border-primary/20 p-4 md:p-5 rounded-xl bg-background h-full">
          <h6 className="text-sm flex items-center gap-2">
            Tracking Analytics
          </h6>
          <div className="flex flex-col gap-2 md:gap-3 mt-4 rounded-md">
            {[
              {
                label: "Total Scans",
                value: trackings?.totalScans ?? 0,
                className: "bg-green-100 text-green-800",
              },
              {
                label: "Active QR Codes",
                value: trackings?.activeQR ?? 0,
                className: "bg-[#e0f2fe] text-[#0c4a6e]",
              },
              {
                label: "NFC Taps",
                value: trackings?.nfcTaps ?? 0,
                className: "bg-blue-100 text-blue-800",
              },
              {
                label: "Conversion Rate",
                value: `${trackings?.conversionRate ?? 0}%`,
                className: "bg-purple-100 text-purple-800",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-xs p-3 md:p-4 rounded-lg bg-gray-50"
              >
                <p className="font-medium">{item.label}</p>
                <div>
                  <span
                    className={`px-1.5 py-0.5 rounded-sm ${item.className}`}
                  >
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {trackings?.personalizedQR && trackings.personalizedQR.length > 0 && (
        <div className="border w-full border-primary/15 p-4 md:p-5 rounded-xl bg-background">
          <h4 className="text-sm font-medium flex items-center gap-2 pb-3">
            <LuQrCode className="text-blue-600 text-lg" />
            Generated QR Codes
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs py-3 px-2 font-medium text-gray-700 max-w-fit">
                    QR Code
                  </th>
                  <th className="text-left text-xs py-3 px-2 font-medium text-gray-700">
                    Path / URL
                  </th>
                  <th className="text-left text-xs py-3 px-2 font-medium text-gray-700">
                    Total Scans
                  </th>
                  <th className="text-left text-xs py-3 px-2 font-medium text-gray-700">
                    Created
                  </th>
                  <th className="text-right text-xs py-3 px-2 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trackings.personalizedQR.map((qr) => (
                  <tr key={qr._id} className="hover:bg-gray-50/50">
                    <td className="text-left text-xs py-3 px-2 max-w-fit">
                      <div className="bg-white border border-gray-200 rounded p-0.5 w-12 h-12 flex items-center justify-center">
                        <img
                          src={qr.qrCode}
                          alt="QR"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </td>
                    <td className="text-left text-xs py-3 px-2">
                      <div className="flex flex-col max-w-[200px] md:max-w-full space-y-0.5">
                        <span className="truncate">
                          {qr.customPath || "Default"}
                        </span>
                        <a
                          href={qr.referralUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-blue-500 hover:underline truncate w-fit"
                        >
                          {qr.referralUrl}
                        </a>
                      </div>
                    </td>
                    <td className="text-left text-xs py-3 px-2 font-medium">
                      {qr.totalScan}
                    </td>
                    <td className="text-left text-xs py-3 px-2 whitespace-nowrap">
                      {formatDateToMMDDYYYY(qr.createdAt)}
                    </td>
                    <td className="text-left text-xs py-3 px-2">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleDownloadQR(qr.qrCode)}
                          title="Download QR"
                        >
                          <LuDownload className="size-3.5" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleCopy(qr._id, qr.referralUrl)}
                          title="Copy Link"
                        >
                          {copied === qr._id ? (
                            <LuCheck className="text-green-600 size-3.5" />
                          ) : (
                            <LuCopy className="size-3.5" />
                          )}
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => openSharingModal(qr.referralUrl)}
                          title="Share"
                        >
                          <FiShare2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingPanel;
