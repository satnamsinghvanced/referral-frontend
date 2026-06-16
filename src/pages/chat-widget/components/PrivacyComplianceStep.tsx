import React from "react";
import { Switch, Input, Checkbox, Card, CardBody } from "@heroui/react";
import { LuShieldAlert } from "react-icons/lu";

interface PrivacyComplianceStepProps {
  hipaaMode: boolean;
  setHipaaMode: (val: boolean) => void;
  requirePatientConsent: boolean;
  setRequirePatientConsent: (val: boolean) => void;
  privacyPolicyUrl: string;
  setPrivacyPolicyUrl: (val: string) => void;
  dataRetentionPeriod: string;
  setDataRetentionPeriod: (val: string) => void;
  requireName: boolean;
  requireEmail: boolean;
  setRequireEmail: (val: boolean) => void;
  requirePhone: boolean;
  setRequirePhone: (val: boolean) => void;
  errors: Record<string, string>;
  handleInputChange: (name: string, value: string, setter: (val: string) => void) => void;
}

export default function PrivacyComplianceStep({
  hipaaMode,
  setHipaaMode,
  requirePatientConsent,
  setRequirePatientConsent,
  privacyPolicyUrl,
  setPrivacyPolicyUrl,
  dataRetentionPeriod,
  setDataRetentionPeriod,
  requireName,
  requireEmail,
  setRequireEmail,
  requirePhone,
  setRequirePhone,
  errors,
  handleInputChange
}: PrivacyComplianceStepProps) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="border-b border-foreground/5 pb-2">
        <h3 className="text-base font-bold text-foreground font-sans">Privacy & HIPAA Compliance</h3>
        <p className="text-xs text-default-500 mt-1 font-sans">Ensure your chat widget meets healthcare privacy requirements.</p>
      </div>

      {/* HIPAA Status Banner matching Figma green styles */}
      <div className="flex items-start gap-3 border border-emerald-200 bg-emerald-50/5 rounded-lg p-4">
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground font-sans">HIPAA-Compliant Mode</span>
            <span className="bg-emerald-500 text-white font-bold text-[9px] uppercase px-1.5 py-0.5 rounded leading-none">Enabled</span>
          </div>
          <p className="text-[10px] text-default-600 font-sans font-light mt-1.5 leading-relaxed">
            All conversations are encrypted and stored securely. PHI collection warnings are automatically shown to patients.
          </p>
        </div>
      </div>

      {/* Consent Switch Box with nesting */}
      <div className={`border rounded-xl p-4 transition-all duration-200 ${requirePatientConsent ? "border-sky-200 bg-sky-50/40" : "border-foreground/10 bg-transparent"}`}>
        <div className="flex items-center justify-between pb-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-default-700 font-sans">Require Patient Consent</span>
            <span className="text-[10px] text-default-500 font-sans font-light">Show consent checkbox before starting conversation</span>
          </div>
          <Switch isSelected={requirePatientConsent} onValueChange={setRequirePatientConsent} size="sm" />
        </div>

        {requirePatientConsent && (
          <div className="border-t border-sky-100 pt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-default-700 block mb-1.5 font-sans">
                  Privacy Policy URL <span className="text-danger">*</span>
                </label>
                <Input
                  placeholder="e.g. https://practiceroi.com/privacy"
                  value={privacyPolicyUrl}
                  onValueChange={(val) => handleInputChange("privacyPolicyUrl", val, setPrivacyPolicyUrl)}
                  variant="flat"
                  classNames={{ inputWrapper: "bg-white border-none shadow-none rounded-lg h-11" }}
                  isInvalid={!!errors.privacyPolicyUrl}
                  errorMessage={errors.privacyPolicyUrl}
                  aria-label="Privacy Policy URL"
                />
                {!errors.privacyPolicyUrl && (
                  <span className="text-[10px] text-default-400 font-sans font-light mt-1">Link shown in consent message</span>
                )}
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs font-bold text-default-700 block mb-1.5 font-sans">
                  Data Retention Period (Days) <span className="text-danger">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 90"
                  value={dataRetentionPeriod}
                  onValueChange={(val) => handleInputChange("dataRetentionPeriod", val, setDataRetentionPeriod)}
                  variant="flat"
                  classNames={{ inputWrapper: "bg-white border-none shadow-none rounded-lg h-11" }}
                  isInvalid={!!errors.dataRetentionPeriod}
                  errorMessage={errors.dataRetentionPeriod}
                  min={1}
                  aria-label="Data Retention Period"
                />
                {!errors.dataRetentionPeriod && (
                  <span className="text-[10px] text-default-400 font-sans font-light mt-1 leading-snug">
                    How long to store conversation history (HIPAA requires minimum 6 years for medical records)
                  </span>
                )}
              </div>
            </div>

            {/* Required patient fields */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-default-700 block font-sans">Required Patient Information</label>
              <div className="flex flex-col gap-2.5 pl-1">
                <Checkbox isSelected={requireName} isDisabled size="sm">
                  <span className="text-xs text-default-600 font-sans font-medium">Name (Always required)</span>
                </Checkbox>
                <Checkbox isSelected={requireEmail} onValueChange={setRequireEmail} size="sm">
                  <span className="text-xs text-default-700 font-sans font-medium">Email Address</span>
                </Checkbox>
                <Checkbox isSelected={requirePhone} onValueChange={setRequirePhone} size="sm">
                  <span className="text-xs text-default-700 font-sans font-medium">Phone Number</span>
                </Checkbox>
              </div>
            </div>

            {/* PHI Warning Banner matching Figma blue styles */}
            <Card className="shadow-none border border-blue-200 bg-blue-50/50 rounded-xl p-3">
              <CardBody className="p-0 flex flex-row gap-3 items-start">
                <LuShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-[11px] font-bold text-blue-900 uppercase tracking-wide font-sans">PHI Warning</h4>
                  <p className="text-[10px] text-blue-700/90 leading-relaxed font-sans font-medium">
                    The widget automatically displays: "Please do not share sensitive health information in this chat. For medical emergencies, call 911."
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
