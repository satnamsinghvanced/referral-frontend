import React from "react";
import { StatsSummary } from "../types";
import {
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiDollarSign,
} from "react-icons/fi";

interface StatsCardsProps {
  stats: StatsSummary;
  isLight: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLight }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
      <div
        className={`border rounded-xl p-4 shadow-sm transition-all ${
          isLight
            ? "bg-white border-slate-200/90 hover:shadow-md"
            : "bg-[#0F172A] border-[#1E293B] shadow-lg hover:border-slate-700"
        }`}
      >
        <div
          className={`flex items-center gap-1.5 text-xs font-semibold ${
            isLight ? "text-slate-500" : "text-slate-400"
          }`}
        >
          <FiUsers className="text-sm" />
          <span>Total Clients</span>
        </div>
        <div
          className={`text-2xl sm:text-3xl font-bold mt-2 ${
            isLight ? "text-slate-900" : "text-white"
          }`}
        >
          {stats.total}
        </div>
      </div>

      <div
        className={`border rounded-xl p-4 shadow-sm transition-all ${
          isLight
            ? "bg-white border-slate-200/90 hover:shadow-md"
            : "bg-[#0F172A] border-[#1E293B] shadow-lg hover:border-slate-700"
        }`}
      >
        <div
          className={`flex items-center gap-1.5 text-xs font-semibold ${
            isLight ? "text-slate-500" : "text-slate-400"
          }`}
        >
          <FiCheckCircle className="text-emerald-500 text-sm" />
          <span>Active</span>
        </div>
        <div
          className={`text-2xl sm:text-3xl font-bold mt-2 ${
            isLight ? "text-emerald-600" : "text-emerald-400"
          }`}
        >
          {stats.active}
        </div>
      </div>

      <div
        className={`border rounded-xl p-4 shadow-sm transition-all ${
          isLight
            ? "bg-white border-slate-200/90 hover:shadow-md"
            : "bg-[#0F172A] border-[#1E293B] shadow-lg hover:border-slate-700"
        }`}
      >
        <div
          className={`flex items-center gap-1.5 text-xs font-semibold ${
            isLight ? "text-slate-500" : "text-slate-400"
          }`}
        >
          <FiClock className="text-blue-500 text-sm" />
          <span>Trials</span>
        </div>
        <div
          className={`text-2xl sm:text-3xl font-bold mt-2 ${
            isLight ? "text-blue-600" : "text-blue-400"
          }`}
        >
          {stats.trials}
        </div>
      </div>

      <div
        className={`border rounded-xl p-4 shadow-sm transition-all ${
          isLight
            ? "bg-white border-slate-200/90 hover:shadow-md"
            : "bg-[#0F172A] border-[#1E293B] shadow-lg hover:border-slate-700"
        }`}
      >
        <div
          className={`flex items-center gap-1.5 text-xs font-semibold ${
            isLight ? "text-slate-500" : "text-slate-400"
          }`}
        >
          <FiAlertTriangle className="text-amber-500 text-sm" />
          <span>At Risk</span>
        </div>
        <div
          className={`text-2xl sm:text-3xl font-bold mt-2 ${
            isLight ? "text-amber-600" : "text-amber-400"
          }`}
        >
          {stats.atRisk}
        </div>
      </div>

      <div
        className={`border rounded-xl p-4 shadow-sm transition-all ${
          isLight
            ? "bg-white border-slate-200/90 hover:shadow-md"
            : "bg-[#0F172A] border-[#1E293B] shadow-lg hover:border-slate-700"
        }`}
      >
        <div
          className={`flex items-center gap-1.5 text-xs font-semibold ${
            isLight ? "text-slate-500" : "text-slate-400"
          }`}
        >
          <FiDollarSign className="text-emerald-500 text-sm" />
          <span>MRR</span>
        </div>
        <div
          className={`text-2xl sm:text-3xl font-bold mt-2 ${
            isLight ? "text-emerald-600" : "text-emerald-400"
          }`}
        >
          ${stats.mrr}
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
