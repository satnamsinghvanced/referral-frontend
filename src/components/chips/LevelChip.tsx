import { Chip } from "@heroui/react";

interface LevelChipProps {
  level: string;
}

const LevelChip = ({ level }: LevelChipProps) => {
  const normalizedLevel = level.toLowerCase();

  const getClassName = () => {
    if (normalizedLevel.includes("a-level")) {
      return "bg-green-100 text-green-700 border-green-200";
    }
    if (normalizedLevel.includes("b-level")) {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }
    if (normalizedLevel.includes("c-level")) {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  // Extract the main level (e.g., "A-Level") for display text
  const mainLevel = normalizedLevel.includes("a-level")
    ? "A-Level"
    : normalizedLevel.includes("b-level")
    ? "B-Level"
    : normalizedLevel.includes("c-level")
    ? "C-Level"
    : normalizedLevel.charAt(0).toUpperCase() + normalizedLevel.slice(1);

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`text-[11px] h-5 border capitalize ${getClassName()}`}
    >
      {mainLevel + " Partner"}
    </Chip>
  );
};

export default LevelChip;
