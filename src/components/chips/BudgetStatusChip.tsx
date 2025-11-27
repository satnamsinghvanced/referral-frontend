import { Chip } from "@heroui/react";
import { BUDGET_STATUSES } from "../../consts/budget";

export default function BudgetStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "paused":
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
      {BUDGET_STATUSES.find((option: any) => option.value === status)?.label}
    </Chip>
  );
}
