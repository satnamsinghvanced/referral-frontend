import { useMemo, useEffect } from "react";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_TYPES,
} from "../../../consts/practice";
import { useFetchTeamMembers } from "../../../hooks/settings/useTeam";
import {
  useCreateTask,
  useFetchPartners,
  useUpdateTask,
} from "../../../hooks/usePartner";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { TeamMember } from "../../../services/settings/team";
import { FetchPartnersResponse, TaskApiData } from "../../../types/partner";
import { formatCalendarDate } from "../../../utils/formatCalendarDate";

interface TaskActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: TaskApiData | null;
  refetch?: () => void;
  practices?: any;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Task title is required"),
  dueDate: Yup.string().required("Due date is required"),
  priority: Yup.string().required("Priority is required"),
  category: Yup.string().required("Task type is required"),
  practiceId: Yup.string().required("Practice is required"),
  assignTo: Yup.array().min(1, "At least one member must be assigned"),
});

const TaskActionModal = ({
  isOpen,
  onClose,
  task,
  refetch,
  practices,
}: TaskActionModalProps) => {
  const isEditMode = !!task;

  const { data: teamMembersData } = useFetchTeamMembers({ limit: 100 });
  const teamMembers = teamMembersData?.data;
  const activeTeamMembers = useMemo(
    () => teamMembers?.filter((member) => member.status === "active"),
    [teamMembers],
  );

  // @ts-ignore
  const { user } = useTypedSelector((state) => state.auth);

  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: task?.title || "",
      description: task?.description || "",
      dueDate: task?.dueDate || "",
      priority: task?.priority || TASK_PRIORITIES[0]?.value || "",
      category: task?.category || TASK_TYPES[0]?.key || "",
      status: task?.status || "not-started",
      // @ts-ignore
      assignTo:
        task?.assignTo?.map((m: any) => m._id) ??
        (activeTeamMembers && activeTeamMembers.length > 0
          ? []
          : [user?.userId]),
      // @ts-ignore
      practiceId: task?.practiceId?._id || practices?.[0]?._id,
    },
    validationSchema,
    onSubmit: (values) => {
      if (isEditMode && task) {
        updateTask(
          { taskId: task._id, data: values },
          {
            onSuccess: () => {
              if (refetch) refetch();
              handleClose();
            },
          },
        );
      } else {
        createTask(
          { ...values, assignTo: values.assignTo },
          {
            onSuccess: () => {
              if (refetch) refetch();
              handleClose();
            },
          },
        );
      }
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  const isLoading = isCreating || isUpdating;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      placement="center"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent className="p-4 flex flex-col gap-4 !my-2">
        <ModalHeader className="flex flex-col gap-2 p-0 pb-1">
          <h4 className="text-base leading-none font-medium">
            {isEditMode ? `Edit Task - ${task?.title}` : "Add New Task"}
          </h4>
          <p className="text-gray-500 dark:text-foreground/60 font-normal text-xs">
            {isEditMode
              ? "Update the task details and save changes"
              : "Create a new task with specific details"}
          </p>
        </ModalHeader>

        <ModalBody className="p-0">
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            {/* Practice Selection - Only show if creating or if we want to allow changing practice (usually we don't change practice of existing task, but keeping it editable or disabled depending on rqmt) */}
            {/* Task Title */}
            <div>
              <Input
                size="sm"
                radius="sm"
                label="Task Title"
                labelPlacement="outside"
                placeholder="Enter task title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                isInvalid={
                  !!formik.errors.title && (formik.touched.title as boolean)
                }
                errorMessage={formik.errors.title}
                isRequired
              />
            </div>

            {/* Description */}
            <div>
              <Textarea
                size="sm"
                radius="sm"
                label="Description"
                labelPlacement="outside"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                placeholder="Task description (optional)"
                classNames={{ inputWrapper: "py-2" }}
              />
            </div>

            {/* Due Date */}
            <div className="flex">
              <DatePicker
                label="Due Date"
                labelPlacement="outside"
                size="sm"
                radius="sm"
                hideTimeZone
                minValue={today(getLocalTimeZone())}
                value={
                  formik.values.dueDate
                    ? parseDate(formik.values.dueDate.split("T")[0] as string)
                    : null
                }
                onChange={(value) =>
                  formik.setFieldValue("dueDate", formatCalendarDate(value))
                }
                isInvalid={
                  !!formik.errors.dueDate && (formik.touched.dueDate as boolean)
                }
                errorMessage={formik.errors.dueDate}
                isRequired
              />
            </div>

            {/* Priority / Type / Status (Status only in Edit) */}
            <div
              className={`grid max-md:grid-cols-1 max-md:gap-4 ${
                isEditMode ? "grid-cols-3" : "grid-cols-2"
              } gap-2.5`}
            >
              <Select
                label="Priority"
                labelPlacement="outside"
                size="sm"
                radius="sm"
                selectedKeys={[formik.values.priority]}
                disabledKeys={[formik.values.priority]} // Why disabled in reference? Assuming copied logic, removing disabledKeys to allow edit
                onSelectionChange={(keys) =>
                  formik.setFieldValue("priority", Array.from(keys)[0])
                }
                isInvalid={
                  !!formik.errors.priority &&
                  (formik.touched.priority as boolean)
                }
                errorMessage={formik.errors.priority}
                isRequired
              >
                {TASK_PRIORITIES.map((p) => (
                  <SelectItem key={p.value} textValue={p.label}>
                    {p.label}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Category"
                labelPlacement="outside"
                size="sm"
                radius="sm"
                selectedKeys={[formik.values.category]}
                onSelectionChange={(keys) =>
                  formik.setFieldValue("category", Array.from(keys)[0])
                }
                isInvalid={
                  !!formik.errors.category &&
                  (formik.touched.category as boolean)
                }
                errorMessage={formik.errors.category}
                isRequired
              >
                {TASK_TYPES.map((t) => (
                  <SelectItem key={t.key} textValue={t.label}>
                    {t.label}
                  </SelectItem>
                ))}
              </Select>

              {isEditMode && (
                <Select
                  label="Status"
                  labelPlacement="outside"
                  size="sm"
                  radius="sm"
                  selectedKeys={[formik.values.status]}
                  onSelectionChange={(keys) =>
                    formik.setFieldValue("status", Array.from(keys)[0])
                  }
                  isInvalid={
                    !!formik.errors.status && (formik.touched.status as boolean)
                  }
                  errorMessage={formik.errors.status}
                  isRequired
                >
                  {TASK_STATUSES.map((s) => (
                    <SelectItem key={s.value} textValue={s.label}>
                      {s.label}
                    </SelectItem>
                  ))}
                </Select>
              )}
            </div>

            <div className="flex">
              <Select
                label="Related Office/Practice"
                labelPlacement="outside"
                size="sm"
                radius="sm"
                placeholder="Select practice"
                selectedKeys={
                  formik.values.practiceId
                    ? new Set([formik.values.practiceId])
                    : new Set()
                }
                disabledKeys={
                  formik.values.practiceId
                    ? new Set([formik.values.practiceId])
                    : new Set()
                }
                onSelectionChange={(keys) =>
                  formik.setFieldValue("practiceId", Array.from(keys)[0])
                }
                isDisabled={isEditMode} // Usually better not to move tasks between practices
                isInvalid={
                  !!formik.errors.practiceId &&
                  (formik.touched.practiceId as boolean)
                }
                errorMessage={formik.errors.practiceId as string}
                isLoading={!practices}
                isRequired
              >
                {practices?.map((practice: any) => (
                  <SelectItem key={practice._id} textValue={practice.name}>
                    {practice.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Assigned To */}
            <div className="flex flex-col justify-start gap-1">
              {activeTeamMembers && activeTeamMembers.length > 0 ? (
                <Select
                  label="Assigned To"
                  labelPlacement="outside"
                  size="sm"
                  radius="sm"
                  selectionMode="multiple"
                  placeholder="Select members"
                  selectedKeys={new Set(formik.values.assignTo)}
                  onSelectionChange={(keys) =>
                    formik.setFieldValue("assignTo", Array.from(keys))
                  }
                  isInvalid={
                    !!formik.errors.assignTo &&
                    (formik.touched.assignTo as boolean)
                  }
                  errorMessage={formik.errors.assignTo as string}
                  isRequired
                >
                  {(activeTeamMembers ?? []).map((tm: TeamMember) => (
                    <SelectItem
                      key={tm._id}
                      textValue={`${tm.firstName} ${tm.lastName}`}
                    >
                      {tm.firstName} {tm.lastName}
                    </SelectItem>
                  ))}
                </Select>
              ) : (
                <div className="text-xs text-gray-500 dark:text-foreground/60 italic">
                  No active team members found. Task will be assigned to you.
                  Add active team members in settings to assign tasks to others.
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-1">
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                color="default"
                onPress={handleClose}
                className="border-small"
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="solid"
                color="primary"
                type="submit"
                isDisabled={isLoading || !formik.isValid || !formik.dirty}
                isLoading={isLoading}
              >
                {isEditMode ? "Save Changes" : "Create Task"}
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TaskActionModal;
