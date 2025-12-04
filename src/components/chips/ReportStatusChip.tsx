import { Chip } from "@heroui/react";
import { REPORT_STATUSES } from "../../consts/reports";

export default function ReportStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "processing":
      classNames = "bg-yellow-100 text-yellow-800 border-yellow-200";
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
      {REPORT_STATUSES.find((option: any) => option.value === status)?.label}
    </Chip>
  );
}
