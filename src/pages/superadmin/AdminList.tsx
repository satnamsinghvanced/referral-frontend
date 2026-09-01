import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { handleLogoutThunk, setCredentials } from "../../store/authSlice";
import api from "../../services/axios";
import Logo from "../../components/ui/Logo";
import {
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiDollarSign,
  FiSearch,
  FiEye,
  FiKey,
  FiLogOut,
  FiX,
  FiMail,
  FiPhone,
  FiGlobe,
  FiTrendingUp,
  FiStar,
  FiUserCheck,
  FiSun,
  FiMoon,
  FiChevronLeft,
  FiChevronRight,
  FiZap,
  FiXCircle,
  FiSlash,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiSettings,
  FiLock,
  FiUser,
} from "react-icons/fi";

export interface ClientAccount {
  id: string;
  displayClientId?: string;
  initials: string;
  practiceName: string;
  owner: string;
  email?: string;
  phone?: string;
  location: string;
  status: "Active" | "Trial" | "Past Due" | "Onboarding" | "Suspended" | "Cancelled";
  statusSubtext?: string;
  plan: "Growth" | "Scale" | "Starter" | "Enterprise";
  mrr: number | null;
  lastActive: string;
  updatedAt?: string;
  nextBillingDate?: string;
  leads?: number;
  referrals?: number;
  reviewScore?: string;
  joinedDate?: string;
  assignedRep?: string;
  tags?: string[];
  internalNotes?: string;
}

