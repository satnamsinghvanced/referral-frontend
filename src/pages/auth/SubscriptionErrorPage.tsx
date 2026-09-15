import React from "react";
import { Button, Card, CardBody, Divider, Chip } from "@heroui/react";
import { FiAlertCircle, FiExternalLink, FiMail, FiArrowLeft, FiLifeBuoy, FiGlobe } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router";

const SubscriptionErrorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const typeParam = (searchParams.get("type") || "").toLowerCase();
  const reasonParam = searchParams.get("reason") || "";

  const errorMessage =
    location.state?.message ||
    searchParams.get("message") ||
    "Your subscription plan has expired or your account status requires attention.";
  const userEmail = location.state?.email || searchParams.get("email") || "";
  const lowerMsg = errorMessage.toLowerCase();

  const isSuspendedIssue =
    typeParam === "suspended" ||
    Boolean(location.state?.isSuspended) ||
    lowerMsg.includes("suspended") ||
    lowerMsg.includes("suspension");

  const suspensionReason =
    location.state?.suspensionReason ||
    reasonParam ||
    (lowerMsg.includes("reason:")
      ? errorMessage.split(/reason:\s*/i)[1]?.split(".")[0]?.trim()
      : "");

  const isDeletedIssue =
    !isSuspendedIssue &&
    (typeParam === "deleted" ||
      Boolean(location.state?.isDeleted) ||
      lowerMsg.includes("deleted") ||
      lowerMsg.includes("deactivated"));

  const isPaymentIssue =
    !isSuspendedIssue &&
    !isDeletedIssue &&
    (typeParam === "payment" ||
      lowerMsg.includes("payment") ||
      lowerMsg.includes("failed") ||
      lowerMsg.includes("pending"));

  const isExpiredIssue =
    !isSuspendedIssue &&
    !isDeletedIssue &&
    !isPaymentIssue &&
    (typeParam === "expired" ||
      lowerMsg.includes("expired") ||
      lowerMsg.includes("no active") ||
      lowerMsg.includes("canceled"));

  const getWpUrl = (path: string = "") => {
    const wordpressUrl =
      (import.meta as any).env?.WORDPRESS_BASE_URL ||
      (import.meta as any).env?.VITE_WORDPRESS_BASE_URL ||
      "https://practiceroi.com";
    const cleanUrl = wordpressUrl.replace(/\/$/, "");
    return `${cleanUrl}${path}`;
  };

  const handleReturnToWordPress = () => {
    if (isPaymentIssue) {
      window.open(getWpUrl("/my-account"), "_blank");
    } else {
      window.open(getWpUrl("/pricing"), "_blank");
    }
  };

  const handleContactSupport = () => {
    window.open(getWpUrl("/contact/"), "_blank");
  };

  let titleText = "Subscription & Account Alert";
  let subtitleText = "Access to your PracticeROI workspace is currently paused";
  let badgeText = "Action Required";
  let badgeColor: "warning" | "danger" | "primary" = "warning";

  if (isSuspendedIssue) {
    titleText = "Account Suspended";
    subtitleText = "Access restricted by administration";
    badgeText = "Account Suspended";
    badgeColor = "danger";
  } else if (isDeletedIssue) {
    titleText = "Account Scheduled For Deletion";
    subtitleText = "60-Day Recovery Period Active";
    badgeText = "Account Deleted";
    badgeColor = "danger";
  } else if (isPaymentIssue) {
    titleText = "Payment Required";
    badgeText = "Payment Issue";
    badgeColor = "danger";
  } else if (isExpiredIssue) {
    titleText = "Subscription Expired";
    badgeText = "Plan Inactive";
    badgeColor = "warning";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-slate-100 dark:from-gray-950 dark:via-slate-900 dark:to-background flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-lg shadow-2xl border border-foreground/10 bg-content1/90 backdrop-blur-xl rounded-2xl overflow-hidden">
        <CardBody className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`size-16 rounded-2xl ${
                isDeletedIssue || isSuspendedIssue
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                  : "bg-amber-500/10 text-amber-500 border-amber-500/20"
              } flex items-center justify-center border shadow-inner`}
            >
              <FiAlertCircle className="size-8 animate-pulse" />
            </div>
            <div>
              <div className="flex justify-center mb-1">
                <Chip size="sm" color={badgeColor} variant="flat" className="font-semibold text-xs">
                  {badgeText}
                </Chip>
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {titleText}
              </h1>
              <p className="text-sm text-foreground/60 mt-1 font-medium">
                {subtitleText}
              </p>
            </div>
          </div>
          <Divider />
          {isSuspendedIssue ? (
            <div className="p-4 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 rounded-xl space-y-2.5">
              <div className="flex items-start gap-2.5">
                <FiAlertCircle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-2 text-left">
                  <h4 className="text-sm font-bold text-amber-800 dark:text-amber-200">
                    Account Suspended by Administration
                  </h4>
                  {suspensionReason && (
                    <div className="p-2.5 bg-amber-100/80 dark:bg-amber-950/50 rounded-lg border border-amber-300/70 dark:border-amber-800/70">
                      <p className="text-xs text-amber-950 dark:text-amber-100 font-semibold leading-relaxed">
                        <span className="font-extrabold uppercase text-[11px] tracking-wide text-amber-800 dark:text-amber-300 block mb-0.5">
                          Suspension Reason:
                        </span>
                        {suspensionReason}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-amber-900 dark:text-amber-100 leading-relaxed font-medium">
                    Your account has been suspended by administration. If you believe this happened by mistake or wish to appeal and reactivate your account, please contact our support team at{" "}
                    <a
                      href="mailto:support@practiceroi.com"
                      className="underline font-bold text-amber-950 dark:text-white hover:text-amber-600"
                    >
                      support@practiceroi.com
                    </a>.
                  </p>
                  <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80 pt-1">
                    ⚠️ Workspace access and team member logins are temporarily disabled until the account is unsuspended by administration.
                  </p>
                </div>
              </div>
            </div>
          ) : isDeletedIssue ? (
            <div className="p-4 bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 rounded-xl space-y-2.5">
              <div className="flex items-start gap-2.5">
                <FiAlertCircle className="size-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-left">
                  <h4 className="text-sm font-bold text-rose-700 dark:text-rose-300">
                    60-Day Account Recovery Available
                  </h4>
                  <p className="text-xs text-rose-800 dark:text-rose-200 leading-relaxed font-medium">
                    You have requested to delete your account. If this happened by mistake or you wish to recover your account, you can restore all your data within <strong>60 days</strong> by contacting our support team at{" "}
                    <a
                      href="mailto:support@practiceroi.com"
                      className="underline font-bold text-rose-900 dark:text-rose-100 hover:text-rose-600"
                    >
                      support@practiceroi.com
                    </a>.
                  </p>
                  <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 pt-1">
                    ⚠️ If not recovered within 60 days, all your referrals, referrers, team members, locations, integrations, and associated data will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 rounded-xl space-y-2">
              <div className="flex items-start gap-2.5">
                <FiAlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1 text-left">
                  <h4 className="text-sm font-semibold text-red-600 dark:text-red-400">
                    Error Details
                  </h4>
                  <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed font-medium">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2 text-center text-xs text-foreground/70 leading-relaxed">
            {isSuspendedIssue ? (
              <p>
                Please contact support if you have questions regarding your account suspension or wish to reactivate your access.
              </p>
            ) : isPaymentIssue ? (
              <p>
                Please update your payment method or complete your pending payment on WordPress to restore workspace access.
              </p>
            ) : isExpiredIssue ? (
              <p>
                Your subscription plan has expired. Upgrade or renew your plan on WordPress to restore full access to your referrals and tools.
              </p>
            ) : isDeletedIssue ? (
              <p>
                Need to recover your account? Reach out to support below before your 60-day recovery window expires.
              </p>
            ) : (
              <p>
                Please manage your account on WordPress or contact support to resolve this access alert.
              </p>
            )}
          </div>
          <div className="space-y-3 pt-2">
            {!isDeletedIssue && !isSuspendedIssue && (
              <Button
                size="lg"
                color="primary"
                className="w-full font-semibold shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onPress={handleReturnToWordPress}
                endContent={<FiExternalLink className="size-4" />}
              >
                {isPaymentIssue ? "Manage Payment on WordPress" : "Renew / Upgrade Plan on WordPress"}
              </Button>
            )}
            <Button
              size="lg"
              color="primary"
              variant="flat"
              className="w-full font-semibold shadow-md hover:shadow-lg transition-shadow"
              onPress={handleContactSupport}
              startContent={<FiLifeBuoy className="size-4" />}
            >
              {isDeletedIssue ? "Contact Support to Recover Account" : "Contact Support"}
            </Button>
            <div className="grid grid-cols-1 gap-2">
              <Button
                size="sm"
                variant="light"
                className="text-foreground/60 hover:text-foreground font-medium"
                onPress={() => navigate("/signin")}
                startContent={<FiArrowLeft className="size-4" />}
              >
                Back to Sign In
              </Button>
            </div>
          </div>
          <Divider />
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-foreground/60 gap-2 pt-1">
            <div className="flex items-center gap-1.5 font-medium">
              <FiMail className="size-3.5 text-primary" />
              <span>Need help? Contact support:</span>
            </div>
            <a
              href="mailto:Support@practiceROI.com"
              className="text-primary font-semibold hover:underline flex items-center gap-1"
            >
              Support@practiceROI.com
            </a>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SubscriptionErrorPage;