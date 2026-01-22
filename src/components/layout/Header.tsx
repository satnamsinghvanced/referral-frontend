import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Navbar,
  NavbarContent,
} from "@heroui/react";
import { FiUser } from "react-icons/fi";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { queryClient } from "../../providers/QueryProvider";
import { AppDispatch } from "../../store";
import { logout } from "../../store/authSlice";
import NotificationPopover from "../ui/NotificationsPopover";
import { disconnectSocket } from "../../services/socket";
import { useState, useMemo, useRef, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useGlobalSearch } from "../../hooks/useDashboard";
import { Spinner } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuBell,
  LuCalendar,
  LuTarget,
  LuUsers,
  LuUser,
  LuClock,
  LuArrowRight,
} from "react-icons/lu";
import { SearchResult } from "../../types/dashboard";
import { timeAgo } from "../../utils/timeAgo";
import { LoadingState } from "../common/LoadingState";

export default function Header({
  hamburgerMenuClick,
}: {
  hamburgerMenuClick: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user } = useTypedSelector((state) => state.auth);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [isOpen, setIsOpen] = useState(false);

  const { data: results, isLoading } = useGlobalSearch({ q: debouncedQuery });

  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = () => {
    disconnectSocket();
    dispatch(logout());
    queryClient.clear();
    navigate("/signin");
  };
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
              classNames={{
                base: "w-full",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "min-h-8 font-normal text-default-500 shadow-none bg-foreground/4 dark:bg-foreground/10 group-data-[focus=true]:border-default-400 text-foreground /10",
              }}
              placeholder="Search referrals and referrers..."
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
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Search Results
                      </span>
                      {results && results.length > 0 && (
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                          {results.length} Found
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
                    ) : results && results.length > 0 ? (
                      <div className="flex flex-col">
                        {results.map((result) => (
                          <button
                            key={result._id}
                            onClick={() => {
                              setIsOpen(false);
                              navigate(
                                result.resultType === "referral"
                                  ? "/referrals"
                                  : "/referrals?tab=referrers",
                              );
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-foreground/[0.03] dark:hover:bg-foreground/[0.05] transition-all cursor-pointer text-left border-b border-divider last:border-none group"
                          >
                            <div
                              className={`p-2.5 rounded-lg shrink-0 transition-transform ${
                                result.resultType === "referral"
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
                                <span className="text-sm font-bold text-foreground truncate">
                                  {result.name}
                                </span>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter ${
                                    result.resultType === "referral"
                                      ? "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300"
                                      : "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300"
                                  }`}
                                >
                                  {result.resultType}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span className="truncate">{result.email}</span>
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
        <div className="flex gap-1 justify-center items-center">
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
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem
                key="profile"
                className="h-14 gap-2"
                onPress={() => navigate("/settings")}
                textValue={`Signed in as ${user?.email}`}
              >
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>
              <DropdownItem
                key="general"
                onPress={() => navigate("/settings/general")}
                textValue="General"
              >
                General
              </DropdownItem>
              <DropdownItem
                key="locations"
                onPress={() => navigate("/settings/locations")}
                textValue="Locations"
              >
                Locations
              </DropdownItem>
              <DropdownItem
                key="team"
                onPress={() => navigate("/settings/team")}
                textValue="Team Settings"
              >
                Team Settings
              </DropdownItem>
              <DropdownItem
                key="billing"
                onPress={() => navigate("/settings/billing")}
                textValue="Billing"
              >
                Billing
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                textValue="Log Out"
                onPress={handleLogout}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </NavbarContent>
    </Navbar>
  );
}
