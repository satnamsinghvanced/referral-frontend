import { Chip } from "@heroui/react";
import { VISIT_STATUSES } from "../../consts/practice";

export default function VisitStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "pending":
      classNames = "bg-yellow-100 text-yellow-800";
      break;

    case "cancel":
      classNames = "bg-[#e0f2fe] text-[#0c4a6e]";
      break;

    case "completed":
      classNames = "bg-green-100 text-green-600";
      break;

    default:
      classNames = "bg-primary text-white";
      break;
  }

  const displayLabel =
    VISIT_STATUSES.find((option: any) => option.value === status)?.label ||
    (status === "cancel" ? "Cancelled" : status);

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${classNames}`}
    >
      {displayLabel}
    </Chip>
  );
}
