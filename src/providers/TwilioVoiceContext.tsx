import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { Device, Call } from "@twilio/voice-sdk";
import { getTwilioVoiceToken } from "../services/call";
import { queryClient } from "./QueryProvider";
import { CALL_RECORDS_QUERY_KEY } from "../hooks/useCall";

export type CallStatus = "idle" | "ready" | "connecting" | "ringing" | "connected" | "ended" | "error";

interface TwilioVoiceContextType {
  device: Device | null;
  activeCall: Call | null;
  callStatus: CallStatus;
  callDuration: number;
  formattedDuration: string;
  isMuted: boolean;
  error: string | null;
  destinationNumber: string;
  isDialerOpen: boolean;
  openDialer: (prefillNumber?: string) => void;
  closeDialer: () => void;
  makeCall: (phone: string) => Promise<void>;
  hangUp: () => void;
  toggleMute: () => void;
  sendDigit: (digit: string) => void;
  setDestinationNumber: (phone: string) => void;
}

const TwilioVoiceContext = createContext<TwilioVoiceContextType | undefined>(undefined);

export const TwilioVoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [device, setDevice] = useState<Device | null>(null);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [destinationNumber, setDestinationNumber] = useState<string>("");
  const [isDialerOpen, setIsDialerOpen] = useState<boolean>(false);

  const deviceRef = useRef<Device | null>(null);
  const activeCallRef = useRef<Call | null>(null);
  const timerRef = useRef<any>(null);

  const formatSeconds = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();
    setCallDuration(0);
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const openDialer = useCallback((prefillNumber?: string) => {
    if (prefillNumber) {
      setDestinationNumber(prefillNumber);
    }
    setIsDialerOpen(true);
    setError(null);
  }, []);

  const closeDialer = useCallback(() => {
    if (callStatus === "connecting" || callStatus === "ringing" || callStatus === "connected") {
      // Don't close while call is active; user can minimize or hang up first
      return;
    }
    setIsDialerOpen(false);
  }, [callStatus]);

  const initDevice = useCallback(async (): Promise<Device> => {
    if (deviceRef.current && deviceRef.current.state === Device.State.Registered) {
      return deviceRef.current;
    }

    const { token } = await getTwilioVoiceToken();
    const newDevice = new Device(token, {
      logLevel: 1,
      codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
      closeProtection: true,
    });

    newDevice.on("registered", () => {
      setCallStatus((prev) => (prev === "idle" ? "ready" : prev));
    });

    newDevice.on("error", (twilioErr: any) => {
      console.error("[Twilio Voice Device Error]:", twilioErr);
      setError(twilioErr?.message || "Twilio device error occurred");
      setCallStatus("error");
    });

    await newDevice.register();
    deviceRef.current = newDevice;
    setDevice(newDevice);
    return newDevice;
  }, []);

  const makeCall = useCallback(
    async (phone: string) => {
      const cleanPhone = phone.trim();
      if (!cleanPhone) {
        setError("Please enter a valid phone number");
        return;
      }

      setError(null);
      setCallStatus("connecting");
      setDestinationNumber(cleanPhone);
      setIsDialerOpen(true);

      try {
        // Request microphone permission first
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop track right after check; Twilio SDK handles audio stream during connect
          stream.getTracks().forEach((track) => track.stop());
        } catch (micErr: any) {
          setError("Microphone access is required to place browser calls. Please allow microphone permission in your browser.");
          setCallStatus("error");
          return;
        }

        const dev = await initDevice();
        const call = await dev.connect({
          params: {
            To: cleanPhone,
            phoneNumber: cleanPhone,
          },
        });

        activeCallRef.current = call;
        setActiveCall(call);

        call.on("ringing", () => {
          setCallStatus("ringing");
        });

        call.on("accept", () => {
          setCallStatus("connected");
          startTimer();
          setIsMuted(false);
        });

        call.on("disconnect", () => {
          setCallStatus("ended");
          clearTimer();
          activeCallRef.current = null;
          setActiveCall(null);
          // Refresh call log queries
          queryClient.invalidateQueries({ queryKey: [CALL_RECORDS_QUERY_KEY] });
          queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
          setTimeout(() => {
            setCallStatus("ready");
          }, 2500);
        });

        call.on("error", (callErr: any) => {
          console.error("[Twilio Voice Call Error]:", callErr);
          setError(callErr?.message || "Call failed to connect");
          setCallStatus("error");
          clearTimer();
          activeCallRef.current = null;
          setActiveCall(null);
        });

        call.on("cancel", () => {
          setCallStatus("ended");
          clearTimer();
          activeCallRef.current = null;
          setActiveCall(null);
        });
      } catch (err: any) {
        console.error("[Twilio Voice makeCall Error]:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to initiate call");
        setCallStatus("error");
        clearTimer();
      }
    },
    [initDevice]
  );

  const hangUp = useCallback(() => {
    if (activeCallRef.current) {
      activeCallRef.current.disconnect();
    } else if (deviceRef.current) {
      deviceRef.current.disconnectAll();
    }
    setCallStatus("ended");
    clearTimer();
    activeCallRef.current = null;
    setActiveCall(null);
    queryClient.invalidateQueries({ queryKey: [CALL_RECORDS_QUERY_KEY] });
    queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    setTimeout(() => {
      setCallStatus("ready");
    }, 1500);
  }, []);

  const toggleMute = useCallback(() => {
    if (activeCallRef.current) {
      const nextMute = !activeCallRef.current.isMuted();
      activeCallRef.current.mute(nextMute);
      setIsMuted(nextMute);
    }
  }, []);

  const sendDigit = useCallback((digit: string) => {
    if (activeCallRef.current && (callStatus === "connected" || callStatus === "ringing")) {
      activeCallRef.current.sendDigits(digit);
    }
  }, [callStatus]);

  useEffect(() => {
    return () => {
      clearTimer();
      if (deviceRef.current) {
        deviceRef.current.destroy();
      }
    };
  }, []);

  return (
    <TwilioVoiceContext.Provider
      value={{
        device,
        activeCall,
        callStatus,
        callDuration,
        formattedDuration: formatSeconds(callDuration),
        isMuted,
        error,
        destinationNumber,
        isDialerOpen,
        openDialer,
        closeDialer,
        makeCall,
        hangUp,
        toggleMute,
        sendDigit,
        setDestinationNumber,
      }}
    >
      {children}
    </TwilioVoiceContext.Provider>
  );
};

export const useTwilioVoice = () => {
  const context = useContext(TwilioVoiceContext);
  if (!context) {
    throw new Error("useTwilioVoice must be used within a TwilioVoiceProvider");
  }
  return context;
};
