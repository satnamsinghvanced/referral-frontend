import { Chip } from "@heroui/react";
import { TASK_PRIORITIES } from "../../consts/practice";

export default function TaskPriorityChip({ priority }: { priority: string }) {
  let classNames;

  switch (priority) {
    case "low":
      classNames = "bg-[#e0f2fe] text-[#0c4a6e]";
      break;

    case "medium":
      classNames = "bg-yellow-100 text-yellow-700";
      break;

    default:
      classNames = "bg-red-100 text-red-700";
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
