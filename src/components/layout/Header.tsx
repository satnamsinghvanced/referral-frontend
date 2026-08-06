import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Navbar, NavbarContent } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiUser } from "react-icons/fi";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { LuArrowRight, LuClock, LuUser, LuUsers } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useGlobalSearch } from "../../hooks/useDashboard";
import { useDebounce } from "../../hooks/useDebounce";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { AppDispatch } from "../../store";
import { timeAgo } from "../../utils/timeAgo";
import { LoadingState } from "../common/LoadingState";
import NotificationPopover from "../ui/NotificationsPopover";
import LogoutConfirmationModal from "../common/LogoutConfirmationModal";

import { useRolePermissions } from "../../hooks/useRolePermissions";

export default function Header({
  hamburgerMenuClick,
}: {
  hamburgerMenuClick: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useTypedSelector((state) => state.auth);
  const { hasPermission, hasAnyPermission, isAdmin } = useRolePermissions();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { data: results, isLoading } = useGlobalSearch({ q: debouncedQuery });
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const hasManageReferrals = isAdmin || hasPermission("Manage Referrals");
  const hasManageReferrers =
    isAdmin ||
    hasAnyPermission(["Manage Referrers and Partners", "Manage Referrers"]);

  const searchPlaceholder = useMemo(() => {
    if (hasManageReferrals && hasManageReferrers) {
      return "Search referrals and referrers...";
    }
    if (hasManageReferrals) {
      return "Search referrals...";
    }
    if (hasManageReferrers) {
      return "Search referrers...";
    }
    return "Search...";
  }, [hasManageReferrals, hasManageReferrers]);

  const filteredResults = useMemo(() => {
    if (!results) return [];
    if (isAdmin) return results;
    return results.filter((item) => {
      if (item.resultType === "referral" && !hasManageReferrals) return false;
      if (item.resultType === "referrer" && !hasManageReferrers) return false;
      return true;
    });
  }, [results, isAdmin, hasManageReferrals, hasManageReferrers]);

  const hasLocationsPermission = isAdmin || hasPermission("Manage Locations");
  const hasTeamPermission = isAdmin || hasPermission("Manage Team");
  const hasBillingPermission = isAdmin || hasPermission("Manage Billing");

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const profileMenuItems = useMemo(() => {
    const items: Array<{
      key: string;
      label: string;
      onClick: () => void;
      isHeader?: boolean;
      isDanger?: boolean;
    }> = [
        { key: "profile", label: `Signed in as ${user?.email}`, onClick: () => navigate("/settings"), isHeader: true },
        { key: "general", label: "General", onClick: () => navigate("/settings/general") },
      ];

    if (hasLocationsPermission) {
      items.push({ key: "locations", label: "Locations", onClick: () => navigate("/settings/locations") });
    }
    if (hasTeamPermission) {
      items.push({ key: "team", label: "Team Settings", onClick: () => navigate("/settings/team") });
    }
    if (hasBillingPermission) {
      items.push({ key: "billing", label: "Billing", onClick: () => navigate("/settings/billing") });
    }

    items.push({ key: "logout", label: "Log Out", onClick: handleLogout, isDanger: true });

    return items;
  }, [user?.email, hasLocationsPermission, hasTeamPermission, hasBillingPermission, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  return (
    <Navbar
      isBordered
      classNames={{
        base: "border-foreground/10 bg-background h-[58px] md:h-[64px]",
        wrapper: "max-w-none px-4 md:px-6 h-auto",
      }}
    >
      <NavbarContent justify="start" className="items-center gap-3">
        <div className="lg:hidden">
          <button
            onClick={hamburgerMenuClick}
            className="flex cursor-pointer text-xl text-foreground hover:bg-foreground/5 p-1.5 rounded-lg transition-colors -ml-1.5"
          >
            <HiOutlineMenuAlt1 />
          </button>
        </div>
        <NavbarContent className="hidden sm:flex" justify="start">
          <div ref={searchContainerRef} className="w-[18rem] relative">
            <Input
              size="sm"
              value={query}
              onValueChange={(val) => {
                setQuery(val);
                if (val.length >= 2) setIsOpen(true);
              }}
              onFocus={() => {
                if (query.length >= 2) setIsOpen(true);
              }}
              isClearable
              onClear={() => {
                setQuery("");
                setIsOpen(false);
              }}
              classNames={{
                base: "w-full",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "min-h-8 font-normal text-default-500 shadow-none bg-foreground/4 dark:bg-foreground/10 group-data-[focus=true]:border-default-400 text-foreground /10",
              }}
              placeholder={searchPlaceholder}
              startContent={
                <IoSearch size={18} className="text-foreground/50" />
              }
              type="text"
              variant="flat"
            />
            <AnimatePresence>
              {isOpen && query.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute left-0 top-[calc(100%+8px)] w-[400px] bg-background border border-divider shadow-2xl rounded-2xl overflow-hidden z-[100]"
                >
                  <div className="max-h-[450px] overflow-y-auto scrollbar-hide">
                    <div className="px-4 py-3 border-b border-divider flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-20">
                      <h4 className="text-sm font-medium dark:text-gray-400">
                        Search Results
                      </h4>
                      {filteredResults && filteredResults.length > 0 && (
                        <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                          {filteredResults.length} Found
                        </span>
                      )}
                    </div>
                    {isLoading ? (
                      <div className="p-8 flex flex-col items-center justify-center gap-3">
                        <LoadingState />
                        <p className="text-xs text-default-400 font-medium animate-pulse">
                          Searching through database...
                        </p>
                      </div>
                    ) : filteredResults && filteredResults.length > 0 ? (
                      <div className="flex flex-col">
                        {filteredResults.map((result) => (
                          <button
                            key={result._id}
                            onClick={() => {
                              setIsOpen(false);
                              setQuery("");
                              navigate(
                                result.resultType === "referral"
                                  ? `/referrals?tab=Referrals&referralId=${result._id}`
                                  : `/referrals?tab=Referrers&referrerId=${result._id}`,
                              );
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-foreground/[0.03] dark:hover:bg-foreground/[0.05] transition-all cursor-pointer text-left border-b border-divider last:border-none group"
                          >
                            <div
                              className={`p-2.5 rounded-lg shrink-0 transition-transform ${result.resultType === "referral"
                                ? "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400"
                                : "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                }`}
                            >
                              {result.resultType === "referral" ? (
                                <LuUsers size={18} />
                              ) : (
                                <LuUser size={18} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-foreground truncate">
                                  {result.name}
                                </span>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium uppercase tracking-tighter ${result.resultType === "referral"
                                    ? "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300"
                                    : "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300"
                                    }`}
                                >
                                  {result.resultType}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span className="truncate max-w-[150px]">
                                  {result.email}
                                </span>
                                <span className="size-1 bg-divider rounded-full shrink-0 dark:bg-gray-600" />
                                <span className="flex items-center gap-1">
                                  <LuClock size={12} className="opacity-60" />
                                  {timeAgo(result.createdAt)}
                                </span>
                              </div>
                            </div>
                            <LuArrowRight
                              className="text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1"
                              size={18}
                            />
                          </button>
                        ))}
                      </div>
                    ) : debouncedQuery.length >= 2 ? (
                      <div className="p-10 flex flex-col items-center justify-center text-center gap-4">
                        <div className="bg-default-100 dark:bg-default-50/10 rounded-full text-default-400">
                          <IoSearch size={24} />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">
                            No matches found
                          </p>
                          <p className="text-xs text-default-400 max-w-[200px] leading-[1.5]">
                            We couldn't find any referrals or referrers matching
                            "{debouncedQuery}"
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </NavbarContent>
      </NavbarContent>
      <NavbarContent as="div" className="items-center gap-4" justify="end">
        <div className="flex gap-2 justify-center items-center">
          <NotificationPopover />
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                className="text-sm flex justify-center items-center gap-2 border-none"
                startContent={<FiUser fontSize={16} />}
              >
                <p>{user?.firstName}</p>
              </Button>
            </DropdownTrigger>
            <DropdownMenu items={profileMenuItems} aria-label="Profile Actions" variant="flat">
              {(item) => (
                <DropdownItem
                  key={item.key}
                  color={item.isDanger ? "danger" : "default"}
                  className={item.isHeader ? "h-14 gap-2" : ""}
                  textValue={item.label}
                  onPress={() => item.onClick()}
                >
                  {item.isHeader ? (
                    <div>
                      <p className="font-semibold">Signed in as</p>
                      <p className="font-semibold">{user?.email}</p>
                    </div>
                  ) : (
                    item.label
                  )}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
      </NavbarContent>
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </Navbar>
  );
}
