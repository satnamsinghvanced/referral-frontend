import React from "react";
import { HiOutlineCog } from "react-icons/hi";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { CiLocationOn, CiMobile1 } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
import { FiCreditCard, FiUser, FiUsers } from "react-icons/fi";
import { LuShield } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

type NavigationItem = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

const SettingNavigation: React.FC = () => {
  const navigationRoutes: NavigationItem[] = [
    { name: "Profile", icon: FiUser, href: "/settings" },
    { name: "Notifications", icon: FaRegBell, href: "/settings/notifications" },
    { name: "Security", icon: LuShield, href: "/settings/security" },
    { name: "Billing", icon: FiCreditCard, href: "/settings/billing" },
    { name: "Locations", icon: CiLocationOn, href: "/settings/locations" },
    { name: "Team", icon: FiUsers, href: "/settings/team" },
    { name: "General", icon: HiOutlineCog, href: "/settings/general" },
    {
      name: "Integration Tests",
      icon: AiOutlineThunderbolt,
      href: "/settings/integration-tests",
    },
    {
      name: "Push Notifications",
      icon: CiMobile1,
      href: "/settings/push-notifications",
    },
    // { name: "Notification Analytics", icon: FaRegChartBar, href: "/settings/notification-analytics" },
  ];

  return (
    <ul className="flex flex-col text-foreground p-2">
      {navigationRoutes.map((item, index) => {
        const Icon = item.icon;
        return (
          <li key={index}>
            <NavLink
              to={item.href}
              end // ensures exact match for root routes like "/settings"
              className={({ isActive }) =>
                clsx(
                  "my-0.5 rounded-md transition-all group flex items-center py-2 px-3 hover:bg-gray-50 dark:hover:bg-[#0f1214] h-9 cursor-pointer border border-transparent",
                  "hover:bg-gray-50",
                  isActive
                    ? "!bg-sky-50 !text-sky-700 dark:!bg-white shadow-sm !border-sky-200"
                    : "hover:bg-gray-100"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex items-center justify-center ${
                      isActive ? "text-white " : "text-gray-500"
                    }`}
                  >
                    <Icon
                      className={clsx(
                        "text-[16px]",
                        isActive && "text-sky-700"
                      )}
                    />
                  </span>
                  <span className="ml-2 truncate text-[12px]">{item.name}</span>
                </>
              )}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};

export default SettingNavigation;
