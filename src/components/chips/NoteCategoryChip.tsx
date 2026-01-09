import { Chip } from "@heroui/react";
import { NOTE_CATEGORIES } from "../../consts/practice";

export default function NoteCategoryChip({ category }: { category: string }) {
  let classNames;

  switch (category) {
    case "general":
      classNames = "bg-gray-100 text-gray-800 border-gray-200";
      break;

    case "referral":
      classNames = "bg-blue-100 text-blue-800 border-blue-200";
      break;

    case "contact":
      classNames = "bg-green-100 text-green-800 border-green-200";
      break;

    default:
      classNames = "bg-purple-100 text-purple-800 border-purple-200";
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
