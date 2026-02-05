import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Switch,
} from "@heroui/react";
import React, { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { toggleTheme } from "../../store/uiSlice";
import {
  useDeleteAccount,
  useExportAccountData,
  useExportAnalyticsMutation,
  useExportReferralsMutation,
  useExportReviewsMutation,
} from "../../hooks/useAuth";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";

const General: React.FC = () => {
  const theme = useTypedSelector((state) => state.ui.theme);
  const dispatch = useDispatch();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { mutate: exportAccountData, isPending: isExportingAccount } =
    useExportAccountData();
  const { mutate: exportReferrals, isPending: isExportingReferrals } =
    useExportReferralsMutation();
  const { mutate: exportReviews, isPending: isExportingReviews } =
    useExportReviewsMutation();
  const { mutate: exportAnalytics, isPending: isExportingAnalytics } =
    useExportAnalyticsMutation();
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

  const handleExportReferrals = () => {
    exportReferrals(undefined, {
      onSuccess: (data) => downloadJson(data, "referrals_export"),
    });
  };

  const handleExportReviews = () => {
    exportReviews(undefined, {
      onSuccess: (data) => downloadJson(data, "reviews_export"),
    });
  };

  const handleExportAnalytics = () => {
    exportAnalytics(undefined, {
      onSuccess: (data) => downloadJson(data, "analytics_export"),
    });
  };

  const handleDeleteAccount = () => {
    deleteAccount();
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
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="bordered"
                className="border-small font-medium"
                onPress={() => exportAccountData()}
                isLoading={isExportingAccount}
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
          </div>
        </CardBody>
      </Card>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeletingAccount}
        title="Delete Account"
        description="Are you sure you want to delete your account? If you want to recover your account, you will need to contact support or an admin."
      />
    </>
  );
};

export default General;
