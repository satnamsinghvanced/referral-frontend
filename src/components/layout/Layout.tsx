import ls from "localstorage-slim";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";
// import AppRoutes from "../../routes";

ls.config.encrypt = true;

const Layout = () => {
  const initialMini =
    ls.get("isMiniSidebarOpen") !== null ? ls.get("isMiniSidebarOpen") : true;

  const [isMiniSidebarOpen, setIsMiniSidebarOpen] = useState(Boolean(initialMini));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const location = useLocation();

  const toggleSidebar = () => {
    setIsMiniSidebarOpen((prev: any) => !prev);
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
    handleResize(); // run on mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    ls.set("isMiniSidebarOpen", isMiniSidebarOpen);
  }, [isMiniSidebarOpen]);

  return (
    <div
      className={`${
        !isMiniSidebarOpen ? "lg:pl-18" : "lg:pl-[250px]"
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
        className="h-[calc(100vh-4.5rem)] main !z-10 flex-grow-1 md:h-[calc(100vh-65px)] transition-all ease-in-out duration-300 bg-foreground/3 dark:bg-[#0f1214]"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
