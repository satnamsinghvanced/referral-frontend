import { Chip } from "@heroui/react";
import { ACTIVITY_STATUSES } from "../../consts/marketing";

export default function ActivityStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "scheduled":
      classNames = "bg-blue-100 text-blue-800 border-blue-200";
      break;
    case "in-progress":
      classNames = "bg-yellow-100 text-yellow-800 border-yellow-200";
      break;
    case "cancelled":
      classNames = "bg-red-100 text-red-800 border-red-200";
      break;

    default:
      classNames = "bg-emerald-100 text-emerald-800 border-emerald-200";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${classNames}`}
    >
      {ACTIVITY_STATUSES.find((option: any) => option.value === status)?.label}
    </Chip>
  );
}
