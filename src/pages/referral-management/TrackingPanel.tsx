import { addToast, Button, Checkbox, Chip, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useMemo, useState } from "react";
import { FiCalendar, FiShare2 } from "react-icons/fi";
import { GoGraph } from "react-icons/go";
import { HiOutlineDeviceMobile } from "react-icons/hi";
import { LuCheck, LuCopy, LuDownload, LuQrCode, LuTrash2, LuSquarePen } from "react-icons/lu";
import { RiExternalLinkLine } from "react-icons/ri";
import { Link } from "react-router";
import { LoadingState } from "../../components/common/LoadingState";
import {
  useCreateTrackingSetup,
  useFetchTrackings,
  useDeleteTracking,
  useUpdateTracking,
} from "../../hooks/useReferral";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { formatDateToMMDDYYYY } from "../../utils/formatDateToMMDDYYYY";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";

const URL_REGEX = /^(https:\/\/|www\.)[^\s]+\.[^\s]+$/i;

const TrackingPanel = () => {
  const [copied, setCopied] = useState("");
  const [customPath, setCustomPath] = useState("");
  const [isCustomLandingPage, setIsCustomLandingPage] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedQrId, setSelectedQrId] = useState<string | null>(null);
  const [isFullCustomUrl, setIsFullCustomUrl] = useState(false);
  const [customLandingUrl, setCustomLandingUrl] = useState("");
  const [deleteQrId, setDeleteQrId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editQrId, setEditQrId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { user } = useTypedSelector((state) => state.auth);
  const userId = user?.userId;

  const { data: trackings, isLoading } = useFetchTrackings(userId as string);
  const { mutate: createTrackingSetup } = useCreateTrackingSetup();
  const { mutate: deleteTracking, isPending: isDeleting } = useDeleteTracking();
  const { mutate: updateTracking, isPending: isUpdating } = useUpdateTracking();
  console.log("trackings >>>>>", trackings)

  const handleDeleteConfirm = () => {
    if (!deleteQrId) return;
    deleteTracking(deleteQrId, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setDeleteQrId(null);
        if (selectedQrId === deleteQrId) {
          setSelectedQrId(null);
        }
      },
    });
  };

  const handleEditConfirm = () => {
    if (!editQrId || !editName.trim()) return;
    updateTracking(
      {
        trackingId: editQrId,
        payload: {
          customPath: editName.trim().replace(/\s+/g, "_"),
        },
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setEditQrId(null);
          setEditName("");
        },
      }
    );
  };
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

  // const handleDownloadQR = async (imageUrl: string) => {
  //   if (!imageUrl) {
  //     addToast({
  //       title: "Error",
  //       description: "QR Code URL is missing.",
  //       color: "danger",
  //     });
  //     return;
  //   }

  //   try {
  //     const img = new Image();
  //     img.crossOrigin = "anonymous";

  //     // Use the backend proxy to avoid CORS and caching issues
  //     const proxyUrl = `${import.meta.env.VITE_API_BASE_URL}/proxy-image?url=${encodeURIComponent(imageUrl)}`;
  //     img.src = proxyUrl;

  //     img.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       canvas.width = img.width;
  //       canvas.height = img.height;
  //       const ctx = canvas.getContext("2d");
  //       ctx?.drawImage(img, 0, 0);

  //       canvas.toBlob((blob) => {
  //         if (!blob) return;

  //         const url = URL.createObjectURL(blob);
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.download = `referral_qr_${user?.userId}.png`;
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //         URL.revokeObjectURL(url);
  //       });
  //     };

  //     img.onerror = () => {
  //       addToast({
  //         title: "Error",
  //         description:
  //           "Failed to load image. Enable CORS on server for QR image endpoint.",
  //         color: "danger",
  //       });
  //     };
  //   } catch (e) {
  //     console.error("QR Download failed", e);
  //     addToast({
  //       title: "Error",
  //       description: "Unable to download QR Code.",
  //       color: "danger",
  //     });
  //   }
  // };

  const handleDownloadQR = async (imageUrl: string) => {
    if (!imageUrl) return;

    const fileName = `referral_qr_${user?.userId || "code"}.png`;

    try {
      const response = await fetch(`${imageUrl}?t=${new Date().getTime()}`, {
        mode: "cors",
        cache: "no-cache",
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("QR Download via fetch failed, trying canvas fallback", e);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } catch (err) {
          console.error("Canvas fallback failed", err);
          const link = document.createElement("a");
          link.href = imageUrl;
          link.download = fileName;
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };
      img.onerror = () => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = fileName;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
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
    const uniqueId = Math.random().toString(36).substring(2, 7);

    createTrackingSetup(
      {
        id: userId as string,
        customPath: isFullCustomUrl
          ? (customPath ? customPath.replace(/\s+/g, "_") : `External_${uniqueId}`)
          : isCustomLandingPage && customPath
            ? customPath.replace(/\s+/g, "_")
            : "referral",
        customLandingUrl: isFullCustomUrl ? customLandingUrl : undefined,
        isManually: isFullCustomUrl ? true : false,
      },
      {
        onSuccess: () => {
          setShowGenerator(false);
          setCustomPath("");
          setCustomLandingUrl("");
          setIsFullCustomUrl(false);
          setIsCustomLandingPage(false);
          setSelectedQrId(null);
        },
      },
    );
  };

  const latestQr = useMemo(() => {
    if (!trackings?.personalizedQR || trackings.personalizedQR.length === 0)
      return null;
    if (selectedQrId) {
      return (
        trackings.personalizedQR.find((q: any) => q._id === selectedQrId) ||
        trackings.personalizedQR[trackings.personalizedQR.length - 1]
      );
    }
    return trackings.personalizedQR[trackings.personalizedQR.length - 1];
  }, [trackings?.personalizedQR, selectedQrId]);

  const analyticsSummary = useMemo(() => {
    const list = trackings?.personalizedQR || [];
    if (list.length === 0) {
      return {
        activeQR: 0,
        totalScans: 0,
        qrScans: 0,
        nfcTaps: 0,
        totalReferrals: 0,
        conversionRate: "0%",
      };
    }

    const activeQR = list.length;
    const totalScans = list.reduce(
      (sum: number, item: any) => sum + (Number(item.totalScan) || 0),
      0
    );
    const qrScans = list.reduce(
      (sum: number, item: any) => sum + (Number(item.qrScan) || 0),
      0
    );
    const nfcTaps = list.reduce(
      (sum: number, item: any) => sum + (Number(item.nfcTaps) || 0),
      0
    );
    const totalReferrals = list.reduce(
      (sum: number, item: any) => sum + (Number(item.totalReferrals) || 0),
      0
    );

    const finalTotalScans = totalScans > 0 ? totalScans : (trackings?.totalScans ?? 0);
    const finalTotalReferrals = totalReferrals > 0 ? totalReferrals : (trackings?.totalReferrals ?? 0);

    let rate = 0;
    if (finalTotalScans > 0) {
      rate = Number(((finalTotalReferrals / finalTotalScans) * 100).toFixed(2));
    } else if (trackings?.conversionRate !== undefined) {
      rate = trackings.conversionRate;
    }

    return {
      activeQR,
      totalScans: finalTotalScans,
      qrScans: qrScans > 0 ? qrScans : (trackings?.qrScans ?? 0),
      nfcTaps: nfcTaps > 0 ? nfcTaps : (trackings?.nfcTaps ?? 0),
      totalReferrals: finalTotalReferrals,
      conversionRate: `${rate}%`,
    };
  }, [trackings]);

  const hasDefaultReferralQR = useMemo(() => {
    if (!trackings?.personalizedQR || trackings.personalizedQR.length === 0) return false;
    return trackings.personalizedQR.some(
      (q: any) =>
        q.customPath === "referral" ||
        (!q.isManually && (!q.customPath || q.customPath === "referral"))
    );
  }, [trackings?.personalizedQR]);

  const isGenerateDisabled = useMemo(() => {
    if (isFullCustomUrl) {
      return !customLandingUrl || !URL_REGEX.test(customLandingUrl);
    }
    if (isCustomLandingPage) {
      return !customPath.trim();
    }
    return hasDefaultReferralQR;
  }, [isFullCustomUrl, customLandingUrl, isCustomLandingPage, customPath, hasDefaultReferralQR]);

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-start">
        <div className="border w-full border-foreground/10 p-4 md:p-5 rounded-xl bg-background flex flex-col gap-4 md:gap-5 h-full tour-step-qr-area">
          <div>
            <h6 className="text-sm flex items-center gap-2 dark:text-white">
              <LuQrCode className="text-blue-600 dark:text-blue-500 text-lg" />{" "}
              QR & NFC Code Generator
            </h6>
            <p className="text-xs mt-1.5 text-gray-600 dark:text-foreground/60">
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
                    <LuQrCode className="text-gray-300 dark:text-foreground/20 text-5xl" />
                    <p className="text-gray-600 dark:text-foreground/60 text-center text-xs">
                      Generate a personalized QR code and NFC tag for your
                      practice
                    </p>
                  </div>
                  <div className="space-y-1">
                    {!isFullCustomUrl && (
                      <>
                        <div className="flex justify-between items-center">
                          <Checkbox
                            size="sm"
                            radius="sm"
                            isSelected={isCustomLandingPage}
                            onValueChange={setIsCustomLandingPage}
                          >
                            Use Custom Landing Page URL
                          </Checkbox>
                          <div className="flex items-end ">
                            <Button
                              size="sm"
                              variant="light"
                              color="primary"
                              className="text-xs border border-primary border-1"
                              onPress={() => {
                                setShowGenerator(true);
                                setIsFullCustomUrl(true);
                              }}
                            >
                              Add External Page
                            </Button>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-foreground/40">
                          {!isCustomLandingPage
                            ? hasDefaultReferralQR
                              ? "Default referral QR code already generated. Check 'Use Custom Landing Page URL' or click 'Add External Page' to create a new QR code."
                              : "Default: https://practicemarketer.ai/referral"
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
                                    {import.meta.env.VITE_LIVE_URL}/
                                  </span>
                                </div>
                              }
                              type="text"
                              value={customPath}
                              onValueChange={(value) =>
                                setCustomPath(value)
                              }
                            />
                          </div>
                        )}
                      </>
                    )}
                    {isFullCustomUrl && (
                      <div className="mt-2.5 space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-medium dark:text-white">
                            Adding External Page
                          </p>
                          <Button
                            size="sm"
                            variant="light"
                            color="danger"
                            className="text-xs border-1 border-red-600 h-6 px-2"
                            onPress={() => {
                              setIsFullCustomUrl(false);
                              setCustomLandingUrl("");
                              setCustomPath("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                        <Input
                          size="sm"
                          radius="sm"
                          label="Reference Name (e.g. Front Desk)"
                          labelPlacement="outside-top"
                          placeholder="e.g. Front Desk QR"
                          type="text"
                          value={isFullCustomUrl ? customPath : ""}
                          onValueChange={(value) =>
                            setCustomPath(value)
                          }
                        />
                        <Input
                          size="sm"
                          radius="sm"
                          label="External Page URL"
                          labelPlacement="outside-top"
                          placeholder="https://example.com or www.example.com"
                          type="text"
                          value={customLandingUrl}
                          onValueChange={(value) =>
                            setCustomLandingUrl(value.trim())
                          }
                          isInvalid={!!customLandingUrl && !URL_REGEX.test(customLandingUrl)}
                          errorMessage={!!customLandingUrl && !URL_REGEX.test(customLandingUrl) ? "Please enter a valid URL starting with https:// or www." : undefined}
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
                    isDisabled={isGenerateDisabled}
                  >
                    Generate QR Code
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4 md:space-y-5 mt-2">
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white dark:bg-background rounded-lg border-2 border-foreground/10 dark:border-divider inline-block overflow-hidden">
                    <img
                      src={latestQr.qrCode}
                      alt="QR Code"
                      className="size-38 md:size-48 mx-auto"
                    />
                  </div>
                  <p className="text-gray-600 dark:text-foreground/60 mt-3 text-xs">
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

                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-content1 rounded-lg">
                  <div className="flex flex-col gap-0.5 items-center justify-center text-center">
                    <GoGraph className="text-blue-600 dark:text-blue-500 text-lg mb-1.5" />
                    <p className="text-xs font-medium dark:text-white">
                      {latestQr.totalScan}
                    </p>
                    <p className="text-[11px] text-gray-600 dark:text-foreground/60">
                      Total Scans
                    </p>
                  </div>
                  <div className="flex flex-col gap-0.5 items-center justify-center text-center">
                    <FiCalendar className="text-green-600 dark:text-green-500 text-lg mb-1.5" />
                    <p className="text-xs font-medium dark:text-white">
                      {formatDateToMMDDYYYY(latestQr.createdAt || "")}
                    </p>
                    <p className="text-[11px] text-gray-600 dark:text-foreground/60">
                      Created
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
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
                    onPress={() =>
                      openSharingModal(
                        latestQr.referralUrl?.split("&source")[0] || "",
                      )
                    }
                  >
                    Share
                  </Button>
                  <Link
                    to={latestQr.referralUrl.split("&source")[0] || ""}
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
        <div className="border w-full border-foreground/10 p-4 md:p-5 rounded-xl bg-background h-full">
          <h6 className="text-sm flex items-center gap-2 dark:text-white">
            Tracking Analytics
          </h6>
          <div className="flex flex-col gap-2 md:gap-3 mt-4 rounded-md">
            {[
              {
                label: "Total Active QR Codes",
                value: analyticsSummary.activeQR,
                className:
                  "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-400",
              },
              {
                label: "Total Scans",
                value: analyticsSummary.totalScans,
                className:
                  "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400",
              },
              {
                label: "QR Scans",
                value: analyticsSummary.qrScans,
                className:
                  "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400",
              },
              {
                label: "NFC Taps",
                value: analyticsSummary.nfcTaps,
                className:
                  "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400",
              },
              {
                label: "Total Referrals",
                value: analyticsSummary.totalReferrals,
                className:
                  "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-400",
              },
              {
                label: "Conversion Rate",
                value: analyticsSummary.conversionRate,
                className:
                  "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400",
              },
            ].map((item, index) => (
              <div
                key={item.label}
                className="flex justify-between text-xs p-3 md:p-4 rounded-lg bg-gray-50 dark:bg-content1"
              >
                <p className="font-medium dark:text-foreground/80">
                  {item.label}
                </p>
                <div>
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${item.className}`}
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
        <div className="border w-full border-foreground/10 p-4 md:p-5 rounded-xl bg-background">
          <h4 className="text-sm font-medium flex items-center gap-2 pb-3 dark:text-white">
            <LuQrCode className="text-blue-600 dark:text-blue-500 text-lg" />
            Generated QR Codes
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-foreground/10">
                  <th className="text-left text-xs py-3 px-2 font-medium text-gray-700 dark:text-foreground/60 max-w-fit whitespace-nowrap">
                    QR Code
                  </th>
                  <th className="text-left text-xs py-3 px-2 font-medium text-gray-700 dark:text-foreground/60 whitespace-nowrap">
                    Path / URL
                  </th>
                  <th className="text-left text-xs py-3 px-2 font-medium text-gray-700 dark:text-foreground/60 whitespace-nowrap">
                    Total Scans
                  </th>
                  <th className="text-left text-xs py-3 px-2 font-medium text-gray-700 dark:text-foreground/60 whitespace-nowrap">
                    QR Scans
                  </th>
                  <th className="text-left text-xs py-3 px-2 font-medium text-gray-700 dark:text-foreground/60 whitespace-nowrap">
                    NFC Taps
                  </th>
                  <th className="text-left text-xs py-3 px-2 font-medium text-gray-700 dark:text-foreground/60 whitespace-nowrap">
                    Referrals
                  </th>
                  <th className="text-left text-xs py-3 px-2 font-medium text-gray-700 dark:text-foreground/60 whitespace-nowrap">
                    Conversion Rate
                  </th>
                  <th className="text-left text-xs py-3 px-2 font-medium text-gray-700 dark:text-foreground/60 whitespace-nowrap">
                    Created
                  </th>
                  <th className="text-right text-xs py-3 px-2 font-medium text-gray-700 dark:text-foreground/60 whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {trackings.personalizedQR.map((qr) => (
                  <tr
                    key={qr._id}
                    onClick={() => {
                      setSelectedQrId(qr._id);
                      setShowGenerator(false);
                      // Scroll to target if needed, but usually just updating the state is enough
                    }}
                    className={`cursor-pointer transition-colors border-l-2 ${qr._id === latestQr?._id
                      ? "bg-blue-50/80 border-l-blue-600 dark:bg-blue-900/20"
                      : "border-transparent hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                      }`}
                  >
                    <td className="text-left text-xs py-3 px-2 max-w-fit">
                      <div className="bg-white dark:bg-background border border-foreground/10 dark:border-divider rounded p-0.5 w-12 h-12 flex items-center justify-center">
                        <img
                          src={qr.qrCode}
                          alt="QR"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </td>
                    <td className="text-left text-xs py-3 px-2">
                      <div className="flex flex-col max-w-[200px] md:max-w-full space-y-0.5">
                        <span className="font-medium text-gray-900 dark:text-white truncate">
                          {qr.customPath || "Default"}
                        </span>
                        <a
                          href={
                            qr.isManually ? `${import.meta.env.VITE_BASE_URL}?${qr.referralUrl}` : qr.referralUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] text-blue-500 hover:underline truncate w-fit max-md:max-w-[200px]"
                        >
                          {qr.referralUrl}
                        </a>
                      </div>
                    </td>
                    <td className="text-left text-xs py-3 px-2 font-medium dark:text-foreground/80 min-w-[80px]">
                      {qr.totalScan}
                    </td>
                    <td className="text-left text-xs py-3 px-2 font-medium dark:text-foreground/80 min-w-[80px]">
                      {qr.qrScan}
                    </td>
                    <td className="text-left text-xs py-3 px-2 font-medium dark:text-foreground/80 min-w-[80px]">
                      {qr.nfcTaps}
                    </td>
                    <td className="text-left text-xs py-3 px-2 font-medium dark:text-foreground/80 min-w-[80px]">
                      {qr.totalReferrals}
                    </td>
                    <td className="text-left text-xs py-3 px-2 font-medium dark:text-foreground/80 min-w-[80px]">
                      {qr.conversionRate}%
                    </td>
                    <td className="text-left text-xs py-3 px-2 whitespace-nowrap dark:text-foreground/60">
                      {formatDateToMMDDYYYY(qr.createdAt)}
                    </td>
                    <td className="text-left text-xs py-3 px-2">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
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
                        {!(qr.customPath === "referral" && !qr.isManually) && (
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => {
                              setEditQrId(qr._id);
                              setEditName(qr.customPath || "");
                              setIsEditModalOpen(true);
                            }}
                            title="Edit Name"
                          >
                            <LuSquarePen className="size-3.5 text-blue-600 hover:text-blue-800" />
                          </Button>
                        )}
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => {
                            setDeleteQrId(qr._id);
                            setIsDeleteModalOpen(true);
                          }}
                          title="Delete QR"
                        >
                          <LuTrash2 className="size-3.5 text-red-500 hover:text-red-700" />
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
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteQrId(null);
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete QR Code"
        description="Are you sure you want to delete this QR code? This action cannot be undone."
      />
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditQrId(null);
          setEditName("");
        }}
        size="md"
        placement="center"
        isDismissable={!isUpdating}
      >
        <ModalContent className="p-2">
          <ModalHeader className="flex flex-col gap-1 pt-4 pb-2 px-4 dark:text-white">
            <h4 className="text-lg font-semibold tracking-tight">Edit QR Name</h4>
          </ModalHeader>
          <ModalBody className="px-4 py-2">
            <Input
              label="QR Code Name / Custom Path"
              placeholder="Enter name"
              value={editName}
              onValueChange={setEditName}
              isDisabled={isUpdating}
              variant="bordered"
              size="sm"
            />
          </ModalBody>
          <ModalFooter className="flex justify-end gap-3 pt-4 pb-4 px-4">
            <Button
              size="sm"
              radius="sm"
              variant="bordered"
              onPress={() => {
                setIsEditModalOpen(false);
                setEditQrId(null);
                setEditName("");
              }}
              isDisabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              radius="sm"
              color="primary"
              onPress={handleEditConfirm}
              isLoading={isUpdating}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TrackingPanel;
