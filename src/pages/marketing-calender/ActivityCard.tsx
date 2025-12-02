import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { FiGlobe } from "react-icons/fi";
import { LuCalendar } from "react-icons/lu";
import ActivityStatusChip from "../../components/chips/ActivityStatusChip";
import { ACTIVITY_TYPES } from "../../consts/marketing";
import { ActivityItem } from "../../types/marketing";
import { formatDateToReadable } from "../../utils/formatDateToReadable";

interface ActivityCardProps {
  activity: ActivityItem;
  onView: any;
}

export function ActivityCard({ activity, onView }: ActivityCardProps) {
  const {
    _id,
    title,
    description,
    startDate,
    endDate,
    time,
    type,
    status,
    priority,
    budget,
    reach,
  } = activity;

  const activityColor = ACTIVITY_TYPES.find(
    (activityType: any) => activityType.label === type
  )?.color.value;

  console.log(startDate);

  return (
    <Card
      radius="none"
      className={`shadow-none bg-white !rounded-r-xl p-4 h-full flex flex-col justify-between border border-l-4 border-gray-100`}
      style={{ borderLeftColor: activityColor }}
      onPress={() => onView(activity)}
      isPressable
      disableRipple
    >
      <CardHeader className="flex justify-between items-start mb-2 p-0">
        <h3 className="text-sm font-medium">{title}</h3>
        <ActivityStatusChip status={status} />
      </CardHeader>

      {(startDate || type || description) && (
        <CardBody className="text-sm text-gray-600 space-y-2 mb-3 p-0">
          {startDate && (
            <div className="flex items-center gap-1.5">
              <LuCalendar fontSize={14} />
              <p className="flex items-center space-x-1 text-xs">
                <span>{formatDateToReadable(startDate, true)}</span>
              </p>
            </div>
          )}

          {type && (
            <p className="text-xs flex items-center gap-1.5 capitalize">
              <FiGlobe fontSize={14} /> {type}
            </p>
          )}

          {description && (
            <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
          )}
        </CardBody>
      )}

      <CardFooter className="flex justify-between items-center text-gray-600 text-xs p-0">
        {budget ? <div className="text-emerald-600">${budget} budget</div> : ""}
        <div>{reach && reach != "0" ? `${reach} reach` : "No reach yet"}</div>
      </CardFooter>
    </Card>
  );
}
