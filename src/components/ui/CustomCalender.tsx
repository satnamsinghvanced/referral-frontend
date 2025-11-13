import React, { useState, useMemo } from "react";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import clsx from "clsx";
import { Button, Chip } from "@heroui/react";
import { ACTIVITY_TYPES } from "../../consts/marketing";

interface CalendarProps {
  weekendDisabled?: boolean;
  onDayClick?: (date: string) => void;
  activities: any[];
}

const getActivitiesByDate = (activities: any[]) => {
  return activities.reduce((acc, activity) => {
    // 💡 FIX: Ensure dateKey is in 'YYYY-MM-DD' format by taking
    // the first part of the startDate string, regardless of whether
    // it is a full ISO string or already just the date.
    const dateKey = activity.startDate ? activity.startDate.split("T")[0] : "";

    if (dateKey) {
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(activity);
    }
    return acc;
  }, {});
};

const CustomCalendar: React.FC<CalendarProps> = ({
  weekendDisabled = true,
  onDayClick,
  activities,
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<any>(null);

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
    () => getActivitiesByDate(activities),
    [activities]
  );

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  const handleMonthChange = (direction: "prev" | "next") => {
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
    if (weekendDisabled && isWeekend) return;

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
    for (let i = 0; i < startingDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-20" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const dateObj = new Date(dateKey);
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
      const dayActivities = activitiesMap[dateKey] || [];
      const hasActivities = dayActivities.length > 0;

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
            isToday(day) && "!ring-2 !ring-primary !bg-transparent",
            selectedDate === dateKey && "!ring-2 !ring-orange-500 !bg-orange-50"
          )}
        >
          <span className="text-sm text-gray-700 font-medium mb-1">{day}</span>
          <div className="flex flex-col gap-0.5 w-full overflow-hidden">
            {hasActivities &&
              dayActivities.slice(0, 2).map((activity: any) => {
                const activityColor = ACTIVITY_TYPES.find(
                  (activityType: any) =>
                    activityType.label === activity.type.title
                )?.color;

                return (
                  <Chip
                    key={activity._id}
                    size="sm"
                    className="text-[11px] h-5 max-w-full truncate rounded-sm font-normal text-white"
                    style={{ backgroundColor: activityColor }}
                  >
                    {activity.title}
                  </Chip>
                );
              })}
            {dayActivities.length > 2 && (
              <p className="text-[10px] text-gray-500 mt-0.5">
                +{dayActivities.length - 2} more
              </p>
            )}
          </div>
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
