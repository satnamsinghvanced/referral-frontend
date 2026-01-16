import {
  HiOutlineChartBar,
  HiOutlineChevronLeft,
  HiOutlineCog,
  HiOutlineLightningBolt,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineStar,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router";

import { Tooltip } from "@heroui/react";
import {
  LuBuilding2,
  LuCalendar,
  LuDollarSign,
  LuQrCode,
  LuUsers,
  LuVideo,
} from "react-icons/lu";

import { FiFileText, FiHome } from "react-icons/fi";
import { IoIosArrowRoundForward } from "react-icons/io";
// import logoWhite from "../../assets/logo-white.svg";
import clsx from "clsx";
import { MdOutlineModeComment } from "react-icons/md";
import { TbCheckbox } from "react-icons/tb";
import { useDashboardStats } from "../../hooks/useDashboard";
import Logo from "../ui/Logo";

interface SidebarProps {
  isMiniSidebarOpen: boolean;
  toggleSidebar: () => void;
  onCloseSidebar: () => void;
}

interface NavigationRoute {
  name: string;
  icon: any;
  href: string;
  stats?: number | undefined;
  color?: string | ((stats?: number) => string) | undefined;
  label?: string;
}

const Sidebar = ({
  isMiniSidebarOpen,
  toggleSidebar,
  onCloseSidebar,
}: SidebarProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: dashboardStats } = useDashboardStats();

  // const dashboardStats = {
  //   referrals: 0,
  //   partners: 0,
  //   activities: 0,
  //   totalCalls: 0,
  //   integrations: 0,
  //   tasks: 0,
  // };

  // local state for submenu open states (keyed by index)
  // const [openMenus, setOpenMenus] = useState({});

  // const toggleMenu = (idx) => {
  //   setOpenMenus((prev) => ({ ...prev, [idx]: !prev[idx] }));
  // };

  // Example static navigation - we'll replace with role-driven later
  const NAVIGATION_ROUTES: NavigationRoute[] = [
    {
      name: "Dashboard",
      icon: FiHome,
      href: "/",
      stats: undefined,
      color: undefined,
    },
    {
      name: "Referrals",
      icon: LuUsers,
      href: "/referrals",
      stats: dashboardStats?.referrals || 0,
      color: "bg-sky-100 dark:bg-sky-900/40",
    },
    {
      name: "Partner Network",
      icon: LuBuilding2,
      href: "/partner-network",
      stats: dashboardStats?.partners || 0,
      color: "bg-sky-200 dark:bg-sky-900/30",
    },
    {
      name: "Reviews",
      icon: HiOutlineStar,
      href: "/reviews",
      stats: 0,
      color: "bg-yellow-200 dark:bg-yellow-900/30",
      label: "1.2k",
    },
    {
      name: "Marketing Calendar",
      icon: LuCalendar,
      href: "/marketing-calendar",
      stats: dashboardStats?.activities || 0,
      color: "bg-orange-300 dark:bg-orange-900/30",
    },
    {
      name: "Social Media",
      icon: MdOutlineModeComment,
      href: "/social-media",
      stats: 0, // Special case for NEW label
      color: "bg-purple-300 dark:bg-purple-900/30",
    },
    {
      name: "Call Tracking",
      icon: HiOutlinePhone,
      href: "/call-tracking",
      stats: dashboardStats?.totalCalls || 0,
      color: "bg-sky-100 dark:bg-sky-900/40",
    },
    {
      name: "Email Campaigns",
      icon: HiOutlineMail,
      href: "/email-campaigns",
      stats: 0,
      color: "bg-green-300 dark:bg-green-900/30",
    },
    {
      name: "Analytics",
      icon: HiOutlineChartBar,
      href: "/analytics",
      stats: undefined,
      color: "bg-red-300 dark:bg-red-900/30",
    },
    {
      name: "Reports",
      icon: FiFileText,
      href: "/reports",
      stats: undefined,
      color: "bg-gray-300 dark:bg-gray-800",
    },
    {
      name: "Task List",
      icon: TbCheckbox,
      href: "/tasks",
      stats: dashboardStats?.tasks || 0,
      color: "bg-red-300 dark:bg-red-900/30",
    },
    {
      name: "QR Generator",
      icon: LuQrCode,
      href: "/qr-generator",
      stats: undefined,
      color: "bg-red-300 dark:bg-red-900/30",
    },
    {
      name: "Marketing Budget",
      icon: LuDollarSign,
      href: "/marketing-budget",
      stats: undefined,
      color: "bg-red-300 dark:bg-red-900/30",
    },
    {
      name: "Media Management",
      icon: LuVideo,
      href: "/media-management",
      stats: undefined,
      color: "bg-red-300 dark:bg-red-900/30",
    },
    // {
    //   name: "Image Library",
    //   icon: FiImage,
    //   href: "/image-library",
    //   color: "bg-red-300",
    // },
    {
      name: "Integrations",
      icon: HiOutlineLightningBolt,
      href: "/integrations",
      stats: dashboardStats?.integrations || 0,
      color: "bg-blue-400 dark:bg-blue-900/40",
    },
    {
      name: "Settings",
      icon: HiOutlineCog,
      href: "/settings",
      stats: undefined,
      color: undefined,
    },
  ];

  // const bottomRoutes = [];

  const handleNavigate = (href: string) => {
    navigate(href);
    if (typeof onCloseSidebar === "function") onCloseSidebar();
  };

  return (
    <>
      {/* Mobile overlay when sidebar open in mobile/mini mode */}
      <div
        className={`${
          isMiniSidebarOpen
            ? "bg-foreground/30 dark:bg-background/70 fixed inset-0 z-41"
            : "hidden"
        } lg:hidden`}
        onClick={onCloseSidebar}
        aria-hidden
      />

      <aside
        className={`no-print fixed top-0 left-0 z-50 h-screen border-r border-foreground/10  bg-background   transition-all duration-300
          ${isMiniSidebarOpen ? "md:w-[250px] w-[300px]" : "w-18"}
        `}
        aria-label="Primary sidebar"
      >
        <div
          className={`flex items-center h-[58px] md:h-[64px] border-b border-foreground/10 ${
            isMiniSidebarOpen ? "justify-between" : "justify-center"
          } w-full`}
        >
          {isMiniSidebarOpen && (
            <Link
              to="/"
              className="flex items-center gap-2 cursor-pointer text-sm py-2 pl-3 h-full"
              onClick={onCloseSidebar}
            >
              <Logo style={{ height: "100%" }} />
              {/* <img src={logo} alt="" className="w-8 h-8" />
              <span className="flex flex-col text-[#055fa4]">
                <span className="font-bold">PRACTICE ROI</span>
                <span className="text-[11px]">Intelligent Marketing</span>
              </span> */}
            </Link>
          )}

          <div className="p-2">
            <button
              onClick={onCloseSidebar}
              className="cursor-pointer lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-foreground/5"
            >
              <HiOutlineChevronLeft className="size-4" />
            </button>
            <button
              onClick={toggleSidebar}
              className="cursor-pointer hidden lg:flex p-2 rounded-md hover:bg-gray-100 dark:hover:bg-foreground/5"
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
          } flex flex-col justify-between h-[calc(100vh_-_60px)] px-0`}
        >
          <ul className="flex flex-col p-3">
            {NAVIGATION_ROUTES.map((item, index) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={index}>
                  <NavLink
                    to={item.href}
                    className={() => {
                      return clsx(
                        "group border my-0.5 cursor-pointer rounded-md transition-all group flex items-center py-2 px-3 h-9",
                        isMiniSidebarOpen
                          ? "px-0 justify-start"
                          : "px-4 justify-center",
                        isActive
                          ? "!bg-sky-50 dark:!bg-sky-900/20 !text-sky-700 dark:!text-sky-400 !border-sky-200 dark:!border-sky-800 shadow-sm"
                          : "hover:bg-gray-100 dark:hover:bg-foreground/5 border-transparent",
                        item.name === "Settings" && "tour-step-settings",
                        `tour-step-${item.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`
                      );
                    }}
                    onClick={onCloseSidebar}
                  >
                    <span
                      className={`flex items-center justify-center ${
                        isActive ? "text-white " : "text-gray-500"
                      }`}
                    >
                      {isMiniSidebarOpen ? (
                        <Icon
                          className={` ${isActive ? "  text-sky-700" : ""}`}
                        />
                      ) : (
                        <Tooltip
                          content={item.name}
                          placement="right"
                          shadow="sm"
                          size="sm"
                          radius="sm"
                        >
                          <Icon
                            className={` ${
                              isActive
                                ? "bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400"
                                : "hover:bg-gray-100 dark:hover:bg-foreground/5 dark:bg-transparent"
                            }`}
                          />
                        </Tooltip>
                      )}
                    </span>

                    {isMiniSidebarOpen && (
                      <div className="ml-2 truncate text-xs w-full flex justify-between items-center">
                        <p>{item.name}</p>
                        {item.stats ? (
                          <p
                            className={`rounded-full px-2 text-[10px] py-0.5 capitalize !text-foreground dark:!text-foreground ${
                              typeof item.color === "function"
                                ? item.color(item?.stats)
                                : item.color
                            }`}
                          >
                            {typeof item.stats === "number"
                              ? `${item.stats}`
                              : item.stats}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* bottom items */}
          {/* <ul className="space-y-1 p-3">
            {bottomRoutes.map((item, idx) => {
              const Icon = item.icon;
              const isSignOut = item.name.toLowerCase().includes("sign");

              return (
                <li key={idx}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      clsx(
                        "border cursor-pointer rounded-lg transition-all group flex items-center py-2 h-9 dark:hover:bg-[#0f1214]",
                        isMiniSidebarOpen
                          ? "px-3 justify-start"
                          : "px-3 justify-center",
                        isActive
                          ? "!bg-sky-50 !text-sky-700 !border-sky-200 dark:!bg-background dark:!border-sky-50 shadow-sm"
                          : "hover:bg-gray-100 border-transparent",
                        isSignOut && "block md:hidden"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={clsx(
                            "flex items-center justify-center",
                            isActive ? "text-current" : "text-gray-500 "
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
          </ul> */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
