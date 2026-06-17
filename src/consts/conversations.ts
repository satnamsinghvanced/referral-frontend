export const CONVERSATION_PLATFORMS = [
  { key: "all", label: "All" },
  { key: "web", label: "Web" },
  { key: "phone", label: "Phone" },
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
  unreadCount: number;
  isStarred: boolean;
  tags: string[];
  messages: ConversationMessage[];
  estimatedValue: number;
  treatmentInterest: string[];
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    patientName: "Sarah Martinez",
    patientEmail: "sarah.martinez@email.com",
    patientPhone: "(555) 123-4567",
    patientLocation: "Denver, CO",
    platform: "web",
    status: "active",
    isOnline: true,
    lastMessage: "What are your office hours for consultatio...",
    lastMessageTime: "2/17/2024",
    unreadCount: 2,
    isStarred: false,
    tags: ["new-lead", "high-priority"],
    estimatedValue: 7500,
    treatmentInterest: ["Invisalign", "Teeth Whitening"],
    messages: [
      { id: "m1", senderId: "patient", text: "Hi! I'm interested in learning more about Invisalign treatment.", timestamp: "2:25 PM", isFromPatient: true },
      { id: "m2", senderId: "practice", text: "Hello Sarah! We'd love to help you achieve your perfect smile. Invisalign is a great option for adult orthodontics. Would you like to schedule a complimentary consultation?", timestamp: "2:26 PM", isFromPatient: false },
      { id: "m3", senderId: "patient", text: "Yes, that would be great!", timestamp: "2:28 PM", isFromPatient: true },
      { id: "m4", senderId: "practice", text: "Would you like to continue this conversation via text message? It's more convenient and you'll get faster responses!", timestamp: "2:28 PM", isFromPatient: false },
      { id: "m5", senderId: "patient", text: "Sure! My number is (555) 123-4567", timestamp: "2:29 PM", isFromPatient: true },
    ],
  },
  {
    id: "2",
    patientName: "Michael Chen",
    patientEmail: "m.chen@email.com",
    patientPhone: "(555) 234-5678",
    patientLocation: "Boulder, CO",
    platform: "phone",
    status: "active",
    isOnline: false,
    lastMessage: "Thank you! I'll see you then.",
    lastMessageTime: "2/17/2024",
    unreadCount: 0,
    isStarred: false,
    tags: ["scheduled"],
    estimatedValue: 5200,
    treatmentInterest: ["Traditional Braces"],
    messages: [
      { id: "m1", senderId: "patient", text: "Hi, I'd like to schedule an appointment for braces.", timestamp: "10:15 AM", isFromPatient: true },
      { id: "m2", senderId: "practice", text: "We'd be happy to help! We have openings this Thursday at 2pm or Friday at 10am. Which works better?", timestamp: "10:18 AM", isFromPatient: false },
      { id: "m3", senderId: "patient", text: "Thursday at 2pm works great!", timestamp: "10:20 AM", isFromPatient: true },
      { id: "m4", senderId: "practice", text: "Perfect! You're all set for Thursday at 2pm. We'll send you a confirmation email shortly.", timestamp: "10:22 AM", isFromPatient: false },
      { id: "m5", senderId: "patient", text: "Thank you! I'll see you then.", timestamp: "10:23 AM", isFromPatient: true },
    ],
  },
  {
    id: "3",
    patientName: "Emma Rodriguez",
    patientEmail: "emma.r@email.com",
    patientPhone: "(555) 345-6789",
    patientLocation: "Aurora, CO",
    platform: "instagram",
    status: "active",
    isOnline: false,
    lastMessage: "Do you offer payment plans?",
    lastMessageTime: "2/17/2024",
    unreadCount: 1,
    isStarred: false,
    tags: ["pricing-inquiry"],
    estimatedValue: 4800,
    treatmentInterest: ["Clear Braces"],
    messages: [
      { id: "m1", senderId: "patient", text: "Hey! I saw your post about clear braces. How much do they cost?", timestamp: "1:30 PM", isFromPatient: true },
      { id: "m2", senderId: "practice", text: "Hi Emma! Clear braces typically range from $3,500-$6,000 depending on treatment complexity. We offer free consultations to give you an exact quote!", timestamp: "1:35 PM", isFromPatient: false },
      { id: "m3", senderId: "patient", text: "Do you offer payment plans?", timestamp: "1:40 PM", isFromPatient: true },
    ],
  },
  {
    id: "4",
    patientName: "David Thompson",
    patientEmail: "d.thompson@email.com",
    patientPhone: "(555) 456-7890",
    patientLocation: "Lakewood, CO",
    platform: "web",
    status: "active",
    isOnline: true,
    lastMessage: "Thanks for the quick response!",
    lastMessageTime: "2/17/2024",
    unreadCount: 0,
    isStarred: false,
    tags: ["existing-patient"],
    estimatedValue: 3200,
    treatmentInterest: ["Retainers"],
    messages: [
      { id: "m1", senderId: "patient", text: "I think I lost my retainer. What should I do?", timestamp: "3:00 PM", isFromPatient: true },
      { id: "m2", senderId: "practice", text: "No worries, David! We can get you a replacement retainer. Would you like to come in this week for impressions?", timestamp: "3:05 PM", isFromPatient: false },
      { id: "m3", senderId: "patient", text: "Thanks for the quick response!", timestamp: "3:07 PM", isFromPatient: true },
    ],
  },
  {
    id: "5",
    patientName: "Lisa Anderson",
    patientEmail: "lisa.a@email.com",
    patientPhone: "(555) 567-8901",
    patientLocation: "Westminster, CO",
    platform: "facebook",
    status: "active",
    isOnline: false,
    lastMessage: "Perfect, looking forward to it!",
    lastMessageTime: "2/17/2024",
    unreadCount: 0,
    isStarred: true,
    tags: ["high-value", "new-lead"],
    estimatedValue: 9500,
    treatmentInterest: ["Invisalign", "Veneers"],
    messages: [
      { id: "m1", senderId: "patient", text: "I'm interested in a complete smile makeover. Do you do Invisalign and veneers?", timestamp: "11:00 AM", isFromPatient: true },
      { id: "m2", senderId: "practice", text: "Absolutely, Lisa! We specialize in comprehensive smile makeovers. A combination of Invisalign and veneers can create stunning results.", timestamp: "11:10 AM", isFromPatient: false },
      { id: "m3", senderId: "patient", text: "That sounds amazing! When can I come in?", timestamp: "11:15 AM", isFromPatient: true },
      { id: "m4", senderId: "practice", text: "We have a consultation slot available next Monday at 3pm. Would that work for you?", timestamp: "11:20 AM", isFromPatient: false },
      { id: "m5", senderId: "patient", text: "Perfect, looking forward to it!", timestamp: "11:22 AM", isFromPatient: true },
    ],
  },
  {
    id: "6",
    patientName: "James Wilson",
    patientEmail: "j.wilson@email.com",
    patientPhone: "(555) 678-9012",
    patientLocation: "Arvada, CO",
    platform: "web",
    status: "active",
    isOnline: true,
    lastMessage: "Can I get a second opinion on my treatment plan?",
    lastMessageTime: "2/16/2024",
    unreadCount: 1,
    isStarred: false,
    tags: ["new-lead"],
    estimatedValue: 6000,
    treatmentInterest: ["Surgical Orthodontics"],
    messages: [
      { id: "m1", senderId: "patient", text: "Hi, I was told I might need jaw surgery along with braces. Can I get a second opinion on my treatment plan?", timestamp: "4:00 PM", isFromPatient: true },
    ],
  },
];
