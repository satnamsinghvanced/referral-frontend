import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Chip,
  Badge,
} from "@heroui/react";
import React, { useState } from "react";
import { FiBell, FiSettings, FiMail } from "react-icons/fi";
import { RiExternalLinkLine } from "react-icons/ri";

// --- Mock Data ---
const mockNotifications = [
  {
    id: 1,
    title: "New Referral Registered",
    message: "Dr. Smith's office submitted a referral form for a new patient.",
    time: "5 min ago",
    read: false,
    type: "success",
    link: "/app/referrals/new",
  },
  {
    id: 2,
    title: "Tracking QR Code Generated",
    message: "Your personalized QR and NFC tracking setup is complete.",
    time: "2 hours ago",
    read: false,
    type: "info",
    link: "/app/tracking",
  },
  {
    id: 3,
    title: "LinkedIn Integration Success",
    message: "Your social media account was successfully linked.",
    time: "Yesterday",
    read: true,
    type: "neutral",
    link: "/app/settings/social",
  },
];

export default function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

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
          <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </Button>
      </PopoverTrigger>

      {/* 2. Popover Content Block */}
      <PopoverContent className="w-80 p-0 shadow-xl rounded-xl border border-foreground/10 overflow-hidden">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-foreground/10">
            <h4 className="text-sm font-medium">Notifications</h4>
            <span className="text-xs text-primary dark:text-sky-400 underline underline-offset-2 cursor-pointer">
              Mark All as Read
            </span>
          </div>

          {/* List of Notifications */}
          <div className="max-h-96 overflow-y-auto">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                // Tailwind class to highlight unread items
                className={`p-3 border-b border-foreground/10 last:border-b-0 cursor-pointer transition-colors ${
                  notification.read
                    ? "bg-background hover:bg-gray-50 dark:hover:bg-default-100/30"
                    : "bg-blue-50/50 dark:bg-sky-950/20 hover:bg-blue-100 dark:hover:bg-sky-900/30"
                }`}
                onClick={() => {
                  // Handle navigation or mark as read logic here
                  console.log(`Navigating to: ${notification.link}`);
                  setOpen(false); // Close popover on click
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {notification.title}
                    </p>
                    <p className="text-[11px] leading-[1.5] text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  <RiExternalLinkLine className="w-3.5 h-3.5 ml-3 text-gray-400 flex-shrink-0" />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span
                    className={`h-4 text-[11px] font-medium ${
                      notification.read
                        ? "text-gray-500 dark:text-gray-400"
                        : "text-primary dark:text-sky-400"
                    }`}
                  >
                    {notification.time}
                  </span>
                  {/* {!notification.read && (
                    <div className="w-2 h-2 bg-danger-500 rounded-full flex-shrink-0"></div>
                  )} */}
                </div>
              </div>
            ))}
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
