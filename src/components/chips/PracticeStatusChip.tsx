import { Chip } from "@heroui/react";

interface PracticeStatusChipProps {
  status: string;
}

const PracticeStatusChip = ({ status }: PracticeStatusChipProps) => {
  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${
        status === "active"
          ? "bg-green-100 text-green-800"
          : status === "contacted"
          ? "bg-yellow-100 text-yellow-600"
          : status === "scheduled"
          ? "bg-green-100 text-green-600"
          : status === "completed"
          ? "bg-gray-100 text-gray-600 dark:text-gray-400"
          : status === "cancelled"
          ? "bg-red-100 text-red-600"
          : "bg-sky-100 text-sky-700"
      }`}
    >
      {status}
    </Chip>
  );
};

export default PracticeStatusChip;
