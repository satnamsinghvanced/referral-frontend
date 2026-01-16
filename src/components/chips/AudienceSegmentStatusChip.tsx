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
      classNames =
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      break;

    default:
      classNames =
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
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
