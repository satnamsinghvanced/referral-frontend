import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface DeleteTarget {
  type: "role" | "permission";
  id: string;
  name: string;
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  deleteTarget: DeleteTarget | null;
  isLight: boolean;
  deleting: boolean;
  onConfirm: () => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  deleteTarget,
  isLight,
  deleting,
  onConfirm,
}) => {
  if (!isOpen || !deleteTarget) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4 ${
          isLight
            ? "bg-white border-slate-200 text-slate-900"
            : "bg-[#111A2E] border-[#1E2B45] text-white"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-500 shrink-0">
            <FiAlertTriangle className="text-xl" />
          </div>
          <div>
            <h3 className="text-base font-extrabold">
              Delete {deleteTarget.type === "role" ? "Role" : "Permission"}
            </h3>
            <p
              className={`text-xs mt-0.5 ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Are you sure you want to delete{" "}
              <strong className="text-red-400">
                '{deleteTarget.name}'
              </strong>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              isLight
                ? "text-slate-600 hover:bg-slate-100"
                : "text-slate-400 hover:bg-[#1E2B45] hover:text-white"
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-600 text-white shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {deleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Yes, Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
