import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
import { LoadingState } from "../../../components/common/LoadingState";
import { VISIT_STATUSES } from "../../../consts/practice";
import { useUpdateSchedulePlan } from "../../../hooks/usePartner";
import {
  SchedulePlan,
  VisitStatusUpdateFormValues,
} from "../../../types/partner";

interface ScheduleVisitStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: SchedulePlan;
  setVisitEdit: any;
}

const ScheduleVisitStatusModal = ({
  isOpen = false,
  onClose,
  visit,
  setVisitEdit,
}: ScheduleVisitStatusModalProps) => {
  const { mutate: updateSchedulePlan, isPending } = useUpdateSchedulePlan();

  const validationSchema = Yup.object<VisitStatusUpdateFormValues>().shape({
    status: Yup.string().required("Visit Status is required"),
    visitNotes: Yup.string()
      .max(500, "Notes must be under 500 characters")
      .nullable(),
    visitOutcome: Yup.string()
      .max(500, "Outcome must be under 500 characters")
      .nullable(),
    followUp: Yup.boolean().required(),
  });

  const formik = useFormik<VisitStatusUpdateFormValues>({
    enableReinitialize: true,
    initialValues: {
      status: visit?.status || "",
      visitNotes: visit?.visitNotes || "",
      visitOutcome: visit?.visitOutcome || "",
      followUp: visit?.followUp || false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload: VisitStatusUpdateFormValues = {
        status: values.status,
        visitNotes: values.visitNotes,
        visitOutcome: values.visitOutcome,
        followUp: values.followUp,
      };

      updateSchedulePlan(
        { id: visit?._id, data: payload },
        {
          onSuccess: () => {
            setVisitEdit(null);
            onClose();
          },
        },
      );
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  let modalTitle = "Update Schedule Visit Status";
  let modalDescription =
    "Update the status and record notes for this scheduled visit.";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      placement="center"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent className="max-h-[90vh] overflow-hidden p-0 w-full relative">
        <ModalHeader className="flex-col px-4 font-normal space-y-1">
          <h2 className="text-base font-medium text-foreground">
            {modalTitle}
          </h2>
          <p className="text-xs text-gray-600 dark:text-foreground/60">
            {modalDescription}
          </p>
        </ModalHeader>

        {!visit ? (
          <ModalBody className="py-4 pt-1 px-4 gap-0 min-h-[400px] flex items-center justify-center">
            <LoadingState />
          </ModalBody>
        ) : (
          <ModalBody className="space-y-4 py-4 pt-1 px-4 gap-0">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Select
                  name="status"
                  id="status"
                  label="Visit Status"
                  labelPlacement="outside"
                  placeholder="Select new status"
                  size="sm"
                  selectedKeys={[formik.values.status]}
                  disabledKeys={[formik.values.status]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    formik.setFieldValue("status", value);
                  }}
                  onBlur={() => formik.setFieldTouched("status", true)}
                  isInvalid={!!(formik.touched.status && formik.errors.status)}
                  errorMessage={
                    formik.touched.status && (formik.errors.status as string)
                  }
                  isRequired
                >
                  {VISIT_STATUSES.map((status) => (
                    <SelectItem key={status.value} textValue={status.label}>
                      {status.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Textarea
                  id="visitNotes"
                  name="visitNotes"
                  label="Visit Notes"
                  labelPlacement="outside-top"
                  placeholder="Add any internal notes about the visit..."
                  rows={3}
                  size="sm"
                  radius="sm"
                  value={formik.values.visitNotes || ""}
                  onValueChange={(val: string) =>
                    formik.setFieldValue("visitNotes", val)
                  }
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(formik.touched.visitNotes && formik.errors.visitNotes)
                  }
                  errorMessage={
                    formik.touched.visitNotes &&
                    (formik.errors.visitNotes as string)
                  }
                  classNames={{ inputWrapper: "py-2" }}
                />
              </div>

              <div className="space-y-2">
                <Textarea
                  id="visitOutcome"
                  name="visitOutcome"
                  label="Visit Outcome/Result"
                  labelPlacement="outside-top"
                  placeholder="Describe the result or outcome of the visit..."
                  rows={3}
                  size="sm"
                  radius="sm"
                  value={formik.values.visitOutcome || ""}
                  onValueChange={(val: string) =>
                    formik.setFieldValue("visitOutcome", val)
                  }
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(
                      formik.touched.visitOutcome && formik.errors.visitOutcome
                    )
                  }
                  errorMessage={
                    formik.touched.visitOutcome &&
                    (formik.errors.visitOutcome as string)
                  }
                  classNames={{ inputWrapper: "py-2" }}
                />
              </div>

              <div className="flex items-center">
                <Checkbox
                  size="sm"
                  radius="sm"
                  id="followUp"
                  name="followUp"
                  isSelected={formik.values.followUp}
                  onValueChange={(val: boolean) =>
                    formik.setFieldValue("followUp", val)
                  }
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(formik.touched.followUp && formik.errors.followUp)
                  }
                >
                  Follow-up Action Required
                </Checkbox>
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <Button
                  size="sm"
                  radius="sm"
                  type="button"
                  variant="ghost"
                  color="default"
                  onPress={onClose}
                  className="border-small"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="solid"
                  color="primary"
                  size="sm"
                  radius="sm"
                  isLoading={isPending}
                  isDisabled={!formik.isValid || isPending}
                >
                  Update Visit
                </Button>
              </div>
            </form>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ScheduleVisitStatusModal;
