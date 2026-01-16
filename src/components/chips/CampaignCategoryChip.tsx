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
      classNames =
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
      break;

    case "newsletters":
      classNames =
        "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      break;

    case "announcements":
      classNames =
        "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      break;

    case "onboarding":
      classNames =
        "bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800";
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
      {
        CAMPAIGN_CATEGORIES.find((option: any) => option.value === category)
          ?.label
      }
    </Chip>
  );
}
