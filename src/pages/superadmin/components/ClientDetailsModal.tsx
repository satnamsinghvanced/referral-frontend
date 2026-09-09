import React, { useState, useEffect } from "react";
import { ClientAccount } from "../types";
import {
  FiX,
  FiKey,
  FiMail,
  FiPhone,
  FiGlobe,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiStar,
  FiCheckCircle,
  FiUser,
  FiTag,
  FiFileText,
  FiPlus,
  FiEdit2,
  FiEdit3,
  FiTrash2,
  FiPhoneCall,
  FiMessageSquare,
  FiSmartphone,
} from "react-icons/fi";

interface ClientDetailsModalProps {
  isOpen: boolean;
  selectedClient: ClientAccount | null;
  clientAccounts: ClientAccount[];
  modalLoading: boolean;
  impersonatingId: string | null;
  isLight: boolean;
  newTagInput: string;
  notesInput: string;
  notesSaved: boolean;
  savingNotes: boolean;
  initialTab?: "overview" | "phoneService" | "notes";
  onClose: () => void;
  onImpersonate: (client: ClientAccount) => void;
  onTagInputChange: (val: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onNotesInputChange: (val: string) => void;
  onSaveNotes: (customNotes?: string) => void;
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  isOpen,
  selectedClient,
  clientAccounts,
  modalLoading,
  impersonatingId,
  isLight,
  newTagInput,
  notesInput,
  notesSaved,
  savingNotes,
  initialTab = "overview",
  onClose,
  onImpersonate,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onNotesInputChange,
  onSaveNotes,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "phoneService" | "notes">(initialTab);
  const [quickNote, setQuickNote] = useState("");
  const [showFullEditor, setShowFullEditor] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editNoteText, setEditNoteText] = useState("");

  useEffect(() => {
    setActiveTab(initialTab);
    setQuickNote("");
    setShowFullEditor(false);
    setIsEditingNote(false);
    setEditNoteText("");
  }, [isOpen, selectedClient?.id, initialTab]);

  if (!isOpen || !selectedClient) return null;

  const clientIndex = clientAccounts.findIndex((c) => c.id === selectedClient.id);
  const displayId =
    selectedClient.displayClientId ||
    `cli_${String(clientIndex + 1).padStart(3, "0")}`;

  const phoneServiceData = (selectedClient as any)?.phoneService || (selectedClient as any)?.telecom;

  const hasPhonePlan = Boolean(phoneServiceData?.hasPlan || phoneServiceData?.planName);
  const phonePlanName = phoneServiceData?.planName || null;
  const phonePlanPrice = hasPhonePlan ? (phoneServiceData?.planPrice || phoneServiceData?.price || 0) : 0;

