import { Chip } from "@heroui/react";
import { PARTNER_LEVELS } from "../../consts/practice";

interface LevelChipProps {
  level: string;
}

const LevelChip = ({ level }: LevelChipProps) => {
  let classNames;

  switch (level) {
    case "A-Level":
      classNames = "bg-green-100 text-green-700 border-green-200";
      break;
    case "B-Level":
      classNames = "bg-blue-100 text-blue-700 border-blue-200";
      break;
    case "C-Level":
      classNames = "bg-yellow-100 text-yellow-700 border-yellow-200";
      break;
    default:
      classNames = "bg-gray-100 text-gray-700 border-gray-200";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`text-[11px] h-5 border capitalize ${classNames}`}
    >
      {PARTNER_LEVELS.find((option: any) => option.value === level)?.label}
    </Chip>
  );
};

export default LevelChip;
