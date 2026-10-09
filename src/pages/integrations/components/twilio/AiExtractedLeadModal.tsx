import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem, addToast } from "@heroui/react";
import { FiCheck, FiFileText } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { RecordedCall } from "../../../phone-service/mockData";
import axios from "../../../../services/axios";

interface AiExtractedLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  call: RecordedCall | null;
  onSaveLeadSuccess: (callId: string, updatedFields: Partial<RecordedCall>) => void;
}

export default function AiExtractedLeadModal({ isOpen, onClose, call, onSaveLeadSuccess }: AiExtractedLeadModalProps) {
  const [callerName, setCallerName] = useState("");
  const [patientType, setPatientType] = useState<"New Patient" | "Existing Patient">("New Patient");
  const [reasonForCall, setReasonForCall] = useState("");
  const [insurance, setInsurance] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (call) {
      setCallerName(call.callerName || "");
      setPatientType(call.patientType || "New Patient");
      setReasonForCall(call.reasonForCall || "");
      setInsurance(call.insurance || "Unknown");
      setRequestedDate(call.requestedDate || "Flexible");
      setNotes(call.notes || `${call.reasonForCall || "Call inquiry"} — extracted from transcript`);
    }
  }, [call]);

  if (!call) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const payload = {
        callerName,
        patientType,
        reasonForCall,
        insurance,
        requestedDate,
        notes,
        phone: call.phoneNumber,
      };
      const response = (await axios.post(`/twilio-checkout/draft-leads/${call.id}/save`, payload)) as any;
      onSaveLeadSuccess(call.id, {
        callerName,
        patientType,
        reasonForCall,
        insurance,
        requestedDate,
        notes,
        isLeadSaved: true,
        leadId: response?.data?.leadId || response?.leadId,
      });
      addToast({
        title: "Lead Saved",
        description: `Successfully saved ${callerName} as a lead in Lead Tracking!`,
        color: "success",
      });
      onClose();
    } catch (err: any) {
      addToast({
        title: "Failed to Save Lead",
        description: err?.response?.data?.message || err.message || "Could not save lead",
        color: "danger",
      });
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="2xl"
      scrollBehavior="inside"
      placement="center"
      className="m-2 sm:m-0 max-h-[90vh]"
    >
      <ModalContent className="max-h-[90vh] flex flex-col my-auto overflow-hidden">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-4 py-3 shrink-0 border-b border-foreground/10">
              <div className="flex items-center gap-2 text-foreground">
                <HiOutlineSparkles className="w-5 h-5 text-amber-500 shrink-0" />
                <h4 className="text-base font-medium dark:text-white truncate">
                  AI-Extracted Lead Information
                </h4>
              </div>
              <p className="text-xs text-gray-500 font-normal dark:text-foreground/60">
                Review and edit the fields extracted from the call transcript, then save as a lead.
              </p>
            </ModalHeader>
            <ModalBody className="py-3 px-4 gap-3 overflow-y-auto flex-1 scrollbar-slim">
              <div className="bg-foreground/5 dark:bg-default-50/50 border border-foreground/10 rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-foreground/60 mb-1.5">
                  <FiFileText className="w-3.5 h-3.5" />
                  <span>From transcript</span>
                </div>
                <p className="text-xs text-foreground-700 dark:text-foreground-300 italic leading-relaxed">
                  {call.transcript}
                </p>
              </div>
              <div className="border border-foreground/10 rounded-xl p-3 sm:p-4 space-y-3">
                <h4 className="font-medium text-sm dark:text-white">
                  Lead Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
                  <Input
                    label="Caller Name"
                    labelPlacement="outside"
                    placeholder="Enter caller name"
                    size="sm"
                    radius="sm"
                    variant="flat"
                    value={callerName}
                    onValueChange={setCallerName}
                  />
                  <Select
                    label="Patient Type"
                    labelPlacement="outside"
                    placeholder="Select patient type"
                    size="sm"
                    radius="sm"
                    variant="flat"
                    selectedKeys={[patientType]}
                    onSelectionChange={(keys) => {
                      const val = Array.from(keys)[0] as "New Patient" | "Existing Patient";
                      if (val) setPatientType(val);
                    }}
                  >
                    <SelectItem key="New Patient">New Patient</SelectItem>
                    <SelectItem key="Existing Patient">Existing Patient</SelectItem>
                  </Select>
                  <Input
                    label="Reason for Call"
                    labelPlacement="outside"
                    placeholder="Reason for call"
                    size="sm"
                    radius="sm"
                    variant="flat"
                    value={reasonForCall}
                    onValueChange={setReasonForCall}
                  />
                  <Input
                    label="Insurance"
                    labelPlacement="outside"
                    placeholder="Insurance Provider"
                    size="sm"
                    radius="sm"
                    variant="flat"
                    value={insurance}
                    onValueChange={setInsurance}
                  />
                  <Input
                    label="Requested Date"
                    labelPlacement="outside"
                    placeholder="Requested Date"
                    size="sm"
                    radius="sm"
                    variant="flat"
                    value={requestedDate}
                    onValueChange={setRequestedDate}
                  />
                </div>
                <Textarea
                  label="Notes"
                  labelPlacement="outside"
                  placeholder="Add any additional notes..."
                  minRows={3}
                  variant="flat"
                  radius="sm"
                  size="sm"
                  value={notes}
                  onValueChange={setNotes}
                />
              </div>
              <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800 rounded-xl p-3 flex items-center gap-2">
                <HiOutlineSparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                  Fields were auto-filled from the AI transcript. Review for accuracy before saving.
                </span>
              </div>
            </ModalBody>
            <ModalFooter className="px-4 py-3 shrink-0 border-t border-foreground/10 flex items-center justify-end gap-2">
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
                isLoading={isSaving}
                onPress={handleSave}
                startContent={<FiCheck className="text-[15px]" />}
              >
                Save Lead
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}