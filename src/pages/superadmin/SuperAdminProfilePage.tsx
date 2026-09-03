import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { handleLogoutThunk } from "../../store/authSlice";
import { toggleTheme as toggleThemeAction } from "../../store/uiSlice";
import { addToast } from "@heroui/react";
import {
  FiUser,
  FiShield,
  FiSettings,
  FiLogOut,
  FiArrowLeft,
} from "react-icons/fi";

import { FormMessage } from "../../types/superadmin";
import {
  updateSuperAdminProfile,
  updateSuperAdminPassword,
} from "../../services/superadmin";
import SuperAdminHeader from "./components/SuperAdminHeader";
import SuperAdminSidebar from "./components/SuperAdminSidebar";
import ProfileTab from "./components/ProfileTab";
import GeneralTab from "./components/GeneralTab";
import SecurityTab from "./components/SecurityTab";

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
  const { theme } = useSelector((state: RootState) => state.ui);

  const handleToggleTheme = () => {
    dispatch(toggleThemeAction());
  };
  const isLight = theme === "light";

  const superAdminEmail: any = localStorage.getItem("superadmin_email") || user?.email;
  const userInitial = (superAdminEmail?.[0] || "A").toUpperCase();

  const [firstName, setFirstName] = useState("Super");
  const [lastName, setLastName] = useState("Admin");
  const [profileMsg, setProfileMsg] = useState<FormMessage | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  const [passwordMsg, setPasswordMsg] = useState<FormMessage | null>(null);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleSignOut = async () => {
    localStorage.removeItem("superadmin_email");
    await dispatch(handleLogoutThunk("/admin/login"));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        const errorText = "Image file is too large (max 10MB)";
        setProfileMsg({ text: errorText, isError: true });
        addToast({ title: "Upload Error", description: errorText, color: "danger" });
        return;
      }
      const url = URL.createObjectURL(file);
      setAvatarImage(url);
    }
  };

  const handleRemoveImage = () => {
    setAvatarImage(null);
  };

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    try {
      setLoadingProfile(true);
      const res: any = await updateSuperAdminProfile({ firstName, lastName });
      if (res?.data?.success || res?.success) {
        setProfileMsg({ text: "Profile updated successfully!", isError: false });
        addToast({
          title: "Profile Updated",
          description: "Profile information updated successfully!",
          color: "success",
        });
      } else {
        const errorMsg = res?.data?.message || res?.message || "Failed to update profile";
        setProfileMsg({ text: errorMsg, isError: true });
        addToast({ title: "Error", description: errorMsg, color: "danger" });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to update profile";
      setProfileMsg({
        text: errorMsg,
        isError: true,
      });
      addToast({ title: "Error", description: errorMsg, color: "danger" });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdatePasswordSubmit = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    setPasswordMsg(null);
    if (!currentPassword) {
      const msg = "Please enter your current password";
      setPasswordMsg({ text: msg, isError: true });
      addToast({ title: "Validation Error", description: msg, color: "danger" });
      return;
    }
    if (newPassword.length < 6) {
      const msg = "New password must be at least 6 characters long";
      setPasswordMsg({ text: msg, isError: true });
      addToast({ title: "Validation Error", description: msg, color: "danger" });
      return;
    }
    if (newPassword !== confirmPassword) {
      const msg = "New passwords do not match";
      setPasswordMsg({ text: msg, isError: true });
      addToast({ title: "Validation Error", description: msg, color: "danger" });
      return;
    }
    try {
      setLoadingPassword(true);
      const res: any = await updateSuperAdminPassword({
        currentPassword,
        newPassword,
      });
      if (res?.data?.success || res?.success) {
        setProfileMsg({ text: "Password updated successfully!", isError: false });
        addToast({
          title: "Password Updated",
          description: "Password updated successfully!",
          color: "success",
        });
      } else {
        const errorMsg = res?.data?.message || res?.message || "Failed to update password";
        setPasswordMsg({ text: errorMsg, isError: true });
        addToast({ title: "Error", description: errorMsg, color: "danger" });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to update password";
      setPasswordMsg({
        text: errorMsg,
        isError: true,
      });
      addToast({ title: "Error", description: errorMsg, color: "danger" });
    } finally {
      setLoadingPassword(false);
    }
  };

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div
      className={`min-h-screen font-sans flex transition-colors duration-200 selection:bg-[#20a9f8] selection:text-white ${
        isLight ? "bg-[#F8FAFC] text-slate-900" : "bg-[#070C18] text-slate-100"
      }`}
    >
      <SuperAdminSidebar
        activeTab="settings"
        isLight={isLight}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <SuperAdminHeader
          isLight={isLight}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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

        <div className="flex flex-col md:flex-row items-start gap-6">
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

          <div className="flex-1 w-full">
            {activeTab === "profile" && (
              <ProfileTab
                isLight={isLight}
                firstName={firstName}
                lastName={lastName}
                superAdminEmail={superAdminEmail || "admin@practiceroi.com"}
                userInitial={userInitial}
                avatarImage={avatarImage}
                profileMsg={profileMsg}
                loadingProfile={loadingProfile}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
                onAvatarChange={handleImageChange}
                onRemoveAvatar={handleRemoveImage}
                onSubmit={handleUpdateProfileSubmit}
              />
            )}

            {activeTab === "general" && (
              <GeneralTab isLight={isLight} onToggleTheme={handleToggleTheme} />
            )}

            {activeTab === "security" && (
              <SecurityTab
                isLight={isLight}
                passwordMsg={passwordMsg}
                loadingPassword={loadingPassword}
                onSubmitPassword={handleUpdatePasswordSubmit}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  </div>
);
};

export default SuperAdminProfilePage;
