import { Chip } from "@heroui/react";
import { AUDIENCE_TYPES } from "../../consts/campaign";

export default function AudienceSegmentTypeChip({ type }: { type: string }) {
  let classNames;

  switch (type) {
    case "patients":
      classNames = "bg-green-100 text-green-800 border-green-200";
      break;

    case "referralPartners":
      classNames = "bg-purple-100 text-purple-800 border-purple-200";
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
      {AUDIENCE_TYPES.find((option: any) => option.value === type)?.label}
    </Chip>
  );
}
