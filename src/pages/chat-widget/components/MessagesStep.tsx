import React from "react";
import { Input, Switch } from "@heroui/react";

interface MessagesStepProps {
  welcomeMessage: string;
  setWelcomeMessage: (val: string) => void;
  welcomeDelay: string;
  setWelcomeDelay: (val: string) => void;
  enableAutoReply: boolean;
  setEnableAutoReply: (val: boolean) => void;
  autoReplyMessage: string;
  setAutoReplyMessage: (val: string) => void;
  offlineMessage: string;
  setOfflineMessage: (val: string) => void;
  workingHours: boolean;
  setWorkingHours: (val: boolean) => void;
  errors: Record<string, string>;
  handleInputChange: (name: string, value: string, setter: (val: string) => void) => void;
}

export default function MessagesStep({
  welcomeMessage,
  setWelcomeMessage,
  welcomeDelay,
  setWelcomeDelay,
  enableAutoReply,
  setEnableAutoReply,
  autoReplyMessage,
  setAutoReplyMessage,
  offlineMessage,
  setOfflineMessage,
  workingHours,
  setWorkingHours,
  errors,
  handleInputChange
}: MessagesStepProps) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="border-b border-foreground/5 pb-2">
        <h3 className="text-base font-bold text-foreground font-sans">Configure Welcome & Auto Messages</h3>
        <p className="text-xs text-default-500 mt-1 font-sans">Set up automatic responses and welcome messages for your patients.</p>
      </div>

      <div className="space-y-1 flex flex-col">
        <label className="text-xs font-bold text-default-700 block mb-1.5 font-sans">
          Welcome Message <span className="text-danger">*</span>
        </label>
        <textarea
          placeholder="e.g. Hi there! 👋 How can we help you today?"
          value={welcomeMessage}
          onChange={(e) => handleInputChange("welcomeMessage", e.target.value, setWelcomeMessage)}
          className={`w-full h-20 border-none rounded-lg p-3 text-sm focus:bg-default-100 outline-none bg-default-100/50 hover:bg-default-100 dark:bg-content2/50 dark:focus:bg-content2 text-foreground font-sans transition-colors ${errors.welcomeMessage ? "ring-2 ring-danger" : "ring-none"}`}
        />
        {errors.welcomeMessage ? (
          <span className="text-xs text-danger font-semibold mt-1 block font-sans">{errors.welcomeMessage}</span>
        ) : (
          <span className="text-[10px] text-default-400 font-sans font-light mt-0.5">First message patients see when they open the chat.</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="flex flex-col">
          <label className="text-xs font-bold text-default-700 block mb-1.5 font-sans">
            Welcome Message Delay (seconds) <span className="text-danger">*</span>
          </label>
          <Input
            type="number"
            placeholder="e.g. 2"
            value={welcomeDelay}
            onValueChange={(val) => handleInputChange("welcomeDelay", val, setWelcomeDelay)}
            variant="flat"
            classNames={{ inputWrapper: "bg-default-100/50 hover:bg-default-100 border-none shadow-none rounded-lg h-11" }}
            isInvalid={!!errors.welcomeDelay}
            errorMessage={errors.welcomeDelay}
            min={0}
            aria-label="Welcome Message Delay"
          />
        </div>
      </div>

      <div className={`border rounded-xl p-4 transition-all duration-200 ${enableAutoReply ? "border-sky-200 bg-sky-50/40" : "border-foreground/10 bg-transparent"}`}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-default-700 font-sans">Enable Auto-Reply</span>
            <span className="text-[10px] text-default-500 font-sans font-light">Send automatic responses when patients first message</span>
          </div>
          <Switch isSelected={enableAutoReply} onValueChange={setEnableAutoReply} size="sm" />
        </div>
        {enableAutoReply && (
          <div className="mt-4 space-y-1.5 flex flex-col border-t border-sky-100 pt-4 animate-in slide-in-from-top-2 duration-200">
            <label className="text-xs font-bold text-default-700 block mb-1 font-sans">
              Auto-Reply Message <span className="text-danger">*</span>
            </label>
            <textarea
              placeholder="e.g. Thanks for reaching out! A team member will respond shortly..."
              value={autoReplyMessage}
              onChange={(e) => handleInputChange("autoReplyMessage", e.target.value, setAutoReplyMessage)}
              className={`w-full h-20 border-none rounded-lg p-3 text-sm focus:bg-default-100 outline-none bg-white text-foreground font-sans transition-colors ${errors.autoReplyMessage ? "ring-2 ring-danger" : "ring-none"}`}
            />
            {errors.autoReplyMessage && (
              <span className="text-xs text-danger font-semibold mt-1 block font-sans">{errors.autoReplyMessage}</span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1 flex flex-col">
        <label className="text-xs font-bold text-default-700 block mb-1.5 font-sans">
          Offline Message <span className="text-danger">*</span>
        </label>
        <textarea
          placeholder="e.g. We're currently offline. Leave us a message..."
          value={offlineMessage}
          onChange={(e) => handleInputChange("offlineMessage", e.target.value, setOfflineMessage)}
          className={`w-full h-20 border-none rounded-lg p-3 text-sm focus:bg-default-100 outline-none bg-default-100/50 hover:bg-default-100 dark:bg-content2/50 dark:focus:bg-content2 text-foreground font-sans transition-colors ${errors.offlineMessage ? "ring-2 ring-danger" : "ring-none"}`}
        />
        {errors.offlineMessage ? (
          <span className="text-xs text-danger font-semibold mt-1 block font-sans">{errors.offlineMessage}</span>
        ) : (
          <span className="text-[10px] text-default-400 font-sans font-light mt-0.5">Shown when outside business hours.</span>
        )}
      </div>

      <div className="flex items-center justify-between border border-purple-200 bg-purple-50/40 rounded-xl p-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-default-700 font-sans">Working Hours</span>
          <span className="text-[10px] text-default-500 font-sans font-light">Set your availability schedule</span>
        </div>
        <Switch isSelected={workingHours} onValueChange={setWorkingHours} size="sm" />
      </div>
    </div>
  );
}
