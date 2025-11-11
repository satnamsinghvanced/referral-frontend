import { FaRegStar } from "react-icons/fa";
import { FiFileText, FiPhone, FiShare2 } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { LuGift, LuUserPlus } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";
import { PiCrownSimpleBold } from "react-icons/pi";
import { RiMegaphoneLine } from "react-icons/ri";

export const ACTIVITY_TYPES = [
  {
    icon: FiShare2,
    color: "#0ea5e9",
    label: "Social Media Post",
    value: "social media post",
  },
  {
    icon: MdOutlineMail,
    color: "#f97316",
    label: "Email Campaign",
    value: "email campaign",
  },
  {
    icon: GrLocation,
    color: "#1e40af",
    label: "Local Event",
    value: "local event",
  },
  {
    icon: LuGift,
    color: "#059669",
    label: "Promotion",
    value: "promotion",
  },
  {
    icon: LuUserPlus,
    color: "#7c3aed",
    label: "Referral Activity",
    value: "referral activity",
  },
  {
    icon: RiMegaphoneLine,
    color: "#dc2626",
    label: "Ad Campaign",
    value: "ad campaign",
  },
  {
    icon: FiFileText,
    color: "#0891b2",
    label: "Content Creation",
    value: "content creation",
  },
  {
    icon: PiCrownSimpleBold,
    color: "#ea580c",
    label: "Partnership",
    value: "partnership",
  },
  {
    icon: FaRegStar,
    color: "#fbbf24",
    label: "Review Request",
    value: "review request",
  },
  {
    icon: FiPhone,
    color: "#6b7280",
    label: "Call Campaign",
    value: "call campaign",
  },
];

export const ACTIVITY_STATUSES = [
  {
    label: "Scheduled",
    value: "scheduled",
  },
  {
    label: "In Progress",
    value: "in-progress",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];
