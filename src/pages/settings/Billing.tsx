import { Button, Card, CardBody, CardHeader, Spinner, addToast } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCreditCard, FiDownload, FiFileText, FiExternalLink, FiRefreshCw } from "react-icons/fi";
import { useBilling } from "../../hooks/settings/useBilling";
import { getLatestInvoice, getAllInvoices, downloadInvoicePdf, InvoiceItem } from "../../services/settings/billing";
import { formatDateToReadable } from "../../utils/formatDateToReadable";
import { LoadingState } from "../../components/common/LoadingState";

import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Pagination from "../../components/common/Pagination";

const Billing: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: billingData, isLoading, error } = useBilling();
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState<Record<string, boolean>>({});
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  useEffect(() => {
    fetchInvoices();
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

  const isTrial = billingData.status === "trial" || billingData.isTrial;
  const isActive = billingData.status === "active";
  const isCanceled = billingData.status === "canceled";

  const trialEnd = billingData.trialEndsAt || billingData.nextBillingDate;

  const getRemainingTimeText = () => {
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
                : isActive
                  ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/60"
                  : isCanceled
                    ? "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-300 dark:border-zinc-800"
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
              ) : isActive ? (
                <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold shrink-0 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700">
                  Active Subscription
                </span>
              ) : isCanceled ? (
                <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">
                  Canceled
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

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200/60 dark:border-zinc-800 text-xs">
              <p className="text-gray-700 dark:text-zinc-300 font-medium">
                ${billingData.price}/{billingData.billingCycle || "month"}
              </p>
              <p className="text-gray-500 dark:text-zinc-400">
                {isTrial ? "First charge on: " : "Next billing date: "}
                <span className="font-semibold text-gray-700 dark:text-zinc-300">
                  {formatDateToReadable(billingData.nextBillingDate || billingData.trialEndsAt, isShortDuration)}
                </span>
              </p>
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

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              size="sm"
              color="primary"
              variant="solid"
              onPress={handleTogglePlanStatus}
              className="font-semibold shadow-sm"
            >
              {isActive ? "Upgrade Plan" : "Activate Plan"}
            </Button>
          </div>
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
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 font-medium">
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Invoice / Receipt #</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60">
                    {invoices
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((inv) => {
                        const isPaid = inv.status === "paid" || inv.status === "succeeded";
                        return (
                          <tr key={inv.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                            <td className="py-3 text-gray-700 dark:text-zinc-300 font-medium whitespace-nowrap">
                              {inv.date ? new Date(inv.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—"}
                            </td>
                            <td className="py-3 text-gray-600 dark:text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                              {inv.number || inv.id}
                            </td>
                            <td className="py-3 text-gray-900 dark:text-white font-semibold whitespace-nowrap">
                              ${inv.amount.toFixed(2)} {inv.currency.toUpperCase()}
                            </td>
                            <td className="py-3 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                  isPaid
                                    ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                                    : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                                }`}
                              >
                                {inv.status ? inv.status.toUpperCase() : "PAID"}
                              </span>
                            </td>
                            <td className="py-3 text-right whitespace-nowrap">
                              <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                className="text-xs h-7 px-3 font-medium"
                                startContent={<FiDownload className="size-3.5" />}
                                isLoading={Boolean(downloadingIds[inv.id])}
                                onPress={() => handleDownloadSingleInvoice(inv)}
                              >
                                Download PDF
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
    </div>
  );
};

export default Billing;
