import { Chip } from "@heroui/react";
import { NOTE_CATEGORIES } from "../../consts/practice";

export default function NoteCategoryChip({ category }: { category: string }) {
  let classNames;

  switch (category) {
    case "general":
      classNames =
        "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-foreground/10 dark:border-gray-700";
      break;

    case "referral":
      classNames =
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      break;

    case "contact":
      classNames =
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
      break;

    default:
      classNames =
        "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${classNames}`}
    >
      {NOTE_CATEGORIES.find((option: any) => option.value === category)?.label}
    </Chip>
  );
}
