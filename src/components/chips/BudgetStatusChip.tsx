import { Chip } from "@heroui/react";
import { BUDGET_STATUSES } from "../../consts/budget";

export default function BudgetStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "paused":
      classNames =
        "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800";
      break;

    default:
      classNames =
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
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
