import { Button, Card, CardBody, CardHeader, Spinner, addToast, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCreditCard, FiDownload, FiFileText, FiRefreshCw, FiAlertTriangle, FiPackage, FiCalendar, FiClock } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { useBilling } from "../../hooks/settings/useBilling";
import { getLatestInvoice, getAllInvoices, downloadInvoicePdf, InvoiceItem, cancelSubscription, resumeSubscription } from "../../services/settings/billing";
import { UserAddonData, fetchUserAddons, cancelUserAddon } from "../../services/addonService";
import { formatDateToReadable } from "../../utils/formatDateToReadable";
import { LoadingState } from "../../components/common/LoadingState";

import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Pagination from "../../components/common/Pagination";

const Billing: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: billingData, isLoading, error } = useBilling();
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState<Record<string, boolean>>({});
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [userAddons, setUserAddons] = useState<UserAddonData[]>([]);
  const [isLoadingAddons, setIsLoadingAddons] = useState(false);
  const [cancelingAddonId, setCancelingAddonId] = useState<string | null>(null);
  const [addonToCancel, setAddonToCancel] = useState<UserAddonData | null>(null);

  const { isOpen: isCancelOpen, onOpen: onOpenCancel, onOpenChange: onCancelOpenChange, onClose: onCloseCancel } = useDisclosure();
  const [isCanceling, setIsCanceling] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  const fetchInvoices = async () => {
    try {
      setIsLoadingInvoices(true);
      const invoiceData = await getAllInvoices();
      setInvoices(Array.isArray(invoiceData) ? invoiceData : []);
    } catch (err) {
      // Fail silently or set empty
      setInvoices([]);
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const loadUserAddons = async () => {
    try {
      setIsLoadingAddons(true);
      const res = await fetchUserAddons();
      const list = res?.data || res;
      if (Array.isArray(list)) {
        setUserAddons(list);
      }
    } catch (err) {
      console.error("Failed to fetch user add-ons:", err);
      setUserAddons([]);
    } finally {
      setIsLoadingAddons(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    loadUserAddons();
  }, []);

  const triggerFileDownload = (blob: Blob, filename: string) => {
    if (!blob) {
      throw new Error("No file content received");
    }
    const finalBlob = blob instanceof Blob ? blob : new Blob([blob], { type: "application/pdf" });
    const url = window.URL.createObjectURL(finalBlob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 1000);
  };

  const buildUpgradeQuery = () => {
    const params: Record<string, string> = { mode: "upgrade" };
    const email = user?.email || (billingData as any)?.email;
    if (email) params.email = email;
    if (user?.firstName) params.firstName = user.firstName;
    if (user?.lastName) params.lastName = user.lastName;
    if (user?.mobile) params.mobile = user.mobile;
    const plan = (billingData as any)?.name || (billingData as any)?.planId;
    if (plan) params.plan = plan;
    return new URLSearchParams(params).toString();
  };

  const handleUpdatePayment = () => {
    navigate(`/upgrade-plan?${buildUpgradeQuery()}`);
  };

  const handleTogglePlanStatus = () => {
    navigate(`/upgrade-plan?${buildUpgradeQuery()}`);
  };

  const handleCancelSubscription = async () => {
    try {
      setIsCanceling(true);
      const res: any = await cancelSubscription();
      addToast({
        title: "Subscription Canceled",
        description: res?.message || "Your subscription has been canceled. Auto-pay is disabled and no further charges will occur.",
        color: "success",
      });
      onCloseCancel();
      // Invalidate queries & clear localStorage cached billing
      if (user?.userId || (user as any)?._id || (user as any)?.id || user?.email) {
        const id = user?.userId || (user as any)?._id || (user as any)?.id || user?.email;
        try {
          localStorage.removeItem(`cached_billing_data_${id}`);
        } catch (e) { }
      }
      queryClient.invalidateQueries({ queryKey: ["billing"] });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to cancel subscription.";
      addToast({
        title: "Cancellation Failed",
        description: errorMsg,
        color: "danger",
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const handleResumeSubscription = async () => {
    try {
      setIsResuming(true);
      const res: any = await resumeSubscription();
      addToast({
        title: "Subscription Resumed",
        description: res?.message || "Auto-pay has been resumed successfully.",
        color: "success",
      });
      if (user?.userId || (user as any)?._id || (user as any)?.id || user?.email) {
        const id = user?.userId || (user as any)?._id || (user as any)?.id || user?.email;
        try {
          localStorage.removeItem(`cached_billing_data_${id}`);
        } catch (e) { }
      }
      queryClient.invalidateQueries({ queryKey: ["billing"] });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to resume subscription.";
      addToast({
        title: "Resume Failed",
        description: errorMsg,
        color: "danger",
      });
    } finally {
      setIsResuming(false);
    }
  };

  const handleDownloadPaymentInvoice = async () => {
    try {
      setIsDownloadingInvoice(true);
      const res = await getLatestInvoice();
      const invoiceData = res?.data || res;
      const invoiceId = invoiceData?.id;
      const number = invoiceData?.number || invoiceData?.id || "latest";
      const filename = `Invoice_${number}.pdf`;

      const blob = await downloadInvoicePdf({
        invoiceId,
        url: invoiceData?.invoiceUrl || invoiceData?.pdfUrl,
        filename,
      });
      triggerFileDownload(blob, filename);
      addToast({
        title: "Invoice Downloaded",
        description: `Invoice ${number} downloaded successfully.`,
        color: "success",
      });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to download payment invoice.";
      addToast({
        title: "Download Failed",
        description: errorMsg.includes("trial") || errorMsg.includes("first payment") || errorMsg.includes("first charge")
          ? errorMsg
          : "Could not download payment invoice.",
        color: "warning",
      });
    } finally {
      setIsDownloadingInvoice(false);
    }
  };

  const handleDownloadSingleInvoice = async (invoice: InvoiceItem) => {
    try {
      setDownloadingIds((prev) => ({ ...prev, [invoice.id]: true }));
      const filename = `Invoice_${invoice.number || invoice.id}.pdf`;
      const blob = await downloadInvoicePdf({
        invoiceId: invoice.id,
        url: invoice.pdfUrl || invoice.invoiceUrl,
        filename,
      });
      triggerFileDownload(blob, filename);
      addToast({
        title: "Invoice Downloaded",
        description: `Invoice ${invoice.number || invoice.id} downloaded successfully.`,
        color: "success",
      });
    } catch (err: any) {
      console.error("Error downloading invoice PDF:", err);
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to download invoice PDF.";
      addToast({
        title: "Download Failed",
        description: errorMsg,
        color: "danger",
      });
    } finally {
      setDownloadingIds((prev) => ({ ...prev, [invoice.id]: false }));
    }
  };

  const handleDownloadAllInvoices = async () => {
    if (!invoices || invoices.length === 0) {
      addToast({
        title: "No Invoices Found",
        description: "There are no previous invoices available to download.",
        color: "warning",
      });
      return;
    }

    try {
      setIsDownloadingAll(true);
      let downloadedCount = 0;

      for (const inv of invoices) {
        if (!inv) continue;
        try {
          const filename = `Invoice_${inv.number || inv.id}.pdf`;
          const blob = await downloadInvoicePdf({
            invoiceId: inv.id,
            url: inv.pdfUrl || inv.invoiceUrl,
            filename,
          });
          triggerFileDownload(blob, filename);
          downloadedCount++;
          await new Promise((resolve) => setTimeout(resolve, 350));
        } catch (e) {
          console.error("Error downloading invoice:", inv.id, e);
        }
      }

      if (downloadedCount > 0) {
        addToast({
          title: "Invoices Downloaded",
          description: `Downloaded ${downloadedCount} invoice PDF(s).`,
          color: "success",
        });
      } else {
        addToast({
          title: "Download Failed",
          description: "Could not download invoices.",
          color: "warning",
        });
      }
    } finally {
      setIsDownloadingAll(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="rounded-xl shadow-none border border-foreground/10 bg-background h-[356px] flex items-center justify-center">
        <LoadingState />
      </Card>
    );
  }

  const isInactive = billingData.status === "inActive" || billingData.status === "expired" || billingData.status === "failed";
  const isCanceled = !isInactive && (billingData.status === "canceled" || Boolean(billingData.cancelAtPeriodEnd));
  const isTrial = !isInactive && !isCanceled && (billingData.status === "trial" || Boolean(billingData.isTrial));
  const isActive = !isInactive && !isCanceled && !isTrial && (billingData.status === "active");

  const trialEnd = billingData.trialEndsAt || billingData.nextBillingDate;

  const getRemainingTimeText = () => {
    if (billingData.trialDaysLeft !== undefined && billingData.trialDaysLeft !== null) {
      if (billingData.trialDaysLeft <= 0) {
        if (!trialEnd) return "0 mins";
        const ms = new Date(trialEnd).getTime() - Date.now();
        if (ms <= 0) return "0 mins";
        const mins = Math.ceil(ms / (1000 * 60));
        const hrs = Math.ceil(ms / (1000 * 60 * 60));
        if (mins < 60) return `${mins} ${mins === 1 ? "min" : "mins"}`;
        return `${hrs} ${hrs === 1 ? "hour" : "hours"}`;
      }
      return `${billingData.trialDaysLeft} ${billingData.trialDaysLeft === 1 ? "day" : "days"}`;
    }
    if (!trialEnd) return `${billingData.trialDays || 14} days`;
    const msRemaining = new Date(trialEnd).getTime() - Date.now();
    if (msRemaining <= 0) return "0 mins";
    const minutes = Math.ceil(msRemaining / (1000 * 60));
    const hours = Math.ceil(msRemaining / (1000 * 60 * 60));
    const days = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "min" : "mins"}`;
    } else if (hours < 24) {
      return `${hours} ${hours === 1 ? "hour" : "hours"}`;
    } else {
      return `${days} ${days === 1 ? "day" : "days"}`;
    }
  };

  const remainingText = getRemainingTimeText();
  const isShortDuration = trialEnd ? (new Date(trialEnd).getTime() - Date.now()) < 24 * 60 * 60 * 1000 : false;

  const limits = billingData.limits;
  const access = billingData.access;

  const formatLimit = (val?: number) => (val === undefined || val === -1 ? "Unlimited" : val);

  return (
    <div className="space-y-6">
      <Card className="rounded-xl shadow-none border border-foreground/10 bg-background">
        <CardHeader className="flex items-center gap-2 px-4 pt-4 pb-1">
          <FiCreditCard className="size-5" />
          <h4 className="text-base font-semibold">Billing & Subscription</h4>
        </CardHeader>

        <CardBody className="p-4 space-y-6">
          <div
            className={`p-4 rounded-xl border transition-all ${isTrial
              ? "bg-sky-50/60 dark:bg-sky-950/20 border-sky-300 dark:border-sky-800/80"
              : isInactive
                ? "bg-red-50/40 dark:bg-red-950/15 border-red-300 dark:border-red-800/60"
                : isCanceled
                  ? "bg-amber-50/40 dark:bg-amber-950/15 border-amber-300 dark:border-amber-800/70"
                  : isActive
                    ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/60"
                    : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">Current Plan</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{billingData.name} Plan</h3>
              </div>
              {isTrial ? (
                <span className="inline-flex items-center justify-center rounded-full px-3.5 py-1 text-xs font-semibold shrink-0 bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700 shadow-sm">
                  Free Trial ({remainingText} left)
                </span>
              ) : isInactive ? (
                <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold shrink-0 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700">
                  Inactive (Subscription Ended)
                </span>
              ) : isCanceled ? (
                <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold shrink-0 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-sm">
                  Cancellation Scheduled (Autopay Off)
                </span>
              ) : isActive ? (
                <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold shrink-0 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700">
                  Active Subscription
                </span>
              ) : (
                <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold shrink-0 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700">
                  {billingData.status ? billingData.status.toUpperCase() : "Inactive"}
                </span>
              )}
            </div>

            {isTrial && (
              <div className="my-3 p-3 rounded-lg bg-sky-100/70 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-800/60 flex items-center justify-between text-xs text-sky-900 dark:text-sky-200">
                <span>
                  ⏳ <strong>Free Trial Active:</strong> You have <strong>{remainingText} remaining</strong> in your trial period.
                </span>
              </div>
            )}

            {isInactive && (
              <div className="my-3 p-3 rounded-lg bg-red-100/70 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 flex items-center justify-between text-xs text-red-900 dark:text-red-200">
                <span>
                  🔒 <strong>Subscription Ended:</strong> Your account is currently inactive. Activate a plan to regain full access.
                </span>
              </div>
            )}

            {isCanceled && (
              <div className="my-3 p-3 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
                <span>
                  ⚠️ <strong>Cancellation Scheduled:</strong> Autopay has been turned off. You will continue to have full access until{" "}
                  <strong>{formatDateToReadable(billingData.nextBillingDate || billingData.trialEndsAt, isShortDuration)}</strong> without any further charges.
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200/60 dark:border-zinc-800 text-xs">
              <p className="text-gray-700 dark:text-zinc-300 font-medium">
                ${billingData.price}/{billingData.billingCycle || "month"}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {isInactive ? (
                  <span className="text-gray-500 dark:text-zinc-400">
                    Status: <span className="font-semibold text-red-600 dark:text-red-400">Inactive</span> (Autopay Off)
                  </span>
                ) : isCanceled ? (
                  <>
                    <span className="text-gray-500 dark:text-zinc-400">
                      Access active until:{" "}
                      <span className="font-semibold text-gray-800 dark:text-zinc-200">
                        {formatDateToReadable(billingData.nextBillingDate || billingData.trialEndsAt, isShortDuration)}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Autopay Off ($0 due)
                    </span>
                  </>
                ) : isTrial ? (
                  <>
                    <span className="text-gray-500 dark:text-zinc-400">
                      First charge on:{" "}
                      <span className="font-semibold text-gray-800 dark:text-zinc-200">
                        {formatDateToReadable(billingData.trialEndsAt || billingData.nextBillingDate, isShortDuration)}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      ${billingData.nextBillingAmount ?? billingData.price} on Autopay
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-500 dark:text-zinc-400">
                      Next billing date:{" "}
                      <span className="font-semibold text-gray-800 dark:text-zinc-200">
                        {formatDateToReadable(billingData.nextBillingDate, isShortDuration)}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      ${billingData.nextBillingAmount ?? billingData.price} on Autopay
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

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

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                color="primary"
                variant="solid"
                onPress={handleTogglePlanStatus}
                className="font-semibold shadow-sm"
              >
                {isActive ? "Upgrade Plan" : isCanceled ? "Change Plan" : "Activate Plan"}
              </Button>

              {isCanceled && (
                <Button
                  size="sm"
                  color="success"
                  variant="flat"
                  isLoading={isResuming}
                  onPress={handleResumeSubscription}
                  className="font-semibold"
                >
                  Resume Auto-Pay
                </Button>
              )}
            </div>

            {!isCanceled && !isInactive && (
              <Button
                size="sm"
                color="danger"
                variant="light"
                onPress={onOpenCancel}
                className="font-medium text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </CardBody>
      </Card>


      <Card className="rounded-xl shadow-none border border-foreground/10 bg-background">
        <CardHeader className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-foreground/10">
          <div className="flex items-center gap-2">
            <FiPackage className="size-5 text-gray-500" />
            <div>
              <h4 className="text-base font-semibold">Active Optional Add-ons</h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Purchased add-ons, extra capacity, and recurring features
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="light"
              isIconOnly
              title="Refresh add-ons"
              isLoading={isLoadingAddons}
              onPress={loadUserAddons}
            >
              <FiRefreshCw className="size-4" />
            </Button>
          </div>
        </CardHeader>

        <CardBody className="p-4">
          {isLoadingAddons ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-sm text-gray-500">
              <Spinner size="sm" />
              <span>Loading your add-ons...</span>
            </div>
          ) : userAddons.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500 dark:text-zinc-400">
              <FiPackage className="size-8 mx-auto mb-2 text-gray-300 dark:text-zinc-600" />
              <p className="text-xs font-medium text-foreground/80">
                No active optional add-ons
              </p>
              <p className="text-[11px] text-foreground/50 mt-0.5">
                Boost your practice with extra SMS messages, additional user seats, or white-labeling.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {userAddons.map((item) => {
                const isMonthly = item.billingType === "monthly";
                const isAnnually = item.billingType === "annually";
                const isRecurring = isMonthly || isAnnually;
                const isItemCanceled = item.status === "canceled";
                const isItemExpired = item.status === "expired";

                return (
                  <div
                    key={item._id}
                    className="p-4 rounded-xl border border-foreground/10 bg-content1/40 dark:bg-zinc-900/40 flex flex-col justify-between gap-3 transition-all hover:border-primary/40 shadow-xs"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="text-sm font-bold text-foreground">
                              {item.title}
                            </h5>
                          </div>
                          {item.unit && (
                            <p className="text-[11px] font-medium text-foreground/60 mt-0.5">
                              {item.unit}
                            </p>
                          )}
                        </div>

                        <div>
                          {isItemExpired ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800">
                              Expired
                            </span>
                          ) : isItemCanceled ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                              Canceled
                            </span>
                          ) : isMonthly ? (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/80">
                              <span className="size-1.5 rounded-full bg-emerald-500"></span>
                              Monthly • Autopay
                            </span>
                          ) : isAnnually ? (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/80">
                              <span className="size-1.5 rounded-full bg-emerald-500"></span>
                              Annually • Autopay
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/80">
                              <span className="size-1.5 rounded-full bg-emerald-500"></span>
                              Active • One-Time
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-xl font-bold text-primary">
                          ${item.price}
                        </span>
                        <span className="text-[11px] font-medium text-foreground/60">
                          {isMonthly ? "/ month" : isAnnually ? "/ year" : " paid"}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-xs text-foreground/70 mt-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-foreground/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-foreground/60 text-[11px]">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full bg-emerald-500"></span>
                          <strong className="text-foreground/80 font-medium">Active:</strong>{" "}
                          {formatDateToReadable(item.purchaseDate || item.createdAt)}
                        </span>
                        <span>•</span>
                        <span>
                          <strong className="text-foreground/80 font-medium">
                            {isItemCanceled
                              ? "Access until:"
                              : isRecurring
                                ? "Next renewal:"
                                : "Expiry:"}
                          </strong>{" "}
                          {item.nextBillingDate
                            ? formatDateToReadable(item.nextBillingDate)
                            : isRecurring
                              ? "—"
                              : "Lifetime"}
                        </span>
                      </div>

                      {isRecurring && !isItemCanceled && (
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          isLoading={cancelingAddonId === item._id}
                          onPress={() => setAddonToCancel(item)}
                          className="h-6 text-[10px] px-2 font-medium text-danger hover:bg-danger/10 ml-auto"
                        >
                          Cancel Autopay
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
      
      <Card className="rounded-xl shadow-none border border-foreground/10 bg-background">
        <CardHeader className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-foreground/10">
          <div className="flex items-center gap-2">
            <FiFileText className="size-5 text-gray-500" />
            <div>
              <h4 className="text-base font-semibold">Previous Invoices & Receipts</h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                View and download all your past billing invoices and receipts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="light"
              isIconOnly
              title="Refresh invoices"
              isLoading={isLoadingInvoices}
              onPress={fetchInvoices}
            >
              <FiRefreshCw className="size-4" />
            </Button>
            {invoices.length > 0 && (
              <Button
                size="sm"
                variant="bordered"
                className="text-xs border-small font-medium"
                startContent={<FiDownload className="size-3.5" />}
                isLoading={isDownloadingAll}
                onPress={handleDownloadAllInvoices}
              >
                Download All
              </Button>
            )}
          </div>
        </CardHeader>

        <CardBody className="p-4">
          {isLoadingInvoices ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-sm text-gray-500">
              <Spinner size="sm" />
              <span>Fetching past invoices...</span>
            </div>
          ) : invoices.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500 dark:text-zinc-400">
              <FiFileText className="size-8 mx-auto mb-2 text-gray-300 dark:text-zinc-600" />
              <p className="font-medium text-gray-700 dark:text-zinc-300">No previous invoices found</p>
              <p className="text-xs text-gray-400 mt-1">
                Invoices and PDF receipts will automatically appear here after subscription payments are processed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-zinc-800 text-xs font-semibold text-gray-500 dark:text-zinc-400">
                      <th className="pb-3 px-2">Invoice</th>
                      <th className="pb-3 px-2">Billing Date</th>
                      <th className="pb-3 px-2">Amount</th>
                      <th className="pb-3 px-2">Status</th>
                      <th className="pb-3 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60 text-xs">
                    {invoices
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((inv) => {
                        const isDownloadingThis = downloadingIds[inv.id] || false;
                        const isPaid = (inv.status || "").toLowerCase() === "paid";
                        return (
                          <tr key={inv.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                            <td className="py-3 px-2 font-medium text-gray-900 dark:text-zinc-100">
                              {inv.number || inv.id}
                            </td>
                            <td className="py-3 px-2 text-gray-500 dark:text-zinc-400">
                              {formatDateToReadable(inv.date)}
                            </td>
                            <td className="py-3 px-2 font-semibold text-gray-900 dark:text-zinc-100">
                              ${Number(inv.amount || 0).toFixed(2)}
                            </td>
                            <td className="py-3 px-2">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${isPaid
                                    ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-800/60"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60"
                                  }`}
                              >
                                {isPaid ? "Paid" : inv.status || "Pending"}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-right">
                              <Button
                                size="sm"
                                variant="light"
                                isIconOnly
                                title="Download PDF"
                                isLoading={isDownloadingThis}
                                onPress={() => handleDownloadSingleInvoice(inv)}
                                className="text-gray-500 hover:text-gray-900 dark:hover:text-zinc-100"
                              >
                                <FiDownload className="size-3.5" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {invoices.length > 0 && (
                <div className="pt-3 border-t border-gray-200/60 dark:border-zinc-800">
                  <Pagination
                    identifier="invoices"
                    limit={itemsPerPage}
                    totalItems={invoices.length}
                    currentPage={currentPage}
                    totalPages={Math.ceil(invoices.length / itemsPerPage) || 1}
                    handlePageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isCancelOpen} onOpenChange={onCancelOpenChange} placement="center" backdrop="blur" size="md">
        <ModalContent className="bg-background border border-foreground/10">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-2">
                <div className="flex items-center gap-2 text-danger">
                  <FiAlertTriangle className="size-5" />
                  <span className="text-base font-bold text-foreground">Cancel Subscription</span>
                </div>
              </ModalHeader>
              <ModalBody className="py-2 space-y-3">
                <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                  Are you sure you want to cancel your <strong>{billingData.name} Plan</strong>?
                </p>
                <div className="p-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <p className="font-semibold">What will happen:</p>
                  <p>
                    • You will retain full access to all features until{" "}
                    <strong>{formatDateToReadable(billingData.nextBillingDate || billingData.trialEndsAt, isShortDuration)}</strong>.
                  </p>
                  <p>
                    • <strong>Auto-pay is immediately disabled.</strong> You will <strong>NOT</strong> be charged any amount on your next billing date.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="pt-2">
                <Button size="sm" variant="bordered" onPress={onClose} disabled={isCanceling}>
                  Keep Subscription
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="solid"
                  isLoading={isCanceling}
                  onPress={handleCancelSubscription}
                  className="font-semibold shadow-sm"
                >
                  Confirm Cancellation
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={Boolean(addonToCancel)} onOpenChange={() => setAddonToCancel(null)} placement="center" backdrop="blur" size="md">
        <ModalContent className="bg-background border border-foreground/10">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-2">
                <div className="flex items-center gap-2 text-danger">
                  <FiAlertTriangle className="size-5" />
                  <span className="text-base font-bold text-foreground">Cancel Add-on Renewal</span>
                </div>
              </ModalHeader>
              <ModalBody className="py-2 space-y-3">
                <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                  Are you sure you want to cancel Autopay renewal for <strong>{addonToCancel?.title}</strong>?
                </p>
                <div className="p-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <p className="font-semibold">What will happen:</p>
                  <p>
                    • You will continue to have access to this add-on until{" "}
                    <strong>{formatDateToReadable(addonToCancel?.nextBillingDate)}</strong>.
                  </p>
                  <p>
                    • <strong>Autopay will be turned off immediately</strong> and no further renewals will be billed.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="pt-2">
                <Button size="sm" variant="bordered" onPress={onClose} disabled={Boolean(cancelingAddonId)}>
                  Keep Add-on
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="solid"
                  isLoading={Boolean(cancelingAddonId)}
                  onPress={async () => {
                    if (addonToCancel) {
                      try {
                        setCancelingAddonId(addonToCancel._id);
                        await cancelUserAddon(addonToCancel._id);
                        addToast({
                          title: "Add-on Canceled",
                          description: `Autopay renewal canceled for '${addonToCancel.title}'.`,
                          color: "success",
                        });
                        setAddonToCancel(null);
                        await loadUserAddons();
                      } catch (err: any) {
                        addToast({
                          title: "Error",
                          description: err.response?.data?.message || "Failed to cancel add-on",
                          color: "danger",
                        });
                      } finally {
                        setCancelingAddonId(null);
                      }
                    }
                  }}
                  className="font-semibold shadow-sm"
                >
                  Confirm Cancellation
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Billing;
