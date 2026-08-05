import React from "react";
import { Button, Card, CardBody, Divider } from "@heroui/react";
import { FiAlertCircle, FiExternalLink, FiMail, FiArrowLeft, FiLifeBuoy } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router";

const SubscriptionErrorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const errorMessage =
    location.state?.message ||
    "Your account status is currently inActive or your plan subscription has expired.";
  const userEmail = location.state?.email || "";

  const handleUpgradePricing = () => {
    const wordpressUrl =
      (import.meta as any).env?.WORDPRESS_BASE_URL ||
      (import.meta as any).env?.VITE_WORDPRESS_BASE_URL ||
      "https://practiceroi.com";
    const cleanUrl = wordpressUrl.replace(/\/$/, "");
    window.open(`${cleanUrl}/pricing`, "_blank");
  };

  const handleContactSupport = () => {
    window.location.href = `mailto:Support@practiceROI.com?subject=Account%20Subscription%20Support%20-%20${encodeURIComponent(
      userEmail
    )}&body=Hello%20Support%20Team,%0A%0AMy%20account%20status%20is%20currently%20inactive/expired.%20Please%20help%20me%20resolve%20this%20issue.%0A%0AEmail:%20${encodeURIComponent(
      userEmail
    )}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-slate-100 dark:from-gray-950 dark:via-slate-900 dark:to-background flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-lg shadow-2xl border border-foreground/10 bg-content1/90 backdrop-blur-xl rounded-2xl overflow-hidden">
        <CardBody className="p-6 sm:p-8 space-y-6">
          {/* Header Icon & Title */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="size-16 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-inner">
              <FiAlertCircle className="size-8 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Subscription & Account Alert
              </h1>
              <p className="text-sm text-foreground/60 mt-1">
                Access to your PracticeROI workspace is paused
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
                  Account Status Detail
                </h4>
                <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed font-medium">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>

          {/* Informative Guidance */}
          <div className="space-y-2 text-center text-xs text-foreground/70 leading-relaxed">
            <p>
              Your account status is marked as inactive or your subscription plan has reached its expiration date.
            </p>
            <p>
              To restore full access to your referrals, reviews, and automation tools, please upgrade your pricing plan or reach out to our support team.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              size="lg"
              color="primary"
              className="w-full font-semibold shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onPress={handleUpgradePricing}
              endContent={<FiExternalLink className="size-4" />}
            >
              Upgrade & View Pricing Plans
            </Button>

            <Button
              size="lg"
              variant="flat"
              color="secondary"
              className="w-full font-semibold"
              onPress={handleContactSupport}
              startContent={<FiLifeBuoy className="size-4" />}
            >
              Contact Support
            </Button>

            <Button
              size="sm"
              variant="light"
              className="w-full text-foreground/60 hover:text-foreground font-medium"
              onPress={() => navigate("/signin")}
              startContent={<FiArrowLeft className="size-4" />}
            >
              Back to Sign In
            </Button>
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
