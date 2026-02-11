import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { useFormik } from "formik";
import React, { useEffect, useMemo } from "react";
import * as Yup from "yup";
import { TASK_PRIORITIES } from "../../../../../consts/practice";
import { useFetchLocations } from "../../../../../hooks/settings/useLocation";
import { useFetchTeamMembers } from "../../../../../hooks/settings/useTeam";
import { TeamMember } from "../../../../../services/settings/team";
import { formatCalendarDate } from "../../../../../utils/formatCalendarDate";

interface ActionModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSave: (config: any) => void;
  initialData?: any;
}

const ACTION_TYPES = [
  { label: "Update Field", value: "update_field" },
  { label: "Send Notification", value: "send_notification" },
  { label: "Create Task", value: "create_task" },
];

const UPDATE_FIELDS = [
  { label: "Status", value: "status" },
  { label: "Rating", value: "rating" },
  { label: "Notes", value: "notes" },
  { label: "Category", value: "category" },
];

const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  initialData,
}) => {
  const { data: teamMembersData } = useFetchTeamMembers({ limit: 100 });
  const teamMembers = teamMembersData?.data;
  const activeTeamMembers = useMemo(
    () => teamMembers?.filter((member) => member.status === "active") || [],
    [teamMembers],
  );

  const { data: locationsData } = useFetchLocations();
  const practices = locationsData?.data || [];

  const validationSchema = Yup.object().shape({
    actionType: Yup.string().required("Action type is required"),
    // Update Field validations
    fieldToUpdate: Yup.string().when("actionType", {
      is: "update_field",
      then: (schema) => schema.required("Field to update is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    newValue: Yup.string().when("actionType", {
      is: "update_field",
      then: (schema) => schema.required("New value is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    // Notification validations
    notificationMessage: Yup.string().when("actionType", {
      is: "send_notification",
      then: (schema) => schema.required("Notification message is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    // Task validations
    taskTitle: Yup.string().when("actionType", {
      is: "create_task",
      then: (schema) => schema.required("Task title is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    priority: Yup.string().when("actionType", {
      is: "create_task",
      then: (schema) => schema.required("Priority is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    dueDate: Yup.string().when("actionType", {
      is: "create_task",
      then: (schema) => schema.required("Due date is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    assignTo: Yup.array().when("actionType", {
      is: "create_task",
      then: (schema) => schema.min(1, "At least one member must be assigned"),
      otherwise: (schema) => schema.nullable(),
    }),
    practiceId: Yup.string().when("actionType", {
      is: "create_task",
      then: (schema) => schema.required("Practice is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      actionType: initialData?.actionType || "update_field",
      fieldToUpdate: initialData?.fieldToUpdate || "status",
      newValue: initialData?.newValue || "",
      notificationMessage: initialData?.notificationMessage || "",
      taskTitle: initialData?.taskTitle || "",
      description: initialData?.description || "",
      priority: initialData?.priority || "medium",
      dueDate: initialData?.dueDate || "",
      assignTo: initialData?.assignTo || [],
      practiceId: initialData?.practiceId || "",
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
      onOpenChange();
    },
    enableReinitialize: true,
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      formik.resetForm({
        values: {
          actionType: initialData?.actionType || "update_field",
          fieldToUpdate: initialData?.fieldToUpdate || "status",
          newValue: initialData?.newValue || "",
          notificationMessage: initialData?.notificationMessage || "",
          taskTitle: initialData?.taskTitle || "",
          description: initialData?.description || "",
          priority: initialData?.priority || "medium",
          dueDate: initialData?.dueDate || "",
          assignTo: initialData?.assignTo || [],
          practiceId: initialData?.practiceId || "",
        },
      });
    }
  }, [isOpen, initialData]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      radius="lg"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-2 flex-shrink-0 p-4">
              <h3 className="text-base leading-none font-medium text-foreground">
                Configure Action
              </h3>
              <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal">
                Set up the parameters for this automation step
              </p>
            </ModalHeader>
            <ModalBody className="p-4 pt-0 flex flex-col gap-4">
              <Select
                label="Action Type"
                labelPlacement="outside"
                placeholder="Select action type..."
                selectedKeys={[formik.values.actionType]}
                disabledKeys={[formik.values.actionType]}
                onSelectionChange={(keys) =>
                  formik.setFieldValue(
                    "actionType",
                    Array.from(keys)[0] as string,
                  )
                }
                variant="flat"
                size="sm"
                radius="sm"
                isRequired
                isInvalid={
                  !!(formik.touched.actionType && formik.errors.actionType)
                }
                errorMessage={
                  formik.touched.actionType &&
                  (formik.errors.actionType as string)
                }
              >
                {ACTION_TYPES.map((type) => (
                  <SelectItem key={type.value} textValue={type.label}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>

              {formik.values.actionType === "update_field" && (
                <>
                  <Select
                    label="Field to Update"
                    labelPlacement="outside"
                    placeholder="Select field..."
                    selectedKeys={[formik.values.fieldToUpdate]}
                    disabledKeys={[formik.values.fieldToUpdate]}
                    onSelectionChange={(keys) =>
                      formik.setFieldValue(
                        "fieldToUpdate",
                        Array.from(keys)[0] as string,
                      )
                    }
                    variant="flat"
                    size="sm"
                    radius="sm"
                    isRequired
                    isInvalid={
                      !!(
                        formik.touched.fieldToUpdate &&
                        formik.errors.fieldToUpdate
                      )
                    }
                    errorMessage={
                      formik.touched.fieldToUpdate &&
                      (formik.errors.fieldToUpdate as string)
                    }
                  >
                    {UPDATE_FIELDS.map((field) => (
                      <SelectItem key={field.value} textValue={field.label}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="New Value"
                    labelPlacement="outside"
                    placeholder="Enter new value..."
                    value={formik.values.newValue}
                    onValueChange={(val) =>
                      formik.setFieldValue("newValue", val)
                    }
                    variant="flat"
                    size="sm"
                    radius="sm"
                    isRequired
                    isInvalid={
                      !!(formik.touched.newValue && formik.errors.newValue)
                    }
                    errorMessage={
                      formik.touched.newValue &&
                      (formik.errors.newValue as string)
                    }
                  />
                </>
              )}

              {formik.values.actionType === "send_notification" && (
                <Input
                  label="Notification Message"
                  labelPlacement="outside"
                  placeholder="Enter notification message..."
                  value={formik.values.notificationMessage}
                  onValueChange={(val) =>
                    formik.setFieldValue("notificationMessage", val)
                  }
                  variant="flat"
                  size="sm"
                  radius="sm"
                  isRequired
                  isInvalid={
                    !!(
                      formik.touched.notificationMessage &&
                      formik.errors.notificationMessage
                    )
                  }
                  errorMessage={
                    formik.touched.notificationMessage &&
                    (formik.errors.notificationMessage as string)
                  }
                />
              )}

              {formik.values.actionType === "create_task" && (
                <>
                  <Input
                    label="Task Title"
                    labelPlacement="outside"
                    placeholder="Enter task title..."
                    value={formik.values.taskTitle}
                    onValueChange={(val) =>
                      formik.setFieldValue("taskTitle", val)
                    }
                    variant="flat"
                    size="sm"
                    radius="sm"
                    isRequired
                    isInvalid={
                      !!(formik.touched.taskTitle && formik.errors.taskTitle)
                    }
                    errorMessage={
                      formik.touched.taskTitle &&
                      (formik.errors.taskTitle as string)
                    }
                  />

                  <Textarea
                    label="Task Description"
                    labelPlacement="outside"
                    placeholder="Describe the task..."
                    value={formik.values.description}
                    onValueChange={(val) =>
                      formik.setFieldValue("description", val)
                    }
                    variant="flat"
                    size="sm"
                    radius="sm"
                  />

                  <Select
                    label="Priority"
                    labelPlacement="outside"
                    placeholder="Select priority..."
                    selectedKeys={[formik.values.priority]}
                    disabledKeys={[formik.values.priority]}
                    onSelectionChange={(keys) =>
                      formik.setFieldValue(
                        "priority",
                        Array.from(keys)[0] as string,
                      )
                    }
                    variant="flat"
                    size="sm"
                    radius="sm"
                    isRequired
                    isInvalid={
                      !!(formik.touched.priority && formik.errors.priority)
                    }
                    errorMessage={
                      formik.touched.priority &&
                      (formik.errors.priority as string)
                    }
                  >
                    {TASK_PRIORITIES.map((p) => (
                      <SelectItem key={p.value} textValue={p.label}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <DatePicker
                    label="Due Date"
                    labelPlacement="outside"
                    size="sm"
                    radius="sm"
                    hideTimeZone
                    minValue={today(getLocalTimeZone())}
                    value={
                      formik.values.dueDate
                        ? parseDate(
                            formik.values.dueDate.split("T")[0] as string,
                          )
                        : null
                    }
                    onChange={(value) =>
                      formik.setFieldValue("dueDate", formatCalendarDate(value))
                    }
                    isInvalid={
                      !!formik.errors.dueDate &&
                      (formik.touched.dueDate as boolean)
                    }
                    errorMessage={
                      formik.touched.dueDate &&
                      (formik.errors.dueDate as string)
                    }
                    isRequired
                  />

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
                    isInvalid={
                      !!formik.errors.practiceId &&
                      (formik.touched.practiceId as boolean)
                    }
                    errorMessage={
                      formik.touched.practiceId &&
                      (formik.errors.practiceId as string)
                    }
                    isLoading={!practices.length}
                    isRequired
                  >
                    {practices.map((practice: any) => (
                      <SelectItem key={practice._id} textValue={practice.name}>
                        {practice.name}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label="Assigned To"
                    labelPlacement="outside"
                    size="sm"
                    radius="sm"
                    selectionMode="multiple"
                    placeholder="Select members"
                    selectedKeys={new Set(formik.values.assignTo)}
                    disabledKeys={new Set(formik.values.assignTo)}
                    onSelectionChange={(keys) =>
                      formik.setFieldValue("assignTo", Array.from(keys))
                    }
                    isInvalid={
                      !!formik.errors.assignTo &&
                      (formik.touched.assignTo as boolean)
                    }
                    errorMessage={
                      formik.touched.assignTo &&
                      (formik.errors.assignTo as string)
                    }
                    isRequired
                  >
                    {activeTeamMembers.map((tm: TeamMember) => (
                      <SelectItem
                        key={tm._id}
                        textValue={`${tm.firstName} ${tm.lastName}`}
                      >
                        {tm.firstName} {tm.lastName}
                      </SelectItem>
                    ))}
                  </Select>
                </>
              )}
            </ModalBody>
            <ModalFooter className="gap-2 p-4 pt-0">
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
                radius="sm"
                size="sm"
                variant="solid"
                color="primary"
                onPress={() => formik.handleSubmit()}
              >
                Save Configuration
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ActionModal;
