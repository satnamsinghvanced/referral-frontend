import { Chip } from "@heroui/react";

interface LevelChipProps {
  level: string;
}

const LevelChip = ({ level }: LevelChipProps) => {
  const normalizedLevel = level.toLowerCase();

  const getClassName = () => {
    switch (normalizedLevel) {
      case "a-level":
        return "bg-green-100 text-green-700 border-green-200";
      case "b-level":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "c-level":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const displayText = level.charAt(0).toUpperCase() + level.slice(1);

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`text-[11px] h-5 border capitalize ${getClassName()}`}
    >
      {displayText + " Partner"}
    </Chip>
  );
};

export default LevelChip;
