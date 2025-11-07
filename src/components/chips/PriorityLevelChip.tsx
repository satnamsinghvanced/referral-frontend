import { Chip } from "@heroui/react";
import { PRIORITY_LEVELS } from "../../consts/practice";

export default function PriorityLevelChip({ level }: { level: string }) {
  let classNames;

  switch (level) {
    case "low":
      classNames = "bg-[#e0f2fe] text-[#0c4a6e]";
      break;

    case "medium":
      classNames = "bg-primary text-white";
      break;

    default:
      classNames = "bg-[#dc2626] text-white";
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
