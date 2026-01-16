import { Chip } from "@heroui/react";
import { TASK_TYPES } from "../../consts/practice";

export default function TaskCategoryChip({ category }: { category: string }) {
  let classNames;

  switch (category) {
    case "follow-up":
      classNames =
        "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      break;

    case "meeting":
      classNames =
        "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      break;

    case "call":
      classNames =
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      break;

    case "email":
      classNames =
        "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
      break;

    default:
      classNames =
        "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${classNames}`}
    >
      {TASK_TYPES.find((option: any) => option.key === category)?.label}
    </Chip>
  );
}
