import React, { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import clsx from "clsx";
import { Button, Chip } from "@heroui/react";
// Assuming ACTIVITY_TYPES is defined in this path
import { ACTIVITY_TYPES } from "../../consts/marketing";

// --- Interfaces ---
interface Activity {
  _id: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  type: { title: string };
  title: string;
}

interface CalendarProps {
  weekendDisabled?: boolean;
  disablePastDates?: boolean;
  onDayClick?: (date: string) => void;
  onViewActivity?: (id: string) => void;
  activities: Activity[];
}

// --- Utility Functions ---

/**
 * Helper to get the date part (YYYY-MM-DD) from an ISO string.
 * @param dateIsoString
 * @returns YYYY-MM-DD string
 */
const getFormattedDate = (dateIsoString: string): string => {
  return dateIsoString.split("T")[0];
};

/**
 * Creates a map where the key is the date (YYYY-MM-DD) and the value is an array of activities
 * scheduled for that specific day, spanning from startDate to endDate.
 */
const getActivitiesByDate = (activities: Activity[]) => {
  const activityMap: Record<string, Activity[]> = {};

  activities.forEach((activity) => {
    if (!activity.startDate || !activity.endDate) return;

    const start = new Date(getFormattedDate(activity.startDate));
    const end = new Date(getFormattedDate(activity.endDate));

    let currentDay = new Date(start);

    // Ensure the end date is inclusive
    while (currentDay <= end) {
      const dateKey = currentDay.toISOString().split("T")[0];

      if (!activityMap[dateKey]) {
        activityMap[dateKey] = [];
      }
      activityMap[dateKey].push(activity);

      // Move to the next day
      currentDay.setDate(currentDay.getDate() + 1);
    }
  });

  return activityMap;
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

// --- New Extracted Component for Chips ---
interface ActivityChipListProps {
  dayActivities: Activity[];
  onViewActivity?: any;
}

const ActivityChipList: React.FC<ActivityChipListProps> = ({
  dayActivities,
  onViewActivity,
}) => {
  if (dayActivities.length === 0) return null;

  // Show only the first 2 activities, count the rest
  const visibleActivities = dayActivities.slice(0, 2);
  const hiddenCount = dayActivities.length - visibleActivities.length;

  return (
    <div className="flex flex-col gap-0.5 w-full overflow-hidden">
      {visibleActivities.map((activity) => {
        const activityColor = ACTIVITY_TYPES.find(
          (activityType: any) => activityType.label === activity.type.title
        )?.color;

        return (
          <Chip
            key={activity._id}
            size="sm"
            className="text-[11px] h-5 max-w-full truncate rounded-sm font-normal text-white hover:opacity-80"
            style={{ backgroundColor: activityColor }}
            // Essential fix: Stop propagation to prevent selecting the day when clicking the chip
            onClick={(e) => {
              e.stopPropagation();
              onViewActivity?.(activity._id);
            }}
          >
            {activity.title}
          </Chip>
        );
      })}
      {hiddenCount > 0 && (
        <p className="text-[10px] text-gray-500 mt-0.5">+{hiddenCount} more</p>
      )}
    </div>
  );
};
// --- End Extracted Component ---

const CustomCalendar: React.FC<CalendarProps> = ({
  weekendDisabled = true,
  disablePastDates = true,
  onDayClick,
  onViewActivity,
  activities,
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
    "Ocober",
    "November",
    "December",
  ];

  const activitiesMap = useMemo(
    () => getActivitiesByDate(activities),
    [activities]
  );

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  const handleMonthChange = (direction: "prev" | "next") => {
    // Logic to prevent going into past months if disablePastDates is true
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

    onDayClick?.(dateKey);
    setSelectedDate(dateKey);
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const renderDays = () => {
    const cells = [];

    // Render empty cells for preceding days
    for (let i = 0; i < startingDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-26" />);
    }

    // Render day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;

      const dateObj = new Date(dateKey);
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
      const isPast = isPastDate(currentYear, currentMonth, day, today);

      const isDisabled =
        (weekendDisabled && isWeekend) || (disablePastDates && isPast);

      const dayActivities = activitiesMap[dateKey] || [];

      cells.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={clsx(
            "relative h-26 rounded-lg border border-gray-100 flex flex-col items-start justify-start cursor-pointer transition-all group p-1.5",
            "hover:bg-gray-50 hover:ring-1 hover:ring-primary",
            isWeekend &&
              weekendDisabled &&
              "!cursor-not-allowed !bg-gray-100 !ring-0",
            isPast &&
              disablePastDates &&
              "!cursor-not-allowed !bg-gray-100 !text-gray-400 !border-gray-200 !ring-0 !pointer-events-none",
            isToday(day) && "!ring-2 !ring-primary !bg-transparent",
            selectedDate === dateKey && "!ring-2 !ring-orange-500 !bg-orange-50"
          )}
          style={isDisabled ? { pointerEvents: "none", opacity: 0.6 } : {}}
        >
          <span className="text-sm text-gray-700 font-medium mb-1">{day}</span>

          <ActivityChipList
            dayActivities={dayActivities}
            onViewActivity={onViewActivity}
          />
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <Button
          size="sm"
          radius="sm"
          variant="ghost"
          className="min-w-auto p-0 w-8 h-8 hover:bg-gray-50 border-small"
          onPress={() => handleMonthChange("prev")}
          isDisabled={
            disablePastDates &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
          }
        >
          <FiChevronLeft className="text-gray-700" size={16} />
        </Button>
        <p className="text-base font-medium">
          {monthNames[currentMonth]} {currentYear}
        </p>
        <Button
          size="sm"
          radius="sm"
          variant="ghost"
          className="min-w-auto p-0 w-8 h-8 hover:bg-gray-50 border-small"
          onPress={() => handleMonthChange("next")}
        >
          <FiChevronRight className="text-gray-700" size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
        {daysOfWeek.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">{renderDays()}</div>
    </div>
  );
};

export default CustomCalendar;
