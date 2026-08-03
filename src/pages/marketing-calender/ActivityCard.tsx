import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { FiGlobe, FiTrash2 } from "react-icons/fi";
import { LuCalendar } from "react-icons/lu";
import ActivityStatusChip from "../../components/chips/ActivityStatusChip";
import { ACTIVITY_TYPES } from "../../consts/marketing";
import { ActivityItem } from "../../types/marketing";
import { formatDateToReadable } from "../../utils/formatDateToReadable";

interface ActivityCardProps {
  activity: ActivityItem;
  onView: any;
  onDelete?: (activity: ActivityItem) => void;
}

export function ActivityCard({ activity, onView, onDelete }: ActivityCardProps) {
  const {
    _id,
    title,
    description,
    startDate,
    endDate,
    time,
    colorId,
    type = "googleCalendar",
    status,
    priority,
    budget,
    reach,
  } = activity;
  const activityType = ACTIVITY_TYPES.find(
    (activityType: any) => activityType.value == type,
  )?.label;
  const activityColor = ACTIVITY_TYPES.find(
    (activityType: any) => activityType.value == type,
  )?.color.value;

  return (
    <Card
      radius="none"
      className={`relative overflow-visible shadow-none bg-content1 !rounded-r-xl p-4 h-full flex flex-col justify-between border border-l-0 border-foreground/10`}
      onPress={() => onView(activity)}
      isPressable
      disableRipple
    >
      <div
        className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-[calc(100%+2px)] z-0"
        style={{
          background: activityColor ? activityColor : "#4285F4",
        }}
      ></div>
      <CardHeader className="flex justify-between items-start gap-3 mb-2 p-0 w-full">
        <h3 className="text-sm text-start font-medium text-foreground truncate flex-1 min-w-0" title={title}>
          {title}
        </h3>
        <div className="shrink-0">
          <ActivityStatusChip
            status={status === "confirmed" ? "scheduled" : status}
          />
        </div>
      </CardHeader>
      {(startDate || activityType || description) && (
        <CardBody className="text-sm text-gray-600 dark:text-foreground/60 space-y-2 mb-3 p-0">
          {startDate && (
            <div className="flex items-center gap-1.5">
              <LuCalendar fontSize={14} />
              <p className="flex items-center space-x-1 text-xs">
                <span>{formatDateToReadable(startDate, true)}</span>
              </p>
            </div>
          )}
          <p className="text-xs flex items-center gap-1.5 capitalize">
            <FiGlobe fontSize={14} />{" "}
            {activityType ? activityType : "Google Calendar"}
          </p>
          {description && (
            <p className="text-xs text-gray-600 dark:text-foreground/60 line-clamp-2">
              {description}
            </p>
          )}
        </CardBody>
      )}
      <CardFooter className="flex justify-between items-center text-gray-600 dark:text-foreground/40 text-xs p-0 pt-2 border-t border-foreground/5 mt-auto">
        <div className="flex items-center gap-2">
          {budget ? (
            <div className="text-emerald-600 dark:text-emerald-400 font-medium">
              ${budget} budget
            </div>
          ) : null}
          <div>{reach && reach != "0" ? `${reach} reach` : "No reach yet"}</div>
        </div>

        {onDelete && (
          <Button
            size="sm"
            radius="full"
            variant="light"
            isIconOnly
            onPress={(e: any) => {
              // @ts-ignore
              e?.stopPropagation?.();
              onDelete(activity);
            }}
            className="h-7 w-7 min-w-[28px] p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Delete Activity"
          >
            <FiTrash2 size={14} />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
