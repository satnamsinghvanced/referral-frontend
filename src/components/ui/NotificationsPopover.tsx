import { Button, Popover, PopoverContent, PopoverTrigger, Spinner } from "@heroui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useMemo, useState } from "react";
import { FiBell, FiCheck, FiCheckCircle, FiClock, FiInbox } from "react-icons/fi";
import { RiExternalLinkLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useInAppNotifications,
  useMarkNotificationsRead,
} from "../../hooks/settings/useNotification";
import { queryClient } from "../../providers/QueryProvider";
import { getSocket, subscribeToNotifications } from "../../services/socket";

dayjs.extend(relativeTime);

export default function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const navigate = useNavigate();
  const { data: rawNotifications = [], isLoading } = useInAppNotifications();
  const markReadMutation = useMarkNotificationsRead();

  useEffect(() => {
    if (!markReadMutation.isPending) {
      setIsMarkingAll(false);
    }
  }, [markReadMutation.isPending]);

  useEffect(() => {
    const handleNewNotification = (_data: any) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "in-app"] });
    };
    subscribeToNotifications(handleNewNotification);
    return () => {
      const socketInstance = getSocket();
      if (socketInstance) {
        socketInstance.off("new_notification", handleNewNotification);
      }
    };
  }, []);

  // Filter out read notifications older than 24 hours (client-side guard)
  const validNotifications = useMemo(() => {
    const twentyFourHoursAgo = dayjs().subtract(24, "hours");
    return rawNotifications.filter((n: any) => {
      if (!n.isRead) return true;
      return dayjs(n.createdAt).isAfter(twentyFourHoursAgo);
    });
  }, [rawNotifications]);

  const unreadNotifications = useMemo(() => {
    return validNotifications.filter((n: any) => !n.isRead);
  }, [validNotifications]);

  const displayedNotifications =
    activeTab === "unread" ? unreadNotifications : validNotifications;

  const unreadCount = unreadNotifications.length;
  const totalCount = validNotifications.length;

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markReadMutation.mutate([notification._id]);
    }
    const leadId = notification.metadata?.leadId || notification.leadId;
    if (leadId) {
      navigate("/lead-tracking", { state: { openLeadId: leadId } });
      setOpen(false);
      return;
    }
    const referralId =
      notification.metadata?.referralId || notification.referralId;
    if (referralId) {
      navigate(`/referrals?referralId=${referralId}`);
      setOpen(false);
      return;
    }
    const referrerId =
      notification.metadata?.referrerId || notification.referrerId;
    if (referrerId) {
      navigate(`/referrals?referrerId=${referrerId}`);
      setOpen(false);
      return;
    }
    let link = notification.metadata?.link || notification.link;
    if (!link) {
      const title = (
        notification.title ||
        notification.metadata?.title ||
        ""
      ).toLowerCase();
      const message = (
        notification.message ||
        notification.metadata?.message ||
        ""
      ).toLowerCase();
      if (title.includes("referral") || message.includes("referral")) {
        link = "/referrals";
      } else if (title.includes("review") || message.includes("review")) {
        link = "/reviews";
      } else if (title.includes("lead") || message.includes("lead")) {
        link = "/lead-tracking";
      }
    }
    if (link) {
      navigate(link);
      setOpen(false);
    }
  };

  const handleMarkAllRead = () => {
    const unreadIds = unreadNotifications.map((n: any) => n._id);
    if (unreadIds.length > 0) {
      setIsMarkingAll(true);
      markReadMutation.mutate(unreadIds);
    }
  };

  return (
    <Popover placement="bottom-end" isOpen={open} onOpenChange={setOpen} offset={8} containerPadding={12}>
      <PopoverTrigger>
        <div className="relative inline-flex items-center justify-center cursor-pointer">
          <Button
            isIconOnly
            size="sm"
            aria-label="Notifications"
            className="p-0 m-0 bg-transparent hover:bg-foreground/5 rounded-full transition-colors overflow-visible"
            onPress={() => setOpen(!open)}
            disableAnimation
          >
            <FiBell className="size-4 text-foreground/80" />
          </Button>
          {unreadCount > 0 && (
            <motion.span
              animate={{ scale: [1, 1.18, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-1 -right-1 pointer-events-none flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold leading-none rounded-full shadow-sm border border-background z-10 p-0"
            >
              <span className="inline-flex items-center justify-center text-center leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            </motion.span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 p-0 shadow-2xl rounded-2xl border border-foreground/10 overflow-hidden bg-background text-foreground">
        <div className="flex flex-col items-stretch w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10 bg-foreground/[0.02]">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold tracking-tight">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-primary/10 text-primary dark:text-sky-400">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              isMarkingAll && markReadMutation.isPending ? (
                <div className="flex items-center gap-1.5">
                  <Spinner size="sm" classNames={{ wrapper: "size-3 h-3" }} color="primary" />
                  <span className="text-xs text-muted-foreground">Marking...</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-medium text-primary dark:text-sky-400 hover:underline cursor-pointer outline-none"
                  onClick={handleMarkAllRead}
                >
                  <FiCheckCircle className="size-3.5" />
                  <span>Mark All as Read</span>
                </button>
              )
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 px-3 pt-2 pb-1 border-b border-foreground/10 bg-foreground/[0.01]">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "all"
                ? "bg-foreground/10 text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
            >
              <span>All</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] rounded-full ${activeTab === "all"
                  ? "bg-foreground/15 text-foreground"
                  : "bg-foreground/10 text-muted-foreground"
                  }`}
              >
                {totalCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("unread")}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "unread"
                ? "bg-foreground/10 text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${activeTab === "unread"
                    ? "bg-primary text-white"
                    : "bg-primary/20 text-primary dark:text-sky-400"
                    }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Notifications Scroll List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-foreground/5">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-8 gap-2 text-xs text-muted-foreground">
                <Spinner size="sm" color="primary" />
                <span>Loading notifications...</span>
              </div>
            ) : displayedNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center gap-2">
                {activeTab === "unread" ? (
                  <>
                    <FiCheckCircle className="size-8 text-emerald-500/60" />
                    <p className="text-xs font-medium text-foreground">You're all caught up!</p>
                    <p className="text-[11px] text-muted-foreground">
                      No unread notifications right now.
                    </p>
                  </>
                ) : (
                  <>
                    <FiInbox className="size-8 text-muted-foreground/40" />
                    <p className="text-xs font-medium text-foreground">No notifications</p>
                    <p className="text-[11px] text-muted-foreground">
                      When you receive notifications, they'll appear here.
                    </p>
                  </>
                )}
              </div>
            ) : (
              displayedNotifications.map((notification: any) => {
                const isRead = notification.isRead;
                return (
                  <div
                    key={notification._id}
                    className={`group relative p-3.5 cursor-pointer transition-all duration-150 border-l-3 ${!isRead
                      ? "bg-primary-50/40 dark:bg-sky-950/20 border-l-primary hover:bg-primary-50/80 dark:hover:bg-sky-950/40"
                      : "bg-background border-l-transparent hover:bg-foreground/[0.03] opacity-85 hover:opacity-100"
                      }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p
                            className={`text-xs truncate ${!isRead
                              ? "font-semibold text-foreground"
                              : "font-medium text-foreground/80"
                              }`}
                          >
                            {notification.title ||
                              notification.metadata?.title ||
                              "Notification"}
                          </p>
                        </div>
                        <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-2 mt-0.5">
                          {notification.message || notification.metadata?.message}
                        </p>
                      </div>

                      {/* Tag & Actions */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span
                          className={`px-2  text-[6px] font-bold uppercase tracking-wider rounded-md border ${!isRead
                            ? "bg-blue-500/15 text-blue-600 dark:text-sky-400 border-blue-500/30"
                            : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            }`}
                        >
                          {!isRead ? "Unread" : "Read"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-foreground/5">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <FiClock className="size-3" />
                        <span>{dayjs(notification.createdAt).fromNow()}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!isRead && (
                          markReadMutation.isPending &&
                            markReadMutation.variables?.includes(notification._id) ? (
                            <Spinner size="sm" classNames={{ wrapper: "size-3.5 h-3.5" }} color="success" />
                          ) : (
                            <button
                              type="button"
                              className="p-1 rounded-md hover:bg-foreground/10 text-muted-foreground hover:text-emerald-500 transition-colors outline-none cursor-pointer flex items-center gap-1 text-[10px]"
                              onClick={(e) => {
                                e.stopPropagation();
                                markReadMutation.mutate([notification._id]);
                              }}
                              title="Mark as read"
                            >
                              <FiCheck className="size-3" />
                              <span>Mark read</span>
                            </button>
                          )
                        )}
                        {(notification.link || notification.metadata?.link) && (
                          <RiExternalLinkLine className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="px-4 py-2 border-t border-foreground/10 bg-foreground/[0.02] text-center">
            <span className="text-[10px] text-muted-foreground">
              Read notifications auto-clear after 24 hours
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
