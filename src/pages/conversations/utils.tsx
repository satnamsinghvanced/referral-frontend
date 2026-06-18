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
