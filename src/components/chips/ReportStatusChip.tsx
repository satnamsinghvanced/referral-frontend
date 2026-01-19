import { Chip } from "@heroui/react";
import { REPORT_STATUSES } from "../../consts/reports";
import { ReportStatus } from "../../types/reports";

export default function ReportStatusChip({
  status,
}: {
  status: ReportStatus | string;
}) {
  let classNames = "";

  switch (status) {
    case "processing":
    case "generating":
      classNames =
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      break;
    case "ready":
      classNames =
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      break;
    case "failed":
      classNames =
        "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800";
      break;
    default:
      classNames =
        "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      variant="flat"
      className={`capitalize text-[11px] h-5 border ${classNames}`}
    >
      {REPORT_STATUSES.find((option) => option.value === status)?.label ||
        status}
    </Chip>
  );
}
