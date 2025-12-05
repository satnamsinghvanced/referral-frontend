import { Chip } from "@heroui/react";
import { AUDIENCE_SEGMENT_STATUSES } from "../../consts/campaign";

export default function AudienceSegmentStatusChip({
  status,
}: {
  status: string;
}) {
  let classNames;

  switch (status) {
    case "inactive":
      classNames = "bg-yellow-100 text-yellow-800 border-yellow-200";
      break;

    default:
      classNames = "bg-green-100 text-green-800 border-green-200";
      break;
  }

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${classNames}`}
    >
      {
        AUDIENCE_SEGMENT_STATUSES.find((option: any) => option.value === status)
          ?.label
      }
    </Chip>
  );
}
