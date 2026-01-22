import clsx from "clsx";
import { Outlet } from "react-router";
import ComponentContainer from "../../components/common/ComponentContainer";

import { FaRegBell } from "react-icons/fa";
import { FiCreditCard, FiUser, FiUsers } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { HiOutlineCog } from "react-icons/hi";
import { LuShield } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import { BiDevices } from "react-icons/bi";

import { useRolePermissions } from "../../hooks/useRolePermissions";

type NavigationItem = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  requiredPermission?: string | string[];
};

const NAVIGATION_ROUTES: NavigationItem[] = [
  { name: "Profile", icon: FiUser, href: "/settings" },
  {
    name: "General",
    icon: HiOutlineCog,
    href: "/settings/general",
    requiredPermission: "Manage Settings",
  },
  { name: "Security", icon: LuShield, href: "/settings/security" },
  { name: "Devices", icon: BiDevices, href: "/settings/devices" },
  {
    name: "Billing",
    icon: FiCreditCard,
    href: "/settings/billing",
    requiredPermission: "Manage Billing",
  },
  {
    name: "Locations",
    icon: GrLocation,
    href: "/settings/locations",
    requiredPermission: "Manage Settings",
  },
  {
    name: "Team",
    icon: FiUsers,
    href: "/settings/team",
    requiredPermission: "Manage Team",
  },
  { name: "Notifications", icon: FaRegBell, href: "/settings/notifications" },
];

const Settings = () => {
  const { hasPermission, hasAnyPermission, isAdmin, isLoading } =
    useRolePermissions();

  const filteredRoutes = NAVIGATION_ROUTES.filter((route) => {
    if (isAdmin) return true;
    if (isLoading) return !route.requiredPermission;
    if (!route.requiredPermission) return true;
    if (Array.isArray(route.requiredPermission)) {
      return hasAnyPermission(route.requiredPermission);
    }
    return hasPermission(route.requiredPermission as string);
  });

  const HEADING_DATA = {
    heading: "Settings",
    subHeading: "Manage your account preferences and configurations.",
  };

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="md:flex md:items-start md:gap-5 max-md:space-y-4">
        <div className="md:max-w-1/5 w-full border border-foreground/10  rounded-xl bg-background md:sticky md:top-0">
          <ul className="flex flex-col text-foreground p-2.5 space-y-1">
            {filteredRoutes.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <NavLink
                    to={item.href}
                    end // ensures exact match for root routes like "/settings"
                    className={({ isActive }) =>
                      clsx(
                        "rounded-md transition-all group flex items-center py-2 px-3 h-9 cursor-pointer border border-transparent",
                        isActive
                          ? "!bg-sky-50 dark:!bg-sky-900/20 !text-sky-700 dark:!text-sky-400 shadow-sm !border-sky-200 dark:!border-sky-800"
                          : "hover:bg-gray-100 dark:hover:bg-foreground/5",
                        item.name === "Profile" && "tour-step-profile",
                        item.name === "Locations" && "tour-step-locations",
                        item.name === "Team" && "tour-step-team",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`flex items-center justify-center ${
                            isActive
                              ? "text-sky-700 dark:text-sky-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          <Icon
                            className={clsx(
                              "text-[16px]",
                              isActive && "text-current",
                            )}
                          />
                        </span>
                        <span className="ml-2 truncate text-[12px]">
                          {item.name}
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </ComponentContainer>
  );
};

export default Settings;
