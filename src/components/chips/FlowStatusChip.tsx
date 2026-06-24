import { Chip } from "@heroui/react";
import { FLOW_STATUSES } from "../../consts/campaign";

export default function FlowStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "inActive":
      classNames =
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      break;
    case "draft":
      classNames =
        "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-foreground/10 dark:border-gray-700";
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
      {FLOW_STATUSES.find((option: any) => option.value === status)?.label}
    </Chip>
  );
}
