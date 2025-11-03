import { Chip } from "@heroui/react";

export default function ReferralStatusChip({ status }: { status: string }) {
  let classNames;

  switch (status) {
    case "scheduled":
      classNames = "bg-indigo-100 text-indigo-800";
      break;
    case "completed":
      classNames = "bg-green-100 text-green-800";
      break;
    case "consultation":
      classNames = "bg-teal-100 text-teal-800";
      break;
    case "inTreatment":
      classNames = "bg-emerald-100 text-emerald-800";
      break;
    case "noShow":
      classNames = "bg-gray-100 text-gray-800";
      break;
    case "contacted":
      classNames = "bg-blue-100 text-blue-800";
      break;
    case "appointed":
      classNames = "bg-purple-100 text-purple-800";
      break;
    case "inProcess":
      classNames = "bg-yellow-100 text-yellow-800";
      break;
    case "started":
      classNames = "bg-green-100 text-green-800";
      break;
    case "declined":
      classNames = "bg-red-100 text-red-800";
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
      {status}
    </Chip>
  );
}
