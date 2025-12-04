import { Chip } from "@heroui/react";
import { CAMPAIGN_STATUSES } from "../../consts/campaign";

export default function CampaignStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "scheduled":
      classNames = "bg-blue-100 text-blue-800 border-blue-200";
      break;
      
    case "paused":
      classNames = "bg-yellow-100 text-yellow-800 border-yellow-200";
      break;

    case "draft":
      classNames = "bg-gray-100 text-gray-800 border-gray-200";
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
      {CAMPAIGN_STATUSES.find((option: any) => option.value === status)?.label}
    </Chip>
  );
}
