import React from "react";
import { FiCheck, FiArrowLeft } from "react-icons/fi";
import Logo from "../../../components/ui/Logo";
import AuthThemeToggle from "../../../components/common/AuthThemeToggle";
import { SignupHeaderProps } from "./types";

export const SignupHeader: React.FC<SignupHeaderProps> = ({
  currentStep = 1,
  onStepClick,
  title,
  subtitle,
  isTwilioCredits = false,
  isUpgrade = false,
  hideStepper = false,
  showThemeToggle = false,
  showBackButton = false,
  onBackClick,
  backButtonText,
}) => {
  const steps = isUpgrade
    ? [
        { number: 1, label: "Choose Plan" },
        { number: 2, label: "Payment" },
      ]
    : [
        { number: 1, label: "Choose Plan" },
        { number: 2, label: "Your Details" },
        { number: 3, label: "Payment" },
      ];

  const defaultTitle = isTwilioCredits ? (
    <>
      Add <span className="text-[#20a9f8]">Twilio Credits</span>
    </>
  ) : isUpgrade ? (
    currentStep === 1 ? (
      <>
        Upgrade Your <span className="text-[#20a9f8] dark:text-sky-400">Subscription Plan</span>
      </>
    ) : (
      <>
        Confirm Payment & <span className="text-[#20a9f8] dark:text-sky-400">Upgrade</span>
      </>
    )
  ) : currentStep === 1 ? (
    <>
      Simple, Transparent <span className="text-[#20a9f8] dark:text-sky-400">Pricing</span>
    </>
  ) : currentStep === 3 ? (
    <>
      Complete Your <span className="text-[#20a9f8] dark:text-sky-400">Subscription</span>
    </>
  ) : (
    <>
      Start Your <span className="text-[#20a9f8] dark:text-sky-400">14-Day Free Trial</span>
    </>
  );

  const defaultSubtitle = isTwilioCredits
    ? "Complete your payment details to add credits and minutes immediately."
    : isUpgrade
      ? currentStep === 1
        ? "Choose the plan that's right for your practice. Upgrade or change plans anytime."
        : "Complete payment details to activate your new plan."
      : currentStep === 1
        ? "Choose the plan that's right for your practice. All plans include a 14-day free trial with no credit card required."
        : currentStep === 2
          ? "Enter your details to get started in minutes. Cancel anytime."
          : "Complete your payment details to start your free trial. Cancel anytime.";
  return (
    <div className="w-full max-w-5xl flex flex-col items-center relative mb-6">
      {showThemeToggle && (
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
          <AuthThemeToggle />
        </div>
      )}
      <div className="h-10 mb-3 flex items-center justify-center">
        <Logo style={{ height: "40px" }} />
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center">
        {title || defaultTitle}
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium text-center">
        {subtitle || defaultSubtitle}
      </p>
      {!hideStepper && !isTwilioCredits && (
        <div className="w-full relative flex flex-col sm:flex-row items-center justify-center mt-6 min-h-[42px]">
          {showBackButton && onBackClick && (
            <div className="sm:absolute left-0 sm:top-1/2 sm:-translate-y-1/2 mb-3 sm:mb-0">
              <button
                type="button"
                onClick={onBackClick}
                className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-sky-500 dark:hover:text-sky-400 transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl shadow-sm cursor-pointer"
              >
                <FiArrowLeft className="w-4 h-4 text-sky-500" />
                <span>{backButtonText || (currentStep === 3 ? "Back to Details" : "Back to Choose Plan")}</span>
              </button>
            </div>
          )}
          <div className="flex items-center justify-center gap-3 sm:gap-6 select-none flex-wrap">
            {steps.map((step, idx) => {
              const isCompleted = currentStep > step.number;
              const isActive = currentStep === step.number;
              const isClickable = !!onStepClick && step.number <= currentStep;
              return (
                <React.Fragment key={step.number}>
                  <div
                    className={`flex items-center gap-2 ${isClickable ? "cursor-pointer" : ""
                      }`}
                    onClick={() => isClickable && onStepClick && onStepClick(step.number)}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isCompleted
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? "bg-sky-500 text-white shadow-sm"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                    >
                      {isCompleted ? <FiCheck className="text-xs" /> : step.number}
                    </div>
                    <span
                      className={`text-xs font-bold ${isActive
                        ? "text-slate-900 dark:text-white"
                        : isCompleted
                          ? "text-slate-500 dark:text-slate-400"
                          : "text-slate-400 dark:text-slate-500"
                        }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-8 sm:w-12 h-[2px] transition-all ${currentStep > step.number
                        ? "bg-emerald-500"
                        : currentStep === step.number + 1
                          ? "bg-sky-500"
                          : "bg-slate-300 dark:bg-slate-700"
                        }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};