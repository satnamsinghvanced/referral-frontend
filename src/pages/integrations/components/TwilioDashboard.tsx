import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardBody, Button, Chip, addToast, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner } from "@heroui/react";
import { FiPhone, FiDollarSign, FiClock, FiMessageSquare, FiInfo, FiPlus, FiTrash2, FiRefreshCw, FiCheckCircle, FiCreditCard } from "react-icons/fi";
import TwilioAddCreditsModal from "../modal/TwilioAddCreditsModal";
import TwilioPurchaseNumberModal from "../modal/TwilioPurchaseNumberModal";
import TwilioA2PRegistrationModal from "../modal/TwilioA2PRegistrationModal";
import { TwilioConfigResponse } from "../../../types/integrations/twilio";
import axios from "../../../services/axios";
import { useFetchA2PRegistration } from "../../../hooks/integrations/useTwilio";

interface PhoneNumber {
  id: string;
  phoneNumber: string;
  label: string;
  status: "Active" | "Pending" | string;
  capabilities: { voice: boolean; SMS: boolean; MMS: boolean };
}

interface TwilioDashboardProps {
  twilioConfig?: TwilioConfigResponse | undefined;
}

export default function TwilioDashboard({ twilioConfig }: TwilioDashboardProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [balance, setBalance] = useState<number>(twilioConfig?.balance ?? 0);
  const [minutesUsed, setMinutesUsed] = useState<number>(twilioConfig?.minutesUsed ?? 0);
  const [minutesLimit, setMinutesLimit] = useState<number>(twilioConfig?.minutesLimit ?? 0);
  const [planExpiresAt, setPlanExpiresAt] = useState<string | null | undefined>(twilioConfig?.planExpiresAt);

  const planName = twilioConfig?.planName || "No Active Plan";


  useEffect(() => {
    if (twilioConfig) {
      if (twilioConfig.balance !== undefined) setBalance(twilioConfig.balance);
      if (twilioConfig.minutesUsed !== undefined) setMinutesUsed(twilioConfig.minutesUsed);
      if (twilioConfig.minutesLimit !== undefined) setMinutesLimit(twilioConfig.minutesLimit);
      if (twilioConfig.planExpiresAt !== undefined) setPlanExpiresAt(twilioConfig.planExpiresAt);
      if (twilioConfig.phoneNumbers !== undefined) {
        const formatted = twilioConfig.phoneNumbers.map((num: any) => ({
          id: num._id || num.id || num.phoneNumber,
          phoneNumber: num.phoneNumber,
          label: num.label || num.friendlyName,
          status: num.status || "Active",
          capabilities: {
            voice: num.capabilities?.voice !== false,
            SMS: num.capabilities?.sms !== false || num.capabilities?.SMS !== false,
            MMS: num.capabilities?.mms !== false || num.capabilities?.MMS !== false,
          }
        }));
        setPhoneNumbers(formatted);
      }
    }
  }, [twilioConfig]);

  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [isAddCreditsOpen, setIsAddCreditsOpen] = useState(false);
  const [isPurchaseNumberOpen, setIsPurchaseNumberOpen] = useState(false);
  const { data: registrationRes, isLoading: isA2PConfigLoading } = useFetchA2PRegistration();
  const registration = registrationRes ? (registrationRes.data !== undefined ? registrationRes.data : registrationRes) : null;
  const [isA2PRegistrationOpen, setIsA2PRegistrationOpen] = useState(false);
  const [numberToRelease, setNumberToRelease] = useState<PhoneNumber | null>(null);
  const [prevStatus, setPrevStatus] = useState<string | null>(null);
  useEffect(() => {
    if (registration?.status) {
      if (prevStatus === "pending" && registration.status === "approved") {
        addToast({
          title: "A2P Registration Approved",
          description: "Your A2P SMS registration has been approved by carriers. SMS messaging is now enabled!",
          color: "success",
        });
      }
      setPrevStatus(registration.status);
    } else {
      setPrevStatus(null);
    }
  }, [registration?.status, prevStatus]);

  const successParam = searchParams.get("success");
  const typeParam = searchParams.get("type");

  useEffect(() => {
    if (window.opener && typeParam === "twilio_credits") {
      if (successParam === "true") {
        window.opener.postMessage({ type: "STRIPE_SUCCESS" }, "*");
      } else if (successParam === "false") {
        window.opener.postMessage({ type: "STRIPE_CANCEL" }, "*");
      }
      window.close();
      return;
    }
    if (successParam === "true" && typeParam === "twilio_credits") {
      addToast({
        title: "Credits Added",
        description: "Payment successful!",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["twilio"] });
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("success");
      newParams.delete("session_id");
      newParams.delete("type");
      setSearchParams(newParams);
    } else if (successParam === "false" && typeParam === "twilio_credits") {
      addToast({
        title: "Checkout Canceled",
        description: "Your credits purchase was canceled.",
        color: "warning",
      });
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("success");
      newParams.delete("type");
      setSearchParams(newParams);
    }
  }, [successParam, typeParam, queryClient, searchParams, setSearchParams]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "STRIPE_SUCCESS") {
        addToast({
          title: "Credits Added",
          description: "Payment successful! Your credits and minutes have been updated.",
          color: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["twilio"] });
      } else if (event.data?.type === "STRIPE_CANCEL") {
        addToast({
          title: "Checkout Canceled",
          description: "Your credits purchase was canceled.",
          color: "warning",
        });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [queryClient]);

  const handleAddCredits = (amount: number, minutes: number) => {
  };
  const handlePurchaseNumber = (number: string, label: string) => {
    queryClient.invalidateQueries({ queryKey: ["twilio"] });
  };
  const [isReleasing, setIsReleasing] = useState(false);
  const handleConfirmRelease = async () => {
    if (numberToRelease) {
      setIsReleasing(true);
      try {
        const response = await axios.post("/twilio-checkout/release-number", {
          phoneNumber: numberToRelease.phoneNumber,
        }) as any;
        if (response?.success) {
          addToast({
            title: "Number Released",
            description: `Successfully released phone number ${numberToRelease.phoneNumber}`,
            color: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["twilio"] });
        } else {
          throw new Error(response?.message || "Failed to release number.");
        }
      } catch (err: any) {
        console.error(err);
        addToast({
          title: "Release Failed",
          description: err.response?.data?.message || err.message || "Failed to release phone number.",
          color: "danger",
        });
      } finally {
        setIsReleasing(false);
        setNumberToRelease(null);
      }
    }
  };
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["twilio"] }),
        queryClient.invalidateQueries({ queryKey: ["twilio", "a2p"] }),
        axios.get("/twilio-checkout/active-numbers").catch(() => { })
      ]);
      await new Promise((res) => setTimeout(res, 800));
      addToast({
        title: "Syncing status",
        description: "Twilio numbers and status successfully refreshed.",
        color: "success",
      });
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  };
  const getA2PBadgeDetails = () => {
    const rawStatus = (registration?.status === "failed" || registration?.status === "approved")
      ? registration.status
      : (registration?.campaignStatus || registration?.status || "pending");
    const statusUpper = rawStatus.toUpperCase();

    if (statusUpper === "VERIFIED" || statusUpper === "APPROVED") {
      return {
        label: "Verified",
        colorClass: "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30",
        icon: <FiCheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
      };
    }
    if (statusUpper === "FAILED" || statusUpper === "REJECTED") {
      return {
        label: "Rejected",
        colorClass: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 dark:border-red-500/10",
        icon: <FiInfo className="w-3 h-3 text-red-500" />
      };
    }
    const displayLabel = statusUpper === "IN_PROGRESS" ? "In Progress" : "Pending Review";
    return {
      label: displayLabel,
      colorClass: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
      icon: <FiClock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
    };
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Card className="shadow-none border border-foreground/10 rounded-2xl bg-background p-5">
        <CardBody className="p-0 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
                <FiPhone className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-foreground">
                    Practice ROI Phone Service
                  </h2>
                </div>
                <p className="text-xs text-foreground-500 mt-0.5">
                  Manage phone numbers, call tracking, and SMS communication through Practice ROI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Button
                variant="bordered"
                onPress={() => setIsAddCreditsOpen(true)}
                startContent={<FiCreditCard className="w-4 h-4" />}
                className="border border-foreground/10 rounded-xl text-sm font-semibold h-10 px-4 hover:bg-foreground/5"
              >
                Manage plans
              </Button>
              <Button
                color="primary"
                onPress={() => setIsPurchaseNumberOpen(true)}
                startContent={<FiPlus className="w-4 h-4" />}
                className="bg-primary text-white rounded-xl text-sm font-semibold h-10 px-4"
              >
                Purchase Number
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="shadow-none border border-foreground/10 bg-foreground/5 dark:bg-default-50/50 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-foreground-500">Active Numbers</span>
                <FiPhone className="w-4 h-4 text-blue-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-extrabold text-foreground">{phoneNumbers.length}</span>
              </div>
            </Card>
            <Card className="shadow-none border border-foreground/10 bg-foreground/5 dark:bg-default-50/50 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-foreground-500">Current Plan</span>
                <FiDollarSign className="w-4 h-4 text-green-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-extrabold text-foreground">
                  {planName}
                </span>
              </div>
            </Card>
            <Card className="shadow-none border border-foreground/10 bg-foreground/5 dark:bg-default-50/50 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-foreground-500">Monthly Minutes</span>
                <FiClock className="w-4 h-4 text-purple-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-extrabold text-foreground">
                  {minutesUsed}
                  <span className="text-sm font-normal text-foreground-500">/{minutesLimit}</span>
                </span>
              </div>
            </Card>
            <Card className="shadow-none border border-foreground/10 bg-foreground/5 dark:bg-default-50/50 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-foreground-500">Features</span>
                <FiMessageSquare className="w-4 h-4 text-red-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-sm font-bold text-foreground">Voice • SMS • MMS</span>
              </div>
            </Card>
          </div>
        </CardBody>
      </Card>
      <Card className="shadow-none border border-foreground/10 bg-background rounded-2xl p-5">
        <CardBody className="p-0 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-foreground">SMS Messaging Registration (A2P)</h3>
              {registration && (() => {
                const badge = getA2PBadgeDetails();
                return (
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.colorClass}`}>
                    {badge.icon}
                    {badge.label}
                  </span>
                );
              })()}
            </div>
            {(!registration || registration?.status === "failed") && (
              <Button
                color={registration?.status === "failed" ? "danger" : "primary"}
                size="sm"
                // isDisabled={!phoneNumbers || phoneNumbers.length === 0}
                onPress={() => setIsA2PRegistrationOpen(true)}
                startContent={<FiCheckCircle className="w-3.5 h-3.5" />}
                className="rounded-lg text-xs font-semibold h-8 px-4 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                title={!phoneNumbers || phoneNumbers.length === 0 ? "Please purchase a phone number first before registering for SMS" : ""}
              >
                {registration?.status === "failed" ? "Edit & Re-submit" : "Register for SMS"}
              </Button>
            )}

          </div>
          {isA2PConfigLoading ? (
            <div className="flex justify-center items-center py-6">
              <Spinner size="sm" label="Fetching A2P status..." />
            </div>
          ) : !registration ? (
            <div className="border border-red-200 dark:border-red-900/30 bg-red-50/40 dark:bg-red-950/10 rounded-xl p-4 flex flex-row gap-3 items-start">
              <FiInfo className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex flex-col gap-1.5">
                <h4 className="text-xs font-bold text-red-600 dark:text-red-500">
                  SMS Registration Required
                </h4>
                <p className="text-xs text-red-600/80 dark:text-red-400/80 leading-relaxed">
                  To send SMS messages with your phone numbers, you need to complete A2P (Application-to-Person) registration. This is required by mobile carriers for compliance and helps prevent spam.
                </p>
                <ul className="text-xs text-red-600/80 dark:text-red-400/80 list-disc pl-4 space-y-1 mt-1 font-medium">
                  {(!phoneNumbers || phoneNumbers.length === 0) && (
                    <li className="font-bold text-red-700 dark:text-red-300">
                      You must purchase a phone number first before registering for SMS.
                    </li>
                  )}
                  <li>Required for all business SMS messaging</li>
                  <li>One-time registration per brand/campaign</li>
                </ul>
              </div>
            </div>
          ) : registration.status === "pending" ? (
            <div className="border border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/10 rounded-2xl p-5 flex gap-3 items-start">
              <FiClock className="w-5 h-5 text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">
                  Registration Under Review
                </h4>
                <div className="flex flex-col gap-1.5 text-xs text-amber-700 dark:text-amber-400/90 leading-relaxed">
                  <p>
                    Your A2P registration for <span className="font-bold text-amber-900 dark:text-amber-200">"{registration.campaignName || "Patient Communication & Appointment Reminders"}"</span> is currently under review for phone service.
                  </p>
                  <p>
                    This is under review for phone service. It will take 1-2 days. You'll receive an email notification when your registration is approved.
                  </p>
                </div>
              </div>
            </div>
          ) : registration.status === "approved" ? (
            <div className="border border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-950/10 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex gap-3 items-start">
                <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-green-800 dark:text-green-300">
                    SMS Messaging Enabled
                  </h4>
                  <p className="text-xs text-green-700 dark:text-green-400/90 leading-relaxed">
                    Your campaign <span className="font-bold text-green-800 dark:text-green-200">"{registration.campaignName || "Patient Communication & Appointment Reminders"}"</span> is approved and ready for SMS messaging.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-zinc-900 border border-green-200/60 dark:border-green-900/30 p-3.5 rounded-xl flex flex-col gap-1.5">
                  <span className="text-[10px] text-foreground-500 font-semibold leading-none">Campaign Status</span>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 leading-none">Active</span>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-green-200/60 dark:border-green-900/30 p-3.5 rounded-xl flex flex-col gap-1.5">
                  <span className="text-[10px] text-foreground-500 font-semibold leading-none">Registered Numbers</span>
                  <span className="text-xs font-bold text-foreground leading-none">{registration.selectedNumbers?.length || 0}</span>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-green-200/60 dark:border-green-900/30 p-3.5 rounded-xl flex flex-col gap-1.5">
                  <span className="text-[10px] text-foreground-500 font-semibold leading-none">Daily Limit</span>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 leading-none">
                    {registration?.ein ? "6,000 msgs/day" : "1,000 msgs/day"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-red-200 dark:border-red-900/30 bg-red-50/40 dark:bg-red-950/10 rounded-xl p-4 flex flex-row gap-3 items-start">
              <FiInfo className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex flex-col gap-2 w-full">
                <h4 className="text-xs font-bold text-red-600 dark:text-red-500">
                  A2P SMS Registration Rejected
                </h4>
                <p className="text-xs text-red-600/80 dark:text-red-400/80 leading-relaxed">
                  Carrier review has rejected this brand/campaign registration. Please review the items below:
                </p>

                {(() => {
                  if (!registration.rejectionReason) {
                    return (
                      <div className="bg-red-500/10 p-3 rounded-xl border border-red-200/50 text-xs font-bold text-red-700">
                        Rejection reason unspecified by carrier.
                      </div>
                    );
                  }

                  const items = registration.rejectionReason.split(" | ").map((r: string) => r.trim()).filter(Boolean);

                  const getActionableTip = (title: string, detail: string) => {
                    const lower = title.toLowerCase() + " " + detail.toLowerCase();
                    if (lower.includes("business type") || lower.includes("business information")) {
                      return "Ensure your Business Type (e.g. Limited Liability Corporation), Business Legal Name, and EIN match official IRS documents.";
                    }
                    if (lower.includes("authorized representative #1") || lower.includes("authorized representative 1")) {
                      return "Verify contact person's full name, email, phone number, and title.";
                    }
                    if (lower.includes("authorized representative #2") || lower.includes("authorized representative 2")) {
                      return "Second Authorized Representative required by carrier policy.";
                    }
                    if (lower.includes("physical business address") || lower.includes("address")) {
                      return "Verify street address, city, state, and ZIP match official tax/registration records.";
                    }
                    if (lower.includes("primary customer profile")) {
                      return "Primary profile approval required by Twilio carrier policy.";
                    }
                    return "Please review this item and resubmit with verified information.";
                  };

                  return (
                    <div className="flex flex-col gap-2 my-1">
                      {items.map((item: string, idx: number) => {
                        const parts = item.split(":");
                        const title = parts[0] ? parts[0].trim() : "Compliance Requirement";
                        const detail = parts.slice(1).join(":").trim() || "Unfulfilled";
                        const tip = getActionableTip(title, detail);

                        return (
                          <div
                            key={idx}
                            className="flex flex-col gap-1 bg-red-500/10 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 p-3 rounded-xl"
                          >
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                              <span className="text-xs font-bold text-red-700 dark:text-red-300">{title}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/15 text-red-600 dark:text-red-400 font-semibold uppercase tracking-wider">
                                {detail}
                              </span>
                            </div>
                            <p className="text-xs text-red-600/90 dark:text-red-300/90 pl-4 leading-relaxed font-medium">
                              💡 <span className="font-semibold">Action Required:</span> {tip}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                <p className="text-[11px] text-red-500/80 font-medium">
                  Click <span className="font-bold text-red-600 dark:text-red-400">"Edit & Re-submit"</span> above to correct details and resubmit for carrier approval.
                </p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <Card className="shadow-none border border-foreground/10 bg-background rounded-2xl p-5">
        <CardBody className="p-0 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-foreground/5 pb-3">
            <h3 className="text-sm font-bold text-foreground">Connected Phone Numbers</h3>
            <Button
              variant="light"
              isIconOnly
              size="sm"
              isDisabled={isRefreshing}
              onPress={handleRefresh}
              className="text-foreground-500 hover:text-foreground rounded-lg transition-all"
            >
              <FiRefreshCw className={`w-4 h-4 transition-transform duration-500 ${isRefreshing ? "animate-spin text-blue-500" : ""}`} />
            </Button>
          </div>

          {phoneNumbers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 border border-dashed border-foreground/10 rounded-xl">
              <FiPhone className="w-8 h-8 text-foreground-400" />
              <p className="text-xs text-foreground-500">No phone numbers connected. Purchase a number to get started.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {phoneNumbers.map((num) => (
                <div
                  key={num.id}
                  className="border border-foreground/5 dark:border-foreground/10 hover:border-foreground/10 bg-foreground/5 dark:bg-default-50/50 hover:bg-foreground/10 transition-all rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/35 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <FiPhone className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-foreground">
                          {num.phoneNumber}
                        </span>
                        <Chip
                          size="sm"
                          className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-semibold h-4 px-1.5"
                        >
                          {num.status}
                        </Chip>
                      </div>
                      <span className="text-xs text-foreground-500">
                        {num.label}
                      </span>
                      <div className="flex gap-2.5 mt-1">
                        {num.capabilities.voice && (
                          <span className="text-[10px] border border-foreground/10 text-foreground-500 px-2 py-0.5 rounded-full font-medium">
                            Voice
                          </span>
                        )}
                        {num.capabilities.SMS && (
                          <span className="text-[10px] border border-foreground/10 text-foreground-500 px-2 py-0.5 rounded-full font-medium">
                            SMS
                          </span>
                        )}
                        {num.capabilities.MMS && (
                          <span className="text-[10px] border border-foreground/10 text-foreground-500 px-2 py-0.5 rounded-full font-medium">
                            MMS
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="bordered"
                    color="danger"
                    size="sm"
                    onPress={() => setNumberToRelease(num)}
                    startContent={<FiTrash2 className="w-3.5 h-3.5" />}
                    className="border border-danger/20 dark:border-danger/10 hover:bg-danger/10 text-danger rounded-lg text-xs font-semibold h-8 px-3.5"
                  >
                    Release
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Add Credits Modal */}
      <TwilioAddCreditsModal
        isOpen={isAddCreditsOpen}
        onClose={() => setIsAddCreditsOpen(false)}
        currentBalance={balance}
        currentMinutes={minutesLimit}
        minutesUsed={minutesUsed}
        planExpiresAt={planExpiresAt}
        onAddCredits={handleAddCredits}
      />

      {/* Purchase Number Modal */}
      <TwilioPurchaseNumberModal
        isOpen={isPurchaseNumberOpen}
        onClose={() => setIsPurchaseNumberOpen(false)}
        onPurchaseSuccess={handlePurchaseNumber}
        balance={balance}
        phoneNumbersCount={phoneNumbers.length}
        minutesLimit={minutesLimit}
      />

      {/* A2P SMS Registration Modal */}
      <TwilioA2PRegistrationModal
        isOpen={isA2PRegistrationOpen}
        onClose={() => setIsA2PRegistrationOpen(false)}
        phoneNumbers={phoneNumbers}
      />

      {/* Release Confirmation Modal */}
      <Modal
        isOpen={!!numberToRelease}
        onOpenChange={() => setNumberToRelease(null)}
        size="sm"
        classNames={{
          base: "max-sm:!m-3 !m-0 bg-background border border-foreground/10 text-foreground rounded-2xl",
          closeButton: "cursor-pointer text-foreground/50 hover:text-foreground",
        }}
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 p-5 pb-2">
            <h3 className="text-lg font-bold text-foreground">Release Phone Number</h3>
          </ModalHeader>
          <ModalBody className="p-5 pt-2">
            <p className="text-xs text-foreground-500 leading-relaxed">
              Are you sure you want to release the phone number <span className="font-semibold text-foreground">{numberToRelease?.phoneNumber}</span>? This action cannot be undone and inbound calls or messages to this number will fail immediately.
            </p>
          </ModalBody>
          <ModalFooter className="p-5 pt-2 flex gap-3 justify-end border-t border-foreground/5">
            <Button
              variant="bordered"
              isDisabled={isReleasing}
              onPress={() => setNumberToRelease(null)}
              className="border border-foreground/10 rounded-lg text-xs font-semibold h-8 px-4"
            >
              Cancel
            </Button>
            <Button
              color="danger"
              isLoading={isReleasing}
              isDisabled={isReleasing}
              onPress={handleConfirmRelease}
              className="bg-danger text-white rounded-lg text-xs font-semibold h-8 px-4"
            >
              Confirm Release
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
