import { Button, Card, CardBody, CardHeader, Spinner } from "@heroui/react";
import React from "react";
import { FiCreditCard } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useBilling } from "../../hooks/settings/useBilling";
import { formatDateToReadable } from "../../utils/formatDateToReadable";
import { LoadingState } from "../../components/common/LoadingState";

const Billing: React.FC = () => {
  const { data: billingData, isLoading, error } = useBilling();
  const navigate = useNavigate();

  const handleNavigateToROI = () => {
    const wordpressUrl = import.meta.env.VITE_WORDPRESS_BASE_URL || "https://practiceroi.com";
    const baseUrl = wordpressUrl.endsWith("/") ? wordpressUrl.slice(0, -1) : wordpressUrl;
    window.open(`${baseUrl}/pricing/`, "_blank");
  };

  const handleUpdatePayment = () => {
    const wordpressUrl = import.meta.env.VITE_WORDPRESS_BASE_URL || "https://practiceroi.com";
    const baseUrl = wordpressUrl.endsWith("/") ? wordpressUrl.slice(0, -1) : wordpressUrl;
    window.open(`${baseUrl}/pricing/`, "_blank");
  };

  const handleTogglePlanStatus = () => {
    const wordpressUrl = import.meta.env.VITE_WORDPRESS_BASE_URL || "https://practiceroi.com";
    const baseUrl = wordpressUrl.endsWith("/") ? wordpressUrl.slice(0, -1) : wordpressUrl;
    window.open(`${baseUrl}/pricing/`, "_blank");
  };

  if (isLoading) {
    return (
      <Card className="rounded-xl shadow-none border border-foreground/10 bg-background h-[356px] flex items-center justify-center">
        <LoadingState />
      </Card>
    );
  }

  if (!billingData) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg p-3 flex items-center justify-between flex-wrap gap-3 mb-6">
        <p className="text-sm text-yellow-800 dark:text-yellow-400">
          You don't have any active plan. Please buy a plan to continue.
        </p>
        <Button
          // as={Link}
          // to="/integrations"
          size="sm"
          color="warning"
          variant="flat"
          onPress={handleNavigateToROI}
          className="bg-yellow-200 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
        >
          Buy Plan
        </Button>
      </div>
    );
  }

  const isActive = billingData.status === "active";
  const limits = billingData.limits;
  const access = billingData.access;

  const formatLimit = (val?: number) => (val === undefined || val === -1 ? "Unlimited" : val);

  return (
    <Card className="rounded-xl shadow-none border border-foreground/10 bg-background">
      <CardHeader className="flex items-center gap-2 px-4 pt-4 pb-1">
        <FiCreditCard className="size-5" />
        <h4 className="text-base font-semibold">Billing & Subscription</h4>
      </CardHeader>

      <CardBody className="p-4 space-y-6">
        <div
          className={`p-4 rounded-xl border ${isActive
            ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/60"
            : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">Current Plan</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{billingData.name} Plan</h3>
            </div>
            <span
              className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold shrink-0 ${isActive
                ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700"
                : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700"
                }`}
            >
              {isActive ? "Active Subscription" : "Inactive"}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200/60 dark:border-zinc-800 text-xs">
            <p className="text-gray-700 dark:text-zinc-300 font-medium">
              ${billingData.price}/{billingData.billingCycle || "month"}
            </p>
            <p className="text-gray-500 dark:text-zinc-400">
              Next billing date: <span className="font-semibold text-gray-700 dark:text-zinc-300">{formatDateToReadable(billingData.nextBillingDate)}</span>
            </p>
          </div>
        </div>

        {/* Plan Limits Overview */}
        {limits && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Plan Included Limits</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                <span className="text-[11px] text-gray-500 dark:text-zinc-400 block font-medium">Referral Connections</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatLimit(limits.referral_connections)}</span>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                <span className="text-[11px] text-gray-500 dark:text-zinc-400 block font-medium">User Accounts</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatLimit(limits.user_accounts)}</span>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                <span className="text-[11px] text-gray-500 dark:text-zinc-400 block font-medium">Locations</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatLimit(limits.locations)}</span>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                <span className="text-[11px] text-gray-500 dark:text-zinc-400 block font-medium">SMS Marketing</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatLimit(limits.sms_messages)} <span className="text-[10px] text-blue-600 dark:text-zinc-400">/messages/mo</span></span>
              </div>
            </div>
          </div>
        )}

        {/* Feature Access Overview */}
        {access && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Plan Feature Access</h4>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${access.basic_referral_tracking ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" : "bg-gray-100 dark:bg-zinc-800 text-gray-400 line-through border-transparent"}`}>
                Basic Referral Tracking
              </span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${access.advanced_referral_tracking ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" : "bg-gray-100 dark:bg-zinc-800 text-gray-400 line-through border-transparent"}`}>
                Advanced Analytics
              </span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${access.google_business ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" : "bg-gray-100 dark:bg-zinc-800 text-gray-400 line-through border-transparent"}`}>
                Google Business Profile
              </span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${access.social_media ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" : "bg-gray-100 dark:bg-zinc-800 text-gray-400 line-through border-transparent"}`}>
                Social Media Integrations
              </span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${access.call_tracking ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" : "bg-gray-100 dark:bg-zinc-800 text-gray-400 line-through border-transparent"}`}>
                Call Tracking
              </span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${access.sms_marketing ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" : "bg-gray-100 dark:bg-zinc-800 text-gray-400 line-through border-transparent"}`}>
                SMS Marketing
              </span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${access.canva_integration ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" : "bg-gray-100 dark:bg-zinc-800 text-gray-400 line-through border-transparent"}`}>
                Canva Integration
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Payment Method</h4>
          <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-lg">
            <div className="flex items-center gap-3">
              <FiCreditCard className="size-6 text-gray-400" />
              <div>
                <p className="text-sm font-medium">
                  {billingData.cardNumber ? `**** **** **** ${billingData.cardNumber.slice(-4)}` : "Credit / Debit Card"}
                </p>
                {billingData.expire && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Expires {billingData.expire}
                  </p>
                )}
              </div>
            </div>
            <Button
              size="sm"
              variant="bordered"
              onPress={handleUpdatePayment}
              className="border-small font-medium"
            >
              Update
            </Button>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            color="primary"
            variant="solid"
            onPress={handleTogglePlanStatus}
            className="font-semibold shadow-sm"
          >
            {isActive ? "Upgrade Plan" : "Activate Plan"}
          </Button>
          <Button
            size="sm"
            variant="bordered"
            className="border-small font-medium"
            onPress={handleNavigateToROI}
          >
            View Pricing & Features
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default Billing;
