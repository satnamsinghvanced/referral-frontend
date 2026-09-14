import React from "react";

interface PlanCycleToggleProps {
  activeCycle: "monthly" | "yearly";
  onCycleChange: (cycle: "monthly" | "yearly") => void;
  isLight: boolean;
}

export const PlanCycleToggle: React.FC<PlanCycleToggleProps> = ({ activeCycle, onCycleChange, isLight }) => {
  return (
    <div className="flex items-center justify-center my-4 pb-4">
      <div
        className={`p-1.5 rounded-full flex items-center gap-1.5 border shadow-sm ${isLight
          ? "bg-slate-100/90 border-slate-200"
          : "bg-[#111A2E] border-[#1E2B45]"
          }`}
      >
        <button
          type="button"
          onClick={() => onCycleChange("monthly")}
          className={`w-40 h-10  rounded-full text-xs    font-extrabold transition-all cursor-pointer ${activeCycle === "monthly"
            ? "bg-[#20a9f8] text-white shadow-md shadow-[#20a9f8]/25"
            : isLight
              ? "text-slate-600 hover:text-slate-900"
              : "text-slate-400 hover:text-white"
            }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => onCycleChange("yearly")}
          className={`w-40 h-10 rounded-full text-xs font-extrabold transition-all cursor-pointer ${activeCycle === "yearly"
            ? "bg-[#20a9f8] text-white shadow-md shadow-[#20a9f8]/25"
            : isLight
              ? "text-slate-600 hover:text-slate-900"
              : "text-slate-400 hover:text-white"
            }`}
        >
          Annual
        </button>
      </div>
    </div>
  );
};

export default PlanCycleToggle;
