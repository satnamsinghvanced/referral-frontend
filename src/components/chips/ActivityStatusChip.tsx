import { Chip } from "@heroui/react";
import { ACTIVITY_STATUSES } from "../../consts/marketing";

export default function ActivityStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "scheduled":
    case "confirmed":
      classNames =
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      break;
    case "in-progress":
      classNames =
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      break;
    case "cancelled":
      classNames =
        "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800";
      break;

    case "active":
      classNames =
        "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      break;
    case "completed":
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
      {ACTIVITY_STATUSES.find((option: any) => option.value === status)
        ?.label || status}
    </Chip>
  );
}
