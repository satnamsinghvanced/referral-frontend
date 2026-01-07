import { Chip } from "@heroui/react";
import { STATUS_OPTIONS } from "../../consts/practice";

export default function PracticeStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "active":
      classNames = "bg-emerald-100 text-emerald-800";
      break;
    case "inActive":
      classNames = "bg-yellow-100 text-yellow-800";
      break;
    case "prospect":
      classNames = "bg-blue-100 text-blue-800";
      break;
    case "followUp":
      classNames = "bg-violet-100 text-violet-800";
      break;

    default:
      classNames = "bg-sky-100 text-sky-800";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${classNames}`}
    >
      {STATUS_OPTIONS.find((option: any) => option._id === status)?.title}
    </Chip>
  );
}
