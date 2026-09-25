import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { LuSquarePen, LuTrash2 } from "react-icons/lu";
import { FiShare2 } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import ActivityStatusChip from "../../../components/chips/ActivityStatusChip";
import TaskPriorityChip from "../../../components/chips/TaskPriorityChip";
import { ACTIVITY_TYPES } from "../../../consts/marketing";
import { ActivityItem } from "../../../types/marketing";
import { formatDateToReadable } from "../../../utils/formatDateToReadable";
import { getLocationStyle } from "../../../utils/locationTheme";
import { useLocationContext } from "../../../providers/LocationContext";

const DetailItem: React.FC<{ label?: string; value: React.ReactNode; isMultiline?: boolean }> = ({ label, value, isMultiline = false }) => (
  <div className="flex flex-col items-start min-w-0 w-full">
    {label && (
      <label className="text-xs font-medium mb-1 block text-gray-700 dark:text-foreground/70">
        {label}
      </label>
    )}
    {typeof value === "string" ? (
      <p
        className={`text-xs text-gray-600 dark:text-foreground/50 ${isMultiline ? "break-words line-clamp-4" : "truncate max-w-full"}`}
        title={value}
      >
        {value || "N/A"}
      </p>
    ) : (
      value
    )}
  </div>
);

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ActivityItem | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function ActivityDetailModal({ isOpen, onClose, activity, onEdit, onDelete }: ActivityDetailModalProps) {
  if (!activity) return null;

  const { locations: contextLocations } = useLocationContext();

  const formattedBudget = `$${activity?.budget !== undefined && activity?.budget !== null ? activity.budget.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }) : "0"}`;

  const formattedReach = activity.reach && activity.reach !== "0"
    ? Number(activity.reach).toLocaleString()
    : activity.reach === "0" ? "0" : "3,200";

  const locName = activity.location || (activity.locations && activity.locations.length > 0 ? activity.locations[0] : null);
  const { dotColor } = getLocationStyle(locName || undefined, contextLocations);

  const activityTypeObj = ACTIVITY_TYPES.find((t: any) => t.value === activity.type);
  const ActivityIcon = activityTypeObj?.icon || FiShare2;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      classNames={{
        base: `max-lg:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="xl"
      placement="center"
    >
      <ModalContent className="p-4">
        <ModalHeader className="flex flex-col gap-2 flex-shrink-0 p-0 font-normal">
          <div className="flex items-center justify-between gap-3 pr-6 w-full">
            <div className="flex items-center gap-2 text-foreground truncate flex-1 min-w-0">
              <ActivityIcon className="size-4 text-foreground/80 shrink-0" />
              <h4
                data-slot="dialog-title"
                className="text-base font-medium text-foreground truncate"
                title={activity.title}
              >
                {activity.title}
              </h4>
            </div>
            {activity.status && (
              <div className="shrink-0">
                <ActivityStatusChip
                  status={
                    activity.status === "confirmed"
                      ? "scheduled"
                      : activity.status
                  }
                />
              </div>
            )}
          </div>
          <p className="text-gray-600 dark:text-foreground/60 text-xs">
            View and manage details for this marketing activity including
            scheduling, budget, performance metrics, and engagement data.
          </p>
        </ModalHeader>
        <ModalBody className="gap-4 px-0 py-4">
          {locName && (
            <div>
              {activity.isDefaultLocation ? (
                <span
                  title="Auto-assigned to default location because no exact match was found"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
                >
                  <HiOutlineLocationMarker className="size-3.5 text-amber-500 shrink-0" />
                  <span>{locName}</span>
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                  style={{
                    backgroundColor: `${dotColor}18`,
                    borderColor: `${dotColor}50`,
                    color: dotColor,
                  }}
                >
                  <HiOutlineLocationMarker className="size-3.5 shrink-0" style={{ color: dotColor }} />
                  <span>{locName}</span>
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <DetailItem
              label="Date & Time"
              value={formatDateToReadable(activity.startDate, true)}
            />
            <DetailItem
              label="Platform"
              value={activity.platform || "Instagram"}
            />
            <DetailItem
              label="Priority"
              value={
                activity.priority ? (
                  <TaskPriorityChip priority={activity.priority} />
                ) : (
                  "N/A"
                )
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              label="Budget"
              value={formattedBudget}
            />
            <DetailItem
              label="Estimated Reach"
              value={formattedReach}
            />
            <div className="col-span-2">
              <DetailItem
                label="Description"
                value={activity.description || "No description provided."}
                isMultiline
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex items-center justify-between p-0 pt-2">
          <Button
            color="danger"
            size="sm"
            radius="sm"
            onPress={() => onDelete()}
            startContent={<LuTrash2 className="size-4" />}
          >
            Delete
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              color="default"
              size="sm"
              radius="sm"
              onPress={onClose}
              className="border-small"
            >
              Close
            </Button>
            <Button
              color="primary"
              size="sm"
              radius="sm"
              onPress={() => onEdit()}
              startContent={<LuSquarePen className="size-4" />}
            >
              Edit Activity
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
