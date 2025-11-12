import { Chip } from "@heroui/react";

interface UrgencyChipProps {
  urgency: string;
}

const UrgencyChip = ({ urgency }: UrgencyChipProps) => {
  const urgencyToLowercase = urgency.toLowerCase();
  let classNames;

  switch (urgencyToLowercase) {
    case "new":
      classNames = "bg-blue-100 text-blue-700";
      break;
    case "low":
      classNames = "bg-green-100 text-green-700";
      break;
    case "medium":
      classNames = "bg-yellow-100 text-yellow-700";
      break;
    case "high":
      classNames = "bg-red-100 text-red-700";
      break;
    default:
      classNames = "bg-gray-100 text-gray-700";
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
