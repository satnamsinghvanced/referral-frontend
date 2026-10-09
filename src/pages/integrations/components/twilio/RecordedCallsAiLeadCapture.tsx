import { useState, useEffect } from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { FiMic, FiUser, FiCheck, FiEye, FiFileText } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { RecordedCall } from "../../../phone-service/mockData";
import AiExtractedLeadModal from "./AiExtractedLeadModal";
import axios from "../../../../services/axios";

interface RecordedCallsAiLeadCaptureProps {
  initialCalls?: RecordedCall[];
}

export default function RecordedCallsAiLeadCapture({
  initialCalls = [],
}: RecordedCallsAiLeadCaptureProps) {
  const [draftLeads, setDraftLeads] = useState<RecordedCall[]>([]);
  const [recordedCalls, setRecordedCalls] = useState<RecordedCall[]>([]);
  const [selectedCall, setSelectedCall] = useState<RecordedCall | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCallsAndDrafts = async () => {
    try {
      setIsLoading(true);
      const [draftsRes, callsRes] = await Promise.all([
        axios.get("/twilio-checkout/draft-leads/latest").catch(() => ({ data: { data: { drafts: [] } } })),
        axios.get("/twilio-checkout/recorded-new-patient-calls").catch(() => ({ data: { data: { calls: [] } } })),
      ]) as any[];

      const drafts = draftsRes?.data?.drafts || draftsRes?.drafts || [];
      const calls = callsRes?.data?.calls || callsRes?.calls || [];

      setDraftLeads(drafts);
      setRecordedCalls(calls);
    } catch (err) {
      console.error("Error fetching draft leads/recorded calls:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCallsAndDrafts();
  }, []);

  const handleOpenModal = (call: RecordedCall) => {
    setSelectedCall(call);
    setIsModalOpen(true);
  };

  const handleSaveLeadSuccess = (callId: string, updatedFields: Partial<RecordedCall>) => {
    setDraftLeads((prev) => prev.filter((d) => d.id !== callId));
    setRecordedCalls((prev) =>
      prev.map((c) => (c.id === callId ? { ...c, ...updatedFields, isLeadSaved: true } : c))
    );
    fetchCallsAndDrafts();
  };

  return (
    <>
      <Card className="shadow-none border border-foreground/10 rounded-2xl bg-background p-5">
        <CardBody className="p-0 flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2">
              <FiMic className="w-4 h-4 text-pink-500" />
              <h3 className="text-base font-bold text-foreground">
                Recorded Calls &amp; AI Lead Capture
              </h3>
            </div>
            <p className="text-xs text-foreground-500 mt-0.5">
              New-patient calls are automatically transcribed and saved as draft leads. Review and save them with one click.
            </p>
          </div>

          {draftLeads.length > 0 && (
            <div className="flex flex-col gap-3 p-4 border border-purple-200 dark:border-purple-900 bg-purple-50/40 dark:bg-purple-950/20 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HiOutlineSparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">
                    Latest Unsaved Draft Leads ({draftLeads.length})
                  </h4>
                </div>
                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                  Review &amp; save to Lead Tracking
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {draftLeads.map((draft) => (
                  <div
                    key={draft.id}
                    className="border border-purple-200/80 dark:border-purple-800/60 rounded-xl p-4 bg-background shadow-sm hover:border-purple-400 transition-all flex flex-col gap-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                          <FiUser className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-foreground">
                          {draft.callerName}
                        </h4>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          New Patient
                        </span>
                        <span className="text-xs text-foreground-400 font-mono">
                          {draft.timeAgo} &middot; {draft.duration} &middot; {draft.phoneNumber}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() => handleOpenModal(draft)}
                        startContent={<HiOutlineSparkles className="w-3.5 h-3.5" />}
                        className="text-xs font-bold rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-sm shrink-0 self-end sm:self-center"
                      >
                        Save as Lead
                      </Button>
                    </div>

                    <div className="bg-foreground/5 dark:bg-default-50/50 border border-foreground/10 rounded-xl p-3.5 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground-500">
                        <FiFileText className="w-3.5 h-3.5 text-purple-500" />
                        <span>Transcript Snippet</span>
                      </div>
                      <p className="text-xs text-foreground-700 dark:text-foreground-300 italic leading-relaxed">
                        {draft.transcript}
                      </p>
                      <div className="pt-2 border-t border-foreground/10 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground-500">
                        {draft.reasonForCall && (
                          <div>
                            <span className="font-semibold text-foreground-400">Treatment:</span>{" "}
                            <span className="text-foreground-700 dark:text-foreground-300 font-medium">{draft.reasonForCall}</span>
                          </div>
                        )}
                        {draft.insurance && (
                          <div>
                            <span className="font-semibold text-foreground-400">Insurance:</span>{" "}
                            <span className="text-foreground-700 dark:text-foreground-300 font-medium">{draft.insurance}</span>
                          </div>
                        )}
                        {draft.requestedDate && (
                          <div>
                            <span className="font-semibold text-foreground-400">Requested:</span>{" "}
                            <span className="text-foreground-700 dark:text-foreground-300 font-medium">{draft.requestedDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground-500">
              New Patient Recorded Calls
            </h4>
            {recordedCalls.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-foreground/20 rounded-xl text-xs text-foreground-400">
                No recorded new-patient calls found. Inbound calls from new patients (Press 1) will appear here.
              </div>
            ) : (
              recordedCalls.map((call) => (
                <div
                  key={call.id}
                  className="border border-foreground/10 rounded-xl p-4 bg-background hover:border-foreground/20 transition-all flex flex-col gap-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                        <FiUser className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-foreground">
                        {call.callerName}
                      </h4>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        New Patient
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
              ))
            )}
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
