import React from "react";
import { Switch, Card, CardBody, Checkbox } from "@heroui/react";
import { FiInfo } from "react-icons/fi";

interface SmsSetupStepProps {
  enableSmsTransition: boolean;
  setEnableSmsTransition: (val: boolean) => void;
  smsPromptMessage: string;
  setSmsPromptMessage: (val: string) => void;
  smsConsentText: string;
  setSmsConsentText: (val: string) => void;
  triggerAfterMessages: boolean;
  setTriggerAfterMessages: (val: boolean) => void;
  triggerOnScheduling: boolean;
  setTriggerOnScheduling: (val: boolean) => void;
  triggerImmediately: boolean;
  setTriggerImmediately: (val: boolean) => void;
  errors: Record<string, string>;
  handleInputChange: (name: string, value: string, setter: (val: string) => void) => void;
}

export default function SmsSetupStep({
  enableSmsTransition,
  setEnableSmsTransition,
  smsPromptMessage,
  setSmsPromptMessage,
  smsConsentText,
  setSmsConsentText,
  triggerAfterMessages,
  setTriggerAfterMessages,
  triggerOnScheduling,
  setTriggerOnScheduling,
  triggerImmediately,
  setTriggerImmediately,
  errors,
  handleInputChange
}: SmsSetupStepProps) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="border-b border-foreground/5 pb-2">
        <h3 className="text-base font-bold text-foreground font-sans">SMS Transition Settings</h3>
        <p className="text-xs text-default-500 mt-1 font-sans">Configure how the widget transitions from web chat to SMS messaging.</p>
      </div>

      <div className={`border rounded-xl p-4 transition-all duration-200 ${enableSmsTransition ? "border-sky-200 bg-sky-50/40 dark:border-sky-500/20 dark:bg-sky-950/20" : "border-foreground/10 bg-transparent"}`}>
        <div className="flex items-center justify-between pb-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-default-700 font-sans">Enable SMS Transition</span>
            <span className="text-[10px] text-default-500 font-sans font-light">Allow patients to continue conversations via text message</span>
          </div>
          <Switch isSelected={enableSmsTransition} onValueChange={setEnableSmsTransition} size="sm" />
        </div>

        {enableSmsTransition && (
          <div className="border-t border-sky-100 dark:border-sky-500/10 pt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1 flex flex-col">
              <label className="text-xs font-bold text-default-700 block mb-1 font-sans">
                SMS Prompt Message <span className="text-danger">*</span>
              </label>
              <textarea
                placeholder="e.g. Would you like to continue this conversation via text message? It's more convenient and you'll get faster responses!"
                value={smsPromptMessage}
                onChange={(e) => handleInputChange("smsPromptMessage", e.target.value, setSmsPromptMessage)}
                className={`w-full h-20 border-none rounded-lg p-3 text-sm focus:bg-default-100 outline-none bg-default-100/50 hover:bg-default-100 dark:bg-content2/50 dark:focus:bg-content2 text-foreground font-sans transition-colors ${errors.smsPromptMessage ? "ring-2 ring-danger" : "ring-none"}`}
              />
              {errors.smsPromptMessage ? (
                <span className="text-xs text-danger font-semibold mt-1 block font-sans">{errors.smsPromptMessage}</span>
              ) : (
                <span className="text-[10px] text-default-400 font-sans font-light mt-0.5">Message asking patient if they'd like to switch to SMS</span>
              )}
            </div>

            <div className="flex items-start gap-2.5 mt-2">
              <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0 mt-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
              <div className="flex-1 space-y-1 flex flex-col">
                <label className="text-xs font-bold text-default-700 font-sans">
                  SMS Consent Text (Required for Compliance) <span className="text-danger">*</span>
                </label>
                <textarea
                  placeholder="e.g. By providing your phone number, you consent to receive text messages from our practice. Message and data rates may apply. Reply STOP to opt out at any time."
                  value={smsConsentText}
                  onChange={(e) => handleInputChange("smsConsentText", e.target.value, setSmsConsentText)}
                  className={`w-full h-24 border-none rounded-lg p-3 text-xs focus:bg-default-100 outline-none bg-default-100/50 hover:bg-default-100 dark:bg-content2/50 dark:focus:bg-content2 text-foreground font-sans resize-none transition-colors ${errors.smsConsentText ? "ring-2 ring-danger" : "ring-none"}`}
                />
                {errors.smsConsentText ? (
                  <span className="text-xs text-danger font-semibold mt-1 block font-sans">{errors.smsConsentText}</span>
                ) : (
                  <span className="text-[10px] text-default-400 font-sans font-light mt-0.5">Legal disclaimer shown before collecting phone numbers</span>
                )}
              </div>
            </div>
            <Card className="shadow-none border border-amber-200 bg-amber-50/50 dark:border-amber-500/20 dark:bg-amber-950/20 rounded-xl p-3">
              <CardBody className="p-0 flex flex-row gap-3 items-start">
                <FiInfo className="w-4.5 h-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-[11px] font-bold text-amber-900 uppercase tracking-wide font-sans">TCPA Compliance Required</h4>
                  <p className="text-[10px] text-amber-700/95 leading-relaxed font-sans font-medium">
                    You must obtain explicit consent before sending SMS messages. This consent text will be shown to patients with a checkbox they must accept.
                  </p>
                </div>
              </CardBody>
            </Card>
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-default-700 block font-sans">Trigger SMS Transition</label>
              <div className="flex flex-col gap-2.5 pl-1">
                <Checkbox isSelected={triggerAfterMessages} onValueChange={setTriggerAfterMessages} size="sm">
                  <span className="text-xs text-default-700 font-sans font-medium">After 3 messages exchanged</span>
                </Checkbox>
                <Checkbox isSelected={triggerOnScheduling} onValueChange={setTriggerOnScheduling} size="sm">
                  <span className="text-xs text-default-700 font-sans font-medium">When patient asks about scheduling</span>
                </Checkbox>
                <Checkbox isSelected={triggerImmediately} onValueChange={setTriggerImmediately} size="sm">
                  <span className="text-xs text-default-700 font-sans font-medium">Immediately on first message</span>
                </Checkbox>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
