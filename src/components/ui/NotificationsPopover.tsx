import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { FiBell, FiCheck } from "react-icons/fi";
import { RiExternalLinkLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import {
  useInAppNotifications,
  useMarkNotificationsRead,
} from "../../hooks/settings/useNotification";
import { subscribeToNotifications, getSocket } from "../../services/socket";
import { queryClient } from "../../providers/QueryProvider";

dayjs.extend(relativeTime);

export default function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: notifications = [], isLoading } = useInAppNotifications();
  const markReadMutation = useMarkNotificationsRead();

  useEffect(() => {
    // Subscribe to socket notifications
    console.log("Subscribing to notifications...");
    const handleNewNotification = (data: any) => {
      console.log("New notification received via socket:", data);
      queryClient.invalidateQueries({ queryKey: ["notifications", "in-app"] });
    };

    subscribeToNotifications(handleNewNotification);

    return () => {
      const socketInstance = getSocket();
      if (socketInstance) {
        console.log("Unsubscribing from notifications...");
        socketInstance.off("new_notification", handleNewNotification);
      }
    };
  }, [queryClient]);

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markReadMutation.mutate([notification._id]);
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
      }
    }

    if (link) {
      navigate(link);
      setOpen(false);
    }
  };

  const handleMarkAllRead = () => {
    const unreadIds = notifications
      .filter((n: any) => !n.isRead)
      .map((n: any) => n._id);
    if (unreadIds.length > 0) {
      markReadMutation.mutate(unreadIds);
    }
  };

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <Popover placement="bottom-end" isOpen={open} onOpenChange={setOpen}>
      {/* 1. Popover Trigger Button */}
      <PopoverTrigger>
        <Button
          isIconOnly
          size="sm"
          aria-label="Notifications"
          className="p-0 m-0 bg-transparent"
          onPress={() => setOpen(!open)}
          disableAnimation
        >
          <FiBell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </PopoverTrigger>

      {/* 2. Popover Content Block */}
      <PopoverContent className="w-80 p-0 shadow-xl rounded-xl border border-foreground/10 overflow-hidden">
        <div className="flex flex-col items-stretch w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-foreground/10">
            <h4 className="text-sm font-medium">Notifications</h4>
            {unreadCount > 0 && (
              <span
                className="text-xs text-primary dark:text-sky-400 underline underline-offset-2 cursor-pointer"
                onClick={handleMarkAllRead}
              >
                Mark All as Read
              </span>
            )}
          </div>

          {/* List of Notifications */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-xs text-gray-600 dark:text-gray-400">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-600 dark:text-gray-400">
                No notifications
              </div>
            ) : (
              notifications.map((notification: any) => (
                <div
                  key={notification._id}
                  // Tailwind class to highlight unread items
                  className={`p-3 border-b border-foreground/10 last:border-b-0 cursor-pointer transition-colors ${
                    notification.isRead
                      ? "bg-background hover:bg-gray-50 dark:hover:bg-default-100/30"
                      : "bg-blue-50/50 dark:bg-sky-950/20 hover:bg-blue-100 dark:hover:bg-sky-900/30"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {notification.title ||
                          notification.metadata?.title ||
                          "Notification"}
                      </p>
                      <p className="text-[11px] leading-[1.5] text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {notification.message || notification.metadata?.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                      {!notification.isRead && (
                        <button
                          type="button"
                          className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-green-500 transition-colors outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            markReadMutation.mutate([notification._id]);
                          }}
                          title="Mark as read"
                        >
                          <FiCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {(notification.link || notification.metadata?.link) && (
                        <RiExternalLinkLine className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span
                      className={`h-4 text-[11px] font-medium ${
                        notification.isRead
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-primary dark:text-sky-400"
                      }`}
                    >
                      {dayjs(notification.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {/* <div className="p-3 border-t border-foreground/10">
            <Button variant="solid" color="primary" size="sm" fullWidth>
              View All Notifications
            </Button>
          </div> */}
        </div>
      </PopoverContent>
    </Popover>
  );
}
