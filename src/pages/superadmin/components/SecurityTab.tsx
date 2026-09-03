import React, { useState } from "react";
import { FormMessage } from "../types";
import { FiShield, FiEye, FiEyeOff } from "react-icons/fi";

interface SecurityTabProps {
  isLight: boolean;
  passwordMsg: FormMessage | null;
  loadingPassword: boolean;
  onSubmitPassword: (
    currentPass: string,
    newPass: string,
    confirmPass: string
  ) => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({
  isLight,
  passwordMsg,
  loadingPassword,
  onSubmitPassword,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitPassword(currentPassword, newPassword, confirmPassword);
  };

  return (
    <div
      className={`rounded-2xl border p-6 sm:p-8 shadow-sm transition-all ${
        isLight
          ? "bg-white border-slate-200/90"
          : "bg-[#0F172A] border-[#1E293B]"
      }`}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <FiShield className={`text-lg ${isLight ? "text-slate-800" : "text-slate-200"}`} />
        <h2 className={`font-bold text-base sm:text-lg ${isLight ? "text-slate-900" : "text-white"}`}>
          Security & Privacy
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        {passwordMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold ${
              passwordMsg.isError
                ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
            }`}
          >
            {passwordMsg.text}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Current Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showCurrentPass ? "text" : "password"}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`w-full text-xs sm:text-sm rounded-xl px-4 pr-10 py-2.5 border transition-all shadow-sm focus:outline-none ${
                isLight
                  ? "bg-[#F8FAFC] border-slate-200 text-slate-900 focus:bg-white focus:border-[#20a9f8]"
                  : "bg-[#111A2E] border-[#1E2B45] text-slate-200 focus:border-[#20a9f8]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPass(!showCurrentPass)}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showCurrentPass ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showNewPass ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full text-xs sm:text-sm rounded-xl px-4 pr-10 py-2.5 border transition-all shadow-sm focus:outline-none ${
                isLight
                  ? "bg-[#F8FAFC] border-slate-200 text-slate-900 focus:bg-white focus:border-[#20a9f8]"
                  : "bg-[#111A2E] border-[#1E2B45] text-slate-200 focus:border-[#20a9f8]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPass(!showNewPass)}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showNewPass ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPass ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full text-xs sm:text-sm rounded-xl px-4 pr-10 py-2.5 border transition-all shadow-sm focus:outline-none ${
                isLight
                  ? "bg-[#F8FAFC] border-slate-200 text-slate-900 focus:bg-white focus:border-[#20a9f8]"
                  : "bg-[#111A2E] border-[#1E2B45] text-slate-200 focus:border-[#20a9f8]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showConfirmPass ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loadingPassword}
            style={{ backgroundColor: "#20a9f8" }}
            className="hover:opacity-90 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            {loadingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecurityTab;
