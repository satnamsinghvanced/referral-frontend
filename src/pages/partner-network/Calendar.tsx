import React from "react";

import { Calendar, cn, Radio } from "@heroui/react";
import {
  getLocalTimeZone,
  startOfMonth,
  startOfWeek,
  today,
} from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";

const PartnerNetworkCalendar = () => {
  let defaultDate = today(getLocalTimeZone());
  let [value, setValue] = React.useState(defaultDate);
  let { locale } = useLocale();

  let now = today(getLocalTimeZone());
  let nextWeek = startOfWeek(now.add({ weeks: 1 }), locale);
  let nextMonth = startOfMonth(now.add({ months: 1 }));

  const CustomRadio = (props: any) => {
    const { children, ...otherProps } = props;

    return (
      <Radio
        {...otherProps}
        classNames={{
          base: cn(
            "flex-none m-0 h-8 bg-foreground/5 hover:bg-content2 items-center justify-between",
            "cursor-pointer rounded-full border-1 border-default-200/60",
            "data-[selected=true]:border-primary"
          ),
          label: "text-tiny text-default-500",
          labelWrapper: "px-1 m-0",
          wrapper: "hidden",
        }}
        className="rounded-sm"
      >
        {children}
      </Radio>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Calendar
        calendarWidth={`100%`}
        className="w-full shadow-none p-5 bg-background border border-primary/15"
        aria-label="Date (Presets)"
        weekdayStyle="short"
        classNames={{
          content: "w-full bg-transparent",
          gridBody: "w-full",
          base: "w-full",
          gridBodyRow: "w-full",
          cell: "w-full m-1",
          grid: "w-full p-10 bg-background",
          gridHeader: "w-full bg-background shadow-none",
          header: "w-full",
          headerWrapper: "bg-background p-0 !text-foreground pb-2",
          gridHeaderCell: "w-full",
          cellButton:
            "w-full h-[80px] border rounded-md border-foreground/10 flex justify-start items-start pt-2 pl-2",
          prevButton:
            "py-0.5 px-1 w-10 border-1 border-foreground/20 rounded-sm hover:bg-foreground/10",
          nextButton:
            "py-0.5 px-1 w-10 border-1 border-foreground/20 rounded-sm hover:bg-foreground/10",
        }}
        focusedValue={value}
        nextButtonProps={{
          variant: "bordered",
        }}
        prevButtonProps={{
          variant: "bordered",
        }}
        value={value!}
        onChange={setValue}
        onFocusChange={setValue}
      />
    </div>
  );
};

export default PartnerNetworkCalendar;
