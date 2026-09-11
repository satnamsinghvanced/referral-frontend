import React from "react";
import { FiDollarSign, FiPlus } from "react-icons/fi";

interface PlansHeaderProps {
  isLight: boolean;
  onOpenModal: () => void;
}

export const PlansHeader: React.FC<PlansHeaderProps> = ({ isLight, onOpenModal }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
      <div>
        <h1 className={`text-2xl font-extrabold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
          <FiDollarSign className="text-[#20a9f8]" />
          <span>Subscription Plans & Features</span>
        </h1>
        <p className={`text-xs mt-1 font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
          Manage monthly and annual plan prices, discounts, and cycle-specific feature lists.
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenModal}
        className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#20a9f8]/20 flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto shrink-0"
      >
        <FiPlus className="text-base" />
        <span>Add New Plan</span>
      </button>
    </div>
  );
};

export default PlansHeader;
