import { FaGlobe, FaPhoneAlt, FaFacebookF, FaInstagram } from "react-icons/fa";

export const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "web":
      return <FaGlobe className="size-3" />;
    case "phone":
      return <FaPhoneAlt className="size-2.5" />;
    case "facebook":
      return <FaFacebookF className="size-2.5" />;
    case "instagram":
      return <FaInstagram className="size-3" />;
    default:
      return <FaGlobe className="size-3" />;
  }
};

export const getPlatformLabel = (platform: string) => {
  switch (platform) {
    case "web":
      return "Website Chat";
    case "phone":
      return "Phone";
    case "facebook":
      return "Facebook";
    case "instagram":
      return "Instagram";
    default:
      return "Website";
  }
};

export const getPlatformChipStyle = (platform: string) => {
  switch (platform) {
    case "web":
      return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
    case "phone":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    case "facebook":
      return "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400";
    case "instagram":
      return "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400";
    default:
      return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400";
  }
};

export const getAvatarColor = (name: string) => {
  const colors = [
    "bg-sky-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-rose-500",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const CHIP_COLORS: string[] = [
  "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400",
  "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400",
  "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
];

export const getChipColor = (index: number): string => {
  return CHIP_COLORS[index % CHIP_COLORS.length] ?? CHIP_COLORS[0]!;
};

export const parseMessageDate = (val?: number | string | Date): Date | null => {
  if (!val) return null;
  if (typeof val === "number") return new Date(val);
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  if (typeof val === "string") {
    if (val === "Just now") return new Date();
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) return parsed;

    const timeMatch = val.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
    if (timeMatch) {
      const today = new Date();
      let hours = parseInt(timeMatch[1]!, 10);
      const minutes = parseInt(timeMatch[2]!, 10);
      const ampm = timeMatch[3];
      if (ampm) {
        if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
        if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
      }
      today.setHours(hours, minutes, 0, 0);
      return today;
    }
  }
  return null;
};

export const isSameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const formatDateLabel = (dateVal?: number | string | Date): string => {
  const date = parseMessageDate(dateVal);
  if (!date) return "";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (isSameDay(targetDate, today)) {
    return "Today";
  }
  if (isSameDay(targetDate, yesterday)) {
    return "Yesterday";
  }

  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = diffTime / (1000 * 3600 * 24);

  if (diffDays > 0 && diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const formatConversationTime = (timeStr?: string, timestamp?: number): string => {
  if (timeStr === "Just now") return "Just now";

  let date: Date | null = null;
  if (timestamp) {
    date = new Date(timestamp);
  } else if (timeStr) {
    date = parseMessageDate(timeStr);
  }

  if (!date || isNaN(date.getTime())) {
    return timeStr || "";
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (isSameDay(targetDate, today)) {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }
  if (isSameDay(targetDate, yesterday)) {
    return "Yesterday";
  }

  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = diffTime / (1000 * 3600 * 24);

  if (diffDays > 0 && diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
};