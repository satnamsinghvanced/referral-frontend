import { useEffect, useMemo, useState } from "react";
import { Button, Card, CardBody, CardHeader, Select, SelectItem } from "@heroui/react";
import { LuBuilding2, LuCalendar, LuInfo, LuTrash2, LuFileText } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import TaskPriorityChip from "../../components/chips/TaskPriorityChip";
import { TASK_STATUSES } from "../../consts/practice";
import { useUpdateTask } from "../../hooks/usePartner";
import { TaskApiData } from "../../types/partner";
import { formatDateToMMDDYYYY } from "../../utils/formatDateToMMDDYYYY";
import { useLocationContext } from "../../providers/LocationContext";
import EditTaskNotesModal from "./modal/EditTaskNotesModal";

function TaskCard({
  task,
  onEdit,
  onDelete,
  refetch,
}: {
  task: TaskApiData;
  onEdit: (task: TaskApiData) => void;
  onDelete: (taskId: string) => void;
  refetch?: () => void;
}) {
  const { mutate: updateTask } = useUpdateTask();
  const { locations, getLocationColor } = useLocationContext();
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState(task.status);

  useEffect(() => {
    setLocalStatus(task.status);
  }, [task.status]);

  const locationBadge = useMemo(() => {
    const rawLocId =
      task.locationId?._id ||
      (typeof task.locationId === "string" ? task.locationId : null);
    if (!rawLocId) {
      if (task.locationId?.name) {
        return { name: task.locationId.name, color: getLocationColor(task.locationId._id) };
      }
      return { name: "Not Assigned", color: "#9ca3af" };
    }
    const found = locations?.find((l) => l._id === rawLocId);
    if (found) {
      return { name: found.name, color: getLocationColor(found._id) };
    }
    if (task.locationId?.name) {
      return { name: task.locationId.name, color: getLocationColor(rawLocId) };
    }
    return { name: "Not Assigned", color: "#9ca3af" };
  }, [locations, task.locationId, getLocationColor]);

  return (
    <Card
      className={`rounded-xl p-3.5 border shadow-none ${task.isOverDue
        ? "border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/30"
        : "bg-background dark:bg-content1 border-foreground/10"
        }`}
    >
      <CardHeader className="flex items-center justify-between gap-2 mb-2 p-0">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <p className="text-sm font-medium">{task.title}</p>
          {locationBadge && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0"
              style={{
                backgroundColor: `${locationBadge.color}15`,
                color: locationBadge.color,
                borderColor: `${locationBadge.color}40`,
              }}
            >
              <span
                className="size-1.5 rounded-full shrink-0"
                style={{ backgroundColor: locationBadge.color }}
              />
              <span className="truncate max-w-[120px]">{locationBadge.name}</span>
            </span>
          )}
        </div>
        <TaskPriorityChip priority={task.priority} />
      </CardHeader>
      <CardBody className="p-0 overflow-hidden">
        <div className="md:flex md:justify-between max-md:space-y-3">
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-foreground/60 text-xs flex items-center gap-1.5">
              <LuBuilding2 fontSize={14} /> {task.practiceId?.name}
            </p>
            <p
              className={`text-xs flex items-center gap-1.5 ${task.isOverDue
                ? "text-red-600 dark:text-red-400"
                : "text-gray-600 dark:text-foreground/60"
                }`}
            >
              <LuCalendar fontSize={14} /> Due:{" "}
              {formatDateToMMDDYYYY(task.dueDate)}
              {task.isOverDue && <LuInfo fontSize={12} />}
            </p>
          </div>
          <div className="flex items-center gap-2 max-md:flex-row-reverse max-md:justify-between max-sm:flex-col-reverse max-sm:items-start">
            <div className="flex items-center gap-1">
              <Button
                isIconOnly
                size="sm"
                radius="sm"
                variant="light"
                color="primary"
                onPress={() => onEdit(task)}
              >
                <FiEdit className="size-3.5 text-gray-500 dark:text-foreground/60" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                radius="sm"
                variant="light"
                color="danger"
                onPress={() => onDelete(task._id)}
              >
                <LuTrash2 className="size-3.5 text-red-500" />
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="bordered"
                onPress={() => setIsNotesOpen(true)}
                title="Edit Notes"
                className="border-small h-7.5"
                startContent={<LuFileText className="size-3.5" />}
              >
                Notes {task.comments && task.comments.length > 0 && (
                  <span className="ml-1 px-1.5 py-0 bg-sky-400 text-white text-[10px] rounded-full flex items-center justify-center min-w-[16px] h-4">
                    {task.comments.length}
                  </span>
                )}
              </Button>
            </div>
            <Select
              aria-label="Task Status"
              placeholder="All Statuses"
              size="sm"
              disableAnimation
              popoverProps={{ disableAnimation: true, shouldCloseOnScroll: false }}
              selectedKeys={localStatus ? [localStatus] : []}
              onSelectionChange={(keys) => {
                const newStatus = Array.from(keys)[0] as string;
                if (newStatus && newStatus !== localStatus) {
                  setLocalStatus(newStatus);
                  updateTask({
                    taskId: task._id,
                    data: { status: newStatus },
                  });
                }
              }}
              fullWidth={false}
              className="min-w-[180px] max-w-[200px]"
              classNames={{
                trigger: `h-[30px] min-h-[30px] text-xs ${task.isOverDue && "bg-background"
                  }`,
              }}
            >
              {TASK_STATUSES.map((status: any) => (
                <SelectItem key={status.value} textValue={status.label} className="capitalize">
                  {status.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </CardBody>
      <EditTaskNotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        task={task}
        refetch={refetch}
      />
    </Card>
  );
}

export default TaskCard;
