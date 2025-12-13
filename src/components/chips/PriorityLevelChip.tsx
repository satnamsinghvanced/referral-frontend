import { Chip } from "@heroui/react";
import { PRIORITY_LEVELS } from "../../consts/practice";

export default function PriorityLevelChip({ level }: { level: string }) {
  let classNames;

  switch (level) {
    case "low":
      classNames = "bg-green-100 text-green-800";
      break;

    case "medium":
      classNames = "bg-yellow-100 text-yellow-800";
      break;

    default:
      classNames = "bg-red-100 text-red-800";
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
