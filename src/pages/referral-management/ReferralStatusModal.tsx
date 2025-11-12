import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useFormik } from "formik";
import { FiMail, FiPhone, FiUser } from "react-icons/fi";
import * as Yup from "yup";
import ReferralStatusChip from "../../components/chips/ReferralStatusChip";
import { STATUS_OPTIONS } from "../../consts/filters";
import { Referral, StatusUpdateFormValues } from "../../types/referral";
import { useUpdateReferral } from "../../hooks/useReferral";
import { queryClient } from "../../providers/QueryProvider";

interface ReferralStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  referral: Referral;
  isViewMode: boolean;
  setReferralEditId: any;
}

const ReferralStatusModal = ({
  isOpen = false,
  onClose,
  referral,
  isViewMode = false,
  setReferralEditId,
}: ReferralStatusModalProps) => {
  // Use the mock hook
  const { mutate: updateReferral, isPending } = useUpdateReferral();

  // 1. Validation Schema
  const validationSchema = Yup.object<StatusUpdateFormValues>().shape({
    status: Yup.string().required("New Status is required"),
    statusNotes: Yup.string()
      .max(500, "Notes must be under 500 characters")
      .nullable(),
  });

  // 2. Formik Setup
  const formik = useFormik<StatusUpdateFormValues>({
    enableReinitialize: true,
    initialValues: {
      status: referral?.status, // Initialize with current status
      statusNotes: referral?.statusNotes || "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload = {
        status: values.status,
        statusNotes: values.statusNotes || "",
      };

      updateReferral(
        { id: referral?._id, payload },
        {
          onSuccess: () => {
            setReferralEditId("");
            onClose();
            // formik.resetForm();
          },
        }
      );
    },
  });

  console.log(formik.values.status);
  let modalTitle = "Update Referral Status";
  let modalDescription = "Update the status and add notes for this referral.";

  if (isViewMode) {
    modalTitle = "Referral Details and Status";
    modalDescription = "View the patient's information, status and notes.";
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="md"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex-col px-5 font-normal space-y-1">
          <h2 className="text-base font-medium">{modalTitle}</h2>
          <p className="text-xs text-gray-600">{modalDescription}</p>
        </ModalHeader>

        {/* Dialog Body */}
        <ModalBody className="space-y-4 py-4 pt-1 px-5 gap-0">
          {/* Patient Info Card */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <FiUser className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">{referral?.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <FiPhone className="size-3.5 text-gray-600" />
                <span className="text-xs text-gray-600">{referral?.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMail className="size-3.5 text-gray-600" />
                <span className="text-xs text-gray-600">{referral?.email}</span>
              </div>
            </div>
            <div className="text-xs">
              <span className="text-gray-600">Referred by: </span>
              <span className="font-medium">{referral?.referredBy?.name}</span>
              {referral?.referredBy?.practice?.name && (
                <span className="text-gray-600">
                  {" "}
                  • {referral?.referredBy?.practice?.name}
                </span>
              )}
            </div>
            {referral?.treatment && (
              <div className="text-xs text-gray-600">
                Treatment: {referral?.treatment}
              </div>
            )}
          </div>

          {/* Current Status Badge */}
          <div className="space-y-2">
            <label className="text-xs">Current Status</label>
            <div>
              <ReferralStatusChip status={referral?.status} />
            </div>
          </div>

          {!isViewMode && (
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* New Status Select */}
              <div className="space-y-2">
                <Select
                  name="status"
                  id="status"
                  label="New Status"
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
                >
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} textValue={status.label}>
                      {status.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Status Notes Textarea */}
              <div className="space-y-2">
                <Textarea
                  id="statusNotes"
                  name="statusNotes"
                  label="Status Notes (Optional)"
                  labelPlacement="outside-top"
                  placeholder="Add any notes about this status change..."
                  rows={3}
                  size="sm"
                  radius="sm"
                  value={formik.values.statusNotes}
                  onValueChange={(val: string) =>
                    formik.setFieldValue("statusNotes", val)
                  }
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(formik.touched.statusNotes && formik.errors.statusNotes)
                  }
                  errorMessage={
                    formik.touched.statusNotes &&
                    (formik.errors.statusNotes as string)
                  }
                  classNames={{ inputWrapper: "py-2" }}
                />
              </div>

              {/* Original Notes Read-only */}
              {referral?.additionalNotes && (
                <div>
                  <label className="inline-block text-xs mb-2">
                    Original Notes
                  </label>
                  <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md border border-primary/15">
                    {referral?.additionalNotes}
                  </div>
                </div>
              )}

              {/* Dialog Footer with Buttons */}
              <div
                data-slot="dialog-footer"
                className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
              >
                <Button
                  size="sm"
                  radius="sm"
                  type="button"
                  variant="ghost"
                  onPress={onClose}
                  className="border-small"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  size="sm"
                  radius="sm"
                  isLoading={isPending}
                  isDisabled={!formik.isValid || isPending}
                >
                  Update Status
                </Button>
              </div>
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReferralStatusModal;
