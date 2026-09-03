import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { handleLogoutThunk } from "../../../store/authSlice";
import { FiChevronDown, FiMenu, FiSettings, FiLogOut } from "react-icons/fi";

interface SuperAdminHeaderProps {
  isLight: boolean;
  onNavigateSettings?: () => void;
  onToggleMobileSidebar?: () => void;
}

const SuperAdminHeader: React.FC<SuperAdminHeaderProps> = ({
  isLight,
  onNavigateSettings,
  onToggleMobileSidebar,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const superAdminEmail =
    localStorage.getItem("superadmin_email") ||
    user?.email ||
    "admin@practiceroi.com";
  const userInitial = (superAdminEmail[0] || "A").toUpperCase();

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
    localStorage.removeItem("superadmin_email");
    await dispatch(handleLogoutThunk("/admin/login"));
  };

  const handleSettingsClick = () => {
    setIsProfileMenuOpen(false);
    if (onNavigateSettings) {
      onNavigateSettings();
    } else {
      navigate("/admin/settings");
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
        isLight
          ? "bg-white border-slate-200 text-slate-900"
          : "bg-[#0B101D] border-[#1E293B] text-white"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between md:justify-end">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-[#1E2B45] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <FiMenu className="text-lg" />
        </button>
        {/* Right side Profile Dropdown only (Logo & brand removed as requested) */}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border transition-all cursor-pointer ${
              isLight
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
              className={`text-slate-400 text-sm transition-transform duration-200 ${
                isProfileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isProfileMenuOpen && (
            <div
              className={`absolute right-0 top-full mt-2 w-64 rounded-2xl border shadow-2xl p-4 z-50 animate-in fade-in-50 zoom-in-95 duration-100 ${
                isLight
                  ? "bg-white border-slate-200 text-slate-900 shadow-slate-300/60"
                  : "bg-[#0F172A] border-[#1E293B] text-slate-100 shadow-black/80"
              }`}
            >
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
                  type="button"
                  onClick={handleSettingsClick}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-2 ${
                    isLight
                      ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <FiSettings className="text-sm text-slate-400 shrink-0" />
                  <span>Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    handleSignOut();
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40`}
                >
                  <FiLogOut className="text-sm text-red-500 shrink-0" />
                  <span className="text-red-500 font-bold">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
