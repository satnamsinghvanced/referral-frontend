import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { handleLogoutThunk } from "../../store/authSlice";
import api from "../../services/axios";
import Logo from "../../components/ui/Logo";
import {
  FiUser,
  FiShield,
  FiSettings,
  FiLogOut,
  FiCamera,
  FiX,
  FiEye,
  FiEyeOff,
  FiChevronDown,
  FiLock,
  FiArrowLeft,
} from "react-icons/fi";

const SuperAdminProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabFromUrl = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState<string>(activeTabFromUrl);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const { user } = useSelector((state: RootState) => state.auth);

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  const isLight = theme === "light";

  const superAdminEmail =
    localStorage.getItem("superadmin_email") ||
    user?.email ||
    "admin@practiceroi.com";
  const userInitial = (superAdminEmail[0] || "A").toUpperCase();

  // Profile Form State
  const [firstName, setFirstName] = useState("Super");
  const [lastName, setLastName] = useState("Admin");
  const [profileMsg, setProfileMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Header Dropdown State
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await dispatch(handleLogoutThunk());
    localStorage.removeItem("superadmin_email");
    navigate("/admin/login");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setProfileMsg({ text: "Image file is too large (max 10MB)", isError: true });
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarImage(url);
    }
  };

  const handleRemoveImage = () => {
    setAvatarImage(null);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    try {
      setLoadingProfile(true);
      const res: any = await api.put("/superadmin/profile", { firstName, lastName });
      if (res.data?.success || res.success) {
        setProfileMsg({ text: "Profile updated successfully!", isError: false });
      } else {
        setProfileMsg({ text: res.data?.message || "Failed to update profile", isError: true });
      }
    } catch (error: any) {
      setProfileMsg({
        text: error.response?.data?.message || "Failed to update profile",
        isError: true,
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (!currentPassword) {
      setPasswordMsg({ text: "Please enter your current password", isError: true });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: "New password must be at least 6 characters long", isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: "New passwords do not match", isError: true });
      return;
    }
    try {
      setLoadingPassword(true);
      const res: any = await api.put("/superadmin/password", {
        currentPassword,
        newPassword,
      });
      if (res.data?.success || res.success) {
        setPasswordMsg({ text: "Password updated successfully!", isError: false });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({ text: res.data?.message || "Failed to update password", isError: true });
      }
    } catch (error: any) {
      setPasswordMsg({
        text: error.response?.data?.message || "Failed to update password",
        isError: true,
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div
      className={`min-h-screen font-sans flex flex-col transition-colors duration-200 selection:bg-[#20a9f8] selection:text-white ${isLight ? "bg-[#F8FAFC] text-slate-900" : "bg-[#070C18] text-slate-100"
        }`}
    >
      <header
        className={`sticky top-0 z-40 border-b transition-colors duration-200 ${isLight
          ? "bg-white border-slate-200 text-slate-900"
          : "bg-[#0B101D] border-[#1E293B] text-white"
          }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate("/admin")}
              className="cursor-pointer hover:scale-105 transition-transform"
              title="Go to Dashboard"
            >
              <Logo iconOnly className="h-9 w-auto" />
            </div>
            <span
              className={`font-extrabold text-base sm:text-lg tracking-tight select-none ${isLight ? "text-slate-900" : "text-white"
                }`}
            >
              Practice ROI
            </span>
            <span
              style={{ backgroundColor: "#20a9f815", color: "#20a9f8", borderColor: "#20a9f840" }}
              className="border text-[11px] font-extrabold px-2.5 py-0.5 rounded-full tracking-tight ml-1 select-none"
            >
              Admin Portal
            </span>
          </div>

          <div className="relative flex items-center gap-4" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border transition-all cursor-pointer ${isLight
                ? "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                : "bg-[#111A2E] hover:bg-[#1A2642] border-[#1E2B45] text-slate-200"
                }`}
            >
              <div
                style={{ backgroundColor: "#20a9f8" }}
                className="w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-sm"
              >
                {userInitial}
              </div>
              <span className="text-xs sm:text-sm font-semibold max-w-[170px] truncate">
                {superAdminEmail}
              </span>
              <FiChevronDown
                className={`text-slate-400 text-sm transition-transform duration-200 ${isProfileMenuOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isProfileMenuOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-64 rounded-2xl border shadow-2xl p-4 z-50 animate-in fade-in-50 zoom-in-95 duration-100 ${isLight
                  ? "bg-white border-slate-200 text-slate-900 shadow-slate-300/60"
                  : "bg-[#0F172A] border-[#1E293B] text-slate-100 shadow-black/80"
                  }`}
              >
                {/* Header: Signed in as email */}
                <div className="pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Signed in as
                  </p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                    {superAdminEmail}
                  </p>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setActiveTab("profile");
                      setSearchParams({ tab: "profile" });
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${isLight
                      ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                  >
                    Settings
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleSignOut();
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${isLight
                      ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Settings Body */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title Header with Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? "text-slate-900" : "text-white"
                }`}
            >
              Settings
            </h1>
            <p
              className={`text-xs sm:text-sm mt-1 ${isLight ? "text-slate-500" : "text-slate-400"
                }`}
            >
              Manage your account preferences and configurations.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin")}
            className={`self-start sm:self-auto px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all flex items-center gap-2 cursor-pointer shadow-sm ${isLight
              ? "bg-white hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900"
              : "bg-[#111A2E] hover:bg-[#1A2642] border-[#1E2B45] text-slate-200 hover:text-white"
              }`}
          >
            <FiArrowLeft className="text-sm sm:text-base" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Two-Column Layout Container */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Left Column: Sidebar Tab Card (Shows ONLY Profile, General, Security & Sign Out) */}
          <div
            className={`w-full md:w-60 shrink-0 rounded-2xl border p-3 shadow-sm space-y-1 ${isLight
              ? "bg-white border-slate-200/90"
              : "bg-[#0F172A] border-[#1E293B]"
              }`}
          >
            <button
              onClick={() => {
                setActiveTab("profile");
                setSearchParams({ tab: "profile" });
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer text-left ${activeTab === "profile"
                ? "bg-[#20a9f815] text-[#20a9f8]"
                : isLight
                  ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
            >
              <FiUser className="text-base shrink-0" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("general");
                setSearchParams({ tab: "general" });
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer text-left ${activeTab === "general"
                ? "bg-[#20a9f815] text-[#20a9f8]"
                : isLight
                  ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
            >
              <FiSettings className="text-base shrink-0" />
              <span>General</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("security");
                setSearchParams({ tab: "security" });
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer text-left ${activeTab === "security"
                ? "bg-[#20a9f815] text-[#20a9f8]"
                : isLight
                  ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
            >
              <FiShield className="text-base shrink-0" />
              <span>Security</span>
            </button>

            <hr className="border-slate-100 dark:border-slate-800 my-2" />

            <button
              onClick={handleSignOut}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer text-left ${isLight
                ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
            >
              <FiLogOut className="text-base shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Right Column: Active Card Panel */}
          <div className="flex-1 w-full">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div
                className={`rounded-2xl border p-6 sm:p-8 shadow-sm transition-all ${isLight
                  ? "bg-white border-slate-200/90"
                  : "bg-[#0F172A] border-[#1E293B]"
                  }`}
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <FiUser className="text-lg text-slate-800 dark:text-slate-200" />
                  <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    Profile Information
                  </h2>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {/* Photo Avatar Block with Remove Badge */}
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
                          onClick={handleRemoveImage}
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
                        onChange={handleImageChange}
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

                  {/* Clean 2-Column Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
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
                        onChange={(e) => setLastName(e.target.value)}
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
            )}

            {/* General Tab */}
            {activeTab === "general" && (
              <div
                className={`rounded-2xl border p-6 sm:p-8 shadow-sm transition-all ${isLight
                  ? "bg-white border-slate-200/90"
                  : "bg-[#0F172A] border-[#1E293B]"
                  }`}
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <FiSettings className="text-lg text-slate-800 dark:text-slate-200" />
                  <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    General Settings
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Dark Mode
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Switch to dark theme
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={toggleTheme}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!isLight ? "bg-[#20a9f8]" : "bg-slate-300"
                        }`}
                      role="switch"
                      aria-checked={!isLight}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${!isLight ? "translate-x-5" : "translate-x-0"
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab (Restored Password Update Form Inputs) */}
            {activeTab === "security" && (
              <div
                className={`rounded-2xl border p-6 sm:p-8 shadow-sm transition-all ${isLight
                  ? "bg-white border-slate-200/90"
                  : "bg-[#0F172A] border-[#1E293B]"
                  }`}
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <FiShield className="text-lg text-slate-800 dark:text-slate-200" />
                  <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    Security & Privacy
                  </h2>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-5 w-full">
                  {passwordMsg && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-semibold ${passwordMsg.isError
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
                        className={`w-full text-xs sm:text-sm rounded-xl px-4 pr-10 py-2.5 border transition-all shadow-sm focus:outline-none ${isLight
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
                        className={`w-full text-xs sm:text-sm rounded-xl px-4 pr-10 py-2.5 border transition-all shadow-sm focus:outline-none ${isLight
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
                        className={`w-full text-xs sm:text-sm rounded-xl px-4 pr-10 py-2.5 border transition-all shadow-sm focus:outline-none ${isLight
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminProfilePage;
