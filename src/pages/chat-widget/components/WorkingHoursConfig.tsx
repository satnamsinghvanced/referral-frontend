import React, { useState, useRef, useEffect } from "react";
import { Switch } from "@heroui/react";
import { FiChevronDown, FiChevronUp, FiCheck } from "react-icons/fi";

export const TIMEZONE_OPTIONS = [
  "Eastern Time (ET)",
  "Central Time (CT)",
  "Mountain Time (MT)",
  "Pacific Time (PT)",
  "Arizona (MST, no DST)",
  "Alaska Time (AKT)",
  "Hawaii Time (HST)",
];

export const TIME_SLOTS = [
  "12:00 am", "12:30 am",
  "1:00 am", "1:30 am",
  "2:00 am", "2:30 am",
  "3:00 am", "3:30 am",
  "4:00 am", "4:30 am",
  "5:00 am", "5:30 am",
  "6:00 am", "6:30 am",
  "7:00 am", "7:30 am",
  "8:00 am", "8:30 am",
  "9:00 am", "9:30 am",
  "10:00 am", "10:30 am",
  "11:00 am", "11:30 am",
  "12:00 pm", "12:30 pm",
  "1:00 pm", "1:30 pm",
  "2:00 pm", "2:30 pm",
  "3:00 pm", "3:30 pm",
  "4:00 pm", "4:30 pm",
  "5:00 pm", "5:30 pm",
  "6:00 pm", "6:30 pm",
  "7:00 pm", "7:30 pm",
  "8:00 pm", "8:30 pm",
  "9:00 pm", "9:30 pm",
  "10:00 pm", "10:30 pm",
  "11:00 pm", "11:30 pm",
];

export const START_TIME_SLOTS = TIME_SLOTS.slice(0, TIME_SLOTS.length - 1);

export interface DaySchedule {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export const DEFAULT_SCHEDULE: DaySchedule[] = [
  { day: "Mon", enabled: true, startTime: "9:00 am", endTime: "5:00 pm" },
  { day: "Tue", enabled: true, startTime: "9:00 am", endTime: "5:00 pm" },
  { day: "Wed", enabled: true, startTime: "9:00 am", endTime: "5:00 pm" },
  { day: "Thu", enabled: true, startTime: "9:00 am", endTime: "5:00 pm" },
  { day: "Fri", enabled: true, startTime: "9:00 am", endTime: "5:00 pm" },
  { day: "Sat", enabled: false, startTime: "9:00 am", endTime: "5:00 pm" },
  { day: "Sun", enabled: false, startTime: "9:00 am", endTime: "5:00 pm" },
];

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().toLowerCase().split(" ");
  if (parts.length !== 2) return 0;

  const time = parts[0];
  const period = parts[1];
  if (!time || !period) return 0;

  const timeParts = time.split(":");
  if (timeParts.length !== 2) return 0;

  const hoursStr = timeParts[0];
  const minutesStr = timeParts[1];
  if (!hoursStr || !minutesStr) return 0;

  let hours = parseInt(hoursStr, 10) || 0;
  const minutes = parseInt(minutesStr, 10) || 0;

  if (period === "pm" && hours !== 12) {
    hours += 12;
  } else if (period === "am" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  className?: string;
}

function CustomSelect({
  value,
  onChange,
  options,
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer shadow-2xs font-sans h-10 ${isOpen
          ? " ring-2 ring-gray-300/30 border border-gray-300 "
          : "border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/30 dark:border-gray-900/40 bg-white dark:bg-content1 text-gray-500 dark:text-gray-500"
          }`}
      >
        <span className="truncate">{value}</span>
        {isOpen ? (
          <FiChevronUp className="w-4 h-4 shrink-0 transition-transform text-gray-500 dark:text-gray-400" />
        ) : (
          <FiChevronDown className="w-4 h-4 shrink-0 transition-transform text-gray-400 dark:text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-full min-w-[100px] max-h-[300px] overflow-y-auto rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-content1 shadow-lg shadow-gray-300/20 dark:shadow-black/40 p-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-100 font-sans [scrollbar-width:thin]">
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
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer text-left ${isSelected
                  ? "bg-gray-100 text-gray-900 dark:bg-content2 dark:text-white font-semibold"
                  : "hover:bg-gray-100/80 text-gray-700 dark:hover:bg-content2/60 dark:text-gray-300"
                  }`}
              >
                <span className="truncate">{opt}</span>
                {isSelected && (
                  <FiCheck className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface WorkingHoursConfigProps {
  workingHours: boolean;
  setWorkingHours: (val: boolean) => void;
  timezone: string;
  setTimezone: (val: string) => void;
  schedule: DaySchedule[];
  setSchedule: React.Dispatch<React.SetStateAction<DaySchedule[]>>;
}

export default function WorkingHoursConfig({
  workingHours,
  setWorkingHours,
  timezone,
  setTimezone,
  schedule = DEFAULT_SCHEDULE,
  setSchedule,
}: WorkingHoursConfigProps) {

  const toggleDay = (index: number, enabled: boolean) => {
    setSchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, enabled } : item))
    );
  };

  const getEndTimeOptions = (startTimeStr: string): string[] => {
    const startMins = timeToMinutes(startTimeStr);
    const filtered = TIME_SLOTS.filter((slot) => timeToMinutes(slot) > startMins);
    const lastSlot = TIME_SLOTS[TIME_SLOTS.length - 1] || "11:30 pm";
    return filtered.length > 0 ? filtered : [lastSlot];
  };

