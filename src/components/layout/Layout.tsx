import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Logo from "../ui/Logo";
import { useBilling } from "../../hooks/settings/useBilling";
import { useRolePermissions } from "../../hooks/useRolePermissions";
import { FiUser, FiArrowLeft, FiLogOut } from "react-icons/fi";
import { setCredentials } from "../../store/authSlice";

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const rawImpersonated = localStorage.getItem("impersonated_client");
  const isImpersonating = !!rawImpersonated;

  const impersonatedData = (() => {
    if (!rawImpersonated) return null;
    try {
      return JSON.parse(rawImpersonated);
    } catch {
      return null;
    }
  })();

  const practiceName =
    impersonatedData?.practiceName ||
    impersonatedData?.name ||
    (user as any)?.name ||
    user?.email ||
    "Client Account";

  if (user?.role === "SuperAdmin" && !isImpersonating) {
    return <Navigate to="/admin" replace />;
  }

  const handleExitImpersonation = () => {
    const adminToken = localStorage.getItem("admin_token");
    const adminRefreshToken = localStorage.getItem("admin_refreshToken");
    const adminUserStr = localStorage.getItem("admin_user");
    if (adminToken) localStorage.setItem("token", adminToken);
    if (adminRefreshToken) localStorage.setItem("refreshToken", adminRefreshToken);
    if (adminUserStr) localStorage.setItem("user", adminUserStr);
    localStorage.removeItem("impersonated_client");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_refreshToken");
    localStorage.removeItem("admin_user");
    if (adminUserStr && adminToken) {
      try {
        const adminUser = JSON.parse(adminUserStr);
        dispatch(setCredentials({ user: adminUser, token: adminToken } as any));
      } catch (e) {
        console.error("Error restoring admin user:", e);
      }
    }
    window.location.href = "/admin";
  };

  const { data: billingData, isLoading: isBillingLoading } = useBilling();
  const { isLoading: isPermissionsLoading } = useRolePermissions();
  const isInitialLoading = (isBillingLoading && !billingData) || isPermissionsLoading;

  const getInitialMini = () => {
    const storedValue = localStorage.getItem("isMiniSidebarOpen");
    if (storedValue !== null) {
      try {
        return JSON.parse(storedValue);
      } catch {
        return true;
      }
    }
    return true;
  };
  const [isMiniSidebarOpen, setIsMiniSidebarOpen] = useState<boolean>(
    getInitialMini()
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsMiniSidebarOpen((prev) => !prev);
  };
  const onCloseSidebar = () => {
    if (window.innerWidth < 1023) {
      setIsSidebarOpen(false);
    }
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
        setIsMiniSidebarOpen(true);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    localStorage.setItem(
      "isMiniSidebarOpen",
      JSON.stringify(isMiniSidebarOpen)
    );
  }, [isMiniSidebarOpen]);

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-300">
        <div className="flex flex-col items-center gap-6">
          <Logo style={{ height: "100px" }} className="animate-pulse" />
          <div className="flex items-center gap-2 text-XXL font-semibold tracking-wide text-foreground/70 uppercase">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
            <span>Loading Workspace...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {isImpersonating && (
        <div className="w-full bg-[#f59e0b] dark:bg-[#d97706] text-white px-4 py-2 flex items-center justify-between z-[100] shadow-md border-b border-amber-600/40 text-xs font-semibold shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <FiUser className="text-white text-xs" />
            </div>
            <span>
              Impersonating: <strong className="font-extrabold text-white">{practiceName}</strong>
            </span>
            <span className="bg-white/25 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ml-1 border border-white/30">
              ADMIN VIEW
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExitImpersonation}
              className="px-3 py-1 rounded-lg bg-white text-amber-900 font-bold hover:bg-amber-50 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <FiArrowLeft className="text-xs" />
              <span>Back to Admin Portal</span>
            </button>
            <button
              type="button"
              onClick={handleExitImpersonation}
              className="px-3 py-1 rounded-lg bg-amber-700/90 hover:bg-amber-800 text-white font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer text-xs border border-amber-400/40"
            >
              <FiLogOut className="text-xs" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      )}

      <div
        className={`${!isMiniSidebarOpen ? "lg:pl-18" : "lg:pl-[250px]"
          } transition-all flex-1`}
      >
        {isSidebarOpen && (
          <Sidebar
            isMiniSidebarOpen={isMiniSidebarOpen}
            toggleSidebar={toggleSidebar}
            onCloseSidebar={onCloseSidebar}
          />
        )}
        <Header
          hamburgerMenuClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
        />
        <main
          id="main"
          className={`main !z-10 flex-grow-1 transition-all ease-in-out duration-300 bg-foreground/3 dark:bg-[#0b0e11] overflow-auto ${isImpersonating ? "h-[calc(100vh-98px)] md:h-[calc(100vh-104px)]" : "h-[calc(100vh-58px)] md:h-[calc(100vh-64px)]"
            }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
