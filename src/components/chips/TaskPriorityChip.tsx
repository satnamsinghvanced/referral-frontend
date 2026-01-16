import { Chip } from "@heroui/react";
import { TASK_PRIORITIES } from "../../consts/practice";

export default function TaskPriorityChip({ priority }: { priority: string }) {
  let classNames;

  switch (priority) {
    case "low":
      classNames =
        "bg-[#e0f2fe] dark:bg-sky-900/30 text-[#0c4a6e] dark:text-sky-300";
      break;

    case "medium":
      classNames =
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      break;

    default:
      classNames =
        "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${classNames}`}
    >
      {TASK_PRIORITIES.find((option: any) => option.value === priority)?.label}
    </Chip>
  );
}
