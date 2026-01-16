import { Chip } from "@heroui/react";
import { AUDIENCE_TYPES } from "../../consts/campaign";

export default function AudienceSegmentTypeChip({ type }: { type: string }) {
  let classNames;

  switch (type) {
    case "patients":
      classNames =
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
      break;

    case "referralPartners":
      classNames =
        "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      break;

    default:
      classNames =
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${classNames}`}
    >
      {AUDIENCE_TYPES.find((option: any) => option.value === type)?.label}
    </Chip>
  );
}
