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
import { formatDateToReadable } from "../../utils/formatDateToReadable";

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
  onEdit: () => void;
  onDelete: () => void;
}

export function ActivityDetailModal({
  isOpen,
  onClose,
  activity,
  onEdit,
  onDelete,
}: ActivityDetailModalProps) {
  if (!activity) return;

  const formattedBudget = `$${activity?.budget?.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

  const formattedReach = activity.reach
    ? activity.reach.toLocaleString()
    : "N/A";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        base: `max-sm:!m-3 !m-0`,
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
            {activity.status && <ActivityStatusChip status={activity.status} />}
          </h4>
          <p className="text-gray-600 text-xs">
            View and manage details for this marketing activity including
            scheduling, budget, performance metrics, and engagement data.
          </p>
        </ModalHeader>

        <ModalBody className="gap-0 px-0 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              label="Start Date"
              value={formatDateToReadable(activity.startDate, true)}
            />
            {activity.endDate ? (
              <DetailItem
                label="End Date"
                value={formatDateToReadable(activity.endDate, true)}
              />
            ) : (
              <DetailItem label="End Date" value="Same Day" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Platform" value={activity.platform || "N/A"} />
            {activity.priority && (
              <DetailItem
                label="Priority"
                value={<TaskPriorityChip priority={activity.priority} />}
              />
            )}
          </div>

          {(activity.budget || activity.reach) && (
            <div
              className={`grid grid-cols-${activity.reach ? "3" : "2"} gap-4`}
            >
              {activity.budget ? (
                <DetailItem label="Budget" value={formattedBudget} />
              ) : (
                ""
              )}
              {activity.reach !== undefined && (
                <DetailItem label="Estimated Reach" value={formattedReach} />
              )}
            </div>
          )}

          <div>
            <DetailItem
              label="Description"
              value={activity.description || "No description provided."}
            />
          </div>
        </ModalBody>

        <ModalFooter className="flex items-center justify-between p-0">
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
