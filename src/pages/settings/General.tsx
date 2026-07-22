import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Switch,
} from "@heroui/react";
import React, { useState } from "react";
import { FiSettings, FiAlertTriangle } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { toggleTheme } from "../../store/uiSlice";
import {
  useDeleteAccount,
  useExportAccountData,
  useExportAnalyticsPDFMutation,
  useExportReferralsMutation,
  useExportReviewsPDFMutation,
} from "../../hooks/useAuth";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import { generateReferralsPdf } from "../../utils/pdfReferralsGenerator";
import { useUpload } from "../../providers/UploadProvider";
import { useFetchUser } from "../../hooks/settings/useUser";
import { OtpVerificationModal } from "../../components/OtpVerificationModal";
import { useFetchEmailIntegration } from "../../hooks/integrations/useEmailMarketing";

const General: React.FC = () => {
  const theme = useTypedSelector((state) => state.ui.theme);
  const dispatch = useDispatch();
  const { addManualUpload, updateManualUploadProgress, completeManualUpload } = useUpload();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isDeleteOtpLoading, setIsDeleteOtpLoading] = useState(false);
  const user = useTypedSelector((state) => state.auth.user);
  const { data: userData } = useFetchUser(user?.userId || "") as any;
  const [otpError, setOtpError] = useState<string | undefined>(undefined);
  const [maskedPhone, setMaskedPhone] = useState<string | undefined>(undefined);
  const { data: emailIntegration } = useFetchEmailIntegration();
  const emailConfigsList = Array.isArray(emailIntegration)
    ? emailIntegration
    : emailIntegration
      ? [emailIntegration]
      : [];
  const hasEmailConfig = emailConfigsList.some((cfg: any) => cfg.status === "Connected");
  const { mutate: exportAccountData, isPending: isExportingAccount } =
    useExportAccountData();
  const { mutate: exportReferrals, isPending: isExportingReferrals } =
    useExportReferralsMutation();
  const { mutate: exportReviewsPDF, isPending: isExportingReviews } =
    useExportReviewsPDFMutation();
  const { mutate: exportAnalyticsPDF, isPending: isExportingAnalytics } =
    useExportAnalyticsPDFMutation();
  const { mutate: deleteAccount, isPending: isDeletingAccount } =
    useDeleteAccount();

  const downloadJson = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportReferrals = () => {
    const uploadId = Math.random().toString(36).substring(7);
    addManualUpload(uploadId, "Generating Referrals PDF", "media");

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      updateManualUploadProgress(uploadId, Math.min(progress, 90));
    }, 250);

    exportReferrals(undefined, {
      onSuccess: (data: any) => {
        clearInterval(interval);
        completeManualUpload(uploadId, "completed");

        const referrals = data || [];
        const totalReferrals = referrals.length;
        const totalValue = referrals.reduce((sum: number, r: any) => sum + (Number(r.estValue) || 0), 0);
        const activeCount = referrals.filter((r: any) => r.status !== "declined" && r.status !== "completed").length;
        const highPriorityCount = referrals.filter((r: any) => r.priority?.toLowerCase() === "high").length;

        const stats = {
          totalReferrals,
          totalValue,
          activeCount,
          highPriorityCount,
        };

        generateReferralsPdf(referrals, stats, false);
      },
      onError: () => {
        clearInterval(interval);
        completeManualUpload(uploadId, "error");
      },
    });
  };

  const handleExportReviews = () => {
    const uploadId = Math.random().toString(36).substring(7);
    addManualUpload(uploadId, "Generating Reviews PDF", "media");

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      updateManualUploadProgress(uploadId, Math.min(progress, 90));
    }, 250);

    exportReviewsPDF(undefined, {
      onSuccess: (blob) => {
        clearInterval(interval);
        completeManualUpload(uploadId, "completed");
        downloadBlob(blob, "reviews_export");
      },
      onError: () => {
        clearInterval(interval);
        completeManualUpload(uploadId, "error");
      },
    });
  };

  const handleExportAnalytics = () => {
    const uploadId = Math.random().toString(36).substring(7);
    addManualUpload(uploadId, "Generating Analytics PDF", "media");

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      updateManualUploadProgress(uploadId, Math.min(progress, 90));
    }, 250);

    exportAnalyticsPDF(undefined, {
      onSuccess: (blob) => {
        clearInterval(interval);
        completeManualUpload(uploadId, "completed");
        downloadBlob(blob, "analytics_export");
      },
      onError: () => {
        clearInterval(interval);
        completeManualUpload(uploadId, "error");
      },
    });
  };

  const handleDownloadAccountData = () => {
    const uploadId = Math.random().toString(36).substring(7);
    addManualUpload(uploadId, "Generating Account Data", "media");

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      updateManualUploadProgress(uploadId, Math.min(progress, 90));
    }, 250);

    exportAccountData(undefined, {
      onSuccess: () => {
        clearInterval(interval);
        completeManualUpload(uploadId, "completed");
      },
      onError: () => {
        clearInterval(interval);
        completeManualUpload(uploadId, "error");
      },
    });
  };

  const handleDeleteAccount = (otpCode?: string) => {
    setOtpError(undefined);
    if (userData?.isTwoFactorEnabled && !otpCode) {
      setIsDeleteModalOpen(false);
      setIsDeleteOtpLoading(true);
      deleteAccount(undefined, {
        onSuccess: (res: any) => {
          setIsDeleteOtpLoading(false);
          if (res?.twoFactorRequired) {
            setMaskedPhone(res.phone || userData?.phone);
            setIsOtpOpen(true);
          }
        },
        onError: () => {
          setIsDeleteOtpLoading(false);
        }
      });
    } else {
      if (otpCode) {
        setIsDeleteOtpLoading(true);
      }
      deleteAccount(otpCode ? { otp: otpCode } : undefined, {
        onSuccess: () => {
          setIsDeleteOtpLoading(false);
          setIsOtpOpen(false);
        },
        onError: (error: any) => {
          setIsDeleteOtpLoading(false);
          const errorMessage =
            (error.response?.data as { message?: string })?.message ||
            error.message ||
            "Verification failed";
          setOtpError(errorMessage);
        }
      });
    }
  };

  return (
    <>
      <Card className="rounded-xl shadow-none border border-foreground/10 bg-background">
        <CardHeader className="flex items-center gap-2 px-4 pt-4 pb-1">
          <FiSettings className="size-5" />
          <h4 className="text-base">General Settings</h4>
        </CardHeader>

        <CardBody className="p-4 space-y-4">
          {/* Dark Mode Setting */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm">Dark Mode</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Switch to dark theme
              </p>
            </div>
            <Switch
              size="sm"
              aria-label="Theme"
              isSelected={theme === "dark"}
              onChange={() => dispatch(toggleTheme())}
            />
          </div>

          <Divider />

          {/* Data Export Section */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm">Data Export</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Export your referral data and analytics
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="bordered"
                className="border-small font-medium"
                onPress={handleExportReferrals}
                isLoading={isExportingReferrals}
              >
                Export Referrals
              </Button>
              <Button
                size="sm"
                variant="bordered"
                className="border-small font-medium"
                onPress={handleExportReviews}
                isLoading={isExportingReviews}
              >
                Export Reviews
              </Button>
              <Button
                size="sm"
                variant="bordered"
                className="border-small font-medium"
                onPress={handleExportAnalytics}
                isLoading={isExportingAnalytics}
              >
                Export Analytics
              </Button>
            </div>
          </div>

          <Divider />

          {/* Account Management Section */}
          <div className="space-y-4">
            <h4 className="text-sm">Account Management</h4>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="bordered"
                  className="border-small font-medium"
                  onPress={handleDownloadAccountData}
                  isLoading={isExportingAccount}
                  isDisabled={!hasEmailConfig}
                >
                  Download Account Data
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  color="danger"
                  className="font-medium"
                  onPress={() => setIsDeleteModalOpen(true)}
                >
                  Delete Account
                </Button>
              </div>
              {!hasEmailConfig && (
                <p className="text-xs text-orange-400 flex items-center gap-1">
                  <FiAlertTriangle /> Please connect an email account in integrations to download account data.
                </p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDeleteAccount()}
        isLoading={isDeletingAccount || isDeleteOtpLoading}
        title="Delete Account"
        description="Are you sure you want to delete your account? If you want to recover your account, you will need to contact support or an admin."
      />

      <OtpVerificationModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        isLoading={isDeletingAccount || isDeleteOtpLoading}
        onVerify={(otp) => handleDeleteAccount(otp)}
        onResend={() => handleDeleteAccount()}
        phoneNumber={maskedPhone}
        error={otpError}
        onClearError={() => setOtpError(undefined)}
        title="Verify Account Deletion"
      />
    </>
  );
};

export default General;