const formatRelativeTime = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return "2 mins ago";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.max(0, Math.floor(diffInMs / 1000));
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInSecs < 60) return "Just now";
  if (diffInMins < 60) return `${diffInMins} min${diffInMins > 1 ? "s" : ""} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
};

const getPlanDueNotice = (
  account: ClientAccount
): { text: string; isWarning: boolean } | null => {
  if (account.statusSubtext) {
    return {
      text: account.statusSubtext,
      isWarning: account.status === "Past Due",
    };
  }

  if (account.status === "Trial") {
    if (account.nextBillingDate) {
      const trialDate = new Date(account.nextBillingDate);
      if (!isNaN(trialDate.getTime())) {
        const monthStr = trialDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        return { text: `ends ${monthStr}`, isWarning: false };
      }
    }
    return { text: "ends Jul 10", isWarning: false };
  }

  if (account.status === "Past Due") {
    return { text: "12d overdue", isWarning: true };
  }

  if (account.nextBillingDate) {
    const dueDate = new Date(account.nextBillingDate);
    if (!isNaN(dueDate.getTime())) {
      const now = new Date();
      const diffInDays = Math.ceil(
        (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays < 0) {
        return { text: `${Math.abs(diffInDays)}d overdue`, isWarning: true };
      }
      if (diffInDays <= 10) {
        return {
          text: `due in ${diffInDays} day${diffInDays > 1 ? "s" : ""}`,
          isWarning: true,
        };
      }
    }
  }

  return null;
};

interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  isLight: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  onChange,
  isLight,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-44 sm:w-52" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer shadow-sm ${isLight
          ? "bg-slate-100 hover:bg-slate-200/80 border-slate-300 text-slate-800"
          : "bg-[#111A2E] hover:bg-[#1A2642] border-[#1E2B45] text-slate-200"
          }`}
      >
        <span className="truncate">{value}</span>
        {isOpen ? (
          <FiChevronUp className="text-slate-500 text-base shrink-0 ml-1" />
        ) : (
          <FiChevronDown className="text-slate-500 text-base shrink-0 ml-1" />
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 top-full mt-2 w-full min-w-[210px] rounded-2xl border shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100 ${isLight
            ? "bg-white border-slate-200/90 text-slate-800 shadow-slate-300/50"
            : "bg-[#0F172A] border-[#1E293B] text-slate-100 shadow-black/60"
            }`}
        >
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer text-left ${isSelected
                  ? isLight
                    ? "bg-slate-200/80 text-slate-900 font-bold"
                    : "bg-slate-800 text-white font-bold"
                  : isLight
                    ? "hover:bg-slate-100 text-slate-700"
                    : "hover:bg-slate-800/60 text-slate-300"
                  }`}
              >
                <span>{opt}</span>
                {isSelected && (
                  <FiCheck className="text-sm text-blue-600 dark:text-sky-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLight: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
  superAdminEmail: string;
}

const SuperAdminSettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isLight,
  theme,
  toggleTheme,
  superAdminEmail,
}) => {
  const [firstName, setFirstName] = useState("Super");
  const [lastName, setLastName] = useState("Admin");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMsg, setProfileMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  if (!isOpen) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    try {
      setLoadingProfile(true);
      const res: any = await api.put("/superadmin/profile", { firstName, lastName });
      if (res.success || res.data?.success) {
        setProfileMsg({ text: "Profile updated successfully!", isError: false });
      } else {
        setProfileMsg({ text: res.message || "Failed to update profile", isError: true });
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
      if (res.success || res.data?.success) {
        setPasswordMsg({ text: "Password updated successfully!", isError: false });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({ text: res.message || "Failed to update password", isError: true });
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

  const initialLetter = (superAdminEmail[0] || "A").toUpperCase();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden z-10 border animate-in fade-in-50 zoom-in-95 duration-200 ${isLight
          ? "bg-white border-slate-200 text-slate-900"
          : "bg-[#0F172A] border-[#1E293B] text-slate-100"
          }`}
      >
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${isLight
            ? "bg-slate-50 border-slate-200"
            : "bg-[#0B101D] border-[#1E293B]"
            }`}
        >
          <div className="flex items-center gap-2.5">
            <FiSettings className="text-xl text-blue-600 dark:text-sky-400" />
            <h2 className="font-bold text-lg">Super Admin Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Profile Details
            </h3>

            <div className="flex items-center gap-4 py-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                {initialLetter}
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  {firstName} {lastName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Platform Super Administrator
                </p>
              </div>
            </div>

            {profileMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${profileMsg.isError
                  ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  }`}
              >
                {profileMsg.text}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border focus:outline-none transition-all ${isLight
                    ? "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600 focus:bg-white"
                    : "bg-[#111A2E] border-[#1E2B45] text-slate-200 focus:border-sky-500"
                    }`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border focus:outline-none transition-all ${isLight
                    ? "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600 focus:bg-white"
                    : "bg-[#111A2E] border-[#1E2B45] text-slate-200 focus:border-sky-500"
                    }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                  (Disabled / Locked)
                </span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={superAdminEmail}
                  disabled
                  readOnly
                  className={`w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border cursor-not-allowed opacity-75 ${isLight
                    ? "bg-slate-100 border-slate-200 text-slate-500"
                    : "bg-slate-800/80 border-slate-700 text-slate-400"
                    }`}
                />
                <FiLock className="absolute right-3.5 top-3 text-slate-400 text-sm" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {loadingProfile ? "Saving Profile..." : "Save Profile"}
            </button>
          </form>

          <hr className="border-slate-200 dark:border-slate-800" />

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Update Password
            </h3>

            {passwordMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${passwordMsg.isError
                  ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  }`}
              >
                {passwordMsg.text}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border focus:outline-none transition-all ${isLight
                  ? "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600 focus:bg-white"
                  : "bg-[#111A2E] border-[#1E2B45] text-slate-200 focus:border-sky-500"
                  }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border focus:outline-none transition-all ${isLight
                    ? "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600 focus:bg-white"
                    : "bg-[#111A2E] border-[#1E2B45] text-slate-200 focus:border-sky-500"
                    }`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border focus:outline-none transition-all ${isLight
                    ? "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600 focus:bg-white"
                    : "bg-[#111A2E] border-[#1E2B45] text-slate-200 focus:border-sky-500"
                    }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingPassword}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {loadingPassword ? "Updating Password..." : "Update Password"}
            </button>
          </form>

          <hr className="border-slate-200 dark:border-slate-800" />

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Theme Preference
            </h3>
            <div
              className={`flex items-center justify-between p-3.5 rounded-xl border ${isLight
                ? "bg-slate-50 border-slate-200"
                : "bg-[#111A2E] border-[#1E2B45]"
                }`}
            >
              <div className="flex items-center gap-2.5">
                {isLight ? (
                  <FiSun className="text-amber-500 text-lg" />
                ) : (
                  <FiMoon className="text-indigo-400 text-lg" />
                )}
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {isLight ? "Light Mode Active" : "Dark Mode Active"}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Switch theme layout for your Super Admin workspace
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${isLight
                  ? "bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                  }`}
              >
                Switch to {isLight ? "Dark" : "Light"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  const [clientAccounts, setClientAccounts] = useState<ClientAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedClient, setSelectedClient] = useState<ClientAccount | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Profile Dropdown & Settings Modal States
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.get("/superadmin/admins");
      const responseData = res.data?.data || res.data;
      const fetched = Array.isArray(responseData) ? responseData : responseData?.admins || [];

      if (responseData?.total !== undefined) {
        setTotalCount(responseData.total);
      }

      if (Array.isArray(fetched)) {
        const formatted: ClientAccount[] = fetched.map((admin: any, index: number) => {
          const firstLetter = (admin.firstName?.[0] || admin.practiceName?.[0] || "A").toUpperCase();
          const secondLetter = (admin.lastName?.[0] || admin.practiceName?.[1] || "C").toUpperCase();
          const initials = `${firstLetter}${secondLetter}`;

          const planStatus = admin.plan?.status;
          const status = !admin.isActive
            ? "Suspended"
            : planStatus === "trial"
              ? "Trial"
              : planStatus === "past_due"
                ? "Past Due"
                : "Active";

          const planName = admin.plan?.name || "Growth";
          const email = admin.email || "";
          const phone = admin.mobile || admin.phone || "";
          const location =
            admin.city && admin.state
              ? `${admin.city}, ${admin.state}`
              : admin.specialty?.name || "Phoenix, AZ";
          const joinedDate = admin.createdAt
            ? new Date(admin.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
            : "Recent";

          const lastActiveTime = admin.updatedAt || admin.createdAt || new Date().toISOString();

          return {
            id: admin._id || String(index + 1),
            displayClientId: `cli_${String(index + 1).padStart(3, "0")}`,
            initials,
            practiceName: admin.practiceName || `${admin.firstName || "Client"} ${admin.lastName || "Practice"}`,
            owner: admin.firstName && admin.lastName ? `Dr. ${admin.firstName} ${admin.lastName}` : "Dr. Practice Owner",
            email,
            phone,
            location,
            status: status as any,
            plan: (planName.includes("Scale") ? "Scale" : planName.includes("Enterprise") ? "Enterprise" : planName.includes("Starter") ? "Starter" : "Growth") as any,
            mrr: admin.plan?.price ? Number(admin.plan.price) : 0,
            lastActive: formatRelativeTime(lastActiveTime),
            updatedAt: lastActiveTime,
            nextBillingDate: admin.plan?.nextBillingDate,
            leads: admin.totalLeads ?? admin.leads,
            referrals: admin.totalReferrals ?? admin.referrals,
            reviewScore: admin.reviewScore,
            joinedDate,
            assignedRep: admin.assignedRep,
            tags: Array.isArray(admin.tags) && admin.tags.length > 0 ? admin.tags : undefined,
            internalNotes: admin.internalNotes || admin.notes || undefined,
          };
        });
        setClientAccounts(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch admins from API:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleImpersonate = async (client: ClientAccount) => {
    try {
      setImpersonatingId(client.id);
      const targetEmail = client.email || `${client.practiceName.toLowerCase().replace(/\s+/g, "")}@example.com`;
      const res: any = await api.post("/superadmin/impersonate", {
        adminId: client.id,
        email: targetEmail,
      });

      const responsePayload = res?.data || res;
      const accessToken = responsePayload?.accessToken;
      const refreshToken = responsePayload?.refreshToken;
      const impersonatedUser = responsePayload?.user;

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        if (impersonatedUser) localStorage.setItem("user", JSON.stringify(impersonatedUser));

        dispatch(
          setCredentials({
            user: impersonatedUser,
            token: accessToken,
          } as any)
        );
        window.open("/", "_blank");
      } else {
        alert(res?.message || "Failed to log in as client user.");
      }
    } catch (error: any) {
      console.error("Impersonation error:", error);
      alert(
        error.response?.data?.message || error.message || "Failed to log in as target client user."
      );
    } finally {
      setImpersonatingId(null);
    }
  };

  const handleSignOut = async () => {
    await dispatch(handleLogoutThunk());
    localStorage.removeItem("superadmin_email");
    navigate("/admin/login");
  };

  const handleOpenDrawer = async (client: ClientAccount) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
    setModalLoading(true);
    try {
      const res = await api.get(`/superadmin/admins/${client.id}`);
      const data = res.data?.data || res.data;
      if (data) {
        setSelectedClient((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            leads: data.leads ?? prev.leads ?? 0,
            referrals: data.referrals ?? prev.referrals ?? 0,
            reviewScore: data.reviewScore ?? prev.reviewScore ?? "0 ★",
            tags: Array.isArray(data.tags) ? data.tags : prev.tags || [],
            internalNotes: data.internalNotes || prev.internalNotes || "",
          };
        });
      }
    } catch (err) {
      console.error("Failed to fetch client details from API:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const filteredAccounts = useMemo(() => {
    return clientAccounts.filter((account) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        account.practiceName.toLowerCase().includes(q) ||
        account.owner.toLowerCase().includes(q) ||
        (account.email && account.email.toLowerCase().includes(q)) ||
        account.location.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All Statuses" || account.status === statusFilter;

      const matchesPlan =
        planFilter === "All Plans" || account.plan === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [clientAccounts, searchQuery, statusFilter, planFilter]);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAccounts = useMemo(() => {
    return filteredAccounts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAccounts, startIndex, itemsPerPage]);

  const stats = useMemo(() => {
    const total = clientAccounts.length;
    const active = clientAccounts.filter((a) => a.status === "Active").length;
    const trials = clientAccounts.filter((a) => a.status === "Trial").length;
    const atRisk = clientAccounts.filter(
      (a) => a.status === "Past Due" || a.status === "Suspended"
    ).length;
    const mrr = clientAccounts.reduce((acc, curr) => acc + (curr.mrr || 0), 0);
    return { total, active, trials, atRisk, mrr };
  }, [clientAccounts]);

  const superAdminEmail =
    localStorage.getItem("superadmin_email") ||
    user?.email ||
    "admin@practiceroi.com";
  const userInitial = (superAdminEmail[0] || "A").toUpperCase();
  const isLight = theme === "light";

  return (
    <div
      className={`min-h-screen font-sans flex flex-col transition-colors duration-200 selection:bg-blue-600 selection:text-white relative ${isLight ? "bg-[#F8FAFC] text-slate-900" : "bg-[#070C18] text-slate-100"
        }`}
    >
      <header
        className={`sticky top-0 z-40 border-b transition-colors duration-200 ${isLight
          ? "bg-white border-slate-200 text-slate-900"
          : "bg-[#0B101D] border-[#1E293B] text-white"
          }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Practice ROI Logo Icon & Text Badge */}
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

          {/* Right: Profile Avatar Dropdown Button */}
          <div className="relative" ref={profileMenuRef}>
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

            {/* Profile Dropdown Menu (Matching Screenshot 1) */}
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
                      navigate("/admin/settings");
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

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? "text-slate-900" : "text-white"
              }`}
          >
            Client Accounts
          </h1>
          <p
            className={`text-xs sm:text-sm mt-1 ${isLight ? "text-slate-500" : "text-slate-400"
              }`}
          >
            View, manage, and impersonate any client account.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          <div
            className={`border rounded-xl p-4 shadow-sm transition-all ${isLight
              ? "bg-white border-slate-200/90 hover:shadow-md"
              : "bg-[#0F172A] border-[#1E293B] shadow-lg hover:border-slate-700"
              }`}
          >
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold ${isLight ? "text-slate-500" : "text-slate-400"
                }`}
            >
              <FiUsers className="text-sm" />
              <span>Total Clients</span>
            </div>
            <div
              className={`text-2xl sm:text-3xl font-bold mt-2 ${isLight ? "text-slate-900" : "text-white"
                }`}
            >
              {stats.total}
            </div>
          </div>

          <div
            className={`border rounded-xl p-4 shadow-sm transition-all ${isLight
              ? "bg-white border-slate-200/90 hover:shadow-md"
              : "bg-[#0F172A] border-[#1E293B] shadow-lg hover:border-slate-700"
              }`}
          >
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold ${isLight ? "text-slate-500" : "text-slate-400"
                }`}
            >
              <FiCheckCircle className="text-emerald-500 text-sm" />
              <span>Active</span>
            </div>
            <div
              className={`text-2xl sm:text-3xl font-bold mt-2 ${isLight ? "text-emerald-600" : "text-emerald-400"
                }`}
            >
              {stats.active}
            </div>
          </div>

          <div
            className={`border rounded-xl p-4 shadow-sm transition-all ${isLight
              ? "bg-white border-slate-200/90 hover:shadow-md"
              : "bg-[#0F172A] border-[#1E293B] shadow-lg hover:border-slate-700"
              }`}
          >
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold ${isLight ? "text-slate-500" : "text-slate-400"
                }`}
            >
              <FiClock className="text-blue-500 text-sm" />
              <span>Trials</span>
            </div>
            <div
              className={`text-2xl sm:text-3xl font-bold mt-2 ${isLight ? "text-blue-600" : "text-blue-400"
                }`}
            >
              {stats.trials}
            </div>
          </div>

          <div
            className={`border rounded-xl p-4 shadow-sm transition-all ${isLight
              ? "bg-white border-slate-200/90 hover:shadow-md"
              : "bg-[#0F172A] border-[#1E293B] shadow-lg hover:border-slate-700"
              }`}
          >
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold ${isLight ? "text-slate-500" : "text-slate-400"
                }`}
            >
              <FiAlertTriangle className="text-amber-500 text-sm" />
              <span>At Risk</span>
            </div>
            <div
              className={`text-2xl sm:text-3xl font-bold mt-2 ${isLight ? "text-amber-600" : "text-amber-400"
                }`}
            >
              {stats.atRisk}
            </div>
          </div>

          <div
            className={`border rounded-xl p-4 shadow-sm transition-all ${isLight
              ? "bg-white border-slate-200/90 hover:shadow-md"
              : "bg-[#0F172A] border-[#1E293B] shadow-lg hover:border-slate-700"
              }`}
          >
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold ${isLight ? "text-slate-500" : "text-slate-400"
                }`}
            >
              <FiDollarSign className="text-emerald-500 text-sm" />
              <span>MRR</span>
            </div>
            <div
              className={`text-2xl sm:text-3xl font-bold mt-2 ${isLight ? "text-emerald-600" : "text-emerald-400"
                }`}
            >
              ${stats.mrr}
            </div>
          </div>
        </div>

        {/* Search & Figma Custom Select Filters Bar */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-xl border ${isLight
            ? "bg-white border-slate-200/90 shadow-sm"
            : "bg-[#0F172A]/60 border-[#1E293B]"
            }`}
        >
          <div className="relative flex-1 w-full">
            <FiSearch
              className={`absolute left-3.5 top-3 text-sm ${isLight ? "text-slate-400" : "text-slate-400"
                }`}
            />
            <input
              type="text"
              placeholder="Search practice name, owner, email, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none transition-colors ${isLight
                ? "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white"
                : "bg-[#111A2E] border border-[#1E2B45] text-slate-200 placeholder-slate-500 focus:border-blue-500"
                }`}
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <CustomSelect
              value={statusFilter}
              options={[
                "All Statuses",
                "Active",
                "Trial",
                "Past Due",
                "Onboarding",
                "Suspended",
                "Cancelled",
              ]}
              onChange={setStatusFilter}
              isLight={isLight}
            />

            <CustomSelect
              value={planFilter}
              options={[
                "All Plans",
                "Growth",
                "Scale",
                "Starter",
                "Enterprise",
              ]}
              onChange={setPlanFilter}
              isLight={isLight}
            />
          </div>
        </div>

        {/* Client Accounts Table */}
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
                  <th className="py-3.5 px-6">MRR</th>
                  <th className="py-3.5 px-6">LAST ACTIVE</th>
                  <th className="py-3.5 px-6 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs sm:text-sm ${isLight
                  ? "divide-slate-100"
                  : "divide-[#1E293B]/60 text-slate-200"
                  }`}
              >
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-9 h-9 border-3 border-[#20a9f8] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-bold text-slate-400 tracking-wide">
                          Loading client accounts...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400 font-medium">
                      No client accounts match your search filters.
                    </td>
                  </tr>
                ) : (
                  paginatedAccounts.map((account) => {
                    const notice = getPlanDueNotice(account);
                    return (
                      <tr
                        key={account.id}
                        className={`transition-colors group ${isLight
                          ? "hover:bg-slate-50/80"
                          : "hover:bg-[#131C33]/70"
                          }`}
                      >
                        {/* Practice Name & Owner */}
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
                                onClick={() => handleOpenDrawer(account)}
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

                        {/* Status Column (Matching Screenshot 2) */}
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
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 ${isLight
                                  ? "bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]"
                                  : "bg-[#075985]/80 text-[#38BDF8] border border-[#0284C7]/60"
                                  }`}
                              >
                                <FiClock className="text-xs shrink-0" />
                                Trial
                              </span>
                            )}

                            {account.status === "Past Due" && (
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 ${isLight
                                  ? "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]"
                                  : "bg-[#78350F]/80 text-[#FBBF24] border border-[#D97706]/60"
                                  }`}
                              >
                                <FiAlertTriangle className="text-xs shrink-0" />
                                Past Due
                              </span>
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

                        {/* Plan Badge */}
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

                        {/* MRR Column */}
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

                        {/* Last Active Column (Dynamic relative time) */}
                        <td
                          className={`py-4 px-6 text-xs font-medium ${isLight ? "text-slate-600" : "text-slate-400"
                            }`}
                        >
                          {formatRelativeTime(account.updatedAt || account.lastActive)}
                        </td>

                        {/* Actions Column */}
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-5 sm:gap-6">
                            <button
                              onClick={() => handleOpenDrawer(account)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${isLight
                                ? "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900"
                                : "bg-[#111A2E] hover:bg-[#1A2642] border-[#1E2B45] text-slate-300 hover:text-white"
                                }`}
                            >
                              <FiEye className="text-sm" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleImpersonate(account)}
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
                    );
                  }))}
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
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
                  onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
      </main>

      {/* Centered Modal Overlay Details */}
      {isDrawerOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Content Card */}
          <div
            className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-10 border my-auto animate-in fade-in-50 zoom-in-95 duration-200 ${isLight
              ? "bg-white border-slate-200 text-slate-900"
              : "bg-[#0F172A] border-[#1E293B] text-slate-100"
              }`}
          >
            {/* Modal Header */}
            <div
              className={`p-6 border-b flex items-start justify-between ${isLight ? "bg-slate-50/80 border-slate-200" : "bg-[#0B101D] border-[#1E293B]"
                }`}
            >
              <div className="flex items-center gap-4">
                <div
                  style={{ backgroundColor: "#20a9f8" }}
                  className="w-14 h-14 rounded-2xl text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md"
                >
                  {selectedClient.initials}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-bold text-xl text-slate-900 dark:text-white leading-tight">
                      {selectedClient.practiceName}
                    </h2>
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedClient.displayClientId || `cli_${String(clientAccounts.findIndex(c => c.id === selectedClient.id) + 1).padStart(3, "0")}`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {selectedClient.owner}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      style={{ backgroundColor: "#19a17215", color: "#19a172", borderColor: "#19a17240" }}
                      className="border text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#19a172]"></span>
                      {selectedClient.status}
                    </span>
                    <span
                      style={{ backgroundColor: "#20a9f815", color: "#20a9f8", borderColor: "#20a9f840" }}
                      className="border text-xs font-bold px-2.5 py-0.5 rounded-full"
                    >
                      {selectedClient.plan} Plan
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {modalLoading && (
                <div className="flex items-center gap-2 text-xs font-bold text-[#20a9f8] bg-[#20a9f815] px-3.5 py-2 rounded-xl border border-[#20a9f830] w-full justify-center animate-pulse">
                  <div className="w-3.5 h-3.5 border-2 border-[#20a9f8] border-t-transparent rounded-full animate-spin"></div>
                  <span>Fetching real-time metrics from database...</span>
                </div>
              )}
              {/* Impersonate Callout Banner */}
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${isLight ? "bg-amber-50/70 border-amber-200" : "bg-amber-950/30 border-amber-900/50"
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
                  onClick={() => handleImpersonate(selectedClient)}
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

              {/* 2-Column Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    CONTACT DETAILS
                  </h3>
                  <div className={`p-4 rounded-xl border space-y-2.5 text-xs ${isLight ? "bg-slate-50 border-slate-200/80" : "bg-[#111A2E] border-[#1E2B45]"}`}>
                    <div className="flex items-center gap-3">
                      <FiMail className="text-slate-400 text-sm shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedClient.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiPhone className="text-slate-400 text-sm shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedClient.phone || "(602) 555-0142"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiGlobe className="text-slate-400 text-sm shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedClient.location}</span>
                    </div>
                  </div>
                </div>

                {/* Account Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    ACCOUNT DETAILS
                  </h3>
                  <div className={`p-4 rounded-xl border space-y-2 text-xs ${isLight ? "bg-slate-50 border-slate-200/80" : "bg-[#111A2E] border-[#1E2B45]"}`}>
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Client ID</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-200/80 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {selectedClient.displayClientId || `cli_${String(clientAccounts.findIndex(c => c.id === selectedClient.id) + 1).padStart(3, "0")}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Joined</span>
                      <span className="font-medium text-slate-900 dark:text-white">{selectedClient.joinedDate}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500 dark:text-slate-400">Last Active</span>
                      <span className="font-medium text-slate-900 dark:text-white">{selectedClient.lastActive}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  PERFORMANCE METRICS
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className={`p-3.5 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200/80" : "bg-[#111A2E] border-[#1E2B45]"}`}>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <FiDollarSign className="text-slate-400" />
                      <span>MRR</span>
                    </div>
                    <div style={{ color: "#19a172" }} className="text-base font-extrabold mt-1">
                      ${selectedClient.mrr !== null && selectedClient.mrr !== undefined ? selectedClient.mrr : 0}/mo
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200/80" : "bg-[#111A2E] border-[#1E2B45]"}`}>
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

                  <div className={`p-3.5 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200/80" : "bg-[#111A2E] border-[#1E2B45]"}`}>
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

                  <div className={`p-3.5 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200/80" : "bg-[#111A2E] border-[#1E2B45]"}`}>
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

              {/* Tags Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  TAGS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(selectedClient.tags) && selectedClient.tags.length > 0 ? (
                    selectedClient.tags.map((tag, i) => (
                      <span
                        key={i}
                        style={{ backgroundColor: "#20a9f815", color: "#20a9f8", borderColor: "#20a9f830" }}
                        className="border px-3 py-1 text-xs font-bold rounded-full"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No tags assigned</span>
                  )}
                </div>
              </div>

              {/* Internal Notes Section (Read-only view, no save button) */}
              <div className="space-y-3 pb-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  INTERNAL NOTES
                </h3>
                <div className={`p-4 rounded-xl border text-xs leading-relaxed font-medium ${isLight ? "bg-amber-50/60 border-amber-200/80 text-slate-800" : "bg-[#111A2E] border-[#1E2B45] text-slate-200"}`}>
                  {selectedClient.internalNotes && selectedClient.internalNotes.trim() !== "" ? (
                    selectedClient.internalNotes
                  ) : (
                    <span className="text-slate-400 italic">No internal notes added for this client.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Super Admin Settings Modal */}
      <SuperAdminSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        isLight={isLight}
        theme={theme}
        toggleTheme={toggleTheme}
        superAdminEmail={superAdminEmail}
      />
    </div>
  );
};

export default AdminList;
