import { Chip } from "@heroui/react";
import { TASK_TYPES } from "../../consts/practice";

export default function TaskCategoryChip({ category }: { category: string }) {
  let classNames;

  switch (category) {
    case "follow-up":
      classNames = "bg-orange-100 text-orange-800 border-orange-200";
      break;

    case "meeting":
      classNames = "bg-purple-100 text-purple-800 border-purple-200";
      break;

    case "call":
      classNames = "bg-yellow-100 text-yellow-800 border-yellow-200";
      break;

    case "email":
      classNames = "bg-indigo-100 text-indigo-800 border-indigo-200";
      break;

    default:
      classNames = "bg-pink-100 text-pink-800 border-pink-200";
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
