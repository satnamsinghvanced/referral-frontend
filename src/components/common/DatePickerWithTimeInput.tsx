import React from "react";
import { DatePicker, TimeInput } from "@heroui/react";
import {
  CalendarDate,
  Time,
  getLocalTimeZone,
  today,
} from "@internationalized/date";

export interface DatePickerWithTimeInputProps {
  value?: string | null | undefined;
  onChange?: ((value: string | null) => void) | undefined;
  label?: string | undefined;
  isRequired?: boolean | undefined;
  isInvalid?: boolean | undefined;
  errorMessage?: React.ReactNode | undefined;
  minValue?: any;
  maxValue?: any;
  datePickerProps?: any;
  timeInputProps?: any;
  className?: string | undefined;
  id?: string | undefined;
  name?: string | undefined;
  onBlur?: (() => void) | undefined;
}

const DatePickerWithTimeInput: React.FC<DatePickerWithTimeInputProps> = ({
  value,
  onChange,
  label,
  isRequired,
  isInvalid,
  errorMessage,
  minValue,
  maxValue,
  datePickerProps = {},
  timeInputProps = {},
  className = "",
  id,
  name,
  onBlur,
}) => {
  const parsed = React.useMemo(() => {
    if (!value) return { date: null, time: null };
    const d = new Date(value);
    if (isNaN(d.getTime())) return { date: null, time: null };
    return {
      date: new CalendarDate(
        d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
      ),
      time: new Time(d.getHours(), d.getMinutes()),
    };
  }, [value]);

  const combineDateTime = (
    date: CalendarDate | null,
    time: Time | null,
  ): string | null => {
    if (!date) return null;
    const nowLocal = new Date();
    const hour = time ? time.hour : nowLocal.getHours();
    const minute = time ? time.minute : nowLocal.getMinutes();
    const d = new Date(date.year, date.month - 1, date.day, hour, minute, 0, 0);
    return d.toISOString();
  };

  const getCalendarDate = (val: any) => {
    if (!val) return undefined;
    if (
      val &&
      typeof val === "object" &&
      "year" in val &&
      "month" in val &&
      "day" in val &&
      !("toDate" in val)
    ) {
      return new CalendarDate(val.year, val.month, val.day);
    }
    const d =
      val && typeof val === "object" && typeof val.toDate === "function"
        ? val.toDate()
        : new Date(val);
    if (!isNaN(d.getTime())) {
      return new CalendarDate(
        d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
      );
    }
    return undefined;
  };

  const handleDateChange = (newDate: CalendarDate | null) => {
    if (!newDate) {
      onChange?.(null);
    } else {
      const newIso = combineDateTime(newDate, parsed.time);
      onChange?.(newIso);
    }
  };

  const handleTimeChange = (newTime: Time | null) => {
    const defaultDate = parsed.date || today("UTC");
    const newIso = combineDateTime(defaultDate, newTime);
    onChange?.(newIso);
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`} id={id}>
      {label && (
        <span className="text-xs font-medium text-foreground">
          {label} {isRequired && <span className="text-danger">*</span>}
        </span>
      )}
      <div className="flex flex-row gap-3 w-full items-start">
        <div className="flex-grow max-w-[200px]">
          <DatePicker
            size="sm"
            radius="sm"
            showMonthAndYearPickers
            value={parsed.date}
            minValue={getCalendarDate(minValue)}
            maxValue={getCalendarDate(maxValue)}
            onChange={handleDateChange}
            onBlur={onBlur}
            isInvalid={isInvalid}
            aria-label={label ? `${label} Date` : "Select Date"}
            {...datePickerProps}
          />
        </div>
        <div className="w-[100px] flex-shrink-0">
          <TimeInput
            size="sm"
            radius="sm"
            value={parsed.time}
            onChange={handleTimeChange}
            onBlur={onBlur}
            isInvalid={isInvalid}
            aria-label={label ? `${label} Time` : "Select Time"}
            {...timeInputProps}
          />
        </div>
      </div>
      {isInvalid && errorMessage && (
        <span className="text-[11px] text-danger mt-0.5">{errorMessage}</span>
      )}
    </div>
  );
};

export default DatePickerWithTimeInput;
