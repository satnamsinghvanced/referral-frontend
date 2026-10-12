import React from "react";
import { Button, Chip } from "@heroui/react";
import { FiPhoneCall } from "react-icons/fi";
import { useTwilioVoice } from "../../providers/TwilioVoiceContext";
import { useFetchTwilioConfig } from "../../hooks/integrations/useTwilio";

export const DialerFloatingButton: React.FC = () => {
  const { isDialerOpen, openDialer, callStatus, formattedDuration } = useTwilioVoice();
  const { data: twilioConfig } = useFetchTwilioConfig();

  const isTwilioActive = twilioConfig && twilioConfig.status === "Connected" && (twilioConfig?.phoneNumbers?.length ?? 0) > 0;
  if (!isTwilioActive || isDialerOpen) return null;

  const isInCall = callStatus === "connecting" || callStatus === "ringing" || callStatus === "connected";

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in fade-in zoom-in-95">
      <Button
        size="lg"
        radius="full"
        color={isInCall ? "success" : "primary"}
        variant="solid"
        onPress={() => openDialer()}
        className={`shadow-xl px-5 py-6 font-semibold flex items-center gap-2.5 cursor-pointer text-white transition-all ${
          isInCall
            ? "bg-emerald-600 hover:bg-emerald-700 ring-4 ring-emerald-500/20 animate-pulse"
            : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-700/20 hover:scale-105"
        }`}
      >
        <FiPhoneCall className="w-5 h-5 shrink-0" />
        <span>{isInCall ? `In Call (${formattedDuration})` : "Dialer"}</span>
        {isInCall && (
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
        )}
      </Button>
    </div>
  );
};

export default DialerFloatingButton;
