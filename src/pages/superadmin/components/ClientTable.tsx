import React from "react";
import { ClientAccount } from "../types";
import { formatRelativeTime } from "../utils";
import {
  FiEye,
  FiEyeOff,
  FiKey,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiZap,
  FiXCircle,
  FiSlash,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { WorkspaceLoader } from "../../../components/common/LoadingState";

interface ClientTableProps {
  loading: boolean;
  paginatedAccounts: ClientAccount[];
  filteredAccounts: ClientAccount[];
  startIndex: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  impersonatingId: string | null;
  isLight: boolean;
  onOpenDrawer: (client: ClientAccount, tab?: "overview" | "phoneService" | "notes") => void;
  onImpersonate: (client: ClientAccount) => void;
  onPageChange: (page: number) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({
  loading,
  paginatedAccounts,
  filteredAccounts,
  startIndex,
  itemsPerPage,
  currentPage,
  totalPages,
  impersonatingId,
  isLight,
  onOpenDrawer,
  onImpersonate,
  onPageChange,
}) => {
  const [expandedNotes, setExpandedNotes] = React.useState<Record<string, boolean>>({});

  const toggleNoteExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      className={`rounded-xl overflow-hidden border shadow-md ${isLight
        ? "bg-white border-slate-200/90"
        : "bg-[#0F172A] border-[#1E293B]"
        }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr
              className={`text-[11px] font-bold uppercase tracking-wider border-b ${isLight
                ? "bg-slate-50/90 text-slate-500 border-slate-200"
                : "bg-[#0B132B]/80 text-slate-400 border-[#1E293B]"
                }`}
            >
              <th className="py-3.5 px-6">PRACTICE</th>
              <th className="py-3.5 px-6">STATUS</th>
              <th className="py-3.5 px-6">PLAN</th>
              <th className="py-3.5 px-6">TAGS & NOTES</th>
              <th className="py-3.5 px-6">MRR</th>
              <th className="py-3.5 px-6">LAST ACTIVE</th>
              <th className="py-3.5 px-6 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y text-xs sm:text-sm ${isLight ? "divide-slate-100" : "divide-[#1E293B]/60 text-slate-200"
              }`}
          >
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <WorkspaceLoader message="LOADING..." minHeight="min-h-[300px]" />
                </td>
              </tr>
            ) : paginatedAccounts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-slate-400 font-medium">
                  No client accounts match your search filters.
                </td>
              </tr>
            ) : (
              paginatedAccounts.map((account) => (
                <tr
                  key={account.id}
                  className={`transition-colors group ${isLight
                    ? "hover:bg-slate-50/80"
                    : "hover:bg-[#131C33]/70"
                    }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${isLight
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : "bg-[#1A2642] text-sky-400 border-sky-500/20"
                          }`}
                      >
                        {account.initials}
                      </div>
                      <div>
                        <div
                          onClick={() => onOpenDrawer(account)}
                          className={`font-bold text-sm transition-colors cursor-pointer ${isLight
                            ? "text-slate-900 hover:text-blue-600"
                            : "text-slate-100 hover:text-sky-400"
                            }`}
                        >
                          {account.practiceName}
                        </div>
                        <div
                          className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"
                            }`}
                        >
                          {account.owner} • {account.location}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex flex-col items-start">
                      {account.status === "Active" && (
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 ${isLight
                            ? "bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]"
                            : "bg-[#064E3B]/80 text-[#34D399] border border-[#059669]/60"
                            }`}
                        >
                          <FiCheckCircle className="text-xs shrink-0" />
                          Active
                        </span>
                      )}

                      {account.status === "Trial" && (
                        <div className="flex flex-col items-start">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 ${isLight
                              ? "bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]"
                              : "bg-[#075985]/80 text-[#38BDF8] border border-[#0284C7]/60"
                              }`}
                          >
                            <FiClock className="text-xs shrink-0" />
                            Trial
                          </span>
                          {account.statusSubtext && (
                            <span className="text-[11px] font-semibold text-[#0369A1] dark:text-[#38BDF8] mt-1 pl-1">
                              {account.statusSubtext}
                            </span>
                          )}
                        </div>
                      )}

                      {account.status === "Past Due" && (
                        <div className="flex flex-col items-start">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 ${isLight
                              ? "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]"
                              : "bg-[#78350F]/80 text-[#FBBF24] border border-[#D97706]/60"
                              }`}
                          >
                            <FiAlertTriangle className="text-xs shrink-0" />
                            Past Due
                          </span>
                          {account.statusSubtext && (
                            <span className="text-[11px] font-semibold text-red-500 mt-1 pl-1">
                              {account.statusSubtext}
                            </span>
                          )}
                        </div>
                      )}

                      {account.status === "Onboarding" && (
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 ${isLight
                            ? "bg-[#F3E8FF] text-[#6B21A8] border border-[#E9D5FF]"
                            : "bg-[#581C87]/80 text-[#C084FC] border border-[#7E22CE]/60"
                            }`}
                        >
                          <FiZap className="text-xs shrink-0" />
                          Onboarding
                        </span>
                      )}

                      {account.status === "Suspended" && (
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 ${isLight
                            ? "bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]"
                            : "bg-[#7F1D1D]/80 text-[#F87171] border border-[#B91C1C]/60"
                            }`}
                        >
                          <FiXCircle className="text-xs shrink-0" />
                          Suspended
                        </span>
                      )}

                      {account.status === "Cancelled" && (
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 ${isLight
                            ? "bg-slate-100 text-slate-700 border border-slate-300"
                            : "bg-slate-800/80 text-slate-400 border border-slate-700/60"
                            }`}
                        >
                          <FiSlash className="text-xs shrink-0" />
                          Churned
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    {account.plan === "Growth" && (
                      <span
                        className={`px-3 py-0.5 text-xs font-semibold rounded-full ${isLight
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-blue-950/60 text-blue-300 border border-blue-700/50"
                          }`}
                      >
                        Growth
                      </span>
                    )}
                    {account.plan === "Scale" && (
                      <span
                        className={`px-3 py-0.5 text-xs font-semibold rounded-full ${isLight
                          ? "bg-pink-50 text-pink-700 border border-pink-200"
                          : "bg-pink-950/60 text-pink-300 border border-pink-700/50"
                          }`}
                      >
                        Scale
                      </span>
                    )}
                    {account.plan === "Starter" && (
                      <span
                        className={`px-3 py-0.5 text-xs font-semibold rounded-full ${isLight
                          ? "bg-slate-100 text-slate-700 border border-slate-200"
                          : "bg-slate-800/80 text-slate-300 border border-slate-700/60"
                          }`}
                      >
                        Starter
                      </span>
                    )}
                    {account.plan === "Enterprise" && (
                      <span
                        className={`px-3 py-0.5 text-xs font-semibold rounded-full ${isLight
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-amber-950/60 text-amber-300 border border-amber-700/50"
                          }`}
                      >
                        Enterprise
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 max-w-[240px]">
                    <div className="flex flex-col gap-1.5">
                      {Array.isArray(account.tags) && account.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {account.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${isLight
                                ? "bg-slate-100 text-slate-700 border-slate-200"
                                : "bg-slate-800/80 text-slate-300 border-slate-700/60"
                                }`}
                            >
                              {tag}
                            </span>
                          ))}
                          {account.tags.length > 3 && (
                            <span className="text-[10px] font-bold text-slate-400 self-center">
                              +{account.tags.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No tags</span>
                      )}
                      {(() => {
                        const cleanNote = account.internalNotes
                          ? account.internalNotes.replace(/\[[A-Za-z]{3}\s+\d{1,2},\s+\d{4},?\s+[^\]]+\]\s*/gi, "").trim()
                          : "";

                        if (!cleanNote) {
                          return <span className="text-[11px] text-slate-400 italic">No notes</span>;
                        }

                        return (
                          <div className="flex items-center gap-1.5 max-w-[240px]">
                            <div
                              title={cleanNote}
                              className={`text-xs font-medium truncate ${
                                isLight ? "text-slate-600" : "text-slate-400"
                              }`}
                            >
                              {cleanNote}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenDrawer(account, "notes");
                              }}
                              title="View & manage notes in modal"
                              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                              <FiEye className="text-xs" />
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div
                      className={`font-bold ${isLight ? "text-slate-900" : "text-slate-100"
                        }`}
                    >
                      {account.mrr !== null ? `$${account.mrr}` : "—"}
                    </div>
                    <span
                      className={`text-[11px] font-normal ${isLight ? "text-slate-400" : "text-slate-500"
                        }`}
                    >
                      /month
                    </span>
                  </td>

                  <td
                    className={`py-4 px-6 text-xs font-medium ${isLight ? "text-slate-600" : "text-slate-400"
                      }`}
                  >
                    {formatRelativeTime(account.updatedAt || account.lastActive)}
                  </td>

                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-5 sm:gap-6">
                      <button
                        type="button"
                        onClick={() => onOpenDrawer(account)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${isLight
                          ? "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900"
                          : "bg-[#111A2E] hover:bg-[#1A2642] border-[#1E2B45] text-slate-300 hover:text-white"
                          }`}
                      >
                        <FiEye className="text-sm" />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onImpersonate(account)}
                        disabled={impersonatingId === account.id}
                        style={{ backgroundColor: "#ffb86a" }}
                        className="text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <FiKey className="text-sm" />
                        <span>
                          {impersonatingId === account.id
                            ? "Impersonating..."
                            : "Log In As"}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        className={`flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t text-xs gap-3 ${isLight
          ? "bg-white border-slate-200 text-slate-600"
          : "bg-[#0B132B]/60 border-[#1E293B] text-slate-400"
          }`}
      >
        <div>
          Showing {filteredAccounts.length === 0 ? 0 : startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, filteredAccounts.length)} of{" "}
          {filteredAccounts.length} clients
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${currentPage === 1
              ? "opacity-40 cursor-not-allowed"
              : isLight
                ? "bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-sm"
                : "bg-[#111A2E] hover:bg-[#1A2642] border-[#1E2B45] text-slate-200"
              }`}
          >
            <FiChevronLeft />
            <span>Prev</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 text-xs font-bold rounded-lg border transition-all cursor-pointer ${currentPage === page
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : isLight
                  ? "bg-white hover:bg-slate-100 border-slate-300 text-slate-700"
                  : "bg-[#111A2E] hover:bg-[#1A2642] border-[#1E2B45] text-slate-200"
                }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${currentPage === totalPages || totalPages === 0
              ? "opacity-40 cursor-not-allowed"
              : isLight
                ? "bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-sm"
                : "bg-[#111A2E] hover:bg-[#1A2642] border-[#1E2B45] text-slate-200"
              }`}
          >
            <span>Next</span>
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientTable;
