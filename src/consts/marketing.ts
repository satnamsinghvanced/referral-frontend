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
    color: {
      id: 7,
      value: "#039be5",
    },
    label: "Social Media Post",
    value: "social media post",
  },
  {
    icon: MdOutlineMail,
    color: {
      id: 2,
      value: "#33b679",
    },
    label: "Email Campaign",
    value: "email campaign",
  },
  {
    icon: GrLocation,
    color: {
      id: 3,
      value: "#8e24aa",
    },
    label: "Local Event",
    value: "local event",
  },
  {
    icon: LuGift,
    color: {
      id: 4,
      value: "#e67c73",
    },
    label: "Promotion",
    value: "promotion",
  },
  {
    icon: LuUserPlus,
    color: {
      id: 5,
      value: "#f6c026",
    },
    label: "Referral Activity",
    value: "referral activity",
  },
  {
    icon: RiMegaphoneLine,
    color: {
      id: 6,
      value: "#f5511d",
    },
    label: "Ad Campaign",
    value: "ad campaign",
  },
  {
    icon: FiFileText,
    color: {
      id: 1,
      value: "#7986cb",
    },
    label: "Content Creation",
    value: "content creation",
  },
  {
    icon: PiCrownSimpleBold,
    color: {
      id: 11,
      value: "#d50000",
    },
    label: "Partnership",
    value: "partnership",
  },
  {
    icon: FaRegStar,
    color: {
      id: 9,
      value: "#3f51b5",
    },
    label: "Review Request",
    value: "review request",
  },
  {
    icon: FiPhone,
    color: {
      id: 10,
      value: "#0b8043",
    },
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
    label: "Scheduled",
    value: "confirmed",
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
