import React, { useEffect, useState } from "react";
import ls from "localstorage-slim";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Header from "./Header";
// import AppRoutes from "../../routes";

ls.config.encrypt = true;

const Layout = () => {
  const initialMini =
    ls.get("isMiniSidebarOpen") !== null ? ls.get("isMiniSidebarOpen") : true;

  const [isMiniSidebarOpen, setIsMiniSidebarOpen] = useState(initialMini);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const location = useLocation();

  const toggleSidebar = () => {
    setIsMiniSidebarOpen((prev) => !prev);
  };

  const onCloseSidebar = () => {
    if (window.innerWidth < 767) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
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
      className={`${!isMiniSidebarOpen
        ? "lg:pl-[88px] md:pl-22"
        : "lg:pl-[280px] md:pl-22"
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
        onClick={() => {
          setIsSidebarOpen(!isSidebarOpen);
        }}
      />

      <main
        id="main"
        className="h-[calc(100vh-4.5rem)] main !z-10 flex-grow-1 md:h-[calc(100vh-65px)] transition-all ease-in-out duration-300 bg-text/3"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
