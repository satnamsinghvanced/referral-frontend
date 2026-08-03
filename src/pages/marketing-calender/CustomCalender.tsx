import React, { useState, useMemo, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight, FiX, FiClock, FiMaximize2, FiMinimize2, FiEdit3, FiTrash2 } from "react-icons/fi";
import clsx from "clsx";
import { Button, Select, SelectItem } from "@heroui/react";
import { ACTIVITY_TYPES } from "../../consts/marketing";

interface CalendarProps {
  weekendDisabled?: boolean;
  disablePastDates?: boolean;
  onDayClick?: (date: string) => void;
  onActivityClick?: (activity: any) => void;
  onActivityEdit?: (activity: any) => void;
  onActivityDelete?: (activity: any) => void;
  onRangeSelect?: (startDate: Date, endDate: Date) => void;
  activities: any[];
}

type ViewMode = "day" | "week" | "month" | "year";

interface EventLayoutInfo {
  activity: any;
  topPx: number;
  heightPx: number;
  leftPercent: number;
  widthPercent: number;
  timeRangeStr: string;
  actColor: string;
}

const getActivitiesWithSlots = (
  activities: any[],
  year: number,
  month: number
) => {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  const slots: Record<string, (any | null)[]> = {};
  const activeAssignments: Record<string, number> = {};
  days.forEach((dayDate) => {
    const dateKey = `${dayDate.getFullYear()}-${String(
      dayDate.getMonth() + 1
    ).padStart(2, "0")}-${String(dayDate.getDate()).padStart(2, "0")}`;
    const dayActivities = activities.filter((a) => {
      const start = new Date(a.startDate);
      start.setHours(0, 0, 0, 0);
      const end = a.endDate ? new Date(a.endDate) : new Date(start);
      end.setHours(0, 0, 0, 0);
      const current = new Date(dayDate);
      current.setHours(0, 0, 0, 0);
      return (
        current.getTime() >= start.getTime() &&
        current.getTime() <= end.getTime()
      );
    });
    Object.keys(activeAssignments).forEach((id) => {
      if (!dayActivities.find((a) => a._id === id)) {
        delete activeAssignments[id];
      }
    });
    dayActivities.sort((a, b) => {
      const slotA = activeAssignments[a._id];
      const slotB = activeAssignments[b._id];
      if (slotA !== undefined && slotB !== undefined) return slotA - slotB;
      if (slotA !== undefined) return -1;
      if (slotB !== undefined) return 1;
      const durA =
        new Date(a.endDate || a.startDate).getTime() -
        new Date(a.startDate).getTime();
      const durB =
        new Date(b.endDate || b.startDate).getTime() -
        new Date(b.startDate).getTime();
      return durB - durA;
    });
    const currentSlots: (any | null)[] = [];
    const usedSlots = new Set(Object.values(activeAssignments));
    dayActivities.forEach((card) => {
      if (activeAssignments[card._id] === undefined) {
        let s = 0;
        while (usedSlots.has(s)) s++;
        activeAssignments[card._id] = s;
        usedSlots.add(s);
      }
      const slot = activeAssignments[card._id]!;
      while (currentSlots.length <= slot) currentSlots.push(null);
      currentSlots[slot] = card;
    });
    slots[dateKey] = currentSlots;
  });
  return slots;
};

const isPastDate = (year: number, month: number, day: number, today: Date) => {
  const currentDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const checkDay = new Date(year, month, day);
  return checkDay.getTime() < currentDay.getTime();
};

