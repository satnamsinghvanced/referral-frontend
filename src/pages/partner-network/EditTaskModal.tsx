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
import { useEffect, useMemo } from "react";
import { useScheduleTaskEvent, useUpdateTask } from "../../hooks/usePartner";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { TaskApiData } from "../../types/partner";
import { formatCalendarDate } from "../../utils/formatCalendarDate";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_TYPES,
} from "../../consts/practice";
import { useFetchTeamMembers } from "../../hooks/settings/useTeam";
import { TeamMember } from "../../services/settings/team";
import { useFormik } from "formik";
import * as Yup from "yup";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskApiData;
}

// 🧩 Yup Validation Schema
const validationSchema = Yup.object({
  title: Yup.string().required("Task title is required"),
  dueDate: Yup.string().required("Due date is required"),
  priority: Yup.string().required("Priority is required"),
  category: Yup.string().required("Task type is required"),
  status: Yup.string().required("Status is required"),
  assignTo: Yup.array().min(1, "At least one member must be assigned"),
});

const EditTaskModal = ({ isOpen, onClose, task }: EditTaskModalProps) => {
  const { data: teamMembersData } = useFetchTeamMembers({ limit: 100 });
  const teamMembers = teamMembersData?.data;

  // @ts-ignore
  const { user } = useTypedSelector((state) => state.auth);

  const activeTeamMembers = useMemo(
    () => teamMembers?.filter((member) => member.status === "active"),
    [teamMembers],
  );

  const { mutate: updateTask } = useUpdateTask();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      _id: task._id,
      title: task.title || "",
      description: task.description || "",
      dueDate: task.dueDate || "",
      priority: task.priority || "",
      category: task.category || "",
      status: task.status || "",
      assignTo: task.assignTo?.map((m: any) => m._id) ?? [],
      practiceId: task.practiceId || "",
    },
    validationSchema,
    onSubmit: (values) => {
      updateTask(
        { taskId: task._id, data: values },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    },
  });

  useEffect(() => {
    if (activeTeamMembers && activeTeamMembers.length === 0 && user?.userId) {
      if (formik.values.assignTo.length === 0) {
        formik.setFieldValue("assignTo", [user.userId]);
      }
    }
  }, [activeTeamMembers, user, formik.values.assignTo, formik]);

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent className="p-4 flex flex-col gap-4 !my-2">
        <ModalHeader className="flex flex-col gap-2 p-0">
          <h4 className="text-base leading-none font-medium text-foreground">
            Edit Task - {task?.title}
          </h4>
        </ModalHeader>

        <ModalBody className="p-0">
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            {/* Task Title */}
            <div>
              <Input
                size="sm"
                radius="sm"
                label="Task Title"
                labelPlacement="outside-top"
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
                labelPlacement="outside-top"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                placeholder="Task description"
                classNames={{ inputWrapper: "py-2" }}
              />
            </div>

            {/* Due Date */}
            <div>
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

            {/* Priority / Type / Status */}
            <div className="grid grid-cols-3 gap-2.5 max-md:grid-cols-1">
              <Select
                label="Priority"
                labelPlacement="outside"
                size="sm"
                selectedKeys={[formik.values.priority]}
                disabledKeys={[formik.values.priority]}
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
                  <SelectItem key={p.value}>{p.label}</SelectItem>
                ))}
              </Select>

              <Select
                label="Category"
                labelPlacement="outside"
                size="sm"
                selectedKeys={[formik.values.category]}
                disabledKeys={[formik.values.category]}
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
                  <SelectItem key={t.key}>{t.label}</SelectItem>
                ))}
              </Select>

              <Select
                label="Status"
                labelPlacement="outside"
                size="sm"
                selectedKeys={[formik.values.status]}
                disabledKeys={[formik.values.status]}
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
                  <SelectItem key={s.value}>{s.label}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Assigned To */}
            <div className="flex justify-start">
              {activeTeamMembers && activeTeamMembers.length > 0 ? (
                <Select
                  label="Assigned To"
                  labelPlacement="outside"
                  size="sm"
                  radius="sm"
                  selectionMode="multiple"
                  selectedKeys={new Set(formik.values.assignTo)}
                  onSelectionChange={(keys) =>
                    formik.setFieldValue("assignTo", Array.from(keys))
                  }
                  isRequired
                  isInvalid={
                    !!formik.errors.assignTo &&
                    (formik.touched.assignTo as boolean)
                  }
                  errorMessage={formik.errors.assignTo as string}
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
                <div className="text-xs text-gray-500 dark:text-foreground/40 italic">
                  No active team members found. Task will be assigned to you.
                  Add active team members to assign tasks to them.
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
                onPress={onClose}
                className="border-small"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="solid"
                color="primary"
                type="submit"
                isDisabled={!formik.isValid || !formik.dirty}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditTaskModal;
