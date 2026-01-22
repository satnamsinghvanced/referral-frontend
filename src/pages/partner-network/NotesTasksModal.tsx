import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Chip,
  DatePicker,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Textarea,
} from "@heroui/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { useEffect, useMemo, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import {
  LuClock,
  LuPlus,
  LuStickyNote,
  LuTrash2,
  LuUser,
} from "react-icons/lu";
import {
  NOTE_CATEGORIES,
  TASK_PRIORITIES,
  TASK_TYPES,
} from "../../consts/practice";
import { useFetchTeamMembers } from "../../hooks/settings/useTeam";
import {
  useCreateNote,
  useCreateTask,
  useDeleteNote,
  useDeleteTask,
  useGetAllNotesAndTasks,
  useUpdateTask,
} from "../../hooks/usePartner";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { TeamMember } from "../../services/settings/team";
import { TaskApiData } from "../../types/partner";
import { formatCalendarDate } from "../../utils/formatCalendarDate";
import { formatDateToReadable } from "../../utils/formatDateToReadable";
import EditTaskModal from "./EditTaskModal";
import PriorityLevelChip from "../../components/chips/PriorityLevelChip";
import TaskCategoryChip from "../../components/chips/TaskCategoryChip";
import NoteCategoryChip from "../../components/chips/NoteCategoryChip";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";

interface NotesTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  practice: any;
}

