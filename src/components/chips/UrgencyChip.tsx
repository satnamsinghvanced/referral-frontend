import { Chip } from "@heroui/react";

interface UrgencyChipProps {
  urgency: string;
}

const UrgencyChip = ({ urgency }: UrgencyChipProps) => {
  const urgencyToLowercase = urgency.toLowerCase();
  let classNames;

  switch (urgencyToLowercase) {
    case "new":
      classNames =
        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      break;
    case "low":
      classNames =
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      break;
    case "medium":
      classNames =
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      break;
    case "high":
      classNames =
        "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      break;
    default:
      classNames =
        "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`text-[11px] h-5 capitalize ${classNames}`}
    >
      {urgency}
    </Chip>
  );
};

export default UrgencyChip;
