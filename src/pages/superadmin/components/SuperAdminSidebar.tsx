import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { handleLogoutThunk } from "../../../store/authSlice";
import Logo from "../../../components/ui/Logo";
import { FiUsers, FiDollarSign, FiPhoneCall, FiLogOut, FiSettings, FiBookmark } from "react-icons/fi";

interface SuperAdminSidebarProps {
  activeTab: "clients" | "plans" | "phonePlans" | "specialties" | "settings";
  onTabChange?: (tab: "clients" | "plans" | "phonePlans" | "specialties") => void;
  isLight: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({
  activeTab,
  onTabChange,
  isLight,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSignOut = async () => {
    if (onCloseMobile) onCloseMobile();
    localStorage.removeItem("superadmin_email");
    await dispatch(handleLogoutThunk("/admin/login"));
  };

  const handleClientAccountsClick = () => {
    if (onCloseMobile) onCloseMobile();
    if (onTabChange) {
      onTabChange("clients");
    }
    navigate("/admin");
  };

  const handlePlansClick = () => {
    if (onCloseMobile) onCloseMobile();
    if (onTabChange) {
      onTabChange("plans");
    }
    navigate("/admin?tab=plans");
  };

  const handlePhonePlansClick = () => {
    if (onCloseMobile) onCloseMobile();
    if (onTabChange) {
      onTabChange("phonePlans");
    }
    navigate("/admin?tab=phone-plans");
  };

  const handleSpecialtiesClick = () => {
    if (onCloseMobile) onCloseMobile();
    if (onTabChange) {
      onTabChange("specialties");
    }
    navigate("/admin?tab=specialties");
  };

  const handleSettingsClick = () => {
    if (onCloseMobile) onCloseMobile();
    navigate("/admin/settings");
  };

  const sidebarContent = (
    <aside
      className={`w-64 shrink-0 border-r flex flex-col justify-between min-h-screen transition-colors duration-200 sticky top-0 h-screen select-none ${isLight
        ? "bg-white border-slate-200 text-slate-900"
        : "bg-[#0B101D] border-[#1E293B] text-white"
        }`}
    >
      <div>
        <div className="p-6 border-b border-slate-200/80 dark:border-[#1E293B] flex items-center gap-3">
          <div
            onClick={() => navigate("/admin")}
            className="cursor-pointer hover:scale-105 transition-transform shrink-0"
            title="Go to Dashboard"
          >
            <Logo iconOnly className="h-8 w-auto" />
          </div>
          <div>
            <h2 className="font-black text-base tracking-tight leading-none">
              Practice ROI
            </h2>
            <span
              style={{
                backgroundColor: "#20a9f815",
                color: "#20a9f8",
                borderColor: "#20a9f840",
              }}
              className="border text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 tracking-wider uppercase"
            >
              Admin
            </span>
          </div>
        </div>

        <div className="p-4 space-y-1.5">
          <button
            type="button"
            onClick={handleClientAccountsClick}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "clients"
              ? "bg-[#20a9f8] text-white shadow-md shadow-[#20a9f8]/20"
              : isLight
                ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                : "text-slate-300 hover:bg-[#111A2E] hover:text-white"
              }`}
          >
            <FiUsers className="text-base shrink-0" />
            <span>Client Accounts</span>
          </button>

          <button
            type="button"
            onClick={handlePlansClick}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "plans"
              ? "bg-[#20a9f8] text-white shadow-md shadow-[#20a9f8]/20"
              : isLight
                ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                : "text-slate-300 hover:bg-[#111A2E] hover:text-white"
              }`}
          >
            <FiDollarSign className="text-base shrink-0" />
            <span>Plans & Features</span>
          </button>

          <button
            type="button"
            onClick={handlePhonePlansClick}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "phonePlans"
              ? "bg-[#20a9f8] text-white shadow-md shadow-[#20a9f8]/20"
              : isLight
                ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                : "text-slate-300 hover:bg-[#111A2E] hover:text-white"
              }`}
          >
            <FiPhoneCall className="text-base shrink-0" />
            <span>Phone Service Plans</span>
          </button>

          <button
            type="button"
            onClick={handleSpecialtiesClick}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "specialties"
              ? "bg-[#20a9f8] text-white shadow-md shadow-[#20a9f8]/20"
              : isLight
                ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                : "text-slate-300 hover:bg-[#111A2E] hover:text-white"
              }`}
          >
            <FiBookmark className="text-base shrink-0" />
            <span>Specialties</span>
          </button>
        </div>
      </div>

      {/* Footer: Action Buttons (Settings & Sign Out) */}
      <div className="p-4 border-t border-slate-200/80 dark:border-[#1E293B] space-y-1.5">
        <button
          type="button"
          onClick={handleSettingsClick}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "settings"
            ? "bg-[#20a9f8] text-white shadow-md shadow-[#20a9f8]/20"
            : isLight
              ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              : "text-slate-300 hover:bg-[#111A2E] hover:text-white"
            }`}
        >
          <FiSettings className="text-sm shrink-0" />
          <span>Settings</span>
        </button>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
        >
          <FiLogOut className="text-sm shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block shrink-0">{sidebarContent}</div>

      {/* Mobile Drawer Sidebar */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative z-10 w-64 max-w-[80vw] h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default SuperAdminSidebar;
