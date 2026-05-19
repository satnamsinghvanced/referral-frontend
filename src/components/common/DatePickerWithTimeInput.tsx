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
  // Helper to parse ISO UTC string (with Z) to UTC CalendarDate and Time
  const parsed = React.useMemo(() => {
    if (!value) return { date: null, time: null };
    const d = new Date(value);
    if (isNaN(d.getTime())) return { date: null, time: null };
    return {
      date: new CalendarDate(
        d.getUTCFullYear(),
        d.getUTCMonth() + 1,
        d.getUTCDate(),
      ),
      time: new Time(d.getUTCHours(), d.getUTCMinutes()),
    };
  }, [value]);

  // Helper to construct UTC date/time and return as ISO UTC string
  const combineDateTime = (
    date: CalendarDate | null,
    time: Time | null,
  ): string | null => {
    if (!date) return null;
    const nowUtc = new Date();
    const hour = time ? time.hour : nowUtc.getUTCHours();
    const minute = time ? time.minute : nowUtc.getUTCMinutes();
    const d = new Date(
      Date.UTC(date.year, date.month - 1, date.day, hour, minute, 0, 0),
    );
    return d.toISOString();
  };

  // Helper to convert any minValue / maxValue prop to a CalendarDate in UTC
  const getCalendarDate = (val: any) => {
    if (!val) return undefined;
    if (
      val &&
      typeof val === "object" &&
      "year" in val &&
      "month" in val &&
      "day" in val
    ) {
      return new CalendarDate(val.year, val.month, val.day);
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return new CalendarDate(
        d.getUTCFullYear(),
        d.getUTCMonth() + 1,
        d.getUTCDate(),
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
