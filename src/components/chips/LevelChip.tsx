import { Chip } from "@heroui/react";
import { PARTNER_LEVELS } from "../../consts/practice";

interface LevelChipProps {
  level: string;
}

const LevelChip = ({ level }: LevelChipProps) => {
  let classNames;

  switch (level) {
    case "A-Level":
      classNames =
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
      break;
    case "B-Level":
      classNames =
        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      break;
    case "C-Level":
      classNames =
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      break;
    default:
      classNames =
        "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-foreground/10 dark:border-gray-700";
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
