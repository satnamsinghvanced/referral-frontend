import clsx from "clsx";
import { Outlet } from "react-router";
import ComponentContainer from "../../components/common/ComponentContainer";

import { FaRegBell } from "react-icons/fa";
import { FiCreditCard, FiUser, FiUsers } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { HiOutlineCog } from "react-icons/hi";
import { LuShield } from "react-icons/lu";
import { NavLink } from "react-router-dom";

type NavigationItem = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

const NAVIGATION_ROUTES: NavigationItem[] = [
  { name: "Profile", icon: FiUser, href: "/settings" },
  { name: "General", icon: HiOutlineCog, href: "/settings/general" },
  { name: "Security", icon: LuShield, href: "/settings/security" },
  { name: "Billing", icon: FiCreditCard, href: "/settings/billing" },
  { name: "Locations", icon: GrLocation, href: "/settings/locations" },
  { name: "Team", icon: FiUsers, href: "/settings/team" },
  { name: "Notifications", icon: FaRegBell, href: "/settings/notifications" },
];

const Settings = () => {
  const HEADING_DATA = {
    heading: "Settings",
    subHeading: "Manage your account preferences and configurations.",
  };

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="flex items-start gap-5">
        <div className="max-w-1/5 w-full border border-foreground/10  rounded-xl bg-background sticky top-0">
          <ul className="flex flex-col text-foreground p-2.5 space-y-1">
            {NAVIGATION_ROUTES.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <NavLink
                    to={item.href}
                    end // ensures exact match for root routes like "/settings"
                    className={({ isActive }) =>
                      clsx(
                        "rounded-md transition-all group flex items-center py-2 px-3 hover:bg-gray-50 dark:hover:bg-[#0f1214] h-9 cursor-pointer border border-transparent",
                        "hover:bg-gray-50",
                        isActive
                          ? "!bg-sky-50 !text-sky-700 dark:!bg-background shadow-sm !border-sky-200"
                          : "hover:bg-gray-100",
                        item.name === "Profile" && "tour-step-profile",
                        item.name === "Locations" && "tour-step-locations",
                        item.name === "Team" && "tour-step-team"
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
