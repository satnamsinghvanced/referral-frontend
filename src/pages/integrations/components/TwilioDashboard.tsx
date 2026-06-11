import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardBody, Button, Chip, addToast, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner } from "@heroui/react";
import {
  FiPhone,
  FiDollarSign,
  FiClock,
  FiMessageSquare,
  FiInfo,
  FiPlus,
  FiTrash2,
  FiRefreshCw,
  FiCheckCircle,
  FiCreditCard,
} from "react-icons/fi";
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

  useEffect(() => {
    if (twilioConfig) {
      if (twilioConfig.balance !== undefined) setBalance(twilioConfig.balance);
      if (twilioConfig.minutesUsed !== undefined) setMinutesUsed(twilioConfig.minutesUsed);
      if (twilioConfig.minutesLimit !== undefined) setMinutesLimit(twilioConfig.minutesLimit);
      if (twilioConfig.phoneNumbers !== undefined) {
        const formatted = twilioConfig.phoneNumbers.map((num: any) => ({
          id: num._id || num.id || num.phoneNumber,
          phoneNumber: num.phoneNumber,
          label: num.label || num.friendlyName || "Marketing Line",
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
  const registration = registrationRes?.data;

  const [isA2PRegistrationOpen, setIsA2PRegistrationOpen] = useState(false);
  const [numberToRelease, setNumberToRelease] = useState<PhoneNumber | null>(null);

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

  const handleConfirmRelease = async () => {
    if (numberToRelease) {
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
        setNumberToRelease(null);
      }
    }
  };

  const handleRefresh = () => {
    addToast({
      title: "Syncing status",
      description: "Twilio numbers and status successfully refreshed.",
      color: "success",
    });
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
                  <Chip
                    size="sm"
                    className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30 text-[10px] font-bold h-5 px-1.5"
                  >
                    Demo Mode
                  </Chip>
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
                Add Credits
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
                <span className="text-xs font-semibold text-foreground-500">Account Balance</span>
                <FiDollarSign className="w-4 h-4 text-green-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-extrabold text-foreground">
                  ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

      <Card className="shadow-none border border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/10 rounded-2xl p-4">
        <CardBody className="p-0 flex flex-row gap-3 items-start">
          <FiInfo className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400">Demo Mode Active</h4>
            <p className="text-xs text-blue-700/80 dark:text-blue-400/80 mt-1 leading-relaxed">
              This is a demonstration of the Practice ROI Phone Service interface. All data shown is for preview purposes only. When activated, clients will purchase phone numbers and credits directly through Practice ROI, with Twilio running in the background.
            </p>
          </div>
        </CardBody>
      </Card>

      <Card className="shadow-none border border-foreground/10 bg-background rounded-2xl p-5">
        <CardBody className="p-0 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-foreground">SMS Messaging Registration (A2P)</h3>
              {registration?.status === "approved" && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-2.5 py-0.5 rounded-full border border-green-200 dark:border-green-900/30">
                  <FiCheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                  Approved
                </span>
              )}
              {registration?.status === "pending" && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/30">
                  <FiClock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  Pending Review
                </span>
              )}
              {registration?.status === "failed" && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full border border-red-500/20 dark:border-red-500/10">
                  <FiInfo className="w-3 h-3 text-red-500" />
                  Rejected
                </span>
              )}
            </div>

            {(!registration || registration?.status === "failed") && (
              <Button
                color={registration?.status === "failed" ? "danger" : "primary"}
                size="sm"
                onPress={() => setIsA2PRegistrationOpen(true)}
                startContent={<FiCheckCircle className="w-3.5 h-3.5" />}
                className="rounded-lg text-xs font-semibold h-8 px-4 text-white"
              >
                {registration?.status === "failed" ? "Edit & Re-submit" : "Register for SMS"}
              </Button>
            )}

            {registration && (registration.status === "pending" || registration.status === "approved") && (
              <Button
                variant="light"
                size="sm"
                onPress={() => setIsA2PRegistrationOpen(true)}
                className="text-xs font-semibold text-foreground-500 hover:text-foreground hover:bg-foreground/5 rounded-lg px-3 h-8"
              >
                {registration.status === "approved" ? "View Details" : "Edit Registration"}
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
                  <li>Registration takes 5-10 minutes</li>
                  <li>Approval typically within 1-2 business days</li>
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
                    Your A2P registration for <span className="font-bold text-amber-900 dark:text-amber-200">"{registration.campaignName || "Patient Communication & Appointment Reminders"}"</span> is currently being reviewed by mobile carriers.
                  </p>
                  <p>
                    This typically takes 1-2 business days. You'll receive an email notification when your registration is approved.
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
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 leading-none">Unlimited</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-red-200 dark:border-red-900/30 bg-red-50/40 dark:bg-red-950/10 rounded-xl p-4 flex flex-row gap-3 items-start">
              <FiInfo className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex flex-col gap-1.5">
                <h4 className="text-xs font-bold text-red-600 dark:text-red-500">
                  A2P SMS Registration Rejected
                </h4>
                <p className="text-xs text-red-600/80 dark:text-red-400/80 leading-relaxed">
                  Carrier review has rejected this brand/campaign registration for the following reason:
                </p>
                <div className="bg-red-500/10 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-200/50 dark:border-red-900/30 text-xs text-red-700 dark:text-red-400 font-bold my-1">
                  {registration.rejectionReason || "Rejection reason unspecified by carrier."}
                </div>
                <p className="text-[10px] text-red-500/80">
                  Please review the details, correct any compliance issues, and re-submit your registration.
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
              onPress={handleRefresh}
              className="text-foreground-500 hover:text-foreground rounded-lg"
            >
              <FiRefreshCw className="w-4 h-4" />
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
                        <Chip
                          size="sm"
                          className="bg-default-100 dark:bg-default-900/50 text-foreground-500 text-[10px] font-semibold h-4 px-1.5"
                        >
                          Voice Only
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
        currentMinutes={minutesUsed}
        onAddCredits={handleAddCredits}
      />

      {/* Purchase Number Modal */}
      <TwilioPurchaseNumberModal
        isOpen={isPurchaseNumberOpen}
        onClose={() => setIsPurchaseNumberOpen(false)}
        onPurchaseSuccess={handlePurchaseNumber}
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
              onPress={() => setNumberToRelease(null)}
              className="border border-foreground/10 rounded-lg text-xs font-semibold h-8 px-4"
            >
              Cancel
            </Button>
            <Button
              color="danger"
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
