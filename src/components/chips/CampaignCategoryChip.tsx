import { Chip } from "@heroui/react";
import { CAMPAIGN_CATEGORIES } from "../../consts/campaign";

export default function CampaignCategoryChip({
  category,
}: {
  category: string;
}) {
  let classNames;

  switch (category) {
    case "patientFollowUp":
      classNames = "bg-green-100 text-green-800 border-green-200";
      break;

    case "newsletters":
      classNames = "bg-purple-100 text-purple-800 border-purple-200";
      break;

    case "announcements":
      classNames = "bg-orange-100 text-orange-800 border-orange-200";
      break;

    case "onboarding":
      classNames = "bg-teal-100 text-teal-800 border-teal-200";
      break;

    default:
      classNames = "bg-blue-100 text-blue-800 border-blue-200";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${classNames}`}
    >
      {
        CAMPAIGN_CATEGORIES.find((option: any) => option.value === category)
          ?.label
      }
    </Chip>
  );
}
