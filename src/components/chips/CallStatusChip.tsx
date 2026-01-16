import { Chip } from "@heroui/react";
import { CALL_STATUSES } from "../../consts/call";

export default function CallStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "completed":
      classNames =
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
      break;
    case "no-answer":
    case "busy":
    case "failed":
      classNames =
        "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800";
      break;

    default:
      classNames =
        "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-foreground/10 dark:border-gray-700";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${classNames}`}
    >
      {CALL_STATUSES.find((option: any) => option.value === status)?.label}
    </Chip>
  );
}
