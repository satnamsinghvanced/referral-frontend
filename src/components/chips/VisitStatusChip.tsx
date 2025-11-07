import { Chip } from "@heroui/react";
import { VISIT_STATUSES } from "../../consts/practice";

export default function VisitStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "cancelled":
      classNames = "bg-[#e0f2fe] text-[#0c4a6e]";
      break;

    default:
      classNames = "bg-primary text-white";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${classNames}`}
    >
      {VISIT_STATUSES.find((option: any) => option.value === status)?.label}
    </Chip>
  );
}