const NotesTasksModal = ({
  isOpen,
  onClose,
  practice,
}: // notes,
// tasks,
NotesTasksModalProps) => {
  const [activeTab, setActiveTab] = useState("notes");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteCategory, setNewNoteCategory] = useState(
    NOTE_CATEGORIES[0]?.value,
  );

  // State for new task
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState(
    TASK_PRIORITIES[0]?.value,
  );
  const [newTaskType, setNewTaskType] = useState(TASK_TYPES[0]?.key);
  const [newTaskAssignTo, setNewTaskAssignTo] = useState<string[]>([""]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskApiData | null>(null);

  const [deleteConfig, setDeleteConfig] = useState<{
    isOpen: boolean;
    type: "note" | "task" | null;
    id: string | null;
  }>({
    isOpen: false,
    type: null,
    id: null,
  });

  // @ts-ignore
  const { user } = useTypedSelector((state) => state.auth);

  const { data: teamMembersData } = useFetchTeamMembers({ limit: 100 });
  const teamMembers = teamMembersData?.data;
  const activeTeamMembers = useMemo(
    () => teamMembers?.filter((member) => member.status === "active"),
    [teamMembers],
  );

  useEffect(() => {
    if (activeTeamMembers && activeTeamMembers.length > 0) {
      setNewTaskAssignTo([activeTeamMembers[0]?._id as string]);
    } else if (user?.userId) {
      setNewTaskAssignTo([user.userId]);
    }
  }, [activeTeamMembers, user]);

  useEffect(() => {
    if (!isOpen) {
      setNewNoteContent("");
      setNewNoteCategory(NOTE_CATEGORIES[0]?.value);
      setNewTaskTitle("");
      setNewTaskDueDate("");
      setNewTaskDescription("");
      setNewTaskPriority(TASK_PRIORITIES[0]?.value);
      setNewTaskType(TASK_TYPES[0]?.key);
      if (activeTeamMembers && activeTeamMembers.length > 0) {
        setNewTaskAssignTo([activeTeamMembers[0]?._id as string]);
      } else if (user?.userId) {
        setNewTaskAssignTo([user.userId]);
      }
      setActiveTab("notes");
    }
  }, [isOpen]); // We want to reset when isOpen becomes false

  const { data } = useGetAllNotesAndTasks(practice?.id);
  const { mutate: createNote } = useCreateNote();
  const { mutate: deleteNote } = useDeleteNote();

  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  // const { mutate: updateTaskStatus } = useUpdateTaskStatus();
  const { mutate: deleteTask } = useDeleteTask();

  const notes = data?.notes;
  const tasks = data?.tasks;

  const getTaskColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "meeting":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300";
      case "follow-up":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-default-200/50 text-gray-800 dark:text-foreground/70";
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        size="md"
        classNames={{
          base: `max-sm:!m-3 !m-0`,
          closeButton: "cursor-pointer",
        }}
      >
        <ModalContent className="p-4 flex flex-col gap-4">
          <ModalHeader className="flex flex-col gap-2 text-center sm:text-left flex-shrink-0 p-0">
            <h4 className="text-base leading-none font-medium flex items-center space-x-2">
              <LuStickyNote className="size-5" />
              <span>Notes &amp; Tasks - {practice?.name}</span>
            </h4>
            <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal text-left">
              Manage notes and tasks for this referring practice to track
              interactions, follow-ups, and action items.
            </p>
          </ModalHeader>

          <div className="space-y-3">
            <div className="">
              <Tabs
                aria-label="Notes & Tasks"
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as string)}
                variant="light"
                radius="full"
                classNames={{
                  base: "bg-primary/15 dark:bg-background rounded-full p-1 w-full",
                  tabList: "flex w-full rounded-full p-0 gap-0",
                  tab: "flex-1 h-9 text-sm font-medium transition-all",
                  cursor: "rounded-full bg-white dark:bg-primary",
                  tabContent:
                    "dark:group-data-[selected=true]:text-primary-foreground text-default-500 dark:text-foreground/60 transition-colors",
                }}
                className="w-full"
              >
                {/* Notes Tab Content */}
                <Tab
                  title={`Notes${notes && ` (${notes?.length})`}`}
                  key="notes"
                  className="outline-none flex-1 overflow-y-auto space-y-3 py-0"
                >
                  <div className="mt-4 space-y-3">
                    <Card className="rounded-xl border border-foreground/10 shadow-none dark:bg-default-100/20">
                      <CardHeader className="px-4 pt-4">
                        <h4 className="text-sm">Add New Note</h4>
                      </CardHeader>
                      <CardBody className="px-4 pb-4 pt-0 space-y-3">
                        <Textarea
                          placeholder="Enter your note here..."
                          value={newNoteContent}
                          onChange={(e) => setNewNoteContent(e.target.value)}
                          className="min-h-[80px] resize-none"
                          radius="sm"
                        />
                        <div className="flex items-center space-x-2">
                          <Select
                            aria-label="Note Category"
                            selectedKeys={[newNoteCategory as string]}
                            disabledKeys={[newNoteCategory as string]}
                            onChange={(event) =>
                              setNewNoteCategory(event.target.value)
                            }
                            className="w-full"
                            size="sm"
                          >
                            {NOTE_CATEGORIES.map((cat) => (
                              <SelectItem key={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </Select>
                          <Button
                            color="primary"
                            isDisabled={!newNoteContent.trim()}
                            size="sm"
                            className="min-w-24 gap-1"
                            onPress={() => {
                              createNote(
                                {
                                  description: newNoteContent,
                                  category: newNoteCategory as string,
                                  practiceId: practice?.id,
                                },
                                {
                                  onSuccess: () => {
                                    setNewNoteContent("");
                                    setNewNoteCategory(
                                      NOTE_CATEGORIES[0]?.value,
                                    );
                                  },
                                },
                              );
                            }}
                          >
                            <LuPlus className="text-[15px]" />
                            Add Note
                          </Button>
                        </div>
                      </CardBody>
                    </Card>

                    {/* List of Existing Notes */}
                    <div className="space-y-3 max-h-[270px] overflow-auto">
                      {notes?.map((note) => (
                        <Card
                          key={note._id}
                          className="rounded-xl border border-foreground/10 shadow-none dark:bg-default-100/20"
                        >
                          <CardBody className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-gray-900 dark:text-foreground mb-2 text-sm">
                                  {note.description}
                                </p>
                                <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-foreground/60">
                                  <span className="flex items-center gap-1">
                                    <LuUser className="size-3.5" />
                                    <span className="text-xs">
                                      Current User
                                    </span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <LuClock className="size-3.5 ml-1" />
                                    <span className="text-xs">
                                      {formatDateToReadable(note.createdAt)}
                                    </span>
                                  </span>
                                  <NoteCategoryChip category={note.category} />
                                </div>
                              </div>
                              <Button
                                variant="light"
                                color="danger"
                                size="sm"
                                isIconOnly
                                onPress={() =>
                                  setDeleteConfig({
                                    isOpen: true,
                                    type: "note",
                                    id: note?._id,
                                  })
                                }
                              >
                                <LuTrash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                      {notes?.length === 0 && (
                        <div className="text-center text-gray-500 dark:text-foreground/40 py-2 text-sm">
                          No notes recorded for this partner yet.
                        </div>
                      )}
                    </div>
                  </div>
                </Tab>

                {/* Tasks Tab Content */}
                <Tab
                  title={`Tasks${tasks && ` (${tasks?.length})`}`}
                  key="tasks"
                  className="outline-none flex-1 overflow-y-auto space-y-3 py-0"
                >
                  <div className="mt-4 space-y-3">
                    <Card className="rounded-xl border border-foreground/10 shadow-none dark:bg-default-100/20">
                      <CardHeader className="px-4 pt-4">
                        <h4 className="text-sm">Add New Task</h4>
                      </CardHeader>
                      <CardBody className="px-4 pb-4 pt-0 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            type="text"
                            placeholder="Task Title"
                            size="sm"
                            radius="sm"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                          />
                          <DatePicker
                            className="max-w-[284px]"
                            aria-label="Due Date"
                            size="sm"
                            radius="sm"
                            minValue={today(getLocalTimeZone())}
                            value={
                              newTaskDueDate ? parseDate(newTaskDueDate) : null
                            }
                            onChange={(value) =>
                              setNewTaskDueDate(formatCalendarDate(value))
                            }
                          />
                        </div>
                        <Textarea
                          size="sm"
                          placeholder="Task description (optional)"
                          value={newTaskDescription}
                          onChange={(e) =>
                            setNewTaskDescription(e.target.value)
                          }
                          className="min-h-[60px] resize-none"
                        />
                        <div className="flex items-center space-x-2">
                          <Select
                            aria-label="Task Priority"
                            size="sm"
                            radius="sm"
                            selectedKeys={[newTaskPriority as string]}
                            disabledKeys={[newTaskPriority as string]}
                            onChange={(event) =>
                              setNewTaskPriority(event.target.value)
                            }
                          >
                            {TASK_PRIORITIES.map((p) => (
                              <SelectItem key={p.value}>{p.label}</SelectItem>
                            ))}
                          </Select>
                          <Select
                            aria-label="Task Type"
                            size="sm"
                            radius="sm"
                            selectedKeys={[newTaskType as string]}
                            disabledKeys={[newTaskType as string]}
                            onChange={(event) =>
                              setNewTaskType(event.target.value)
                            }
                          >
                            {TASK_TYPES.map((t) => (
                              <SelectItem key={t.key}>{t.label}</SelectItem>
                            ))}
                          </Select>
                        </div>
                        <div
                          className={`flex items-center space-x-2 ${
                            activeTeamMembers && activeTeamMembers.length > 0
                              ? ""
                              : "flex-col-reverse gap-2 items-stretch"
                          }`}
                        >
                          {activeTeamMembers && activeTeamMembers.length > 0 ? (
                            <Select
                              size="sm"
                              radius="sm"
                              aria-label="Assigned To"
                              placeholder="Select assign member"
                              selectionMode="multiple"
                              selectedKeys={newTaskAssignTo || new Set([])}
                              onSelectionChange={(keys: any) => {
                                const values = Array.from(keys) as string[];
                                setNewTaskAssignTo(values);
                              }}
                            >
                              {(activeTeamMembers ?? []).map(
                                (teamMember: TeamMember) => (
                                  <SelectItem
                                    key={teamMember._id}
                                    textValue={`${teamMember.firstName} ${teamMember.lastName}`}
                                  >
                                    {teamMember.firstName} {teamMember.lastName}
                                  </SelectItem>
                                ),
                              )}
                            </Select>
                          ) : (
                            <div className="text-xs text-gray-500 dark:text-foreground/40 italic flex-1">
                              No active team members found. Task will be
                              assigned to you. Add active team members to assign
                              tasks to them.
                            </div>
                          )}
                          <Button
                            color="primary"
                            isDisabled={
                              !newTaskTitle.trim() ||
                              !newTaskDueDate ||
                              !Array.isArray(newTaskAssignTo) ||
                              newTaskAssignTo.length < 1
                            }
                            onPress={() => {
                              createTask(
                                {
                                  title: newTaskTitle,
                                  description: newTaskDescription,
                                  priority: newTaskPriority as string,
                                  category: newTaskType as string,
                                  dueDate: newTaskDueDate,
                                  practiceId: practice?.id,
                                  assignTo: newTaskAssignTo || [],
                                },
                                {
                                  onSuccess: () => {
                                    setNewTaskTitle("");
                                    setNewTaskDescription("");
                                    setNewTaskDueDate("");
                                    setNewTaskPriority(
                                      TASK_PRIORITIES[0]?.value,
                                    );
                                    setNewTaskType(TASK_TYPES[0]?.key);
                                  },
                                },
                              );
                            }}
                            className="min-w-[100px]"
                            radius="sm"
                            size="sm"
                          >
                            <LuPlus className="size-3.5" />
                            Add Task
                          </Button>
                        </div>
                      </CardBody>
                    </Card>

                    {/* List of Existing Tasks */}
                    <div className="space-y-3 max-h-[340px] overflow-auto">
                      {tasks?.map((task) => (
                        <Card
                          key={task._id}
                          className={`rounded-xl border border-foreground/10 shadow-none dark:bg-default-100/20 ${
                            task.status === "completed" ? "opacity-60" : ""
                          }`}
                        >
                          <CardBody className="p-4">
                            <div className="flex items-start justify-between gap-0.5">
                              <div className="-mt-0.5">
                                <Checkbox
                                  size="sm"
                                  radius="sm"
                                  defaultSelected={task.status === "completed"}
                                  onValueChange={(isSelected: boolean) => {
                                    if (isSelected) {
                                      updateTask({
                                        taskId: task?._id,
                                        data: {
                                          status: "completed",
                                          practiceId: practice.id,
                                        },
                                      });
                                    } else {
                                      updateTask({
                                        taskId: task?._id,
                                        data: {
                                          status: "not-started",
                                          practiceId: practice.id,
                                        },
                                      });
                                    }
                                  }}
                                  classNames={{ base: "p-0 m-0" }}
                                />
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="space-y-1.5">
                                    <div
                                      className={`font-medium text-sm ${
                                        task.status === "completed"
                                          ? "line-through"
                                          : ""
                                      }`}
                                    >
                                      {task.title}
                                    </div>
                                    <div className="flex flex-wrap items-center justify-start gap-1.5 min-w-[140px]">
                                      <PriorityLevelChip
                                        level={task.priority}
                                      />
                                      <TaskCategoryChip
                                        category={task.category}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="light"
                                      color="primary"
                                      size="sm"
                                      isIconOnly
                                      onPress={() => {
                                        setTaskToEdit(task);
                                        setIsEditModalOpen(true);
                                      }}
                                    >
                                      <FiEdit className="size-3.5" />
                                    </Button>
                                    <Button
                                      variant="light"
                                      color="danger"
                                      size="sm"
                                      isIconOnly
                                      onPress={() =>
                                        setDeleteConfig({
                                          isOpen: true,
                                          type: "task",
                                          id: task?._id,
                                        })
                                      }
                                    >
                                      <LuTrash2 className="size-3.5" />
                                    </Button>
                                  </div>
                                </div>
                                {task.description && (
                                  <p className="text-xs text-gray-700 dark:text-foreground/70 mb-1.5">
                                    {task.description}
                                  </p>
                                )}
                                <div className="flex flex-col items-start gap-1.5 text-xs text-gray-600 dark:text-foreground/40">
                                  <p>
                                    Due: {formatDateToReadable(task.dueDate)}
                                  </p>
                                  {task.assignTo &&
                                    task.assignTo?.length > 0 && (
                                      <p className="flex items-center space-x-1">
                                        <LuUser className="size-3.5" />
                                        <span>
                                          {task.assignTo
                                            ?.map((assignMember: any) => {
                                              return `${assignMember.firstName} ${assignMember.lastName}`;
                                            })
                                            .join(", ")}
                                        </span>
                                      </p>
                                    )}
                                  {task.status === "completed" && (
                                    <Chip
                                      size="sm"
                                      variant="light"
                                      color="success"
                                      className="gap-0.5 px-0"
                                      startContent={
                                        <IoCheckmarkCircleOutline className="size-3.5" />
                                      }
                                    >
                                      Completed
                                    </Chip>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                      {tasks?.length === 0 && (
                        <div className="text-center text-gray-500 dark:text-foreground/40 py-2 text-sm">
                          No tasks for this partner yet.
                        </div>
                      )}
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </ModalContent>
      </Modal>

      {taskToEdit && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={taskToEdit}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteConfig.isOpen}
        onClose={() => setDeleteConfig({ isOpen: false, type: null, id: null })}
        onConfirm={() => {
          if (deleteConfig.type === "note" && deleteConfig.id) {
            deleteNote(
              {
                noteId: deleteConfig.id,
                partnerId: practice?.id,
              },
              {
                onSuccess: () =>
                  setDeleteConfig({ isOpen: false, type: null, id: null }),
              },
            );
          } else if (deleteConfig.type === "task" && deleteConfig.id) {
            deleteTask(deleteConfig.id, {
              onSuccess: () =>
                setDeleteConfig({ isOpen: false, type: null, id: null }),
            });
          }
        }}
        title={`Delete ${deleteConfig.type === "note" ? "Note" : "Task"}`}
        description={`Are you sure you want to delete this ${
          deleteConfig.type === "note" ? "note" : "task"
        }?`}
      />
    </>
  );
};

export default NotesTasksModal;
