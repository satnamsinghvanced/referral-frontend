import React from "react";
import { FiSettings } from "react-icons/fi";

interface GeneralTabProps {
  isLight: boolean;
  onToggleTheme: () => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ isLight, onToggleTheme }) => {
  return (
    <div
      className={`rounded-2xl border p-6 sm:p-8 shadow-sm transition-all ${
        isLight
          ? "bg-white border-slate-200/90"
          : "bg-[#0F172A] border-[#1E293B]"
      }`}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <FiSettings className={`text-lg ${isLight ? "text-slate-800" : "text-slate-200"}`} />
        <h2 className={`font-bold text-base sm:text-lg ${isLight ? "text-slate-900" : "text-white"}`}>
          General Settings
        </h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <h3 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
              Dark Mode
            </h3>
            <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Switch to dark theme
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              !isLight ? "bg-[#20a9f8]" : "bg-slate-300"
            }`}
            role="switch"
            aria-checked={!isLight}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                !isLight ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
