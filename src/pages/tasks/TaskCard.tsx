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

function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: TaskApiData;
  onEdit: (task: TaskApiData) => void;
  onDelete: (taskId: string) => void;
}) {
  const { mutate: updateTask } = useUpdateTask();

  return (
    <Card
      className={`rounded-xl p-3.5 border shadow-none ${
        task.isOverDue
          ? "border-red-200 bg-red-50"
          : "bg-background border-primary/15"
      }`}
    >
      <CardHeader className="flex items-center justify-between gap-2 mb-2 p-0">
        <p className="text-sm">{task.title}</p>
        <TaskPriorityChip priority={task.priority} />
      </CardHeader>
      <CardBody className="p-0 overflow-hidden">
        <div className="flex flex-row justify-between">
          <div className="space-y-2">
            <p className="text-gray-600 text-xs flex items-center gap-1.5">
              <LuBuilding2 fontSize={14} /> {task.practiceId?.name}
            </p>
            <p
              className={`text-xs flex items-center gap-1.5 ${
                task.isOverDue ? "text-red-600" : "text-gray-600"
              }`}
            >
              <LuCalendar fontSize={14} /> Due:{" "}
              {formatDateToMMDDYYYY(task.dueDate)}
              {task.isOverDue && <LuInfo fontSize={12} />}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                isIconOnly
                size="sm"
                radius="sm"
                variant="light"
                color="primary"
                onPress={() => onEdit(task)}
              >
                <FiEdit className="size-3.5 text-gray-500" />
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
                trigger: `h-[30px] min-h-[30px] text-xs ${
                  task.isOverDue && "bg-background"
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
    </Card>
  );
}

export default TaskCard;
