import { FiInfo, FiClock, FiCheckCircle, FiAlertTriangle, FiCheckSquare } from "react-icons/fi";
import { Spinner } from "@heroui/react";
import { A2PRegistrationData, PhoneNumber } from "./types";
import { parseAndMapRejectionReason } from "../../../../utils/a2pRejectionMapper";

interface A2PStatusBannerProps {
  registration: A2PRegistrationData | null;
  phoneNumbers: PhoneNumber[];
  isA2PConfigLoading: boolean;
}

export default function A2PStatusBanner({ registration, phoneNumbers, isA2PConfigLoading, }: A2PStatusBannerProps) {
  if (isA2PConfigLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Spinner size="sm" label="Fetching A2P status..." />
      </div>
    );
  }

  if (!registration) {
    return (
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
    );
  }

  if (registration.status === "pending") {
    return (
      <div className="border border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/10 rounded-2xl p-5 flex gap-3 items-start">
        <FiClock className="w-5 h-5 text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">
            Registration Under Review
          </h4>
          <div className="flex flex-col gap-1.5 text-xs text-amber-700 dark:text-amber-400/90 leading-relaxed">
            <p>
              Your A2P registration for{" "}
              <span className="font-bold text-amber-900 dark:text-amber-200">
                "{registration.campaignName || "Patient Communication & Appointment Reminders"}"
              </span>{" "}
              is currently under review for phone service.
            </p>
            <p>
              This is under review for phone service. It will take 1-2 days. You'll receive an email notification when your registration is approved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (registration.status === "approved") {
    return (
      <div className="border border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-950/10 rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex gap-3 items-start">
          <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-bold text-green-800 dark:text-green-300">
              SMS Messaging Enabled
            </h4>
            <p className="text-xs text-green-700 dark:text-green-400/90 leading-relaxed">
              Your campaign{" "}
              <span className="font-bold text-green-800 dark:text-green-200">
                "{registration.campaignName || "Patient Communication & Appointment Reminders"}"
              </span>{" "}
              is approved and ready for SMS messaging.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white dark:bg-zinc-900 border border-green-200/60 dark:border-green-900/30 p-3.5 rounded-xl flex flex-col gap-1.5">
            <span className="text-[10px] text-foreground-500 font-semibold leading-none">
              Campaign Status
            </span>
            <span className="text-xs font-bold text-green-600 dark:text-green-400 leading-none">
              Active
            </span>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-green-200/60 dark:border-green-900/30 p-3.5 rounded-xl flex flex-col gap-1.5">
            <span className="text-[10px] text-foreground-500 font-semibold leading-none">
              Registered Numbers
            </span>
            <span className="text-xs font-bold text-foreground leading-none">
              {registration.selectedNumbers?.length || 0}
            </span>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-green-200/60 dark:border-green-900/30 p-3.5 rounded-xl flex flex-col gap-1.5">
            <span className="text-[10px] text-foreground-500 font-semibold leading-none">
              Daily Limit
            </span>
            <span className="text-xs font-bold text-green-600 dark:text-green-400 leading-none">
              {registration?.ein ? "6,000 msgs/day" : "1,000 msgs/day"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const parseResult = parseAndMapRejectionReason(registration.rejectionReason);
  return (
    <div className="border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 rounded-2xl p-6 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-200/60 dark:border-red-900/40 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5">
            <FiAlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-red-800 dark:text-red-300">
                A2P SMS Registration Rejected
              </h4>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-red-600/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 uppercase tracking-wider">
                Action Required
              </span>
            </div>
            <p className="text-xs text-red-700/80 dark:text-red-300/80 leading-relaxed font-medium">
              Registration review was not approved. Review the specific feedback below and resubmit with verified information.
            </p>
          </div>
        </div>
      </div>

      {parseResult.hasSpecificReason ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3.5">
            {parseResult.reasons.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-3 bg-white dark:bg-zinc-900 border border-red-200/80 dark:border-red-900/40 p-4 rounded-xl shadow-xs"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
                    <span className="text-sm font-bold text-red-800 dark:text-red-300">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 font-bold uppercase tracking-wider border border-red-200 dark:border-red-900/40">
                    ACTION REQUIRED
                  </span>
                </div>

                <div className="ml-4 bg-red-50/80 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40 p-3 rounded-lg flex flex-col gap-1">
                  <span className="text-xs font-bold text-red-900 dark:text-red-200">
                    Reason for rejection:{" "}
                    <span className="font-normal text-red-800 dark:text-red-300">
                      {item.specificMessage}
                    </span>
                  </span>
                </div>

                <div className="ml-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 p-3 rounded-lg flex items-start gap-2.5">
                  <FiCheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                    <span className="font-bold text-amber-950 dark:text-amber-100">
                      Fix Requirement:
                    </span>{" "}
                    {item.actionableTip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 p-4 rounded-xl flex flex-col gap-1.5">
            <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <FiInfo className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Possible reasons (exact cause not specified)
            </h5>
            <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed font-medium">
              The verification system did not specify an exact failure cause. Please review the guidance checklist below to ensure your business details match official records before re-submitting:
            </p>
          </div>

          <div className="bg-white/60 dark:bg-zinc-900/60 border border-red-200/60 dark:border-red-900/30 rounded-xl p-4 flex flex-col gap-2">
            <h5 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <FiCheckCircle className="w-4 h-4 text-red-500" />
              General Guidance Checklist (Check before Re-submitting):
            </h5>
            <ul className="text-xs text-foreground-500 list-disc pl-5 space-y-1.5 font-medium">
              <li>
                <strong className="text-foreground-700 dark:text-foreground-200">
                  Exact Business Name:
                </strong>{" "}
                Must match your official IRS tax document (W-9 or CP575 notice) including suffixes like LLC, Inc.
              </li>
              <li>
                <strong className="text-foreground-700 dark:text-foreground-200">
                  Active 9-Digit EIN:
                </strong>{" "}
                Must be typed without dashes or spaces and belong to the legal business name.
              </li>
              <li>
                <strong className="text-foreground-700 dark:text-foreground-200">
                  Physical Business Address:
                </strong>{" "}
                Must match official state/IRS tax filings (no P.O. Box).
              </li>
              <li>
                <strong className="text-foreground-700 dark:text-foreground-200">
                  Authorized Representative:
                </strong>{" "}
                Must be a company officer with valid full name, business email, and direct phone.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
