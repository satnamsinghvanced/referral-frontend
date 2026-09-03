import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiChevronUp, FiCheck } from "react-icons/fi";

interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  isLight: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  onChange,
  isLight,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-44 sm:w-52" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer shadow-sm ${
          isLight
            ? "bg-slate-100 hover:bg-slate-200/80 border-slate-300 text-slate-800"
            : "bg-[#111A2E] hover:bg-[#1A2642] border-[#1E2B45] text-slate-200"
        }`}
      >
        <span className="truncate">{value}</span>
        {isOpen ? (
          <FiChevronUp className="text-slate-500 text-base shrink-0 ml-1" />
        ) : (
          <FiChevronDown className="text-slate-500 text-base shrink-0 ml-1" />
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 top-full mt-2 w-full min-w-[210px] rounded-2xl border shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100 ${
            isLight
              ? "bg-white border-slate-200/90 text-slate-800 shadow-slate-300/50"
              : "bg-[#0F172A] border-[#1E293B] text-slate-100 shadow-black/60"
          }`}
        >
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer text-left ${
                  isSelected
                    ? isLight
                      ? "bg-slate-200/80 text-slate-900 font-bold"
                      : "bg-slate-800 text-white font-bold"
                    : isLight
                    ? "hover:bg-slate-100 text-slate-700"
                    : "hover:bg-slate-800/60 text-slate-300"
                }`}
              >
                <span>{opt}</span>
                {isSelected && (
                  <FiCheck className="text-sm text-blue-600 dark:text-sky-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
