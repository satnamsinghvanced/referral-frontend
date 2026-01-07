import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useFormik } from "formik";
import { FiUser } from "react-icons/fi";
import * as Yup from "yup";
import PriorityLevelChip from "../../../components/chips/PriorityLevelChip";
import ReferralStatusChip from "../../../components/chips/ReferralStatusChip";
import { LoadingState } from "../../../components/common/LoadingState";
import { STATUS_OPTIONS } from "../../../consts/filters";
import { TREATMENT_OPTIONS } from "../../../consts/referral";
import { useUpdateReferral } from "../../../hooks/useReferral";
import { Referral, StatusUpdateFormValues } from "../../../types/referral";
import { formatDateToReadable } from "../../../utils/formatDateToReadable";

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
    estValue: Yup.number(),
    status: Yup.string().required("New Status is required"),
    statusNotes: Yup.string()
      .max(500, "Notes must be under 500 characters")
      .nullable(),
  });

  // 2. Formik Setup
  const formik = useFormik<StatusUpdateFormValues>({
    enableReinitialize: true,
    initialValues: {
      estValue: referral?.estValue || 0,
      status: referral?.status, // Initialize with current status
      statusNotes: referral?.statusNotes || "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload = {
        estValue: values.estValue,
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

        {!referral ? (
          <ModalBody className="py-4 pt-1 px-5 gap-0 min-h-[400px] flex items-center justify-center">
            <LoadingState />
          </ModalBody>
        ) : (
          <ModalBody className="space-y-4 py-4 pt-1 px-5 gap-0">
            {/* Patient Info Card */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <FiUser className="size-4 text-gray-600" />
                <span className="text-sm font-medium">{referral?.name}</span>
              </div>
              {referral?.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    Phone: {referral?.phone}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">
                  Email: {referral?.email}
                </span>
              </div>

              {referral?.createdAt && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    Referred on: {formatDateToReadable(referral.createdAt)}
                  </span>
                </div>
              )}
              {referral?.scheduledDate && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    Scheduled:{" "}
                    {formatDateToReadable(referral.scheduledDate, true)}
                  </span>
                </div>
              )}
              {referral?.referredBy?.name && (
                <div className="text-xs text-gray-600">
                  <span>Referred by: </span>
                  <span>{referral?.referredBy?.name}</span>
                  {referral?.referredBy?.practice?.name && (
                    <span> • {referral?.referredBy?.practice?.name}</span>
                  )}
                </div>
              )}
              {referral?.treatment && (
                <div className="text-xs text-gray-600">
                  Treatment:{" "}
                  {
                    TREATMENT_OPTIONS.find(
                      (treatmentOption: any) =>
                        treatmentOption.key === referral.treatment
                    )?.label
                  }
                </div>
              )}
              {referral?.addedVia && (
                <div className="text-xs text-gray-600">
                  Source: {referral?.addedVia}
                </div>
              )}
              {isViewMode && referral.estValue ? (
                <div className="text-xs text-gray-600">
                  Estimated Value: ${referral?.estValue}
                </div>
              ) : (
                ""
              )}
            </div>

            {/* Current Status Badge */}
            <div className="space-y-0.5">
              <label className="text-xs block">Current Status</label>
              <ReferralStatusChip status={referral?.status} />
            </div>

            <div className="space-y-0.5">
              <label className="text-xs block">Priority Level</label>
              <PriorityLevelChip level={referral?.priority as string} />
            </div>

            {referral?.additionalNotes && (
              <div className="space-y-0.5">
                <label className="text-xs block">Additional Notes</label>
                <p className="text-xs text-gray-600">
                  {referral?.additionalNotes}
                </p>
              </div>
            )}

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
                    isInvalid={
                      !!(formik.touched.status && formik.errors.status)
                    }
                    errorMessage={
                      formik.touched.status && (formik.errors.status as string)
                    }
                    isRequired
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
                      !!(
                        formik.touched.statusNotes && formik.errors.statusNotes
                      )
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

                {!isViewMode && (
                  <div>
                    <Input
                      size="sm"
                      radius="sm"
                      label="Estimated Value"
                      labelPlacement="outside-top"
                      placeholder="100"
                      type="number"
                      value={formik.values.estValue.toString()}
                      onValueChange={(value) =>
                        formik.setFieldValue("estValue", value)
                      }
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">$</span>
                        </div>
                      }
                    />
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
                    isDisabled={!formik.isValid || isPending || !formik.dirty}
                  >
                    Update Status
                  </Button>
                </div>
              </form>
            )}
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ReferralStatusModal;
