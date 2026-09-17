import React from "react";
import { FiClock, FiCheckCircle, FiAlertTriangle, FiInfo } from "react-icons/fi";
import { A2PRegistrationData } from "./types";
import { getStageStatus } from "./a2pUtils";

interface A2PProgressStepperProps {
  registration: A2PRegistrationData | null;
}

export default function A2PProgressStepper({ registration }: A2PProgressStepperProps) {
  const profileStage = getStageStatus(registration, "profile");
  const brandStage = getStageStatus(registration, "brand");
  const campaignStage = getStageStatus(registration, "campaign");
  return (
    <div className="flex flex-col gap-4 border border-foreground/10 rounded-2xl p-5 bg-background shadow-xs">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-foreground/5">
        <div className="flex flex-col gap-0.5">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <span>A2P Carrier Registration Workflow</span>
          </h4>
          <p className="text-xs text-foreground-500">
            Follow these 3 compliance stages to register your brand and send SMS messages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground-500 bg-foreground/5 px-3 py-1.5 rounded-xl border border-foreground/10 flex items-center gap-1.5">
            <FiClock className="w-3.5 h-3.5 text-blue-500" />
            Total Est. Time: <strong className="text-foreground">2–5 Business Days</strong>
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        <div className="flex flex-col justify-between p-4 rounded-xl border border-foreground/10 bg-foreground/5 dark:bg-default-50/40 gap-3 hover:border-blue-500/30 transition-all">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                Step 1
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h5 className="text-sm font-bold text-foreground">Customer Profile</h5>
              <p className="text-xs text-foreground-500">Legal & Business Verification</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-foreground/5">
            <span className="text-[10px] text-foreground-400 font-medium">Stage Status:</span>
            {profileStage.type === "success" && (
              <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                <FiCheckCircle className="w-3.5 h-3.5" /> Approved
              </span>
            )}
            {profileStage.type === "warning" && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                <FiClock className="w-3.5 h-3.5" /> Pending Review
              </span>
            )}
            {profileStage.type === "danger" && (
              <span className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
                <FiAlertTriangle className="w-3.5 h-3.5" /> Rejected
              </span>
            )}
            {profileStage.type === "neutral" && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-foreground-400">
                <span className="w-2 h-2 rounded-full bg-foreground-300" /> Not registered
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-between p-4 rounded-xl border border-foreground/10 bg-foreground/5 dark:bg-default-50/40 gap-3 hover:border-blue-500/30 transition-all">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                Step 2
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h5 className="text-sm font-bold text-foreground">Brand Registration</h5>
              <p className="text-xs text-foreground-500">Messaging Identity & TCR Vetting</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-foreground/5">
            <span className="text-[10px] text-foreground-400 font-medium">Stage Status:</span>
            {brandStage.type === "success" && (
              <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                <FiCheckCircle className="w-3.5 h-3.5" /> Approved
              </span>
            )}
            {brandStage.type === "warning" && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                <FiClock className="w-3.5 h-3.5" /> Pending Review
              </span>
            )}
            {brandStage.type === "danger" && (
              <span className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
                <FiAlertTriangle className="w-3.5 h-3.5" /> Rejected
              </span>
            )}
            {brandStage.type === "neutral" && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-foreground-400">
                <span className="w-2 h-2 rounded-full bg-foreground-300" /> Not registered
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-between p-4 rounded-xl border border-foreground/10 bg-foreground/5 dark:bg-default-50/40 gap-3 hover:border-blue-500/30 transition-all">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                Step 3
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <h5 className="text-sm font-bold text-foreground">Campaign & Numbers</h5>
              <p className="text-xs text-foreground-500">Use Case & Carrier Approval</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-foreground/5">
            <span className="text-[10px] text-foreground-400 font-medium">Stage Status:</span>
            {campaignStage.type === "success" && (
              <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                <FiCheckCircle className="w-3.5 h-3.5" /> Approved
              </span>
            )}
            {campaignStage.type === "warning" && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                <FiClock className="w-3.5 h-3.5" /> Pending Review
              </span>
            )}
            {campaignStage.type === "danger" && (
              <span className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
                <FiAlertTriangle className="w-3.5 h-3.5" /> Rejected
              </span>
            )}
            {campaignStage.type === "neutral" && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-foreground-400">
                <span className="w-2 h-2 rounded-full bg-foreground-300" /> Not registered
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-1 pt-3 border-t border-foreground/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-foreground-500 bg-foreground/5 dark:bg-default-50/20 p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <FiInfo className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span>
            <strong>Required Information Checklist:</strong> IRS Legal Name, 9-Digit EIN, Physical Address, Website, Use Case Description, Sample SMS & Opt-In URLs.
          </span>
        </div>
      </div>
    </div>
  );
}