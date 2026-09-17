import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import TwilioAddCreditsModal from "../modal/TwilioAddCreditsModal";
import TwilioPurchaseNumberModal from "../modal/TwilioPurchaseNumberModal";
import TwilioA2PRegistrationModal from "../modal/TwilioA2PRegistrationModal";
import { TwilioConfigResponse } from "../../../types/integrations/twilio";
import axios from "../../../services/axios";
import { useFetchA2PRegistration } from "../../../hooks/integrations/useTwilio";
import { PhoneNumber } from "./a2p/types";
import A2PRegistrationSection from "./a2p/A2PRegistrationSection";
import TwilioOverviewHeader from "./twilio/TwilioOverviewHeader";
import ConnectedPhoneNumbersList from "./twilio/ConnectedPhoneNumbersList";
import ReleaseNumberModal from "./twilio/ReleaseNumberModal";
import { useTwilioStripeListener } from "./twilio/useTwilioStripeListener";

interface TwilioDashboardProps {
  twilioConfig?: TwilioConfigResponse | undefined;
}

export default function TwilioDashboard({ twilioConfig }: TwilioDashboardProps) {
  const queryClient = useQueryClient();
  useTwilioStripeListener();
  const [balance, setBalance] = useState<number>(twilioConfig?.balance ?? 0);
  const [minutesUsed, setMinutesUsed] = useState<number>(twilioConfig?.minutesUsed ?? 0);
  const [minutesLimit, setMinutesLimit] = useState<number>(twilioConfig?.minutesLimit ?? 0);
  const [planExpiresAt, setPlanExpiresAt] = useState<string | null | undefined>(twilioConfig?.planExpiresAt);
  const planName = twilioConfig?.planName || "No Active Plan";
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);

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
          },
        }));
        setPhoneNumbers(formatted);
      }
    }
  }, [twilioConfig]);

  const [isAddCreditsOpen, setIsAddCreditsOpen] = useState(false);
  const [isPurchaseNumberOpen, setIsPurchaseNumberOpen] = useState(false);
  const [isA2PRegistrationOpen, setIsA2PRegistrationOpen] = useState(false);
  const [numberToRelease, setNumberToRelease] = useState<PhoneNumber | null>(null);
  const [isReleasing, setIsReleasing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: registrationRes, isLoading: isA2PConfigLoading } = useFetchA2PRegistration();
  const registration = registrationRes
    ? registrationRes.data !== undefined
      ? registrationRes.data
      : registrationRes
    : null;
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

  const handlePurchaseSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["twilio"] });
  };

  const handleConfirmRelease = async () => {
    if (!numberToRelease) return;
    setIsReleasing(true);
    try {
      const response = (await axios.post("/twilio-checkout/release-number", {
        phoneNumber: numberToRelease.phoneNumber,
      })) as any;
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
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["twilio"] }),
        queryClient.invalidateQueries({ queryKey: ["twilio", "a2p"] }),
        axios.get("/twilio-checkout/active-numbers").catch(() => { }),
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

  return (
    <div className="flex flex-col gap-4 w-full">
      <TwilioOverviewHeader
        activeNumbersCount={phoneNumbers.length}
        planName={planName}
        minutesUsed={minutesUsed}
        minutesLimit={minutesLimit}
        onOpenManagePlans={() => setIsAddCreditsOpen(true)}
        onOpenPurchaseNumber={() => setIsPurchaseNumberOpen(true)}
      />

      <A2PRegistrationSection
        registration={registration}
        phoneNumbers={phoneNumbers}
        isA2PConfigLoading={isA2PConfigLoading}
        onOpenRegistrationModal={() => setIsA2PRegistrationOpen(true)}
      />

      <ConnectedPhoneNumbersList
        phoneNumbers={phoneNumbers}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onSelectReleaseNumber={(num) => setNumberToRelease(num)}
      />

      <TwilioAddCreditsModal
        isOpen={isAddCreditsOpen}
        onClose={() => setIsAddCreditsOpen(false)}
        currentBalance={balance}
        currentMinutes={minutesLimit}
        minutesUsed={minutesUsed}
        planExpiresAt={planExpiresAt}
        onAddCredits={() => { }}
      />

      <TwilioPurchaseNumberModal
        isOpen={isPurchaseNumberOpen}
        onClose={() => setIsPurchaseNumberOpen(false)}
        onPurchaseSuccess={handlePurchaseSuccess}
        balance={balance}
        phoneNumbersCount={phoneNumbers.length}
        minutesLimit={minutesLimit}
      />

      <TwilioA2PRegistrationModal
        isOpen={isA2PRegistrationOpen}
        onClose={() => setIsA2PRegistrationOpen(false)}
        phoneNumbers={phoneNumbers}
      />

      <ReleaseNumberModal
        numberToRelease={numberToRelease}
        isReleasing={isReleasing}
        onClose={() => setNumberToRelease(null)}
        onConfirmRelease={handleConfirmRelease}
      />
    </div>
  );
}