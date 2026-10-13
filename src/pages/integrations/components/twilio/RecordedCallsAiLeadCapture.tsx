import { useState, useEffect } from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { FiMic, FiUser, FiCheck, FiEye, FiFileText } from "react-icons/fi";
import { RecordedCall } from "../../../phone-service/mockData";
import { LEAD_STATUSES } from "../../../../consts/lead-pipeline";
import AiExtractedLeadModal from "./AiExtractedLeadModal";
import axios from "../../../../services/axios";

interface RecordedCallsAiLeadCaptureProps {
  initialCalls?: RecordedCall[];
}

const formatCallerHeading = (name?: string, patientType?: string): string => {
  if (!name) return patientType || "New Patient";
  let clean = name.trim();
  clean = clean.replace(/^(?:my\s+name\s+is|this\s+is|i\s+am|i'm|it\s+is|the\s+name\s+is|name\s+is|call\s+me)\b\s*/i, "").trim();
  clean = clean.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, " ").trim();
  const lower = clean.toLowerCase();
  if (!clean || lower === "my name is" || lower === "unknown" || lower === "caller" || lower === "patient") {
    return patientType || "New Patient";
  }
  return clean
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

export default function RecordedCallsAiLeadCapture({
  initialCalls = [],
}: RecordedCallsAiLeadCaptureProps) {
  const [calls, setCalls] = useState<RecordedCall[]>([]);
  const [selectedCall, setSelectedCall] = useState<RecordedCall | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCallsAndDrafts = async () => {
    try {
      setIsLoading(true);
      const [draftsRes, callsRes] = (await Promise.all([
        axios.get("/twilio-checkout/draft-leads/latest").catch(() => ({ data: { data: { drafts: [] } } })),
        axios.get("/twilio-checkout/recorded-new-patient-calls").catch(() => ({ data: { data: { calls: [] } } })),
      ])) as any[];

      const drafts: RecordedCall[] = draftsRes?.data?.drafts || draftsRes?.drafts || [];
      const recorded: RecordedCall[] = callsRes?.data?.calls || callsRes?.calls || [];

      const callMap = new Map<string, RecordedCall>();
      for (const c of recorded) {
        const key = c.id || c.callSid || "";
        if (key) callMap.set(key, c);
      }
      for (const d of drafts) {
        const key = d.id || d.callSid || "";
        if (key) {
          const existing = callMap.get(key);
          callMap.set(key, {
            ...existing,
            ...d,
            isLeadSaved: existing?.isLeadSaved || d.isLeadSaved || false,
            leadStatus: d.leadStatus || existing?.leadStatus || "newLead",
          });
        }
      }

      // Filter out saved calls so they are removed from the Recorded Calls & AI Lead Capture list
      const unsavedCalls = Array.from(callMap.values()).filter(
        (c) => !c.isLeadSaved && (c as any).status !== "saved"
      );
      setCalls(unsavedCalls);
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

  const handleSaveLeadSuccess = (callId: string, _updatedFields?: Partial<RecordedCall>) => {
    // Immediately remove saved call from the list
    setCalls((prev) => prev.filter((c) => c.id !== callId));
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
              Calls are transcribed automatically. Review and save them as leads with one click.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            {isLoading && calls.length === 0 ? (
              <div className="flex flex-col gap-3 animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 rounded-xl bg-foreground/5 border border-foreground/10" />
                ))}
              </div>
            ) : calls.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-foreground/20 rounded-xl text-xs text-foreground-400">
                No recorded calls found. Inbound calls will appear here automatically.
              </div>
            ) : (
              calls.map((call) => {
                const isExisting = call.patientType === "Existing Patient";
                return (
                  <div
                    key={call.id}
                    className="border border-foreground/10 rounded-2xl p-4 bg-background hover:border-foreground/20 transition-all flex flex-col gap-3 shadow-none"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isExisting
                              ? "bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                              : "bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400"
                            }`}
                        >
                          <FiUser className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-foreground">
                          {formatCallerHeading(call.callerName, call.patientType)}
                        </h4>
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${isExisting
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                              : "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                            }`}
                        >
                          {call.patientType || "New Patient"}
                        </span>
                        {call.isLeadSaved && (
                          <>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <FiCheck className="w-3 h-3" /> Lead Saved
                            </span>
                            {call.leadStatus && (
                              <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                                {LEAD_STATUSES.find((s) => s.key === call.leadStatus)?.label || call.leadStatus}
                              </span>
                            )}
                          </>
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

                    <div className="bg-default-50/70 dark:bg-default-50/20 border border-foreground/10 rounded-xl p-3.5 flex flex-col gap-2">
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
                            <span className="text-foreground-700 dark:text-foreground-300 font-medium">
                              {call.reasonForCall}
                            </span>
                          </div>
                        )}
                        {call.insurance && (
                          <div>
                            <span className="font-semibold text-foreground-400">Insurance:</span>{" "}
                            <span className="text-foreground-700 dark:text-foreground-300 font-medium">
                              {call.insurance}
                            </span>
                          </div>
                        )}
                        {call.requestedDate && (
                          <div>
                            <span className="font-semibold text-foreground-400">Requested:</span>{" "}
                            <span className="text-foreground-700 dark:text-foreground-300 font-medium">
                              {call.requestedDate}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
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
