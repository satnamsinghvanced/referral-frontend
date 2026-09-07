import React from "react";
import { FiCheck, FiArrowLeft } from "react-icons/fi";
import Logo from "../../../components/ui/Logo";
import AuthThemeToggle from "../../../components/common/AuthThemeToggle";
import { SignupHeaderProps } from "./types";

export const SignupHeader: React.FC<SignupHeaderProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full max-w-5xl flex flex-col items-center relative mb-6">
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
        <AuthThemeToggle />
      </div>

      <div className="h-10 mb-3 flex items-center justify-center">
        <Logo style={{ height: "40px" }} />
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center">
        Start Your <span className="text-blue-600 dark:text-sky-400">14-Day Free Trial</span>
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium text-center">
        Enter your details to get started in minutes. Cancel anytime.
      </p>

      <div className="w-full relative flex flex-col sm:flex-row items-center justify-center mt-6 min-h-[42px]">
        {currentStep === 2 && (
          <div className="sm:absolute left-0 sm:top-1/2 sm:-translate-y-1/2 mb-3 sm:mb-0">
            <button
              type="button"
              onClick={() => onStepClick(1)}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-sky-500 dark:hover:text-sky-400 transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl shadow-sm cursor-pointer"
            >
              <FiArrowLeft className="w-4 h-4 text-sky-500" />
              <span>Back to Details</span>
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 sm:gap-6 select-none flex-wrap">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onStepClick(1)}>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${currentStep === 1 ? "bg-sky-500 text-white" : "bg-emerald-500 text-white"
                }`}
            >
              {currentStep > 1 ? <FiCheck className="text-xs" /> : "1"}
            </div>
            <span className={`text-xs font-bold ${currentStep === 1 ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
              Your Details
            </span>
          </div>
          <div className={`w-8 sm:w-12 h-[2px] ${currentStep >= 2 ? "bg-sky-500" : "bg-slate-300 dark:bg-slate-700"}`} />
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === 2 ? "bg-sky-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
            >
              2
            </div>
            <span className={`text-xs font-bold ${currentStep === 2 ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
              Payment
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

