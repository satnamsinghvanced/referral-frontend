import { Chip } from "@heroui/react";
import { STATUS_OPTIONS } from "../../consts/filters";

export default function ReferralStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "scheduled":
      classNames =
        "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300";
      break;
    case "completed":
      classNames =
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      break;
    case "consultation":
      classNames =
        "bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300";
      break;
    case "inTreatment":
      classNames =
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300";
      break;
    case "noShow":
      classNames =
        "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
      break;
    case "contacted":
      classNames =
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      break;
    case "appointed":
      classNames =
        "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300";
      break;
    case "inProcess":
      classNames =
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      break;
    case "started":
      classNames =
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      break;
    case "declined":
      classNames =
        "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      break;

    default:
      classNames =
        "bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${classNames}`}
    >
      {STATUS_OPTIONS.find((option: any) => option.value === status)?.label}
    </Chip>
  );
}
