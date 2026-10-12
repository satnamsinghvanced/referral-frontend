import React, { useState, useEffect } from "react";
import { Button, Chip, Tooltip } from "@heroui/react";
import {
  FiPhone,
  FiPhoneCall,
  FiPhoneOff,
  FiMic,
  FiMicOff,
  FiX,
  FiDelete,
  FiGrid,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { LuPhoneCall } from "react-icons/lu";
import { useTwilioVoice } from "../../providers/TwilioVoiceContext";
import { useFetchTwilioConfig } from "../../hooks/integrations/useTwilio";

const KEYPAD_BUTTONS = [
  { digit: "1", sub: "" },
  { digit: "2", sub: "ABC" },
  { digit: "3", sub: "DEF" },
  { digit: "4", sub: "GHI" },
  { digit: "5", sub: "JKL" },
  { digit: "6", sub: "MNO" },
  { digit: "7", sub: "PQRS" },
  { digit: "8", sub: "TUV" },
  { digit: "9", sub: "WXYZ" },
  { digit: "*", sub: "" },
  { digit: "0", sub: "+" },
  { digit: "#", sub: "" },
];

const COUNTRY_PREFIXES = [
  { code: "+1", label: "US/CA (+1)" },
  { code: "+91", label: "IN (+91)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+61", label: "AU (+61)" },
];

export const BrowserPhoneDialer: React.FC = () => {
  const {
    callStatus,
    formattedDuration,
    isMuted,
    error,
    destinationNumber,
    isDialerOpen,
    closeDialer,
    makeCall,
    hangUp,
    toggleMute,
    sendDigit,
    setDestinationNumber,
  } = useTwilioVoice();

  const { data: twilioConfig } = useFetchTwilioConfig();
  const callerIdNumber = twilioConfig?.phoneNumbers?.[0]?.phoneNumber || "+18188733885";

  const [inputNumber, setInputNumber] = useState(destinationNumber);
  const [selectedPrefix, setSelectedPrefix] = useState("+1");
  const [showKeypadInCall, setShowKeypadInCall] = useState(false);

  useEffect(() => {
    if (destinationNumber) {
      setInputNumber(destinationNumber);
      if (destinationNumber.startsWith("+91")) {
        setSelectedPrefix("+91");
      } else if (destinationNumber.startsWith("+1")) {
        setSelectedPrefix("+1");
      }
    }
  }, [destinationNumber]);

  if (!isDialerOpen) return null;

  const handleDigitClick = (digit: string) => {
    if (callStatus === "connected" || callStatus === "ringing") {
      sendDigit(digit);
    } else {
      setInputNumber((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setInputNumber((prev) => prev.slice(0, -1));
  };

  const handleCallSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputNumber.trim()) return;

    let fullNumber = inputNumber.trim();
    if (!fullNumber.startsWith("+")) {
      fullNumber = `${selectedPrefix}${fullNumber.replace(/^0+/, "")}`;
    }
    makeCall(fullNumber);
  };

  const isInCall = callStatus === "connecting" || callStatus === "ringing" || callStatus === "connected";

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[340px] max-w-[calc(100vw-32px)] bg-background/95 dark:bg-[#13171d]/95 backdrop-blur-xl border border-foreground/15 dark:border-default-200/20 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      {/* Top Header */}
      <div className="px-4 py-3 bg-default-100/60 dark:bg-default-50/10 border-b border-foreground/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <FiPhoneCall className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground">Browser Phone</span>
              <Chip size="sm" variant="flat" color="success" className="h-4 text-[10px] px-1">
                Live
              </Chip>
            </div>
            <p className="text-[10px] text-foreground/50">Caller ID: {callerIdNumber}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={closeDialer}
          disabled={isInCall}
          className={`p-1.5 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all ${
            isInCall ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
          }`}
          title={isInCall ? "Cannot close while call is active" : "Close dialer"}
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-4">
        {/* Error Alert */}
        {error && (
          <div className="p-2.5 rounded-xl bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800/40 text-danger-700 dark:text-danger-300 text-xs flex items-start gap-2">
            <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-tight">{error}</div>
          </div>
        )}

        {/* IN-CALL ACTIVE VIEW */}
        {isInCall ? (
          <div className="py-4 flex flex-col items-center justify-center space-y-4">
            {/* Pulsing Avatar / Waves */}
            <div className="relative flex items-center justify-center">
              <div
                className={`absolute w-20 h-20 rounded-full animate-ping opacity-25 ${
                  callStatus === "connected" ? "bg-emerald-500" : "bg-sky-500"
                }`}
              />
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  callStatus === "connected"
                    ? "bg-gradient-to-tr from-emerald-600 to-teal-400 text-white"
                    : "bg-gradient-to-tr from-sky-600 to-indigo-500 text-white"
                }`}
              >
                <FiPhone className="w-7 h-7" />
              </div>
            </div>

            {/* Calling info */}
            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-foreground tracking-wide">{destinationNumber || inputNumber}</h4>
              <div className="flex items-center justify-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    callStatus === "connected" ? "bg-emerald-500 animate-pulse" : "bg-sky-500 animate-bounce"
                  }`}
                />
                <span className="text-xs font-medium text-foreground/70 capitalize">
                  {callStatus === "connected" ? formattedDuration : callStatus === "ringing" ? "Ringing patient..." : "Connecting..."}
                </span>
              </div>
            </div>

            {/* In-Call Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <Tooltip content={isMuted ? "Unmute Mic" : "Mute Mic"}>
                <Button
                  isIconOnly
                  size="md"
                  radius="full"
                  variant={isMuted ? "solid" : "flat"}
                  color={isMuted ? "danger" : "default"}
                  onPress={toggleMute}
                  className="shadow-sm"
                >
                  {isMuted ? <FiMicOff className="w-4 h-4" /> : <FiMic className="w-4 h-4" />}
                </Button>
              </Tooltip>

              <Tooltip content="Keypad (DTMF)">
                <Button
                  isIconOnly
                  size="md"
                  radius="full"
                  variant={showKeypadInCall ? "solid" : "flat"}
                  color={showKeypadInCall ? "primary" : "default"}
                  onPress={() => setShowKeypadInCall(!showKeypadInCall)}
                  className="shadow-sm"
                >
                  <FiGrid className="w-4 h-4" />
                </Button>
              </Tooltip>

              <Tooltip content="End Call">
                <Button
                  isIconOnly
                  size="lg"
                  radius="full"
                  color="danger"
                  variant="solid"
                  onPress={hangUp}
                  className="shadow-md bg-red-600 hover:bg-red-700 text-white"
                >
                  <FiPhoneOff className="w-5 h-5" />
                </Button>
              </Tooltip>
            </div>

            {/* Secondary In-call Keypad for extension dialing */}
            {showKeypadInCall && (
              <div className="grid grid-cols-3 gap-2 w-full pt-2">
                {KEYPAD_BUTTONS.map((btn) => (
                  <button
                    key={btn.digit}
                    type="button"
                    onClick={() => handleDigitClick(btn.digit)}
                    className="py-2 rounded-xl bg-default-100 hover:bg-default-200 text-foreground font-semibold text-sm transition-all"
                  >
                    {btn.digit}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* DIALPAD VIEW */
          <div className="space-y-3">
            {/* Number Input Bar */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-default-100/70 dark:bg-default-50/10 border border-foreground/10 focus-within:border-primary/60 transition-all">
              <select
                value={selectedPrefix}
                onChange={(e) => setSelectedPrefix(e.target.value)}
                className="bg-transparent text-xs font-semibold text-foreground/80 outline-none cursor-pointer border-r border-foreground/10 pr-1.5 py-1"
              >
                {COUNTRY_PREFIXES.map((p) => (
                  <option key={p.code} value={p.code} className="bg-background text-foreground">
                    {p.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={inputNumber}
                onChange={(e) => setInputNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCallSubmit();
                }}
                placeholder="Enter patient mobile..."
                className="flex-1 bg-transparent text-sm font-semibold text-foreground tracking-wider outline-none placeholder:text-foreground/30"
              />
              {inputNumber && (
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="p-1 rounded-md text-foreground/40 hover:text-foreground transition-all cursor-pointer"
                >
                  <FiDelete className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-2">
              {KEYPAD_BUTTONS.map((btn) => (
                <button
                  key={btn.digit}
                  type="button"
                  onClick={() => handleDigitClick(btn.digit)}
                  className="py-2.5 rounded-xl bg-default-100/50 hover:bg-default-200/70 dark:bg-default-50/5 dark:hover:bg-default-50/15 border border-foreground/5 hover:border-foreground/15 text-foreground flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  <span className="text-base font-bold leading-none">{btn.digit}</span>
                  {btn.sub && <span className="text-[9px] font-medium text-foreground/40 mt-0.5 tracking-widest">{btn.sub}</span>}
                </button>
              ))}
            </div>

            {/* Call Action Button */}
            <Button
              fullWidth
              size="lg"
              color="success"
              variant="solid"
              onPress={() => handleCallSubmit()}
              disabled={!inputNumber.trim()}
              className="font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 cursor-pointer"
              startContent={<FiPhoneCall className="w-5 h-5" />}
            >
              Call Patient
            </Button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-default-50/40 dark:bg-default-50/5 border-t border-foreground/5 flex items-center justify-between text-[11px] text-foreground/50">
        <span className="flex items-center gap-1">
          <FiCheckCircle className="w-3 h-3 text-emerald-500" /> WebRTC Audio Enabled
        </span>
        <span>Auto-recorded</span>
      </div>
    </div>
  );
};

export default BrowserPhoneDialer;
