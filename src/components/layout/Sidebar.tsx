import {
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineChevronLeft,
  HiOutlineClipboardList,
  HiOutlineCog,
  HiOutlineDocument,
  HiOutlineLockClosed,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineQuestionMarkCircle,
  HiOutlineStar,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router";

import { Tooltip } from "@heroui/react";
import { LuBuilding2 } from "react-icons/lu";

import { FiHome, FiUsers } from "react-icons/fi";
import { IoIosArrowRoundForward } from "react-icons/io";
import logo from "../../assets/logos/logo.png";
// import logoWhite from "../../assets/logo-white.svg";
import clsx from "clsx";
import Profile from "../common/Profile";

interface SidebarProps {
  isMiniSidebarOpen: boolean;
  toggleSidebar: () => void;
  onCloseSidebar: () => void;
}

const Sidebar = ({
  isMiniSidebarOpen,
  toggleSidebar,
  onCloseSidebar,
}: SidebarProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { auth_user } = useSelector(
    (state: { user: any }) => state?.user || {}
  );

  // local state for submenu open states (keyed by index)
  // const [openMenus, setOpenMenus] = useState({});

  // const toggleMenu = (idx) => {
  //   setOpenMenus((prev) => ({ ...prev, [idx]: !prev[idx] }));
  // };

  // Example static navigation - we'll replace with role-driven later
  const navigationRoutes = [
    {
      name: "Dashboard",
      icon: FiHome,
      href: "/dashboard",
    },
    {
      name: "Referrals",
      icon: FiUsers,
      href: "/referrals",
      stats: 247,
      color: (stats: number) =>
        stats > 200
          ? "bg-sky-100"
          : stats > 50
          ? "bg-orange-100"
          : "bg-green-400",
    },
    {
      name: "Referral Connections",
      icon: LuBuilding2,
      href: "/referral-connections",
      stats: 12,
      color: "bg-sky-200",
    },
    {
      name: "Reviews",
      icon: HiOutlineStar,
      href: "/reviews",
      stats: 1200,
      color: "bg-yellow-200",
      label: "1.2k",
    },
    {
      name: "Marketing Calendar",
      icon: HiOutlineCalendar,
      href: "/marketing-calendar",
      stats: 8,
      color: "bg-orange-300",
    },
    {
      name: "Social Media",
      icon: HiOutlineMail,
      href: "/social-media",
      stats: "NEW", // Special case for NEW label
      color: "bg-purple-300",
    },
    {
      name: "Call Tracking",
      icon: HiOutlinePhone,
      href: "//",
      stats: 34,
      color: "bg-violet-300",
    },
    {
      name: "Email Campaigns",
      icon: HiOutlineMail,
      href: "/email-campaigns",
      stats: 5,
      color: "bg-green-300",
    },
    {
      name: "Analytics",
      icon: HiOutlineChartBar,
      href: "/analytics",
      stats: 6,
      color: "bg-red-300",
    },
    {
      name: "Reports",
      icon: HiOutlineDocument,
      href: "/reports",
      stats: 1,
      color: "bg-gray-300",
    },
    {
      name: "Task List",
      icon: HiOutlineClipboardList,
      href: "/",
      stats: 12,
      color: "bg-red-300",
    },
  ];

  const bottomRoutes = [
    {
      name: "Help Center",
      icon: HiOutlineQuestionMarkCircle,
      href: "/helpcenter",
    },
    { name: "Settings", icon: HiOutlineCog, href: "/settings" },
    { name: "Sign Out", icon: HiOutlineLockClosed, href: "/logout" },
  ];

  const handleNavigate = (href: string) => {
    navigate(href);
    if (typeof onCloseSidebar === "function") onCloseSidebar();
  };

  return (
    <>
      {/* Mobile overlay when sidebar open in mobile/mini mode */}
      <div
        className={` z-[100]  ${
          isMiniSidebarOpen ? "bg-black/40 fixed inset-0 z-30" : "hidden"
        } md:hidden`}
        onClick={onCloseSidebar}
        aria-hidden
      />

      <aside
        className={`no-print fixed top-0 left-0 z-50 h-screen border-r border-text/10 dark:border-text/30 bg-background dark:text-white transition-all duration-300
          ${isMiniSidebarOpen ? "md:w-[250px] w-[90%]" : "w-18"}
        `}
        aria-label="Primary sidebar"
      >
        {/* Mobile header (only visible md:hidden) */}
        <div className="md:hidden flex items-center justify-between pb-6 mb-6 mx-2 border-b">
          <div className="flex items-center gap-3">
            <Profile user={auth_user} className="h-11 w-11" />
            <div>
              <div className="font-semibold">
                {auth_user?.firstName || "User"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-300">
                {auth_user?.email}
              </div>
            </div>
          </div>
          <button
            onClick={onCloseSidebar}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <HiOutlineChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Logo + expand/contract */}
        <div
          className={`hidden md:flex items-center h-16 border-b border-text/10 dark:border-text/30 ${
            isMiniSidebarOpen ? "justify-between" : "justify-center"
          } w-full`}
        >
          {isMiniSidebarOpen && (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 cursor-pointer text-sm pl-3"
            >
              {/* <img src={logo} alt="logo" className="h-8 block dark:hidden" />
              <img
                src={logoWhite}
                alt="logo white"
                className="h-8 hidden dark:block"
              /> */}
              <img src={logo} alt="" className="w-8 h-8" />
              <span className="flex flex-col">
                <span className="font-bold">Referral Retriever</span>
                <span className="text-[10px]">Orthodontic Management</span>
              </span>
            </Link>
          )}

          <div className="p-2">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <IoIosArrowRoundForward
                className={`${
                  isMiniSidebarOpen ? "rotate-180" : ""
                } transition-transform w-5 h-5`}
              />
            </button>
          </div>
        </div>

        {/* nav container */}
        <div
          className={`${
            isMiniSidebarOpen ? "overflow-y-auto" : ""
          } flex flex-col justify-between h-[calc(100vh_-_60px)]  px-0`}
        >
          <ul className="flex flex-col text-gray-900 dark:text-white p-3">
            {navigationRoutes.map((item, index) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <li key={index}>
                  {/* if item.list exists in future, we can render expand. For now single links */}
                  <NavLink
                    to={item.href}
                    className={({ isActive }: { isActive: boolean }) =>
                      clsx(
                        "border my-0.5 cursor-pointer rounded-md transition-all group flex items-center py-2 px-3 hover:text-gray-700 hover:bg-gray-50 h-9",
                        isMiniSidebarOpen
                          ? "px-0 justify-start"
                          : "px-4 justify-center",
                        isActive
                          ? "bg-sky-50 text-sky-700 !border-sky-200 shadow-sm"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent"
                      )
                    }
                  >
                    <span
                      className={`flex items-center justify-center ${
                        active ? "text-white" : "text-gray-500 dark:text-white"
                      }`}
                    >
                      {isMiniSidebarOpen ? (
                        <Icon
                          className={` ${
                            active
                              ? "bg-sky-50 text-sky-700"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        />
                      ) : (
                        <Tooltip content={item.name} placement="right">
                          <Icon
                            className={` ${
                              active
                                ? "bg-sky-50 text-sky-700"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                          />
                        </Tooltip>
                      )}
                    </span>

                    {isMiniSidebarOpen && (
                      <div className="ml-2 truncate text-xs w-full flex justify-between items-center">
                        <p>{item.name}</p>
                        {item.stats && (
                          <p
                            className={`rounded-full px-2 text-[10px] py-0.5 capitalize !text-text dark:!text-background ${
                              typeof item.color === "function"
                                ? item.color(item.stats)
                                : item.color
                            }`}
                          >
                            {" "}
                            {typeof item.stats === "number"
                              ? `${item.stats}`
                              : item.stats}
                          </p>
                        )}
                      </div>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* bottom items */}
          <ul className="space-y-1 text-gray-900 dark:text-white p-3">
            {bottomRoutes.map((item, idx) => {
              const Icon = item.icon;
              const isSignOut = item.name.toLowerCase().includes("sign");

              return (
                <li key={idx}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      clsx(
                        "border cursor-pointer rounded-lg transition-all group flex items-center py-2 h-9",
                        isMiniSidebarOpen
                          ? "px-3 justify-start"
                          : "px-3 justify-center",
                        isActive
                          ? "bg-sky-50 text-sky-700 !border-sky-200 shadow-sm"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent",
                        isSignOut && "block md:hidden"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={clsx(
                            "flex items-center justify-center",
                            isActive
                              ? "text-current"
                              : "text-gray-500 dark:text-white"
                          )}
                        >
                          <Icon />
                        </span>
                        {isMiniSidebarOpen && (
                          <span className="ml-2 truncate text-xs">
                            {item.name}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* bottom SwitchMode (kept as ThemeToggle usage above) */}
      </aside>
    </>
  );
};

export default Sidebar;