  const updateStartTime = (index: number, newStartTime: string) => {
    setSchedule((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        const newStartMins = timeToMinutes(newStartTime);
        const currentEndMins = timeToMinutes(item.endTime);

        let nextEndTime = item.endTime;
        if (currentEndMins <= newStartMins) {
          const validOptions = TIME_SLOTS.filter((slot) => timeToMinutes(slot) > newStartMins);
          if (validOptions.length > 0 && validOptions[0]) {
            nextEndTime = validOptions[0];
          }
        }

        return { ...item, startTime: newStartTime, endTime: nextEndTime };
      })
    );
  };

  const updateEndTime = (index: number, endTime: string) => {
    setSchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, endTime } : item))
    );
  };

  const applyPreset = (presetType: "mon-fri" | "mon-sat" | "7days") => {
    setSchedule((prev) =>
      prev.map((item) => {
        if (presetType === "mon-fri") {
          const isMonFri = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(item.day);
          return {
            ...item,
            enabled: isMonFri,
            startTime: "9:00 am",
            endTime: "5:00 pm"
          };
        } else if (presetType === "mon-sat") {
          const isMonSat = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].includes(item.day);
          return {
            ...item,
            enabled: isMonSat,
            startTime: "8:00 am",
            endTime: "6:00 pm"
          };
        } else {
          return {
            ...item,
            enabled: true,
            startTime: "8:00 am",
            endTime: "5:00 pm"
          };
        }
      })
    );
  };

  return (
    <div className={`border rounded-xl p-4 transition-all duration-200 ${workingHours ? "border-purple-200/80 bg-purple-50/30 dark:border-purple-500/20 dark:bg-purple-950/20" : "border-foreground/10 bg-transparent"}`}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-default-700 font-sans">Working Hours</span>
          <span className="text-[10px] text-default-500 font-sans font-light">Set your availability schedule</span>
        </div>
        <Switch
          isSelected={workingHours}
          onValueChange={setWorkingHours}
          size="sm"
          classNames={{
            wrapper: "group-data-[selected=true]:bg-[#20a9f8] dark:group-data-[selected=true]:bg-[#20a9f8]"
          }}
        />
      </div>

      {workingHours && (
        <div className="mt-4 space-y-4 border-t border-purple-100 dark:border-purple-900/30 pt-4 animate-in slide-in-from-top-2 duration-200">
          {/* TIMEZONE */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-purple-400 dark:text-purple-400 tracking-wider uppercase font-sans">
              TIMEZONE
            </label>
            <CustomSelect
              value={timezone}
              onChange={setTimezone}
              options={TIMEZONE_OPTIONS}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-purple-400 dark:text-purple-400 tracking-wider uppercase font-sans">
              SCHEDULE
            </label>
            <div className="space-y-2">
              {schedule.map((item, index) => {
                const endTimeOptions = getEndTimeOptions(item.startTime);
                return (
                  <div
                    key={item.day}
                    className="bg-white dark:bg-content1/80 border border-purple-100/80 dark:border-purple-900/40 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-2xs transition-colors"
                  >
                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 w-full">
                      <div className="flex items-center gap-2.5 min-w-[85px]">
                        <Switch
                          isSelected={item.enabled}
                          onValueChange={(val) => toggleDay(index, val)}
                          size="sm"
                          classNames={{
                            wrapper: "group-data-[selected=true]:bg-purple-400 dark:group-data-[selected=true]:bg-purple-400"
                          }}
                        />
                        <span className={`text-xs font-medium font-sans ${item.enabled ? "text-default-700 dark:text-purple-100" : "text-default-400"}`}>
                          {item.day}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        {item.enabled ? (
                          <>
                            <CustomSelect
                              value={item.startTime}
                              onChange={(val) => updateStartTime(index, val)}
                              options={START_TIME_SLOTS}
                              className="w-28 sm:w-32"
                            />
                            <span className="text-xs text-default-400 font-normal font-sans px-0.5">to</span>
                            <CustomSelect
                              value={item.endTime}
                              onChange={(val) => updateEndTime(index, val)}
                              options={endTimeOptions}
                              className="w-28 sm:w-32"
                            />
                          </>
                        ) : (
                          <span className="text-xs text-default-400 italic font-sans font-light pr-2">
                            Closed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QUICK PRESETS */}
          <div className="space-y-2 pt-1">
            <label className="text-[11px] font-bold text-purple-500 dark:text-purple-400 tracking-wider uppercase font-sans">
              QUICK PRESETS
            </label>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => applyPreset("mon-fri")}
                className="rounded-full px-4 py-1.5 text-xs font-semibold bg-[#f5f0ff] hover:bg-[#ebd9ff] text-[#9333ea] dark:bg-purple-950/40 dark:hover:bg-purple-900/60 dark:text-purple-300 border border-[#e9d8fd] dark:border-purple-800 transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 font-sans"
              >
                Mon–Fri 9–5
              </button>
              <button
                type="button"
                onClick={() => applyPreset("mon-sat")}
                className="rounded-full px-4 py-1.5 text-xs font-semibold bg-[#f5f0ff] hover:bg-[#ebd9ff] text-[#9333ea] dark:bg-purple-950/40 dark:hover:bg-purple-900/60 dark:text-purple-300 border border-[#e9d8fd] dark:border-purple-800 transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 font-sans"
              >
                Mon–Sat 8–6
              </button>
              <button
                type="button"
                onClick={() => applyPreset("7days")}
                className="rounded-full px-4 py-1.5 text-xs font-semibold bg-[#f5f0ff] hover:bg-[#ebd9ff] text-[#9333ea] dark:bg-purple-950/40 dark:hover:bg-purple-900/60 dark:text-purple-300 border border-[#e9d8fd] dark:border-purple-800 transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 font-sans"
              >
                7 Days 8–5
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
