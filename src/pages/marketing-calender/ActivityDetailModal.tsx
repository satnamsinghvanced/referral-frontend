import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { LuSquarePen, LuTrash2 } from "react-icons/lu";
import ActivityStatusChip from "../../components/chips/ActivityStatusChip";
import TaskPriorityChip from "../../components/chips/TaskPriorityChip";
import { ActivityItem } from "../../types/marketing";
import { formatDateToMMDDYYYY } from "../../utils/formatDateToMMDDYYYY";

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col items-start">
    <label className="text-xs font-medium mb-1 block text-gray-700">
      {label}
    </label>
    {typeof value === "string" ? (
      <p className="text-xs text-gray-600">{value || "N/A"}</p>
    ) : (
      value
    )}
  </div>
);

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ActivityItem | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  deleteLoading: boolean;
}

export function ActivityDetailModal({
  isOpen,
  onClose,
  activity,
  onEdit,
  onDelete,
  deleteLoading,
}: ActivityDetailModalProps) {
  if (!activity) return;

  const dateTimeValue = `${formatDateToMMDDYYYY(activity.startDate)}${
    activity.time ? ` at ${activity.time}` : ""
  }`;

  const formattedBudget = activity.budget
    ? `$${activity.budget.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`
    : "N/A";

  const formattedReach = activity.reach
    ? activity.reach.toLocaleString()
    : "N/A";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        base: "max-w-xl",
        closeButton: "cursor-pointer",
      }}
      size="xl"
    >
      <ModalContent className="p-5">
        <ModalHeader className="flex flex-col gap-2 text-center sm:text-left flex-shrink-0 p-0 font-normal">
          <h4
            data-slot="dialog-title"
            className="text-base leading-none font-medium flex items-center gap-2"
          >
            {activity.title}
            <ActivityStatusChip status={activity.status} />
          </h4>
          <p className="text-gray-600 text-xs">
            View and manage details for this marketing activity including
            scheduling, budget, performance metrics, and engagement data.
          </p>
        </ModalHeader>

        <ModalBody className="gap-0 px-0 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Date & Time" value={dateTimeValue} />
            <DetailItem label="Platform" value={activity.platform || "N/A"} />
          </div>

          <div className="pt-2">
            <DetailItem
              label="Description"
              value={activity.description || "No description provided."}
            />
          </div>

          <div className={`grid grid-cols-${activity.reach ? "3" : "2"} gap-4`}>
            <DetailItem
              label="Priority"
              value={<TaskPriorityChip priority={activity.priority} />}
            />
            <DetailItem label="Budget" value={formattedBudget} />
            {activity.reach !== undefined && (
              <DetailItem label="Estimated Reach" value={formattedReach} />
            )}
          </div>
        </ModalBody>

        <ModalFooter className="flex items-center justify-between p-0">
          <Button
            color="danger"
            size="sm"
            radius="sm"
            onPress={() => activity._id && onDelete(activity._id)}
            startContent={<LuTrash2 className="size-4" />}
            isLoading={deleteLoading}
            isDisabled={deleteLoading || !activity._id}
          >
            Delete
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
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
              onPress={() => activity._id && onEdit(activity._id)}
              startContent={<LuSquarePen className="size-4" />}
              isDisabled={!activity._id}
            >
              Edit Activity
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