const getGmtOffset = () => {
  const offset = -new Date().getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? "+" : "-";
  return `GMT${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const daysOfWeekShort = ["S", "M", "T", "W", "T", "F", "S"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const hoursList = Array.from({ length: 23 }, (_, i) => i + 1);

const CustomCalendar: React.FC<CalendarProps> = ({
  weekendDisabled = false,
  disablePastDates = false,
  onDayClick,
  onActivityClick,
  onActivityEdit,
  onActivityDelete,
  onRangeSelect,
  activities,
}) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [dragEnd, setDragEnd] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [timeDragStart, setTimeDragStart] = useState<{
    date: Date;
    hour: number;
  } | null>(null);
  const [timeDragEnd, setTimeDragEnd] = useState<{
    date: Date;
    hour: number;
  } | null>(null);
  const [isTimeDragging, setIsTimeDragging] = useState(false);

  const [yearViewPopover, setYearViewPopover] = useState<{
    date: Date;
    activities: any[];
    x: number;
    y: number;
  } | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [mobileMonthIndex, setMobileMonthIndex] = useState<number>(currentDate.getMonth());
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    setMobileMonthIndex(currentDate.getMonth());
  }, [currentDate]);

  const handleMobileMonthPrev = () => {
    if (mobileMonthIndex > 0) {
      setMobileMonthIndex(mobileMonthIndex - 1);
    } else {
      setMobileMonthIndex(11);
      setCurrentDate(new Date(currentYear - 1, 11, 1));
    }
  };

  const handleMobileMonthNext = () => {
    if (mobileMonthIndex < 11) {
      setMobileMonthIndex(mobileMonthIndex + 1);
    } else {
      setMobileMonthIndex(0);
      setCurrentDate(new Date(currentYear + 1, 0, 1));
    }
  };

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setYearViewPopover(null);
      }
    };
    if (yearViewPopover) {
      window.addEventListener("mousedown", handleGlobalClick);
    }
    return () => window.removeEventListener("mousedown", handleGlobalClick);
  }, [yearViewPopover]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMaximized) {
        setIsMaximized(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMaximized]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging && dragStart && dragEnd) {
        setIsDragging(false);
        const startMs = dragStart.getTime();
        const endMs = dragEnd.getTime();
        const minMs = Math.min(startMs, endMs);
        const maxMs = Math.max(startMs, endMs);

        const start = new Date(minMs);
        const end = new Date(maxMs);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 0, 0);

        const dateActs = getActivitiesForDateObj(start);
        const isSingleClickOnActiveDateInYearView =
          viewMode === "year" && startMs === endMs && dateActs.length > 0;

        if (!isSingleClickOnActiveDateInYearView) {
          onRangeSelect?.(start, end);
        }

        setDragStart(null);
        setDragEnd(null);
      }

      if (isTimeDragging && timeDragStart && timeDragEnd) {
        setIsTimeDragging(false);

        const start = new Date(timeDragStart.date);
        start.setHours(timeDragStart.hour, 0, 0, 0);

        const end = new Date(timeDragEnd.date);
        end.setHours(timeDragEnd.hour, 0, 0, 0);

        if (start.getTime() > end.getTime()) {
          onRangeSelect?.(end, start);
        } else {
          onRangeSelect?.(start, end);
        }

        setTimeDragStart(null);
        setTimeDragEnd(null);
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [
    isDragging,
    dragStart,
    dragEnd,
    isTimeDragging,
    timeDragStart,
    timeDragEnd,
    onRangeSelect,
  ]);

  const handleTimeDragStart = (date: Date, hour: number) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    setTimeDragStart({ date: d, hour });
    setTimeDragEnd({ date: d, hour });
    setIsTimeDragging(true);
  };

  const handleTimeDragEnter = (date: Date, hour: number) => {
    if (isTimeDragging) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      setTimeDragEnd({ date: d, hour });
    }
  };

  const isSlotSelected = (date: Date, hour: number) => {
    if (!isTimeDragging || !timeDragStart || !timeDragEnd) return false;
    const minDay = Math.min(
      timeDragStart.date.getTime(),
      timeDragEnd.date.getTime()
    );
    const maxDay = Math.max(
      timeDragStart.date.getTime(),
      timeDragEnd.date.getTime()
    );
    const curDay = new Date(date).setHours(0, 0, 0, 0);
    if (curDay < minDay || curDay > maxDay) return false;

    const minHour = Math.min(timeDragStart.hour, timeDragEnd.hour);
    const maxHour = Math.max(timeDragStart.hour, timeDragEnd.hour);
    return hour >= minHour && hour <= maxHour;
  };

  const activitiesMap = useMemo(
    () => getActivitiesWithSlots(activities, currentYear, currentMonth),
    [activities, currentYear, currentMonth]
  );

  const handleNavigate = (direction: "prev" | "next") => {
    const step = direction === "prev" ? -1 : 1;
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + step);
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + step * 7);
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + step);
    } else if (viewMode === "year") {
      newDate.setFullYear(newDate.getFullYear() + step);
    }
    setCurrentDate(newDate);
    setYearViewPopover(null);
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const todayKey = `${year}-${month}-${day}`;
    setSelectedDateKey(todayKey);
    setYearViewPopover(null);
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    onDayClick?.(start.toISOString());
  };

  const getActivitiesForDateObj = (dateObj: Date) => {
    const target = new Date(dateObj);
    target.setHours(0, 0, 0, 0);
    return activities.filter((a) => {
      if (!a.startDate) return false;
      const start = new Date(a.startDate);
      start.setHours(0, 0, 0, 0);
      const end = a.endDate ? new Date(a.endDate) : new Date(start);
      end.setHours(0, 0, 0, 0);
      return (
        target.getTime() >= start.getTime() && target.getTime() <= end.getTime()
      );
    });
  };

  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    start.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const getHeaderTitle = () => {
    if (viewMode === "day") {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    if (viewMode === "week") {
      const start = weekDays[0] || currentDate;
      const end = weekDays[6] || currentDate;
      const startMonth = start.toLocaleDateString("en-US", { month: "short" });
      const endMonth = end.toLocaleDateString("en-US", { month: "short" });
      if (startMonth === endMonth) {
        return `${startMonth} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
      }
      return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
    }
    if (viewMode === "year") {
      return `${currentYear}`;
    }
    return `${monthNames[currentMonth]} ${currentYear}`;
  };

  const isInDragRange = (date: Date) => {
    if (!isDragging || !dragStart || !dragEnd) return false;
    const start = Math.min(dragStart.getTime(), dragEnd.getTime());
    const end = Math.max(dragStart.getTime(), dragEnd.getTime());
    const current = date.getTime();
    return current >= start && current <= end;
  };

  const handleDragStart = (date: Date) => {
    setDragStart(date);
    setDragEnd(date);
    setIsDragging(true);
  };

  const handleDragEnter = (date: Date) => {
    if (isDragging) {
      setDragEnd(date);
    }
  };

  const formatEventTime = (isoString: string) => {
    const d = new Date(isoString);
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minStr = minutes > 0 ? `:${String(minutes).padStart(2, "0")}` : "";
    return `${hours}${minStr}${ampm}`;
  };

  const formatEventTimeRange = (startDateStr: string, endDateStr?: string) => {
    const startStr = formatEventTime(startDateStr);
    if (!endDateStr) return startStr;
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (isNaN(end.getTime())) return startStr;
    if (start.getTime() === end.getTime()) return startStr;
    const endStr = formatEventTime(endDateStr);
    return `${startStr} – ${endStr}`;
  };

  const computeOverlappingEventsLayout = (
    dayActivities: any[]
  ): EventLayoutInfo[] => {
    if (!dayActivities || dayActivities.length === 0) return [];

    const items = dayActivities.map((act) => {
      const actStart = new Date(act.startDate);
      const actEnd = act.endDate ? new Date(act.endDate) : actStart;
      let startHourFloat = actStart.getHours() + actStart.getMinutes() / 60;
      if (startHourFloat < 1) startHourFloat = 1;
      let endHourFloat = actEnd.getHours() + actEnd.getMinutes() / 60;
      if (actEnd.getDate() !== actStart.getDate()) {
        endHourFloat = 24;
      }
      if (endHourFloat <= startHourFloat) {
        endHourFloat = startHourFloat + 1;
      }

      const durationHours = Math.max(0.5, endHourFloat - startHourFloat);
      const topPx = Math.max(2, (startHourFloat - 1) * 48);
      const heightPx = Math.max(28, durationHours * 48 - 4);
      const actColor =
        ACTIVITY_TYPES.find((t) => t.value === act.type)?.color.value || "#0284c7";
      const timeRangeStr = formatEventTimeRange(act.startDate, act.endDate);

      return {
        activity: act,
        startFloat: startHourFloat,
        endFloat: endHourFloat,
        topPx,
        heightPx,
        actColor,
        timeRangeStr,
        colIndex: 0,
        totalCols: 1,
      };
    });

    items.sort((a, b) => {
      if (a.startFloat !== b.startFloat) return a.startFloat - b.startFloat;
      return (b.endFloat - b.startFloat) - (a.endFloat - a.startFloat);
    });

    const columns: (typeof items)[] = [];

    items.forEach((item) => {
      let placed = false;
      for (let c = 0; c < columns.length; c++) {
        const col = columns[c];
        if (col && col.length > 0) {
          const lastInCol = col[col.length - 1];
          if (lastInCol && lastInCol.endFloat <= item.startFloat) {
            col.push(item);
            item.colIndex = c;
            placed = true;
            break;
          }
        }
      }
      if (!placed) {
        item.colIndex = columns.length;
        columns.push([item]);
      }
    });

    items.forEach((item) => {
      const overlapping = items.filter(
        (other) =>
          other.startFloat < item.endFloat && other.endFloat > item.startFloat
      );
      const maxColIndex = Math.max(...overlapping.map((o) => o.colIndex));
      item.totalCols = Math.max(columns.length, maxColIndex + 1);
    });

    return items.map((item) => {
      const widthPercent = (100 / item.totalCols) * 0.92;
      const leftPercent = item.colIndex * (100 / item.totalCols) * 0.92;
      return {
        activity: item.activity,
        topPx: item.topPx,
        heightPx: item.heightPx,
        leftPercent,
        widthPercent,
        timeRangeStr: item.timeRangeStr,
        actColor: item.actColor,
      };
    });
  };

  const isDateToday = (d: Date) => {
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const renderMonthView = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const cells = [];
    for (let i = 0; i < startingDay; i++) {
      cells.push(
        <div
          key={`empty-${i}`}
          className={clsx(
            "border-b border-r border-foreground/10 bg-gray-50/30 dark:bg-default-100/10",
            isMaximized ? "min-h-[110px] h-full" : "min-h-[100px]"
          )}
        />
      );
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const currentDateObj = new Date(currentYear, currentMonth, day);
      currentDateObj.setHours(0, 0, 0, 0);
      const isWeekend =
        currentDateObj.getDay() === 0 || currentDateObj.getDay() === 6;
      const isPast = isPastDate(currentYear, currentMonth, day, today);
      const isDisabled =
        (weekendDisabled && isWeekend) || (disablePastDates && isPast);
      const daySlots = activitiesMap[dateKey] || [];
      const hasActivities = daySlots.some((x) => x !== null);
      const isTodayDate = isDateToday(currentDateObj);
      const isSelected = selectedDateKey === dateKey;
      const inDrag = isInDragRange(currentDateObj);

      cells.push(
        <div
          key={day}
          onMouseDown={(e) => {
            if (e.button === 0) {
              e.preventDefault();
              handleDragStart(currentDateObj);
            }
          }}
          onMouseEnter={() => handleDragEnter(currentDateObj)}
          onClick={() => {
            const start = new Date(currentDateObj);
            start.setHours(0, 0, 0, 0);
            const end = new Date(currentDateObj);
            end.setHours(23, 59, 0, 0);
            onDayClick?.(start.toISOString());
            onRangeSelect?.(start, end);
          }}
          className={clsx(
            "relative border-b border-r border-foreground/10 flex flex-col items-start justify-start cursor-pointer transition-all group",
            isMaximized ? "min-h-[110px] h-full" : "min-h-[100px]",
            "hover:bg-gray-50 dark:hover:bg-default-100/20",
            isDisabled &&
            "bg-gray-100 dark:bg-default-100/40 cursor-not-allowed",
            isTodayDate && "bg-blue-50 dark:bg-blue-900/10",
            isSelected && "!bg-orange-50 dark:!bg-orange-900/10",
            inDrag && "!bg-blue-50 dark:!bg-blue-900/10"
          )}
          style={isDisabled ? { pointerEvents: "none" } : {}}
        >
          <div className="w-full p-2 flex justify-between items-center">
            <span
              className={clsx(
                "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                isTodayDate
                  ? "bg-primary text-white font-bold"
                  : "text-gray-700 dark:text-foreground/80",
                !isTodayDate &&
                isDisabled &&
                "text-gray-400 dark:text-foreground/30"
              )}
            >
              {day}
            </span>
          </div>
          <div className="flex flex-col gap-[2px] w-full">
            {hasActivities &&
              daySlots.slice(0, 3).map((activity: any, index: number) => {
                if (!activity) {
                  return <div key={`spacer-${index}`} className="h-5" />;
                }
                const activityColor = ACTIVITY_TYPES.find(
                  (activityType: any) => activityType.value === activity.type
                )?.color.value;
                const startDate = new Date(activity.startDate);
                startDate.setHours(0, 0, 0, 0);
                const endDate = activity.endDate
                  ? new Date(activity.endDate)
                  : new Date(startDate);
                endDate.setHours(0, 0, 0, 0);
                const isStart =
                  currentDateObj.getTime() === startDate.getTime();
                const isEnd = currentDateObj.getTime() === endDate.getTime();
                const duration =
                  Math.round(
                    (endDate.getTime() - startDate.getTime()) /
                    (1000 * 60 * 60 * 24)
                  ) + 1;
                const dayIndex = Math.round(
                  (currentDateObj.getTime() - startDate.getTime()) /
                  (1000 * 60 * 60 * 24)
                );
                return (
                  <div
                    key={activity._id}
                    className="relative w-full h-5 overflow-hidden"
                  >
                    <div
                      className={clsx(
                        "absolute top-0 h-5 overflow-hidden text-[10px] font-normal text-white cursor-pointer transition-opacity",
                        isStart ? "rounded-l-sm left-1" : "rounded-l-none left-0",
                        isEnd
                          ? "rounded-r-sm right-1 w-auto"
                          : "rounded-r-none w-[calc(100%+1px)] z-10"
                      )}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onActivityClick?.(activity);
                      }}
                    >
                      <div
                        className="absolute top-0 bottom-0 z-0"
                        style={{
                          left: `calc(-100% * ${dayIndex})`,
                          width: `${duration * 100}%`,
                          background: activityColor || "#0284c7",
                        }}
                      />
                      <span className="relative z-10 px-1 truncate block max-w-full leading-5">
                        {isStart ? activity.title : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            {daySlots.length > 3 && (
              <div
                className="pl-2 text-[10px] text-gray-500 dark:text-foreground/40 font-medium"
                onMouseDown={(e) => e.stopPropagation()}
              >
                +{daySlots.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={clsx("overflow-x-auto", isMaximized && "h-full flex flex-col")}>
        <div className={clsx("min-w-[650px] sm:min-w-[800px]", isMaximized && "h-full flex flex-col")}>
          <div className="grid grid-cols-7 border-b border-foreground/10 bg-gray-50 dark:bg-default-100/20 shrink-0">
            {daysOfWeek.map((d) => (
              <div
                key={d}
                className="py-1.5 sm:py-2 text-center text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-foreground/40 uppercase tracking-wider border-r border-foreground/10 first:border-l"
              >
                {d}
              </div>
            ))}
          </div>
          <div className={clsx("grid grid-cols-7 border-l border-foreground/10", isMaximized && "flex-1 auto-rows-fr")}>
            {cells}
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayActivities = getActivitiesForDateObj(currentDate);
    const dayLayouts = computeOverlappingEventsLayout(dayActivities);

    const dayName = currentDate
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();
    const dayNum = currentDate.getDate();
    const isTodayDay = isDateToday(currentDate);

    const now = new Date();
    const isNowToday = isDateToday(currentDate);
    const currentHourFloat = now.getHours() + now.getMinutes() / 60;
    const redLineTop = (currentHourFloat - 1) * 48;

    return (
      <div className="flex flex-col w-full overflow-x-auto bg-background">
        <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[100px_1fr] border-b border-foreground/10 bg-gray-50/50 dark:bg-default-100/10">
          <div className="p-2 sm:p-3 text-[10px] sm:text-[11px] font-semibold text-gray-400 dark:text-foreground/40 border-r border-foreground/10 flex items-center justify-center">
            {getGmtOffset()}
          </div>
          <div
            onClick={() => {
              const start = new Date(currentDate);
              start.setHours(9, 0, 0, 0);
              const end = new Date(currentDate);
              end.setHours(10, 0, 0, 0);
              onRangeSelect?.(start, end);
            }}
            className="p-2 sm:p-3 flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
            title="Click to add an activity for this day"
          >
            <span className="text-[10px] sm:text-[11px] font-bold text-sky-600 dark:text-sky-400 tracking-wider">
              {dayName}
            </span>
            <span
              className={clsx(
                "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm mt-0.5",
                isTodayDay
                  ? "bg-primary text-white shadow-sm"
                  : "bg-transparent text-foreground"
              )}
            >
              {dayNum}
            </span>
          </div>
        </div>


        <div className={clsx("relative min-w-[300px] sm:min-w-[600px] overflow-y-auto scrollbar-thin", isMaximized ? "flex-1 h-full" : "max-h-[620px]")}>
          <div className="relative grid grid-cols-[70px_1fr] sm:grid-cols-[100px_1fr]">
            <div className="border-r border-foreground/10 bg-gray-50/30 dark:bg-default-100/5">
              {hoursList.map((hour) => {
                const hourLabel =
                  hour === 12
                    ? "12 PM"
                    : hour > 12
                      ? `${hour - 12} PM`
                      : `${hour} AM`;
                return (
                  <div
                    key={hour}
                    className="h-12 border-b border-foreground/10 pr-3 text-right text-[11px] font-medium text-gray-400 dark:text-foreground/40 flex items-center justify-end"
                  >
                    {hourLabel}
                  </div>
                );
              })}
            </div>


            <div className="relative border-b border-foreground/10">
              {hoursList.map((hour) => {
                const isSelected = isSlotSelected(currentDate, hour);
                return (
                  <div
                    key={hour}
                    onMouseDown={(e) => {
                      if (e.button === 0) {
                        e.preventDefault();
                        handleTimeDragStart(currentDate, hour);
                      }
                    }}
                    onMouseEnter={() => handleTimeDragEnter(currentDate, hour)}
                    className={clsx(
                      "relative h-12 border-b border-foreground/10 cursor-pointer transition-colors select-none",
                      isSelected
                        ? "!bg-[#0284c7]/20 dark:!bg-[#0284c7]/40 border-sky-400"
                        : "hover:bg-sky-50/40 dark:hover:bg-sky-950/20"
                    )}
                  />
                );
              })}


              {isNowToday && redLineTop >= 0 && redLineTop <= 23 * 48 && (
                <div
                  className="absolute left-0 right-0 border-b-2 border-red-500 z-30 flex items-center pointer-events-none"
                  style={{ top: `${redLineTop}px` }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1.25 shadow-sm" />
                </div>
              )}


              {dayLayouts.map((layout) => (
                <div
                  key={layout.activity._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onActivityClick?.(layout.activity);
                  }}
                  className="absolute rounded-lg p-2 text-xs font-semibold text-white flex flex-col justify-between cursor-pointer shadow-md transition-all hover:scale-[1.01] hover:z-30 overflow-hidden border border-white/30 dark:border-slate-900/50"
                  style={{
                    top: `${layout.topPx}px`,
                    height: `${layout.heightPx}px`,
                    left: `calc(${layout.leftPercent}% + 2px)`,
                    width: `calc(${layout.widthPercent}% - 4px)`,
                    backgroundColor: layout.actColor,
                  }}
                  title={`${layout.activity.title} - ${layout.activity.type}, ${layout.timeRangeStr}`}
                >
                  <div className="font-semibold truncate leading-tight">
                    {layout.activity.title} – {layout.activity.type}
                  </div>
                  {layout.heightPx > 32 && (
                    <div className="text-[10px] opacity-90 font-medium leading-tight">
                      {layout.timeRangeStr}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };


  const renderWeekView = () => {
    const now = new Date();
    const isNowInWeek = weekDays.some((d) => isDateToday(d));
    const currentHourFloat = now.getHours() + now.getMinutes() / 60;
    const redLineTop = (currentHourFloat - 1) * 48;

    return (
      <div className="flex flex-col w-full overflow-x-auto bg-background">

        <div className="grid grid-cols-[60px_repeat(7,1fr)] sm:grid-cols-[90px_repeat(7,1fr)] border-b border-foreground/10 bg-gray-50/50 dark:bg-default-100/10 min-w-[650px] sm:min-w-[800px]">
          <div className="p-2 sm:p-3 text-[10px] sm:text-[11px] font-semibold text-gray-400 dark:text-foreground/40 border-r border-foreground/10 flex items-center justify-center">
            {getGmtOffset()}
          </div>
          {weekDays.map((d, idx) => {
            const dayName = (daysOfWeek[d.getDay()] || "").toUpperCase();
            const dayNum = d.getDate();
            const isTodayDay = isDateToday(d);
            return (
              <div
                key={idx}
                onClick={() => {
                  const start = new Date(d);
                  start.setHours(9, 0, 0, 0);
                  const end = new Date(d);
                  end.setHours(10, 0, 0, 0);
                  onRangeSelect?.(start, end);
                }}
                className="p-2 sm:p-3 border-r border-foreground/10 last:border-r-0 flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                title={`Click to add activity for ${dayName} ${dayNum}`}
              >
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-foreground/60 tracking-wider">
                  {dayName}
                </span>
                <span
                  className={clsx(
                    "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm mt-0.5",
                    isTodayDay
                      ? "bg-primary text-white shadow-sm"
                      : "bg-transparent text-foreground"
                  )}
                >
                  {dayNum}
                </span>
              </div>
            );
          })}
        </div>

        <div className={clsx("relative min-w-[650px] sm:min-w-[800px] overflow-y-auto scrollbar-thin", isMaximized ? "flex-1 h-full" : "max-h-[620px]")}>
          <div className="relative grid grid-cols-[60px_repeat(7,1fr)] sm:grid-cols-[90px_repeat(7,1fr)]">
            <div className="border-r border-foreground/10 bg-gray-50/30 dark:bg-default-100/5">
              {hoursList.map((hour) => {
                const hourLabel =
                  hour === 12
                    ? "12 PM"
                    : hour > 12
                      ? `${hour - 12} PM`
                      : `${hour} AM`;
                return (
                  <div
                    key={hour}
                    className="h-12 border-b border-foreground/10 pr-3 text-right text-[11px] font-medium text-gray-400 dark:text-foreground/40 flex items-center justify-end"
                  >
                    {hourLabel}
                  </div>
                );
              })}
            </div>

            {/* 7 Day Columns */}
            {weekDays.map((d, colIdx) => {
              const dayActivities = getActivitiesForDateObj(d);
              const dayLayouts = computeOverlappingEventsLayout(dayActivities);
              const isTodayColumn = isDateToday(d);

              return (
                <div
                  key={colIdx}
                  className="relative border-r border-foreground/10 last:border-r-0"
                >
                  {hoursList.map((hour) => {
                    const isSelected = isSlotSelected(d, hour);
                    return (
                      <div
                        key={hour}
                        onMouseDown={(e) => {
                          if (e.button === 0) {
                            e.preventDefault();
                            handleTimeDragStart(d, hour);
                          }
                        }}
                        onMouseEnter={() => handleTimeDragEnter(d, hour)}
                        className={clsx(
                          "relative h-12 border-b border-foreground/10 cursor-pointer transition-colors select-none",
                          isSelected
                            ? "!bg-[#0284c7]/20 dark:!bg-[#0284c7]/40 border-sky-400"
                            : "hover:bg-sky-50/40 dark:hover:bg-sky-950/20"
                        )}
                      />
                    );
                  })}

                  {isTodayColumn && redLineTop >= 0 && redLineTop <= 23 * 48 && (
                    <div
                      className="absolute left-0 right-0 border-b-2 border-red-500 z-30 flex items-center pointer-events-none"
                      style={{ top: `${redLineTop}px` }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1.25 shadow-sm" />
                    </div>
                  )}

                  {dayLayouts.map((layout) => (
                    <div
                      key={layout.activity._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onActivityClick?.(layout.activity);
                      }}
                      className="absolute rounded-lg p-1.5 text-[11px] font-semibold text-white flex flex-col justify-between cursor-pointer shadow transition-all hover:scale-[1.01] hover:z-30 overflow-hidden border border-white/30 dark:border-slate-900/50"
                      style={{
                        top: `${layout.topPx}px`,
                        height: `${layout.heightPx}px`,
                        left: `calc(${layout.leftPercent}% + 2px)`,
                        width: `calc(${layout.widthPercent}% - 4px)`,
                        backgroundColor: layout.actColor,
                      }}
                      title={`${layout.activity.title} - ${layout.activity.type}, ${layout.timeRangeStr}`}
                    >
                      <div className="truncate font-semibold leading-snug">
                        {layout.activity.title} – {layout.activity.type}
                      </div>
                      {layout.heightPx > 32 && (
                        <div className="text-[10px] opacity-90 font-medium leading-tight">
                          {layout.timeRangeStr}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // --- RENDER YEAR VIEW ---
  const renderYearView = () => {
    const renderMonthCard = (mIdx: number, isMobileCard: boolean = false) => {
      const mName = monthNames[mIdx];
      const firstDay = new Date(currentYear, mIdx, 1);
      const lastDay = new Date(currentYear, mIdx + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDay = firstDay.getDay();

      const monthCells = [];
      for (let i = 0; i < startingDay; i++) {
        monthCells.push(<div key={`empty-${i}`} className="w-7 h-7" />);
      }
      for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(currentYear, mIdx, day);
        dayDate.setHours(0, 0, 0, 0);
        const dayActs = getActivitiesForDateObj(dayDate);
        const hasActs = dayActs.length > 0;
        const isTodayDate = isDateToday(dayDate);
        const inDrag = isInDragRange(dayDate);

        monthCells.push(
          <div
            key={day}
            onMouseDown={(e) => {
              if (e.button === 0) {
                e.preventDefault();
                handleDragStart(dayDate);
              }
            }}
            onMouseEnter={() => handleDragEnter(dayDate)}
            onClick={(e) => {
              e.stopPropagation();
              const start = new Date(dayDate);
              start.setHours(0, 0, 0, 0);
              const end = new Date(dayDate);
              end.setHours(23, 59, 0, 0);

              onDayClick?.(start.toISOString());

              if (hasActs) {
                const rect = e.currentTarget.getBoundingClientRect();
                setYearViewPopover({
                  date: dayDate,
                  activities: dayActs,
                  x: rect.left,
                  y: rect.bottom,
                });
              }
            }}
            className={clsx(
              "w-7 h-7 flex items-center justify-center text-xs rounded-full transition-all select-none cursor-pointer",
              hasActs
                ? "bg-primary text-white font-bold hover:scale-110 shadow-sm"
                : isTodayDate
                  ? "bg-sky-100 dark:bg-sky-900/40 text-primary font-bold"
                  : inDrag
                    ? "!bg-sky-500 !text-white font-bold shadow-md scale-105"
                    : "text-slate-700 dark:text-foreground/70 hover:bg-gray-100 dark:hover:bg-default-100/20"
            )}
          >
            {day}
          </div>
        );
      }

      return (
        <div
          key={mName}
          onTouchStart={(e: any) => isMobileCard && setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e: any) => {
            if (isMobileCard && touchStartX !== null) {
              const diffX = touchStartX - e.changedTouches[0].clientX;
              if (diffX > 40) handleMobileMonthNext();
              else if (diffX < -40) handleMobileMonthPrev();
              setTouchStartX(null);
            }
          }}
          className="bg-background border border-foreground/10 rounded-2xl p-4 shadow-sm flex flex-col items-center w-full max-w-[340px] sm:max-w-none mx-auto transition-all"
        >
          {isMobileCard ? (
            <div className="flex items-center justify-between w-full mb-3 px-1">
              <Button
                size="sm"
                radius="full"
                variant="ghost"
                isIconOnly
                onPress={handleMobileMonthPrev}
                className="border-small border-gray-300 dark:border-default-200 h-7 w-7 min-w-[28px] p-0"
                title="Previous Month"
              >
                <FiChevronLeft size={16} />
              </Button>
              <h4 className="text-base font-bold text-slate-800 dark:text-white">
                {mName} {currentYear}
              </h4>
              <Button
                size="sm"
                radius="full"
                variant="ghost"
                isIconOnly
                onPress={handleMobileMonthNext}
                className="border-small border-gray-300 dark:border-default-200 h-7 w-7 min-w-[28px] p-0"
                title="Next Month"
              >
                <FiChevronRight size={16} />
              </Button>
            </div>
          ) : (
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">
              {mName}
            </h4>
          )}

          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {daysOfWeekShort.map((d, i) => (
              <span
                key={i}
                className="w-7 text-[10px] font-bold text-slate-400 dark:text-foreground/40 uppercase"
              >
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {monthCells}
          </div>
        </div>
      );
    };

    return (
      <div className={clsx("relative p-2 sm:p-4 bg-background", isMaximized ? "h-full overflow-y-auto pb-14 scrollbar-thin" : "")}>

        <div className="block sm:hidden py-2">
          {renderMonthCard(mobileMonthIndex, true)}
        </div>
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 pb-6">
          {monthNames.map((_, mIdx) => renderMonthCard(mIdx, false))}
        </div>

        {yearViewPopover && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200"
            onClick={() => setYearViewPopover(null)}
          >
            <div
              ref={popoverRef}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#182030] border border-slate-200 dark:border-slate-700/80 shadow-2xl rounded-3xl p-6 w-full max-w-md flex flex-col gap-4 animate-in zoom-in-95 duration-200"
            >

              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs font-bold uppercase text-[#2563eb] dark:text-[#60a5fa] tracking-wider">
                      {daysOfWeek[yearViewPopover.date.getDay()]}
                    </span>
                    <span className="w-9 h-9 rounded-full bg-[#2563eb] text-white font-bold text-base flex items-center justify-center shadow-md mt-0.5">
                      {yearViewPopover.date.getDate()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                      {yearViewPopover.date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {yearViewPopover.activities.length}{" "}
                      {yearViewPopover.activities.length === 1
                        ? "activity"
                        : "activities"}{" "}
                      scheduled
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setYearViewPopover(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>


              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                {yearViewPopover.activities.map((act) => {
                  const actColor =
                    ACTIVITY_TYPES.find((t) => t.value === act.type)?.color
                      .value || "#0284c7";
                  const timeStr = formatEventTimeRange(act.startDate, act.endDate);

                  return (
                    <div
                      key={act._id}
                      onClick={() => {
                        onActivityClick?.(act);
                        setYearViewPopover(null);
                      }}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50/80 dark:hover:bg-slate-700/90 cursor-pointer border border-slate-200/80 dark:border-slate-700/60 shadow-sm transition-all group hover:scale-[1.01]"
                    >
                      <div className="flex items-center gap-3 truncate pr-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: actColor }}
                        />
                        <div className="truncate">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {act.title}
                          </h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                            {act.type}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900/60 px-2.5 py-1 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
                          <FiClock size={12} className="text-blue-500" />
                          <span>{timeStr}</span>
                        </div>


                        <Button
                          size="sm"
                          radius="full"
                          variant="light"
                          isIconOnly
                          onPress={(e: any) => {
                            e.stopPropagation?.();
                            setYearViewPopover(null);
                            onActivityEdit?.(act);
                          }}
                          className="h-7 w-7 min-w-[28px] p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                          title="Edit Activity"
                        >
                          <FiEdit3 size={14} />
                        </Button>


                        <Button
                          size="sm"
                          radius="full"
                          variant="light"
                          isIconOnly
                          onPress={(e: any) => {
                            e.stopPropagation?.();
                            setYearViewPopover(null);
                            onActivityDelete?.(act);
                          }}
                          className="h-7 w-7 min-w-[28px] p-0 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors"
                          title="Delete Activity"
                        >
                          <FiTrash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex justify-end">
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={() => {
                    const start = new Date(yearViewPopover.date);
                    start.setHours(9, 0, 0, 0);
                    const end = new Date(yearViewPopover.date);
                    end.setHours(10, 0, 0, 0);
                    setYearViewPopover(null);
                    onRangeSelect?.(start, end);
                  }}
                  className="font-medium text-xs rounded-xl"
                >
                  + Add Activity for this Day
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHeaderControls = (inPopup: boolean = false) => (
    <div className="relative flex flex-col sm:flex-row items-center justify-between p-2 sm:p-3.5 gap-2 sm:gap-3 border-b border-foreground/10 bg-background w-full">
      <div className="flex sm:hidden items-center justify-between w-full z-10">
        <p className="text-xs sm:text-base font-bold text-gray-800 dark:text-white truncate max-w-[220px]">
          {getHeaderTitle()}
        </p>

        <div className="flex items-center gap-1 z-10">
          {!inPopup ? (
            <Button
              size="sm"
              radius="sm"
              variant="ghost"
              isIconOnly
              onPress={() => setIsMaximized(true)}
              className="border-small border-gray-300 dark:border-default-200 h-7 w-7 min-w-[28px] p-0"
              title="Maximize"
            >
              <FiMaximize2 size={14} className="text-gray-700 dark:text-foreground/80" />
            </Button>
          ) : (
            <Button
              size="sm"
              radius="full"
              variant="light"
              isIconOnly
              onPress={() => setIsMaximized(false)}
              className="text-gray-500 dark:text-foreground/70 hover:text-foreground hover:bg-foreground/10 h-7 w-7 min-w-[28px] p-0"
              title="Close"
            >
              <FiX size={16} />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto gap-2 z-10">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            isIconOnly
            onPress={() => handleNavigate("prev")}
            className="border-small border-gray-300 dark:border-default-200 h-7 w-7 sm:h-8 sm:w-8 min-w-[28px] p-0"
            title="Previous"
          >
            <FiChevronLeft
              className="text-gray-700 dark:text-foreground/80"
              size={16}
            />
          </Button>
          <Button
            size="sm"
            radius="sm"
            variant="bordered"
            onPress={handleToday}
            className="border-small border-gray-300 dark:border-default-200 font-medium text-[11px] sm:text-xs text-foreground h-7 px-2 sm:h-8 sm:px-3 min-w-fit"
          >
            Today
          </Button>
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            isIconOnly
            onPress={() => handleNavigate("next")}
            className="border-small border-gray-300 dark:border-default-200 h-7 w-7 sm:h-8 sm:w-8 min-w-[28px] p-0"
            title="Next"
          >
            <FiChevronRight
              className="text-gray-700 dark:text-foreground/80"
              size={16}
            />
          </Button>
        </div>

        <div className="flex sm:hidden items-center gap-1.5 justify-end">
          <div className="w-24">
            <Select
              aria-label="Select Calendar View"
              selectedKeys={new Set([viewMode])}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as ViewMode;
                if (selected) {
                  setViewMode(selected);
                  setYearViewPopover(null);
                }
              }}
              size="sm"
              variant="bordered"
              disallowEmptySelection
              className="w-full"
            >
              <SelectItem key="day" textValue="Day" className="capitalize text-xs">
                Day
              </SelectItem>
              <SelectItem key="week" textValue="Week" className="capitalize text-xs">
                Week
              </SelectItem>
              <SelectItem key="month" textValue="Month" className="capitalize text-xs">
                Month
              </SelectItem>
              <SelectItem key="year" textValue="Year" className="capitalize text-xs">
                Year
              </SelectItem>
            </Select>
          </div>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 z-10">
        <div className="w-32">
          <Select
            aria-label="Select Calendar View"
            selectedKeys={new Set([viewMode])}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as ViewMode;
              if (selected) {
                setViewMode(selected);
                setYearViewPopover(null);
              }
            }}
            size="sm"
            variant="bordered"
            disallowEmptySelection
            className="w-full"
          >
            <SelectItem key="day" textValue="Day" className="capitalize text-xs">
              Day
            </SelectItem>
            <SelectItem key="week" textValue="Week" className="capitalize text-xs">
              Week
            </SelectItem>
            <SelectItem key="month" textValue="Month" className="capitalize text-xs">
              Month
            </SelectItem>
            <SelectItem key="year" textValue="Year" className="capitalize text-xs">
              Year
            </SelectItem>
          </Select>
        </div>

        {!inPopup ? (
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            isIconOnly
            onPress={() => setIsMaximized(true)}
            className="border-small border-gray-300 dark:border-default-200"
            title="Maximize"
          >
            <FiMaximize2 size={16} className="text-gray-700 dark:text-foreground/80" />
          </Button>
        ) : (
          <Button
            size="sm"
            radius="full"
            variant="light"
            isIconOnly
            onPress={() => setIsMaximized(false)}
            className="text-gray-500 dark:text-foreground/70 hover:text-foreground hover:bg-foreground/10"
            title="Close"
          >
            <FiX size={20} />
          </Button>
        )}
      </div>

      <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 pointer-events-none z-0 max-w-[35%] lg:max-w-[45%] truncate text-center">
        <p className="text-base md:text-lg font-bold text-gray-800 dark:text-white truncate">
          {getHeaderTitle()}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full rounded-xl overflow-hidden bg-background">
        {renderHeaderControls(false)}
        {viewMode === "month" && renderMonthView()}
        {viewMode === "day" && renderDayView()}
        {viewMode === "week" && renderWeekView()}
        {viewMode === "year" && renderYearView()}
      </div>

      {isMaximized && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md p-1.5 sm:p-3 md:p-6 flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setIsMaximized(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full h-full max-w-[1700px] bg-background border border-foreground/10 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {renderHeaderControls(true)}
            <div className="flex-1 overflow-hidden p-0 flex flex-col">
              {viewMode === "month" && renderMonthView()}
              {viewMode === "day" && renderDayView()}
              {viewMode === "week" && renderWeekView()}
              {viewMode === "year" && renderYearView()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomCalendar;
