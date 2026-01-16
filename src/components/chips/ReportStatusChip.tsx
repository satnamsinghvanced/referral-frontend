import { Chip } from "@heroui/react";
import { REPORT_STATUSES } from "../../consts/reports";

export default function ReportStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "processing":
      classNames =
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      break;

    default:
      classNames =
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${classNames}`}
    >
      {REPORT_STATUSES.find((option: any) => option.value === status)?.label}
    </Chip>
  );
}