  const cycleStartDate = phoneServiceData?.lastPlanPurchasedAt
    ? new Date(phoneServiceData.lastPlanPurchasedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const smsUsed = phoneServiceData?.smsUsed ?? 0;
  const smsLimit = phoneServiceData?.smsLimit ?? 0;
  const smsPercent = smsLimit > 0 ? Math.min(100, Math.round((smsUsed / smsLimit) * 100)) : 0;

  const minutesUsed = phoneServiceData?.minutesUsed ?? 0;
  const minutesLimit = phoneServiceData?.minutesLimit ?? 0;
  const minutesPercent = minutesLimit > 0 ? Math.min(100, Math.round((minutesUsed / minutesLimit) * 100)) : 0;

  const rawPhoneNumbers = phoneServiceData?.phoneNumbers;
  const phoneNumbersList: any[] = Array.isArray(rawPhoneNumbers) ? rawPhoneNumbers : [];

  const phoneNumbersCount = phoneNumbersList.length;
  const numbersCostTotal = phoneNumbersCount * 5;
  const estimatedTotalSpend = (phonePlanPrice || 0) + numbersCostTotal;

  const handleAddQuickNote = () => {
    if (!quickNote.trim()) return;
    const newEntry = quickNote.trim();
    const updatedNotes = notesInput.trim() ? `${newEntry}\n\n${notesInput.trim()}` : newEntry;

    onNotesInputChange(updatedNotes);
    onSaveNotes(updatedNotes);
    setQuickNote("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-10 border my-auto animate-in fade-in-50 zoom-in-95 duration-200 ${isLight
          ? "bg-white border-slate-200 text-slate-900"
          : "bg-[#0F172A] border-[#1E293B]"
          }`}
      >
        <div
          className={`p-6 border-b flex items-start justify-between ${isLight ? "bg-slate-50/80 border-slate-200" : "bg-[#0B101D] border-[#1E293B]"
            }`}
        >
          <div className="flex items-center gap-4">
            <div
              style={{ backgroundColor: "#20a9f8" }}
              className="w-12 h-12 rounded-2xl text-white font-extrabold text-base flex items-center justify-center shadow-md shadow-[#20a9f8]/20 shrink-0"
            >
              {selectedClient.initials}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-extrabold text-lg sm:text-xl tracking-tight">
                  {selectedClient.practiceName}
                </h2>
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border uppercase tracking-wider ${selectedClient.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : selectedClient.status === "Trial"
                        ? "bg-sky-500/10 text-sky-600 border-sky-500/20"
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                    }`}
                >
                  {selectedClient.status}
                </span>
              </div>
              <p
                className={`text-xs mt-1 font-medium ${isLight ? "text-slate-500" : "text-slate-400"
                  }`}
              >
                Owner: {selectedClient.owner} • {selectedClient.location}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div
          className={`flex items-center border-b px-6 pt-3 gap-6 text-xs sm:text-sm font-bold ${isLight ? "bg-slate-50/50 border-slate-200" : "bg-[#0B101D] border-[#1E293B]"
            }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${activeTab === "overview"
              ? "border-[#20a9f8] text-[#20a9f8]"
              : isLight
                ? "border-transparent text-slate-500 hover:text-slate-800"
                : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
          >
            <FiUser className="text-sm" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("phoneService")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${activeTab === "phoneService"
              ? "border-[#20a9f8] text-[#20a9f8]"
              : isLight
                ? "border-transparent text-slate-500 hover:text-slate-800"
                : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
          >
            <FiPhoneCall className="text-sm" />
            <span>Phone Service</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer relative ${activeTab === "notes"
              ? "border-[#20a9f8] text-[#20a9f8]"
              : isLight
                ? "border-transparent text-slate-500 hover:text-slate-800"
                : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
          >
            <FiTag className="text-sm" />
            <span>Tags & Notes</span>
            {((selectedClient.tags?.length || 0) > 0 || !!notesInput.trim()) && (
              <span className="w-2 h-2 rounded-full bg-[#20a9f8]" />
            )}
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {modalLoading && (
            <div className="flex items-center gap-2 text-xs font-bold text-[#20a9f8] bg-[#20a9f815] px-3.5 py-2 rounded-xl border border-[#20a9f830] w-full justify-center animate-pulse">
              <div className="w-3.5 h-3.5 border-2 border-[#20a9f8] border-t-transparent rounded-full animate-spin"></div>
              <span>Fetching real-time metrics from database...</span>
            </div>
          )}

          {activeTab === "overview" && (
            <>
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${isLight
                  ? "bg-amber-50/70 border-amber-200"
                  : "bg-amber-950/30 border-amber-900/50"
                  }`}
              >
                <div>
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Impersonate Client Account
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                    Access their exact dashboard view. All administrative actions are logged.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onImpersonate(selectedClient)}
                  disabled={impersonatingId === selectedClient.id}
                  style={{ backgroundColor: "#ffb86a" }}
                  className="shrink-0 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <FiKey className="text-sm" />
                  <span>
                    {impersonatingId === selectedClient.id
                      ? "Impersonating..."
                      : "Impersonate This Client"}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    CONTACT DETAILS
                  </h3>
                  <div
                    className={`p-4 rounded-xl border space-y-2.5 text-xs ${isLight ? "bg-slate-50 border-slate-200/80" : "bg-[#111A2E] border-[#1E2B45]"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <FiMail className="text-slate-400 text-sm shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {selectedClient.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiPhone className="text-slate-400 text-sm shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {selectedClient.phone || "(602) 555-0142"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiGlobe className="text-slate-400 text-sm shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {selectedClient.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    ACCOUNT DETAILS
                  </h3>
                  <div
                    className={`p-4 rounded-xl border space-y-2 text-xs ${isLight ? "bg-slate-50 border-slate-200/80" : "bg-[#111A2E] border-[#1E2B45]"
                      }`}
                  >
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Client ID</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-200/80 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {displayId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Joined</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {selectedClient.joinedDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500 dark:text-slate-400">Last Active</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {selectedClient.lastActive}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  PERFORMANCE METRICS
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div
                    className={`p-3.5 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200/80" : "bg-[#111A2E] border-[#1E2B45]"
                      }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <FiDollarSign className="text-slate-400" />
                      <span>MRR</span>
                    </div>
                    <div style={{ color: "#19a172" }} className="text-base font-extrabold mt-1">
                      ${selectedClient.mrr !== null && selectedClient.mrr !== undefined ? selectedClient.mrr : 0}/mo
                    </div>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200/80" : "bg-[#111A2E] border-[#1E2B45]"
                      }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <FiUsers className="text-slate-400" />
                      <span>Total Leads</span>
                    </div>
                    <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                      {modalLoading && selectedClient.leads === undefined ? (
                        <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 animate-pulse rounded my-0.5" />
                      ) : (
                        selectedClient.leads ?? 0
                      )}
                    </div>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200/80" : "bg-[#111A2E] border-[#1E2B45]"
                      }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <FiTrendingUp className="text-slate-400" />
                      <span>Total Referrals</span>
                    </div>
                    <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                      {modalLoading && selectedClient.referrals === undefined ? (
                        <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 animate-pulse rounded my-0.5" />
                      ) : (
                        selectedClient.referrals ?? 0
                      )}
                    </div>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200/80" : "bg-[#111A2E] border-[#1E2B45]"
                      }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <FiStar className="text-amber-400" />
                      <span>Review Score</span>
                    </div>
                    <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                      {modalLoading && selectedClient.reviewScore === undefined ? (
                        <div className="w-12 h-5 bg-slate-200 dark:bg-slate-700 animate-pulse rounded my-0.5" />
                      ) : (
                        selectedClient.reviewScore || "0 ★"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "phoneService" && (
            <div className="space-y-6 animate-in fade-in-50 duration-150">
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  PHONE SERVICE PLAN
                </span>
                {hasPhonePlan && phonePlanName ? (
                  <div
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${isLight ? "bg-sky-50/50 border-sky-200/80" : "bg-[#111A2E] border-[#1E2B45]"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-[#20a9f8] flex items-center justify-center text-lg shrink-0">
                        <FiMessageSquare />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {phonePlanName} — ${phonePlanPrice}/mo
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {cycleStartDate ? `Cycle started ${cycleStartDate}` : "Active Plan"}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {phonePlanName}
                    </span>
                  </div>
                ) : (
                  <div
                    className={`p-5 rounded-2xl border text-center space-y-2 ${isLight ? "bg-slate-50 border-slate-200" : "bg-[#111A2E] border-[#1E2B45]"
                      }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-lg">
                      <FiMessageSquare />
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      No Active Phone Service Plan
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
                      This client account has not purchased or subscribed to a Phone Service (SMS/Voice) plan in the database yet.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  THIS BILLING CYCLE
                </span>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">SMS Messages</span>
                    <span className="text-slate-900 dark:text-white">
                      {smsUsed.toLocaleString()} / {smsLimit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${smsPercent}%` }}
                      className="h-full bg-[#20a9f8] rounded-full transition-all duration-300"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 block text-right">
                    {smsPercent}% used
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">Voice Minutes</span>
                    <span className="text-slate-900 dark:text-white">
                      {minutesUsed.toLocaleString()} / {minutesLimit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${minutesPercent}%` }}
                      className="h-full bg-purple-500 rounded-full transition-all duration-300"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 block text-right">
                    {minutesPercent}% used
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    PHONE NUMBERS
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {phoneNumbersCount} {phoneNumbersCount === 1 ? "number" : "numbers"}
                  </span>
                </div>

                {phoneNumbersCount === 0 ? (
                  <div
                    className={`p-6 rounded-2xl border text-center space-y-2 ${isLight ? "bg-slate-50 border-slate-200" : "bg-[#111A2E] border-[#1E2B45]"
                      }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-lg">
                      <FiPhone />
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      No Connected Phone Numbers
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
                      This client account has not purchased or registered any phone numbers in the database yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {phoneNumbersList.map((num: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border space-y-3 transition-all ${isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#111A2E] border-[#1E2B45]"
                          }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-wide">
                              {num.phoneNumber}
                            </h5>
                            {num.label && (
                              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                {num.label}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            {(() => {
                              const statusText = num.status || "A2P Approved";
                              const lowerStatus = statusText.toLowerCase();
                              const isPending = lowerStatus.includes("pending");
                              const isRejected = lowerStatus.includes("reject") || lowerStatus.includes("failed");

                              const badgeStyles = isPending
                                ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                                : isRejected
                                ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800"
                                : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";

                              return (
                                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold border inline-block ${badgeStyles}`}>
                                  {statusText}
                                </span>
                              );
                            })()}
                            <span className="text-xs font-semibold text-slate-400 block mt-1">
                              ${num.cost || 5}/mo
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            Local
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-50 dark:bg-sky-950/40 text-[#20a9f8] flex items-center gap-1">
                            <FiPhone className="text-[10px]" /> Voice
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-50 dark:bg-sky-950/40 text-[#20a9f8] flex items-center gap-1">
                            <FiMessageSquare className="text-[10px]" /> SMS
                          </span>
                          {num.capabilities?.mms && (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-50 dark:bg-sky-950/40 text-[#20a9f8] flex items-center gap-1">
                              # MMS
                            </span>
                          )}
                        </div>

                        {num.purchasedAt && (
                          <p className="text-[11px] font-medium text-slate-400 pt-1">
                            Purchased {(() => {
                              try {
                                const d = new Date(num.purchasedAt);
                                return isNaN(d.getTime())
                                  ? num.purchasedAt
                                  : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                              } catch {
                                return num.purchasedAt;
                              }
                            })()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  MONTHLY PHONE SERVICE SPEND
                </span>
                <div
                  className={`p-4 rounded-2xl border space-y-2.5 text-xs ${isLight ? "bg-slate-50 border-slate-200/90" : "bg-[#111A2E] border-[#1E2B45]"
                    }`}
                >
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 font-medium">
                    <span>SMS/Voice Plan</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">${phonePlanPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 font-medium">
                    <span>Phone Numbers ({phoneNumbersCount})</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">${numbersCostTotal.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">Estimated Total</span>
                    <span className="font-black text-slate-900 dark:text-white text-sm">${estimatedTotalSpend.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <>
              <div className="space-y-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FiTag className="text-slate-400" />
                    <span>CLIENT TAGS</span>
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {Array.isArray(selectedClient.tags) && selectedClient.tags.length > 0 ? (
                    selectedClient.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border transition-all ${isLight
                          ? "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                          : "bg-[#1E293B] text-slate-200 border-slate-700 hover:bg-slate-700"
                          }`}
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => onRemoveTag(tag)}
                          className="text-slate-400 hover:text-red-500 rounded-full transition-colors cursor-pointer"
                          title="Remove tag"
                        >
                          <FiX className="text-xs" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No tags assigned yet</span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1 max-w-lg">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => onTagInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        onAddTag();
                      }
                    }}
                    placeholder="Add a tag (e.g. vip, at-risk, high-priority)"
                    className={`flex-1 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border focus:outline-none transition-all ${isLight
                      ? "bg-white border-slate-300 text-slate-900 focus:border-sky-500"
                      : "bg-[#111A2E] border-[#1E2B45] text-slate-200 focus:border-sky-500"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={onAddTag}
                    disabled={!newTagInput.trim()}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-1 shrink-0"
                  >
                    <FiPlus className="text-sm" />
                    <span>Add Tag</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 font-normal">
                  Press Enter or click Add Tag. Tags are lowercase and hyphenated.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FiFileText className="text-slate-400" />
                    <span>INTERNAL NOTES & LOGS</span>
                  </h3>
                </div>

                {(() => {
                  const cleanSavedNote = notesInput
                    ? notesInput.replace(/\[[A-Za-z]{3}\s+\d{1,2},\s+\d{4},?\s+[^\]]+\]\s*/gi, "").trim()
                    : "";

                  if (cleanSavedNote && !isEditingNote) {
                    return (
                      <div
                        className={`p-4 rounded-xl border space-y-3 transition-all ${
                          isLight ? "bg-slate-50 border-slate-200" : "bg-[#111A2E] border-[#1E2B45]"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-xs sm:text-sm font-sans leading-relaxed text-slate-800 dark:text-slate-200">
                          {cleanSavedNote}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              setEditNoteText(cleanSavedNote);
                              setIsEditingNote(true);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <FiEdit2 className="text-xs" />
                            <span>Edit Note</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onNotesInputChange("");
                              onSaveNotes("");
                              setIsEditingNote(false);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <FiTrash2 className="text-xs" />
                            <span>Delete Note</span>
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      className={`p-4 rounded-xl border space-y-3 ${
                        isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#111A2E] border-[#1E2B45]"
                      }`}
                    >
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        {isEditingNote ? "Edit Internal Note" : "Add Internal Note"}
                      </label>
                      <textarea
                        rows={4}
                        value={isEditingNote ? editNoteText : notesInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (isEditingNote) {
                            setEditNoteText(val);
                          } else {
                            onNotesInputChange(val);
                          }
                        }}
                        placeholder="Type note details here..."
                        className={`w-full text-xs sm:text-sm rounded-xl p-3 border focus:outline-none transition-all resize-y font-medium ${
                          isLight
                            ? "bg-white border-slate-300 text-slate-800 focus:border-sky-500"
                            : "bg-[#0B101D] border-[#1E2B45] text-slate-200 focus:border-sky-500"
                        }`}
                      />
                      <div className="flex items-center justify-end gap-2 pt-1">
                        {isEditingNote && (
                          <button
                            type="button"
                            onClick={() => setIsEditingNote(false)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const valToSave = isEditingNote ? editNoteText.trim() : notesInput.trim();
                            onNotesInputChange(valToSave);
                            onSaveNotes(valToSave);
                            setIsEditingNote(false);
                          }}
                          disabled={savingNotes}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                        >
                          {savingNotes ? (
                            <span>Saving...</span>
                          ) : (
                            <>
                              <FiCheckCircle className="text-sm" />
                              <span>Save Note</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsModal;
