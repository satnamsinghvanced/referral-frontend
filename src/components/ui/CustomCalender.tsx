import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import clsx from "clsx";
import { Button, Chip } from "@heroui/react";

interface CalendarProps {
  weekendDisabled?: boolean;
  onDayClick?: (date: string) => void;
  selectedReferrerObjects: any;
}

const CustomCalendar: React.FC<CalendarProps> = ({
  weekendDisabled = true,
  onDayClick,
  selectedReferrerObjects,
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDates, setSelectedDates] = useState<any>([]);

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
    setSelectedDates((prev: any) => [...prev, dateKey]);
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

      cells.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={clsx(
            "relative h-20 rounded-lg border border-gray-100 flex flex-col items-start justify-start cursor-pointer transition-all group p-2",
            "hover:bg-gray-50",
            isWeekend && weekendDisabled && "!cursor-not-allowed !bg-gray-100",
            isToday(day) && "ring-2 ring-blue-200 !border-blue-200 !bg-blue-100"
          )}
          style={{
            backgroundColor: isToday(day) ? "#0f75bc" : undefined,
          }}
        >
          {selectedDates.includes(dateKey) <= 0 && !isWeekend && (
            <span className="text-gray-300 absolute top-1/2 left-1/2 -translate-1/2 transition-all opacity-0 group-hover:opacity-100">
              <FiPlus />
            </span>
          )}
          <span className="text-sm text-gray-700 font-medium">{day}</span>
          {selectedDates.includes(dateKey) && (
            <Chip className="absolute top-1/2 left-1/2 -translate-1/2 text-[11px] h-5 w-full max-w-[calc(100%-20px)] text-center flex rounded-sm bg-red-100 text-red-800">
              {selectedReferrerObjects.length} visit
              {selectedReferrerObjects.length > 1 ? "s" : ""}
            </Chip>
          )}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          size="sm"
          radius="sm"
          variant="ghost"
          className="min-w-auto p-0 w-8 h-8 hover:bg-gray-50 border-small"
          onPress={() => handleMonthChange("prev")}
        >
          <FiChevronLeft className="text-gray-700" size={16} />
        </Button>
        <p className="text-base font-medium text-gray-800">
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

      {/* Days of Week */}
      <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
        {daysOfWeek.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">{renderDays()}</div>
    </div>
  );
};

export default CustomCalendar;
