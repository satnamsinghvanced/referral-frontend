import React from 'react';

import { Calendar, cn, Radio } from "@heroui/react";
import { getLocalTimeZone, startOfMonth, startOfWeek, today } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";


const ReferralConnectionsCalendar = () => {
    let defaultDate = today(getLocalTimeZone());
    let [value, setValue] = React.useState(defaultDate);
    let { locale } = useLocale();

    let now = today(getLocalTimeZone());
    let nextWeek = startOfWeek(now.add({ weeks: 1 }), locale);
    let nextMonth = startOfMonth(now.add({ months: 1 }));

    const CustomRadio = (props) => {
        const { children, ...otherProps } = props;

        return (
            <Radio
                {...otherProps}
                classNames={{
                    base: cn(
                        "flex-none m-0 h-8 bg-text/5 hover:bg-content2 items-center justify-between",
                        "cursor-pointer rounded-full border-1 border-default-200/60",
                        "data-[selected=true]:border-primary",
                    ),
                    label: "text-tiny text-default-500",
                    labelWrapper: "px-1 m-0",
                    wrapper: "hidden",
                }}
                className='rounded-sm'
            >
                {children}
            </Radio>
        );
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <Calendar
                calendarWidth={`100%`}
                className='w-full shadow-none p-0 pt-2 bg-background'
                aria-label="Date (Presets)"
                weekdayStyle='short'
                // topContent={
                //     <ButtonGroup
                //         fullWidth
                //         className="rounded-sm pb-2 pt-3 bg-background [&>button]:text-default-500 [&>button]:border-default-200/60"
                //         radius="full"
                //         size="sm"
                //         variant="bordered"
                //     >
                //         <Button onPress={() => setValue(now)}>Today</Button>
                //         <Button onPress={() => setValue(nextWeek)}>Next week</Button>
                //         <Button onPress={() => setValue(nextMonth)}>Next month</Button>
                //     </ButtonGroup>
                // }
                classNames={{
                    content: "w-full bg-transparent",
                    gridBody: "w-full",
                    base: "w-full",
                    gridBodyRow: "w-full",
                    cell: "w-full m-1",
                    grid: "w-full p-10 bg-background",
                    gridHeader: "w-full bg-background shadow-none",
                    header: 'w-full', // september 2025
                    headerWrapper: 'bg-background p-0 !text-text pb-2',
                    gridHeaderCell: 'w-full',
                    cellButton: "w-full h-[80px] border rounded-md border-text/10 flex justify-start items-start pt-2 pl-2",
                    prevButton: "py-0.5 px-1 w-10 border-1 border-text/20 rounded-sm hover:bg-text/10",
                    nextButton: "py-0.5 px-1 w-10 border-1 border-text/20 rounded-sm hover:bg-text/10",
                }}

                focusedValue={value}
                nextButtonProps={{
                    variant: "bordered",
                }}
                prevButtonProps={{
                    variant: "bordered",
                }}

                value={value}
                onChange={setValue}
                onFocusChange={setValue}

            // bottomContent={
            //     <RadioGroup
            //         aria-label="Date precision"
            //         classNames={{
            //             base: "w-full pb-2",
            //             wrapper: "-my-2.5 py-2.5 px-3 gap-1 flex-nowrap w-full ",
            //         }}
            //         defaultValue="exact_dates"
            //         orientation="horizontal"
            //         className='w-full bg-background'
            //     >
            //         <CustomRadio value="exact_dates">Exact dates</CustomRadio>
            //         <CustomRadio value="1_day">1 day</CustomRadio>
            //         <CustomRadio value="2_days">2 days</CustomRadio>
            //         <CustomRadio value="3_days">3 days</CustomRadio>
            //         <CustomRadio value="7_days">7 days</CustomRadio>
            //         <CustomRadio value="14_days">14 days</CustomRadio>
            //     </RadioGroup>
            // }
            />
        </div>
    )
}

export default ReferralConnectionsCalendar