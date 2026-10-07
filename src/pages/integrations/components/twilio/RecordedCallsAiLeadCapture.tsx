import { useState } from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { FiMic, FiUser, FiCheck, FiEye, FiFileText } from "react-icons/fi";
import { RecordedCall } from "../../../phone-service/mockData";
import AiExtractedLeadModal from "./AiExtractedLeadModal";

interface RecordedCallsAiLeadCaptureProps {
  initialCalls: RecordedCall[];
}

export default function RecordedCallsAiLeadCapture({
  initialCalls,
}: RecordedCallsAiLeadCaptureProps) {
  const [calls, setCalls] = useState<RecordedCall[]>(initialCalls);
  const [selectedCall, setSelectedCall] = useState<RecordedCall | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = (call: RecordedCall) => {
    setSelectedCall(call);
    setIsModalOpen(true);
  };
  const handleSaveLeadSuccess = (callId: string, updatedFields: Partial<RecordedCall>) => {
    setCalls((prev) =>
      prev.map((c) => (c.id === callId ? { ...c, ...updatedFields } : c))
    );
  };
  return (
    <>
      <Card className="shadow-none border border-foreground/10 rounded-2xl bg-background p-5">
        <CardBody className="p-0 flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2">
              <FiMic className="w-4 h-4 text-pink-500" />
              <h3 className="text-base font-bold text-foreground">
                Recorded Calls &amp; AI Lead Capture
              </h3>
            </div>
            <p className="text-xs text-foreground-500 mt-0.5">
              Calls are transcribed automatically. Review and save them as leads with one click.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {calls.map((call) => (
              <div
                key={call.id}
                className="border border-foreground/10 rounded-xl p-4 bg-background hover:border-foreground/20 transition-all flex flex-col gap-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${call.patientType === "New Patient"
                        ? "bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400"
                        : "bg-sky-100 dark:bg-sky-950/50 text-primary"
                        }`}
                    >
                      <FiUser className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-foreground">
                      {call.callerName}
                    </h4>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${call.patientType === "New Patient"
                        ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                        : "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800"
                        }`}
                    >
                      {call.patientType}
                    </span>
                    {call.isLeadSaved && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <FiCheck className="w-3 h-3" /> Lead Saved
                      </span>
                    )}
                    <span className="text-xs text-foreground-400 font-mono">
                      {call.timeAgo} &middot; {call.duration} &middot; {call.phoneNumber}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="bordered"
                    onPress={() => handleOpenModal(call)}
                    startContent={<FiEye className="w-3.5 h-3.5" />}
                    className="text-xs font-semibold rounded-xl border-foreground/20 hover:bg-foreground/5 shadow-none shrink-0 self-end sm:self-center"
                  >
                    {call.isLeadSaved ? "View Lead" : "Save as Lead"}
                  </Button>
                </div>
                <div className="bg-foreground/5 dark:bg-default-50/50 border border-foreground/10 rounded-xl p-3.5 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground-500">
                    <FiFileText className="w-3.5 h-3.5 text-foreground-400" />
                    <span>Transcript</span>
                  </div>
                  <p className="text-xs text-foreground-700 dark:text-foreground-300 italic leading-relaxed">
                    {call.transcript}
                  </p>
                  <div className="pt-2 border-t border-foreground/10 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground-500 font-sans">
                    {call.reasonForCall && (
                      <div>
                        <span className="font-semibold text-foreground-400">Reason:</span>{" "}
                        <span className="text-foreground-700 dark:text-foreground-300 font-medium">{call.reasonForCall}</span>
                      </div>
                    )}
                    {call.insurance && (
                      <div>
                        <span className="font-semibold text-foreground-400">Insurance:</span>{" "}
                        <span className="text-foreground-700 dark:text-foreground-300 font-medium">{call.insurance}</span>
                      </div>
                    )}
                    {call.requestedDate && (
                      <div>
                        <span className="font-semibold text-foreground-400">Requested:</span>{" "}
                        <span className="text-foreground-700 dark:text-foreground-300 font-medium">{call.requestedDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
      <AiExtractedLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        call={selectedCall}
        onSaveLeadSuccess={handleSaveLeadSuccess}
      />
    </>
  );
}
