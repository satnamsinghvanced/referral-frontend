import { Chip } from "@heroui/react";
import { PRIORITY_LEVELS } from "../../consts/practice";

export default function PriorityLevelChip({ level }: { level: string }) {
  let classNames;

  switch (level) {
    case "low":
      classNames =
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      break;

    case "medium":
      classNames =
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      break;

    default:
      classNames =
        "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${classNames}`}
    >
      {PRIORITY_LEVELS.find((option: any) => option.value === level)?.label}
    </Chip>
  );
}
