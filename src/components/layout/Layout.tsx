import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
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
    handleResize(); // run on mount

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
        className="h-[calc(100vh-4.5rem)] main !z-10 flex-grow-1 md:h-[calc(100vh-64px)] transition-all ease-in-out duration-300 bg-foreground/3 dark:bg-[#0f1214]"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
