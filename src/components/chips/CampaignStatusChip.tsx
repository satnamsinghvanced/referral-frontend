import { Chip } from "@heroui/react";
import { CAMPAIGN_STATUSES } from "../../consts/campaign";

export default function CampaignStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "scheduled":
      classNames =
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      break;

    case "paused":
      classNames =
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      break;

    case "draft":
      classNames =
        "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-foreground/10 dark:border-gray-700";
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
      {CAMPAIGN_STATUSES.find((option: any) => option.value === status)?.label}
    </Chip>
  );
}
