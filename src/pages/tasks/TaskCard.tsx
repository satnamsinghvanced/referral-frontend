import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { LuBuilding2, LuCalendar, LuInfo, LuTrash2 } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import TaskPriorityChip from "../../components/chips/TaskPriorityChip";
import { TASK_STATUSES } from "../../consts/practice";
import { useUpdateTask } from "../../hooks/usePartner";
import { TaskApiData } from "../../types/partner";
import { formatDateToMMDDYYYY } from "../../utils/formatDateToMMDDYYYY";
import { LuFileText } from "react-icons/lu";
import { useState } from "react";
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
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  return (
    <Card
      className={`rounded-xl p-3.5 border shadow-none ${task.isOverDue
        ? "border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/30"
        : "bg-background dark:bg-content1 border-foreground/10"
        }`}
    >
      <CardHeader className="flex items-center justify-between gap-2 mb-2 p-0">
        <p className="text-sm">{task.title}</p>
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
                className="border-small text-white h-7.5"
                startContent={<LuFileText className="size-3.5 text-white" />}
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
              selectedKeys={[task.status]}
              onSelectionChange={(keys) =>
                updateTask({
                  taskId: task._id,
                  data: { status: Array.from(keys)[0] },
                })
              }
              fullWidth={false}
              className="min-w-[180px] max-w-[200px]"
              classNames={{
                trigger: `h-[30px] min-h-[30px] text-xs ${task.isOverDue && "bg-background"
                  }`,
              }}
            >
              {TASK_STATUSES.map((status: any) => (
                <SelectItem key={status.value} className="capitalize">
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
