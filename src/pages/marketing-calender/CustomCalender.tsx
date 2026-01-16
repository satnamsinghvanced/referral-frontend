import React, { useState, useMemo, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import clsx from "clsx";
import { Button, Chip } from "@heroui/react";
import { ACTIVITY_TYPES } from "../../consts/marketing";

interface CalendarProps {
  weekendDisabled?: boolean;
  disablePastDates?: boolean;
  onDayClick?: (date: string) => void;
  onActivityClick?: (activity: any) => void;
  onRangeSelect?: (startDate: Date, endDate: Date) => void;
  activities: any[];
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

    // Cleanup finished assignments
    Object.keys(activeAssignments).forEach((id) => {
      if (!dayActivities.find((a) => a._id === id)) {
        delete activeAssignments[id];
      }
    });

    // Sort: Existing assignments first, then new
    dayActivities.sort((a, b) => {
      const slotA = activeAssignments[a._id];
      const slotB = activeAssignments[b._id];
      if (slotA !== undefined && slotB !== undefined) return slotA - slotB;
      if (slotA !== undefined) return -1;
      if (slotB !== undefined) return 1;
      // Tie-break new: Longest first
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

const CustomCalendar: React.FC<CalendarProps> = ({
  weekendDisabled = true,
  disablePastDates = true,
  onDayClick,
  onActivityClick,
  onRangeSelect,
  activities,
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<any>(null);

  // Drag State
  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [dragEnd, setDragEnd] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging && dragStart && dragEnd) {
        setIsDragging(false);
        const start = new Date(
          Math.min(dragStart.getTime(), dragEnd.getTime())
        );
        const end = new Date(Math.max(dragStart.getTime(), dragEnd.getTime()));

        // Set time to noon Local to ensure consistent 12:00 display regardless of timezone
        start.setHours(12, 0, 0, 0);
        end.setHours(12, 0, 0, 0);

        onRangeSelect?.(start, end);

        if (start.getTime() === end.getTime() && onDayClick) {
          // Fallback for click compatibility only if needed,
          // but strictly we want to trigger modal with range.
          // We'll rely on onRangeSelect logic solely now.
        }

        const year = start.getFullYear();
        const month = String(start.getMonth() + 1).padStart(2, "0");
        const day = String(start.getDate()).padStart(2, "0");
        setSelectedDate(`${year}-${month}-${day}`);

        setDragStart(null);
        setDragEnd(null);
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging, dragStart, dragEnd, onRangeSelect]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

  const activitiesMap = useMemo(
    () => getActivitiesWithSlots(activities, currentYear, currentMonth),
    [activities, currentYear, currentMonth]
  );

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  const handleMonthChange = (direction: "prev" | "next") => {
    if (disablePastDates && direction === "prev") {
      const isCurrentMonth =
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();
      if (isCurrentMonth) {
        return;
      }
    }

    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((prev) => prev - 1);
      } else setCurrentMonth((prev) => prev - 1);
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((prev) => prev + 1);
      } else setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    const dateObj = new Date(dateKey);
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

    const isPast = isPastDate(currentYear, currentMonth, day, today);
    if ((weekendDisabled && isWeekend) || (disablePastDates && isPast)) {
      return;
    }

    onDayClick?.(new Date(dateKey).toISOString());
    setSelectedDate(dateKey);
  };

  // Helper for date comparison (resetting time)
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
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

  const isInDragRange = (date: Date) => {
    if (!isDragging || !dragStart || !dragEnd) return false;
    const start = Math.min(dragStart.getTime(), dragEnd.getTime());
    const end = Math.max(dragStart.getTime(), dragEnd.getTime());
    const current = date.getTime();
    return current >= start && current <= end;
  };

  const renderDays = () => {
    const cells = [];
    // Empty cells for previous month padding
    for (let i = 0; i < startingDay; i++) {
      // Add border to empty cells too to maintain grid
      cells.push(
        <div
          key={`empty-${i}`}
          className="min-h-[100px] border-b border-r border-foreground/10 bg-gray-50/30 dark:bg-default-100/10"
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;

      // Construct current date object safely with 00:00:00 time
      const currentDate = new Date(currentYear, currentMonth, day);
      currentDate.setHours(0, 0, 0, 0);

      const isWeekend =
        currentDate.getDay() === 0 || currentDate.getDay() === 6;
      const isPast = isPastDate(currentYear, currentMonth, day, today);

      const isDisabled =
        (weekendDisabled && isWeekend) || (disablePastDates && isPast);

      const daySlots = activitiesMap[dateKey] || [];
      const hasActivities = daySlots.some((x) => x !== null);

      // Determine if current day is today
      const isTodayDate = isToday(day);
      const isSelected = selectedDate === dateKey;
      const inDrag = isInDragRange(currentDate);

      cells.push(
        <div
          key={day}
          onMouseDown={(e) => {
            if (e.button === 0) {
              e.preventDefault();
              handleDragStart(currentDate);
            }
          }}
          onMouseEnter={() => handleDragEnter(currentDate)}
          className={clsx(
            "relative min-h-[100px] border-b border-r border-foreground/10 flex flex-col items-start justify-start cursor-pointer transition-all group",
            // Remove gap/rounded styling, use seamless grid
            "hover:bg-gray-50 dark:hover:bg-default-100/20",
            isDisabled &&
              "bg-gray-100 dark:bg-default-100/40 cursor-not-allowed",
            isTodayDate && "bg-blue-50 dark:bg-blue-900/10",
            isSelected && "!bg-orange-50 dark:!bg-orange-900/10",
            inDrag && "!bg-blue-50 dark:!bg-blue-900/10"
          )}
          style={isDisabled ? { pointerEvents: "none" } : {}}
        >
          <div className={clsx("w-full p-2 flex justify-between items-center")}>
            <span
              className={clsx(
                "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                isTodayDate
                  ? "bg-primary text-white"
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
                  (activityType: any) => activityType.value == activity.type
                )?.color.value;

                // Dates
                const startDate = new Date(activity.startDate);
                startDate.setHours(0, 0, 0, 0);
                const endDate = activity.endDate
                  ? new Date(activity.endDate)
                  : new Date(startDate);
                endDate.setHours(0, 0, 0, 0);

                // Start/End checks
                const isStart = isSameDay(currentDate, startDate);
                const isEnd = isSameDay(currentDate, endDate);

                // Visual boundaries:
                const isVisualStart = isStart;
                const isVisualEnd = isEnd;

                const duration =
                  Math.round(
                    (endDate.getTime() - startDate.getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) + 1;
                const dayIndex = Math.round(
                  (currentDate.getTime() - startDate.getTime()) /
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
                        isVisualStart
                          ? "rounded-l-sm left-1"
                          : "rounded-l-none left-0",
                        isVisualEnd
                          ? "rounded-r-sm right-1 w-auto"
                          : "rounded-r-none w-[calc(100%+1px)] z-10"
                      )}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onActivityClick?.(activity);
                      }}
                    >
                      {/* Background Layer */}
                      <div
                        className="absolute top-0 bottom-0 z-0"
                        style={{
                          left: `calc(-100% * ${dayIndex})`,
                          width: `${duration * 100}%`,
                          background: activityColor || "#4285F4",
                        }}
                      />

                      {/* Text Content */}
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

    return cells;
  };

  return (
    <div className="w-full rounded-xl overflow-hidden bg-background">
      <div className="flex items-center justify-between p-4 border-b border-foreground/10">
        <Button
          size="sm"
          radius="sm"
          variant="ghost"
          isIconOnly
          onPress={() => handleMonthChange("prev")}
          isDisabled={
            disablePastDates &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
          }
          className="border-small border-gray-300 dark:border-default-200"
        >
          <FiChevronLeft
            className="text-gray-700 dark:text-foreground/80"
            size={18}
          />
        </Button>
        <p className="text-base font-semibold text-gray-800 dark:text-white">
          {monthNames[currentMonth]} {currentYear}
        </p>
        <Button
          size="sm"
          radius="sm"
          variant="ghost"
          isIconOnly
          onPress={() => handleMonthChange("next")}
          className="border-small border-gray-300 dark:border-default-200"
        >
          <FiChevronRight
            className="text-gray-700 dark:text-foreground/80"
            size={18}
          />
        </Button>
      </div>

      {/* Scrollable Container for Mobile */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {" "}
          {/* Force min-width for mobile scroll */}
          <div className="grid grid-cols-7 border-b border-foreground/10 bg-gray-50 dark:bg-default-100/20">
            {daysOfWeek.map((d) => (
              <div
                key={d}
                className="py-2 text-center text-xs font-semibold text-gray-500 dark:text-foreground/40 uppercase tracking-wider border-r border-foreground/10 first:border-l"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 border-l border-foreground/10">
            {renderDays()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;
