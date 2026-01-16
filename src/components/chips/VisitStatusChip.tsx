// import { Chip } from "@heroui/react";
// import { VISIT_STATUSES } from "../../consts/practice";

// export default function VisitStatusChip({ status }: { status: string }) {
//   let classNames;

//   switch (status) {
//     case "pending":
//       classNames = "bg-yellow-100 text-yellow-800";
//       break;

//     case "cancelled":
//       classNames = "bg-[#e0f2fe] text-[#0c4a6e]";
//       break;

//     default:
//       classNames = "bg-primary text-white";
//       break;
//   }

//   return (
//     <Chip
//       size="sm"
//       radius="sm"
//       className={`capitalize text-[11px] h-5 ${classNames}`}
//     >
//       {VISIT_STATUSES.find((option: any) => option.value === status)?.label}
//     </Chip>
//   );
// }

import { Chip } from "@heroui/react";
import { VISIT_STATUSES } from "../../consts/practice";

export default function VisitStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "inProgress":
      classNames =
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      break;

    case "cancel":
      classNames =
        "bg-[#e0f2fe] dark:bg-sky-900/30 text-[#0c4a6e] dark:text-sky-300";
      break;

    case "completed":
      classNames =
        "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      break;

    case "draft":
      classNames =
        "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      break;

    default:
      classNames = "bg-primary text-white";
      break;
  }

  const displayLabel =
    VISIT_STATUSES.find((option: any) => option.value === status)?.label ||
    (status === "cancel" ? "Cancelled" : status);

  return (
    <Chip
      size="sm"
      radius="sm"
      className={`capitalize text-[11px] h-5 ${classNames}`}
    >
      {displayLabel}
    </Chip>
  );
}
