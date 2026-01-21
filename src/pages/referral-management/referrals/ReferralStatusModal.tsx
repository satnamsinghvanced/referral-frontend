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
import { useEffect } from "react";
import {
  LuArrowRight,
  LuCalendar,
  LuDollarSign,
  LuMail,
  LuMessageSquare,
  LuPhone,
  LuStethoscope,
  LuTag,
  LuUser,
  LuUsers,
  LuClock,
} from "react-icons/lu";
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
  const { mutate: updateReferral, isPending } = useUpdateReferral();

  const validationSchema = Yup.object<StatusUpdateFormValues>().shape({
    estValue: Yup.number(),
    status: Yup.string().required("New Status is required"),
    statusNotes: Yup.string()
      .max(500, "Notes must be under 500 characters")
      .nullable(),
  });

  const formik = useFormik<StatusUpdateFormValues>({
    enableReinitialize: true,
    initialValues: {
      estValue: referral?.estValue || 0,
      status: referral?.status,
      statusNotes: referral?.statusNotes || "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload = {
        estValue: Number(values.estValue),
        status: values.status,
        statusNotes: values.statusNotes || "",
      };

      updateReferral(
        { id: referral?._id, payload },
        {
          onSuccess: () => {
            setReferralEditId("");
            formik.resetForm();
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

  const modalTitle = isViewMode ? "Referral Details" : "Update Referral Status";
  const modalDescription = isViewMode
    ? "View patient information and current progress."
    : "Update the status and add internal notes for this referral.";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 px-4">
          <h4 className="text-base font-medium dark:text-white">
            {modalTitle}
          </h4>
          <p className="text-xs text-gray-500 font-normal dark:text-foreground/60">
            {modalDescription}
          </p>
        </ModalHeader>

        {!referral ? (
          <ModalBody className="py-8 flex items-center justify-center">
            <LoadingState />
          </ModalBody>
        ) : (
          <ModalBody className="py-0 px-4 gap-3">
            {/* Patient Header Section */}
            <div className="border border-foreground/10 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                  <LuUser size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium dark:text-white truncate">
                    {referral?.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ReferralStatusChip status={referral?.status} />
                    <PriorityLevelChip level={referral?.priority as string} />
                  </div>
                </div>
                {referral?.estValue && referral?.estValue > 0 ? (
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-default-400 tracking-wider">
                      Est. Value
                    </p>
                    <p className="text-sm font-bold text-success flex items-center justify-end">
                      <LuDollarSign size={12} />
                      {referral?.estValue.toLocaleString()}
                    </p>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-4 pt-3 border-t border-foreground/5">
                <InfoItem
                  icon={<LuPhone size={16} />}
                  label="Phone"
                  value={referral?.phone || "N/A"}
                />
                <InfoItem
                  icon={<LuMail size={16} />}
                  label="Email"
                  value={referral?.email || "N/A"}
                />
                <InfoItem
                  icon={<LuCalendar size={16} />}
                  label="Referred On"
                  value={formatDateToReadable(referral.createdAt)}
                />
                <InfoItem
                  icon={<LuUsers size={16} />}
                  label="Referred By"
                  value={referral?.referredBy?.name || "Self"}
                />
                <InfoItem
                  icon={<LuStethoscope size={16} />}
                  label="Treatment"
                  value={
                    TREATMENT_OPTIONS.find(
                      (opt: any) => opt.key === referral.treatment,
                    )?.label || "Not specified"
                  }
                />
                <InfoItem
                  icon={<LuArrowRight size={16} />}
                  label="Source"
                  value={referral?.addedVia || "Manually Added"}
                />
              </div>
            </div>

            {/* Communication Section */}
            {(referral?.additionalNotes || referral?.statusNotes) && (
              <div className="border border-foreground/10 rounded-xl p-4 space-y-3">
                <h4 className="font-medium text-xs dark:text-foreground/80 flex items-center gap-2">
                  <LuMessageSquare size={14} className="text-primary" />
                  Notes & History
                </h4>
                <div className="space-y-2">
                  {referral?.additionalNotes && (
                    <div className="bg-foreground/[0.02] dark:bg-foreground/[0.04] p-3 rounded-lg border border-divider">
                      <p className="text-[10px] uppercase font-bold text-default-400 mb-1">
                        Original Notes
                      </p>
                      <p className="text-xs text-foreground/80 leading-relaxed italic">
                        "{referral.additionalNotes}"
                      </p>
                    </div>
                  )}
                  {referral?.statusNotes && (
                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                      <div className="flex items-center gap-1.5 mb-1">
                        <LuClock size={10} className="text-primary" />
                        <p className="text-[10px] uppercase font-bold text-primary">
                          Status Update Note
                        </p>
                      </div>
                      <p className="text-xs text-foreground/90 font-medium">
                        {referral.statusNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Update Form Section */}
            {!isViewMode && (
              <div className="border border-foreground/10 rounded-xl p-4 space-y-4 mb-4">
                <h4 className="font-medium text-sm dark:text-white">
                  Update Progress
                </h4>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      name="status"
                      label="New Status"
                      labelPlacement="outside"
                      placeholder="Select status"
                      size="sm"
                      radius="sm"
                      variant="flat"
                      selectedKeys={[formik.values.status]}
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0] as string;
                        formik.setFieldValue("status", value);
                      }}
                      onBlur={() => formik.setFieldTouched("status", true)}
                      isInvalid={
                        !!(formik.touched.status && formik.errors.status)
                      }
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} textValue={status.label}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Input
                      label="Estimated Value"
                      labelPlacement="outside"
                      placeholder="0.00"
                      size="sm"
                      radius="sm"
                      variant="flat"
                      type="number"
                      value={formik.values.estValue.toString()}
                      onValueChange={(value) =>
                        formik.setFieldValue("estValue", value)
                      }
                      startContent={
                        <span className="text-default-400 text-xs">$</span>
                      }
                    />
                  </div>

                  <Textarea
                    label="Status Notes"
                    labelPlacement="outside"
                    placeholder="Add specific context about this status change..."
                    size="sm"
                    radius="sm"
                    variant="flat"
                    minRows={3}
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
                  />

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      radius="sm"
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
                      Save Progress
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {isViewMode && (
              <div className="flex justify-end gap-2 pb-4 pt-1">
                <Button
                  size="sm"
                  radius="sm"
                  variant="ghost"
                  color="default"
                  onPress={onClose}
                  className="border-small"
                >
                  Close
                </Button>
              </div>
            )}
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-2.5 group min-w-0">
    <div className="p-1.5 rounded-md bg-default-100 text-default-400 group-hover:bg-default-200 transition-colors shrink-0">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] uppercase font-semibold text-default-400 tracking-wider">
        {label}
      </p>
      <p className="text-xs font-medium dark:text-white truncate">{value}</p>
    </div>
  </div>
);

export default ReferralStatusModal;
