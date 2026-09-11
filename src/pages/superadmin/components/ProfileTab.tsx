import React, { useRef } from "react";
import { FormMessage } from "../types";
import { FiUser, FiCamera, FiX, FiLock } from "react-icons/fi";

interface ProfileTabProps {
  isLight: boolean;
  firstName: string;
  lastName: string;
  superAdminEmail: string;
  userInitial: string;
  avatarImage: string | null;
  profileMsg: FormMessage | null;
  loadingProfile: boolean;
  onFirstNameChange: (val: string) => void;
  onLastNameChange: (val: string) => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  isLight,
  firstName,
  lastName,
  superAdminEmail,
  userInitial,
  avatarImage,
  profileMsg,
  loadingProfile,
  onFirstNameChange,
  onLastNameChange,
  onAvatarChange,
  onRemoveAvatar,
  onSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className={`rounded-2xl border p-6 sm:p-8 shadow-sm transition-all ${isLight
          ? "bg-white border-slate-200/90"
          : "bg-[#0F172A] border-[#1E293B]"
        }`}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <FiUser className={`text-lg ${isLight ? "text-slate-800" : "text-slate-200"}`} />
        <h2 className={`font-bold text-base sm:text-lg ${isLight ? "text-slate-900" : "text-white"}`}>
          Profile Information
        </h2>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative size-20 group shrink-0">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="size-full overflow-hidden rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative cursor-pointer hover:opacity-95 transition-all shadow-sm"
              title="Click to change photo"
            >
              {avatarImage ? (
                <img
                  src={avatarImage}
                  alt="Profile"
                  className="size-full object-cover"
                />
              ) : (
                <div
                  style={{ backgroundColor: "#20a9f8" }}
                  className="size-full flex items-center justify-center text-white font-extrabold text-2xl"
                >
                  {userInitial}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <FiCamera className="size-6 drop-shadow-md" />
              </div>
            </div>
            {avatarImage && (
              <button
                type="button"
                onClick={onRemoveAvatar}
                className="absolute top-0 right-0 size-5 min-w-0 h-5 z-10 p-0 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md border border-white dark:border-slate-800 cursor-pointer"
                title="Remove photo"
              >
                <FiX className="size-3" />
              </button>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              id="profileImage"
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={onAvatarChange}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer mb-1 ${isLight
                  ? "bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-sm"
                  : "bg-[#111A2E] hover:bg-[#1A2642] border-[#1E2B45] text-slate-200"
                }`}
            >
              Change Photo
            </button>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              JPG, JPEG or PNG. 10MB max.
            </p>
          </div>
        </div>
        {profileMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold ${profileMsg.isError
                ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              }`}
          >
            {profileMsg.text}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              placeholder="First Name"
              className={`w-full text-xs sm:text-sm rounded-xl px-4 py-2.5 border transition-all shadow-sm focus:outline-none ${isLight
                  ? "bg-[#F8FAFC] border-slate-200 text-slate-900 focus:bg-white focus:border-[#20a9f8]"
                  : "bg-[#111A2E] border-[#1E2B45] text-slate-200 focus:border-[#20a9f8]"
                }`}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              placeholder="Last Name"
              className={`w-full text-xs sm:text-sm rounded-xl px-4 py-2.5 border transition-all shadow-sm focus:outline-none ${isLight
                  ? "bg-[#F8FAFC] border-slate-200 text-slate-900 focus:bg-white focus:border-[#20a9f8]"
                  : "bg-[#111A2E] border-[#1E2B45] text-slate-200 focus:border-[#20a9f8]"
                }`}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={superAdminEmail}
                disabled
                readOnly
                className={`w-full text-xs sm:text-sm rounded-xl px-4 py-2.5 border cursor-not-allowed opacity-75 ${isLight
                    ? "bg-[#F1F5F9] border-slate-200 text-slate-600"
                    : "bg-slate-800/80 border-slate-700 text-slate-400"
                  }`}
              />
              <FiLock className="absolute right-4 top-3 text-slate-400 text-sm" />
            </div>
          </div>
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={loadingProfile}
            style={{ backgroundColor: "#20a9f8" }}
            className="hover:opacity-90 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            {loadingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;