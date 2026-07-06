export const CONVERSATION_PLATFORMS = [
  { key: "all", label: "All" },
  { key: "web", label: "Web" },
  { key: "facebook", label: "FB" },
  { key: "instagram", label: "IG" },
];

export const CONVERSATION_FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "starred", label: "Starred" },
  { key: "archived", label: "Archived" },
];

export const CONVERSATION_TAGS = [
  { key: "new-lead", label: "new-lead", color: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400" },
  { key: "high-priority", label: "high-priority", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" },
  { key: "existing-patient", label: "existing-patient", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" },
  { key: "high-value", label: "high-value", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" },
  { key: "pricing-inquiry", label: "pricing-inquiry", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400" },
  { key: "scheduled", label: "scheduled", color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400" },
];

export interface ConversationMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isFromPatient: boolean;
  file?: {
    name: string;
    url: string;
    type: string;
  };
}

export interface Conversation {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientLocation: string;
  patientAvatar?: string;
  platform: "web" | "phone" | "facebook" | "instagram";
  status: "active" | "archived";
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageTimestamp?: number;
  unreadCount: number;
  isStarred: boolean;
  tags: string[];
  messages: ConversationMessage[];
  estimatedValue: number;
  treatmentInterest: string[];
  recipientId?: string;
}