import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Logo from "../ui/Logo";
import { useBilling } from "../../hooks/settings/useBilling";
import { useRolePermissions } from "../../hooks/useRolePermissions";

const Layout = () => {
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
    <div
      className={`${!isMiniSidebarOpen ? "lg:pl-18" : "lg:pl-[250px]"
        } transition-all`}
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
        className="h-[calc(100vh-58px)] md:h-[calc(100vh-64px)] main !z-10 flex-grow-1 transition-all ease-in-out duration-300 bg-foreground/3 dark:bg-[#0b0e11] overflow-auto"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
