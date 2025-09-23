import { HiOutlineCog } from "react-icons/hi";
// import { useSelector } from "react-redux";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { CiLocationOn, CiMobile1 } from "react-icons/ci";
import { FaRegBell, FaRegChartBar } from "react-icons/fa";
import { FiCreditCard, FiUser, FiUsers } from "react-icons/fi";
import { LuShield } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router";


const SettingNavigation = () => {
    const navigationRoutes = [
        { name: "Profile", icon: FiUser, href: "/settings" },
        { name: "Notifications", icon: FaRegBell, href: "/settings/notifications" },
        { name: "Security", icon: LuShield, href: "/settings/security" },
        { name: "Billing", icon: FiCreditCard, href: "/settings/billing" },
        { name: "Locations", icon: CiLocationOn, href: "/settings/locations" },
        { name: "Team", icon: FiUsers, href: "/settings/team" },
        { name: "General", icon: HiOutlineCog, href: "/settings/general" },
        { name: "Integration Tests", icon: AiOutlineThunderbolt, href: "/settings/integration-tests" },
        { name: "Push Notifications", icon: CiMobile1, href: "/settings/push-notifications" },
        { name: "Notification Analytics", icon: FaRegChartBar, href: "/settings/notification-analytics" },
    ]
    const navigate = useNavigate();
    const { pathname } = useLocation();
    // const { auth_user } = useSelector((state) => state.user || {});

    const handleNavigate = (href : string) => {
        navigate(href);
        // if (typeof onCloseSidebar === "function") onCloseSidebar();
    };


    return (
        <div className=' flex gap-4'>
            <ul
                className={`flex flex-col text-gray-900 dark:text-white p-2 "ml-[-4.8px]"`}
            >

                {navigationRoutes.map((item, index) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                        <li key={index}>
                            <div
                                onClick={() => handleNavigate(item.href)}
                                className={`my-0.5 cursor-pointer rounded-md transition-all group flex items-center py-2 px-3 hover:text-gary-700 hover:bg-gray-50 h-9
                     "px-0 justify-start"
                                    
                      ${active
                                        ? "bg-sky-50 text-sky-700"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }
                    `}
                            >
                                <span
                                    className={`flex items-center justify-center sm:w-7 w-6  ${active ? "text-white" : "text-gray-500 dark:text-white"
                                        }`}
                                >
                                    {/* {isMiniSidebarOpen ? */}
                                    <Icon className={` 
                                        ${active
                                            ? "bg-sky-50 text-sky-700"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }
                                        `} />
                                    {/* //     :
                                //     <Tooltip content={item.name} placement="right">
                                //         <Icon className={` ${active
                                //             ? "bg-sky-50 text-sky-600"
                                //             : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                //             }`} />
                                //     </Tooltip>
                                // } */}

                                </span>

                                {/* {isMiniSidebarOpen && ( */}
                                <span className="ml-3 truncate text-[12px]">{item.name}</span>
                                {/* )} */}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default SettingNavigation