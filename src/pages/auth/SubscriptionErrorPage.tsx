import React from "react";
import { Button, Card, CardBody, Divider, Chip } from "@heroui/react";
import { FiAlertCircle, FiExternalLink, FiMail, FiArrowLeft, FiLifeBuoy, FiGlobe } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router";

const SubscriptionErrorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const errorMessage =
    location.state?.message ||
    "Your subscription plan has expired or your account status requires attention.";
  const userEmail = location.state?.email || "";

  const lowerMsg = errorMessage.toLowerCase();

  const isPaymentIssue = lowerMsg.includes("payment") || lowerMsg.includes("failed") || lowerMsg.includes("pending");
  const isDeletedIssue = lowerMsg.includes("deleted") || lowerMsg.includes("deactivated");
  const isExpiredIssue = lowerMsg.includes("expired") || lowerMsg.includes("no active") || lowerMsg.includes("canceled");

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

  const handleGoToWpHome = () => {
    window.open(getWpUrl(""), "_blank");
  };

  const handleContactSupport = () => {
    window.location.href = `mailto:Support@practiceROI.com?subject=Account%20Support%20Request%20-%20${encodeURIComponent(
      userEmail
    )}&body=Hello%20Support%20Team,%0A%0AI%20am%20experiencing%20an%20issue%20accessing%20my%20account.%0A%0AError%20Details:%20${encodeURIComponent(
      errorMessage
    )}%0AEmail:%20${encodeURIComponent(userEmail)}`;
  };

  let titleText = "Subscription & Account Alert";
  let badgeText = "Action Required";
  let badgeColor: "warning" | "danger" | "primary" = "warning";

  if (isDeletedIssue) {
    titleText = "Account Deactivated";
    badgeText = "Account Deactivated";
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
          {/* Header Icon & Title */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className={`size-16 rounded-2xl ${isDeletedIssue ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"} flex items-center justify-center border shadow-inner`}>
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
              <p className="text-sm text-foreground/60 mt-1">
                Access to your PracticeROI workspace is currently paused
              </p>
            </div>
          </div>

          <Divider />

          {/* Main Error Box */}
          <div className="p-4 bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 rounded-xl space-y-2">
            <div className="flex items-start gap-2.5">
              <FiAlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-red-600 dark:text-red-400">
                  Error Details
                </h4>
                <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed font-medium">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>

          {/* Contextual Guidance */}
          <div className="space-y-2 text-center text-xs text-foreground/70 leading-relaxed">
            {isPaymentIssue ? (
              <p>
                Please update your payment method or complete your pending payment on WordPress to restore workspace access.
              </p>
            ) : isExpiredIssue ? (
              <p>
                Your subscription plan has expired. Upgrade or renew your plan on WordPress to restore full access to your referrals and tools.
              </p>
            ) : isDeletedIssue ? (
              <p>
                Your account status is marked as inactive. If you believe this is an error, please reach out to our support team.
              </p>
            ) : (
              <p>
                Please manage your account on WordPress or contact support to resolve this access alert.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {!isDeletedIssue && (
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
              variant="flat"
              color={isDeletedIssue ? "primary" : "secondary"}
              className="w-full font-semibold"
              onPress={handleContactSupport}
              startContent={<FiLifeBuoy className="size-4" />}
            >
              Contact Support
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="light"
                className="text-foreground/60 hover:text-foreground font-medium"
                onPress={handleGoToWpHome}
                startContent={<FiGlobe className="size-4" />}
              >
                WordPress Home
              </Button>
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

          {/* Bottom Support Email Footer */}
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

