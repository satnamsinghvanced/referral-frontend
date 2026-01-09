import { Chip } from "@heroui/react";
import { CALL_STATUSES } from "../../consts/call";

export default function CallStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "completed":
      classNames = "bg-green-100 text-green-800 border-green-200";
      break;
    case "no-answer":
    case "busy":
    case "failed":
      classNames = "bg-red-100 text-red-800 border-red-200";
      break;

    default:
      classNames = "bg-gray-100 text-gray-800 border-gray-200";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${classNames}`}
    >
      {CALL_STATUSES.find((option: any) => option.value === status)?.label}
    </Chip>
  );
}
