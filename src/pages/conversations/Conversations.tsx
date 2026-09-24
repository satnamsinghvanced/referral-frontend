import { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardBody, addToast } from "@heroui/react";
import { LuMessageSquare } from "react-icons/lu";
import { HiOutlineMail, HiOutlineClock, HiOutlineTrendingUp } from "react-icons/hi";
import { FiCheck } from "react-icons/fi";
import ComponentContainer from "../../components/common/ComponentContainer";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import TrendIndicator from "../../components/common/TrendIndicator";
import { Conversation, ConversationMessage } from "../../consts/conversations";
import ConversationList from "./components/ConversationList";
import ChatArea from "./components/ChatArea";
import LeadSidebar from "./components/LeadSidebar";
import ViewLeadModal from "./modal/ViewLeadModal";
import ScheduleAppointmentModal from "./modal/ScheduleAppointmentModal";
import SendFormsModal from "./modal/SendFormsModal";
import SendQuoteModal from "./modal/SendQuoteModal";
import { getInstagramConversations, sendInstagramMessage, markInstagramSeen } from "../../services/igMessage";
import { getFacebookConversations, sendFacebookMessage, markFacebookSeen } from "../../services/fbMessage";
import { getWebConversations, sendWebMessage, markWebConversationRead } from "../../services/chatWidget";
import { uploadChatAttachment } from "../../services/conversationAttachment";
import { useSocialCredentials } from "../../hooks/useSocial";
import { useLocationContext } from "../../providers/LocationContext";
import { useQueryClient } from "@tanstack/react-query";
import {
  subscribeToNewMessage,
  unsubscribeFromNewMessage,
  subscribeToNewWebMessage,
  unsubscribeFromNewWebMessage,
  subscribeToEvent,
  unsubscribeFromEvent,
  type NewMessagePayload,
  type NewWebMessagePayload,
} from "../../services/sse";

export const LOCATION_THEMES = [
  {
    key: "sky",
    bg: "bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300",
    badge: "bg-sky-500 text-white border-sky-500",
    dot: "bg-sky-500",
  },
  {
    key: "orange",
    bg: "bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300",
    badge: "bg-orange-500 text-white border-orange-500",
    dot: "bg-orange-500",
  },
  {
    key: "purple",
    bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300",
    badge: "bg-purple-500 text-white border-purple-500",
    dot: "bg-purple-500",
  },
  {
    key: "emerald",
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300",
    badge: "bg-emerald-500 text-white border-emerald-500",
    dot: "bg-emerald-500",
  },
  {
    key: "pink",
    bg: "bg-pink-50 dark:bg-pink-950/40 border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-300",
    badge: "bg-pink-500 text-white border-pink-500",
    dot: "bg-pink-500",
  },
  {
    key: "amber",
    bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300",
    badge: "bg-amber-500 text-white border-amber-500",
    dot: "bg-amber-500",
  },
];

export const getAssignedLocation = (convId: string, locations: string[] = []): string => {
  if (!locations || locations.length === 0) return "";
  let num = 0;
  for (let i = 0; i < convId.length; i++) {
    num += convId.charCodeAt(i);
  }
  const loc = locations[num % locations.length];
  return loc || locations[0] || "";
};

export const getLocationTheme = (locationName: string, locations: string[] = []) => {
  const fallbackTheme = LOCATION_THEMES[0] || {
    key: "sky",
    bg: "bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300",
    badge: "bg-sky-500 text-white border-sky-500",
    dot: "bg-sky-500",
  };
  if (!locations || locations.length === 0) return fallbackTheme;
  const index = locations.indexOf(locationName);
  const themeIdx = index >= 0 ? index % LOCATION_THEMES.length : 0;
  return LOCATION_THEMES[themeIdx] || fallbackTheme;
};

const Conversations = () => {
  const { data: socialCreds, isLoading: isSocialLoading } = useSocialCredentials();
  const queryClient = useQueryClient();
  const isMetaConnected = useMemo(() => {
    const credentials = (socialCreds && typeof socialCreds === "object" && "data" in socialCreds && socialCreds.data)
      ? (socialCreds.data as any) : socialCreds;
    const metaCreds = credentials?.meta;
    return metaCreds?.status === "Connected" || metaCreds?.status === "connected";
  }, [socialCreds]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isConversationsLoading, setIsConversationsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [filterDropdown, setFilterDropdown] = useState("all");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isViewLeadModalOpen, setIsViewLeadModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isSendFormsModalOpen, setIsSendFormsModalOpen] = useState(false);
  const [isSendQuoteModalOpen, setIsSendQuoteModalOpen] = useState(false);
  const [modalLead, setModalLead] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const MAX_ATTACHMENTS = 5;
  const [attachedFile, setAttachedFile] = useState<{ file: File; name: string; url: string; type: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { locations: contextLocations } = useLocationContext();

  const displayLocations = useMemo(() => {
    if (contextLocations && Array.isArray(contextLocations) && contextLocations.length > 0) {
      return contextLocations.map((l) => l.name).filter(Boolean);
    }
    return [];
  }, [contextLocations]);

  const availableLocations = useMemo(() => {
    if (!displayLocations || displayLocations.length === 0) return [];
    const withData = displayLocations.filter((locName) => {
      const hasData = conversations.some((c) => {
        const cLoc = c.patientLocation || getAssignedLocation(c.id, displayLocations);
        return cLoc === locName;
      });
      return hasData || isMetaConnected;
    });
    return withData.length > 0 ? withData : displayLocations;
  }, [displayLocations, conversations, isMetaConnected]);

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  useEffect(() => {
    if (availableLocations && availableLocations.length > 0) {
      setSelectedLocations((prev) => {
        if (!prev || prev.length === 0) return availableLocations;
        const valid = prev.filter((name) => availableLocations.includes(name));
        return valid.length > 0 ? valid : availableLocations;
      });
    }
  }, [availableLocations]);

  const locationFilteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const convLocation = conv.patientLocation || getAssignedLocation(conv.id, displayLocations);
      return selectedLocations.includes(convLocation);
    });
  }, [conversations, selectedLocations, displayLocations]);

  const toggleLocation = (locName: string) => {
    if (selectedLocations.includes(locName)) {
      if (selectedLocations.length <= 1) {
        return;
      }
      setSelectedLocations((prev) => prev.filter((name) => name !== locName));
    } else {
      setSelectedLocations((prev) => [...prev, locName]);
    }
  };

  const HEADING_DATA = {
    heading: "Conversations",
    subHeading: "Unified inbox for all patient communications",
  };

  const applySeenOverrides = (convs: Conversation[]): Conversation[] => {
    return convs.map((conv) => {
      if (!conv.messages || conv.messages.length === 0) {
        return { ...conv, unreadCount: 0 };
      }
      const lastMsg = conv.messages[conv.messages.length - 1];
      if (!lastMsg || !lastMsg.isFromPatient) {
        return { ...conv, unreadCount: 0 };
      }

      const seenMsgId = localStorage.getItem(`seen_msg_${conv.id}`);
      if (seenMsgId) {
        if (seenMsgId === lastMsg.id) {
          return { ...conv, unreadCount: 0 };
        }
        const seenIdx = conv.messages.findIndex((m) => m.id === seenMsgId);
        if (seenIdx !== -1) {
          const unseenCount = conv.messages.slice(seenIdx + 1).filter((m) => m.isFromPatient).length;
          return { ...conv, unreadCount: unseenCount };
        }
      }

      return { ...conv, unreadCount: conv.unreadCount ?? 0 };
    });
  };

  useEffect(() => {
    const fetchIGConversations = async () => {
      try {
        const realIG = await getInstagramConversations();
        if (realIG && Array.isArray(realIG)) {
          setConversations((prev) => {
            const nonIG = prev.filter((c) => c.platform !== "instagram");
            return applySeenOverrides([...nonIG, ...realIG]);
          });
        }
      } catch (err) {
        console.error("Failed to load Instagram conversations:", err);
      }
    };

    const fetchFBConversations = async () => {
      try {
        const realFB = await getFacebookConversations();
        if (realFB && Array.isArray(realFB)) {
          setConversations((prev) => {
            const nonFB = prev.filter((c) => c.platform !== "facebook");
            return applySeenOverrides([...nonFB, ...realFB]);
          });
        }
      } catch (err) {
        console.error("Failed to load Facebook conversations:", err);
      }
    };

    const fetchWebConversations = async () => {
      try {
        const realWeb = await getWebConversations();
        if (realWeb && Array.isArray(realWeb)) {
          setConversations((prev) => {
            const nonWeb = prev.filter((c) => c.platform !== "web");
            return applySeenOverrides([...nonWeb, ...realWeb]);
          });
        }
      } catch (err) {
        console.error("Failed to load Web conversations:", err);
      }
    };
    const loadAllConversations = async () => {
      setIsConversationsLoading(true);
      try {
        await Promise.allSettled([
          fetchIGConversations(),
          fetchFBConversations(),
          fetchWebConversations()
        ]);
      } finally {
        setIsConversationsLoading(false);
      }
    };
    loadAllConversations();
  }, []);

  const selectedConversationIdRef = useRef<string | null>(selectedConversationId);
  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  useEffect(() => {
    const handleNewMessage = (payload: NewMessagePayload) => {
      setConversations((prev) => {
        const foundIdx = prev.findIndex(
          (conv) =>
            conv.platform === payload.platform &&
            (conv.recipientId === payload.recipientId ||
              conv.id === payload.conversationId ||
              conv.recipientId === payload.conversationId ||
              conv.id === payload.recipientId)
        );

        const currentSelected = selectedConversationIdRef.current;
        const msgText = payload.message.text || (payload.message.file ? (payload.message.file.type?.startsWith("image/") ? "Sent an image" : "Sent a file") : "");

        if (foundIdx !== -1 && prev[foundIdx]) {
          const conv = prev[foundIdx]!;
          const isFocused = currentSelected === conv.id || currentSelected === conv.recipientId;

          const existingIndexById = conv.messages.findIndex(
            (m) => m.id === payload.message.id
          );

          const updatedMessages = [...conv.messages];
          if (existingIndexById !== -1) {
            updatedMessages[existingIndexById] = payload.message;
          } else if (!payload.message.isFromPatient) {
            const optimisticIdx = conv.messages.findIndex(
              (m) =>
                !m.isFromPatient &&
                (m.isSending ||
                  m.id.startsWith("temp-") ||
                  (m.text === payload.message.text && Math.abs((m.createdAt || 0) - (payload.message.createdAt || Date.now())) < 10000))
            );
            if (optimisticIdx !== -1) {
              updatedMessages[optimisticIdx] = payload.message;
            } else {
              updatedMessages.push(payload.message);
            }
          } else {
            updatedMessages.push(payload.message);
          }

          const updatedConv: Conversation = {
            ...conv,
            patientName: (payload as any).patientName || conv.patientName,
            messages: updatedMessages,
            lastMessage: msgText,
            lastMessageTime: "Just now",
            lastMessageTimestamp: payload.message.createdAt || Date.now(),
            unreadCount: payload.message.isFromPatient ? (isFocused ? 0 : (conv.unreadCount || 0) + 1) : 0,
          };

          const remaining = prev.filter((_, idx) => idx !== foundIdx);
          return [updatedConv, ...remaining];
        } else {
          const newConv: Conversation = {
            id: payload.conversationId,
            patientName: (payload as any).patientName || (payload.platform === "instagram" ? "Instagram User" : "Facebook User"),
            patientEmail: "",
            patientPhone: "",
            patientLocation: "",
            platform: payload.platform as any,
            status: "active",
            isOnline: true,
            lastMessage: msgText,
            lastMessageTime: "Just now",
            lastMessageTimestamp: payload.message.createdAt || Date.now(),
            unreadCount: payload.message.isFromPatient ? 1 : 0,
            isStarred: false,
            tags: ["new-lead"],
            estimatedValue: 0,
            treatmentInterest: [],
            messages: [payload.message],
            recipientId: payload.recipientId,
          };

          return [newConv, ...prev];
        }
      });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    };

    const handleNewWebMessage = (payload: NewWebMessagePayload) => {
      setConversations((prev) => {
        const foundIdx = prev.findIndex(
          (conv) => conv.platform === "web" && (conv.id === payload.conversationId || conv.recipientId === payload.conversationId)
        );

        const currentSelected = selectedConversationIdRef.current;
        const msgText = payload.message.text || (payload.message.file ? (payload.message.file.type?.startsWith("image/") ? "Sent an image" : "Sent a file") : "");

        if (foundIdx !== -1 && prev[foundIdx]) {
          const conv = prev[foundIdx]!;
          const isFocused = currentSelected === conv.id;

          const existingIndexById = conv.messages.findIndex(
            (m) => m.id === payload.message.id
          );

          const updatedMessages = [...conv.messages];
          if (existingIndexById !== -1) {
            updatedMessages[existingIndexById] = payload.message;
          } else if (!payload.message.isFromPatient) {
            const optimisticIdx = conv.messages.findIndex(
              (m) =>
                !m.isFromPatient &&
                (m.isSending ||
                  m.id.startsWith("temp-") ||
                  (m.text === payload.message.text && Math.abs((m.createdAt || 0) - (payload.message.createdAt || Date.now())) < 10000))
            );
            if (optimisticIdx !== -1) {
              updatedMessages[optimisticIdx] = payload.message;
            } else {
              updatedMessages.push(payload.message);
            }
          } else {
            updatedMessages.push(payload.message);
          }

          const updatedConv: Conversation = {
            ...conv,
            messages: updatedMessages,
            lastMessage: msgText,
            lastMessageTime: "Just now",
            lastMessageTimestamp: payload.message.createdAt || Date.now(),
            unreadCount: payload.message.isFromPatient ? (isFocused ? 0 : (conv.unreadCount || 0) + 1) : 0,
          };

          const remaining = prev.filter((_, idx) => idx !== foundIdx);
          return [updatedConv, ...remaining];
        } else {
          const newConv: Conversation = {
            id: payload.conversationId,
            patientName: "Website Visitor",
            patientEmail: "",
            patientPhone: "",
            patientLocation: "",
            platform: "web",
            status: "active",
            isOnline: true,
            lastMessage: msgText,
            lastMessageTime: "Just now",
            lastMessageTimestamp: payload.message.createdAt || Date.now(),
            unreadCount: payload.message.isFromPatient ? 1 : 0,
            isStarred: false,
            tags: ["web-chat"],
            estimatedValue: 0,
            treatmentInterest: [],
            messages: [payload.message],
            recipientId: payload.conversationId,
          };

          return [newConv, ...prev];
        }
      });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    };

    const handleMessageReadWatermark = (payload: { platform: string; conversationId: string; watermark: number }) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (
            conv.platform === payload.platform &&
            (conv.id === payload.conversationId || conv.recipientId === payload.conversationId)
          ) {
            const updatedMessages = conv.messages.map((m) => {
              if (!m.isFromPatient && m.createdAt && m.createdAt <= payload.watermark && !m.seenAt) {
                return { ...m, seenAt: payload.watermark };
              }
              return m;
            });
            return {
              ...conv,
              messages: updatedMessages
            };
          }
          return conv;
        })
      );
    };

    const handleMessagesReadByPatient = (payload: { conversationId: string; platform: string; lastSeenAt: number }) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.platform === payload.platform && (conv.id === payload.conversationId || conv.recipientId === payload.conversationId)) {
            const updatedMessages = conv.messages.map((m) => {
              if (!m.isFromPatient && !m.seenAt) {
                return { ...m, seenAt: payload.lastSeenAt };
              }
              return m;
            });
            return {
              ...conv,
              messages: updatedMessages
            };
          }
          return conv;
        })
      );
    };

    subscribeToNewMessage(handleNewMessage);
    subscribeToNewWebMessage(handleNewWebMessage);
    subscribeToEvent("message_read_watermark", handleMessageReadWatermark);
    subscribeToEvent("messages_read_by_patient", handleMessagesReadByPatient);

    return () => {
      unsubscribeFromNewMessage(handleNewMessage);
      unsubscribeFromNewWebMessage(handleNewWebMessage);
      unsubscribeFromEvent("message_read_watermark", handleMessageReadWatermark);
      unsubscribeFromEvent("messages_read_by_patient", handleMessagesReadByPatient);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const remainingSlots = MAX_ATTACHMENTS - attachedFile.length;
    if (remainingSlots <= 0) {
      addToast({
        title: "Limit reached",
        description: "You can attach a maximum of 5 files at once.",
        color: "warning",
      });
      e.target.value = "";
      return;
    }
    const selectedFiles = Array.from(files).slice(0, remainingSlots);
    const newAttachments = selectedFiles.map((file) => ({ file, name: file.name, url: URL.createObjectURL(file), type: file.type }));
    setAttachedFile((prev) => [...prev, ...newAttachments]);
    addToast({
      title: "File(s) Attached",
      description: `${newAttachments.length} file(s) added`,
      color: "success",
    });
    e.target.value = "";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const remainingSlots = MAX_ATTACHMENTS - attachedFile.length;
    if (remainingSlots <= 0) {
      addToast({
        title: "Limit reached",
        description: "You can attach a maximum of 5 files at once.",
        color: "warning",
      });
      e.target.value = "";
      return;
    }
    const selectedFiles = Array.from(files).slice(0, remainingSlots);
    const newAttachments = selectedFiles.map((file) => ({ file, name: file.name, url: URL.createObjectURL(file), type: file.type }));
    setAttachedFile((prev) => [...prev, ...newAttachments]);
    addToast({
      title: "Image(s) Attached",
      description: `${newAttachments.length} image(s) added`,
      color: "success",
    });
    e.target.value = "";
  };

  const handleConversationClick = (conv: Conversation) => {
    setSelectedConversationId(conv.id);
    if (conv.unreadCount > 0) {
      setConversations((prev) =>
        prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
      );
    }
  };

  const filteredConversations = useMemo(() => {
    return conversations
      .filter((conv) => {
        const matchesSearch =
          !search ||
          conv.patientName.toLowerCase().includes(search.toLowerCase()) ||
          conv.lastMessage.toLowerCase().includes(search.toLowerCase());
        const matchesPlatform =
          selectedPlatform === "all" || conv.platform === selectedPlatform;
        let matchesFilter = true;
        if (filterDropdown === "unread") {
          matchesFilter = conv.unreadCount > 0 && conv.status !== "archived";
        } else if (filterDropdown === "starred") {
          matchesFilter = conv.isStarred && conv.status !== "archived";
        } else if (filterDropdown === "archived") {
          matchesFilter = conv.status === "archived";
        } else {
          matchesFilter = conv.status !== "archived";
        }
        const convLocation = conv.patientLocation || getAssignedLocation(conv.id, displayLocations);
        const matchesLocation = selectedLocations.includes(convLocation);
        return matchesSearch && matchesPlatform && matchesFilter && matchesLocation;
      })
      .sort((a, b) => {
        const getTimestamp = (conv: Conversation) => {
          if (conv.lastMessageTimestamp !== undefined) return conv.lastMessageTimestamp;
          if (!conv.lastMessageTime) return 0;
          if (conv.lastMessageTime === "Just now") return Date.now();
          const parsed = new Date(conv.lastMessageTime).getTime();
          return isNaN(parsed) ? 0 : parsed;
        };
        return getTimestamp(b) - getTimestamp(a);
      });
  }, [search, selectedPlatform, filterDropdown, conversations, selectedLocations, displayLocations]);

  const selectedConversation = useMemo(() => {
    if (!selectedConversationId) return null;
    return (
      conversations.find((c) => c.id === selectedConversationId) || null
    );
  }, [selectedConversationId, conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      const lastMsg = selectedConversation.messages && selectedConversation.messages.length > 0
        ? selectedConversation.messages[selectedConversation.messages.length - 1]
        : null;
      if (lastMsg) {
        localStorage.setItem(`seen_msg_${selectedConversation.id}`, lastMsg.id);
      }
      const markAsSeenOnPlatform = async () => {
        try {
          const lastMsgId = lastMsg?.id;
          if (selectedConversation.platform === "instagram") {
            await markInstagramSeen(selectedConversation.recipientId || "", selectedConversation.id, lastMsgId);
          } else if (selectedConversation.platform === "facebook") {
            await markFacebookSeen(selectedConversation.recipientId || "", selectedConversation.id, lastMsgId);
          } else if (selectedConversation.platform === "web") {
            await markWebConversationRead(selectedConversation.id);
          }
          queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
        } catch (err) {
          console.error("Failed to mark conversation as seen:", err);
        }
      };
      markAsSeenOnPlatform();
    }
  }, [selectedConversation?.id, selectedConversation?.messages?.length, queryClient]);

  const stats = useMemo<StatCard[]>(() => {
    const activeCount = locationFilteredConversations.filter((c) => c.status === "active").length;
    const unreadCount = locationFilteredConversations.reduce((acc, c) => acc + c.unreadCount, 0);
    return [
      {
        heading: "Active Conversations",
        value: activeCount.toString(),
        icon: <LuMessageSquare className="text-blue-600 dark:text-blue-400" />,
        subheading: (
          <TrendIndicator
            status="increment"
            percentage="12%"
            label="from last week"
          />
        ),
      },
      {
        heading: "Unread Messages",
        value: unreadCount.toString(),
        icon: (
          <HiOutlineMail className="text-orange-600 dark:text-orange-400" />
        ),
        subheading: (
          <TrendIndicator
            status="decrement"
            percentage="5%"
            label="from yesterday"
          />
        ),
      },
      {
        heading: "Avg Response Time",
        value: "2.5m",
        icon: (
          <HiOutlineClock className="text-emerald-600 dark:text-emerald-400" />
        ),
        subheading: (
          <TrendIndicator
            status="decrement"
            valueOverride="-15s"
            label="from last week"
          />
        ),
      },
      {
        heading: "Conversion Rate",
        value: "34%",
        icon: (
          <HiOutlineTrendingUp className="text-purple-600 dark:text-purple-400" />
        ),
        subheading: (
          <TrendIndicator
            status="increment"
            percentage="3%"
            label="vs target"
          />
        ),
      },
    ];
  }, [locationFilteredConversations]);

  const handleSendMessage = async () => {
    const trimmedText = messageInput.trim();
    const filesToSend = [...attachedFile];
    if (!trimmedText && filesToSend.length === 0) return;
    const currentConv = conversations.find((c) => c.id === selectedConversationId);
    if (!currentConv) return;
    setMessageInput("");
    setAttachedFile([]);
    const optimisticMessages: ConversationMessage[] = [];
    const textTempId = `temp-text-${Date.now()}`;
    if (trimmedText) {
      optimisticMessages.push({
        id: textTempId,
        senderId: "provider",
        text: trimmedText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isFromPatient: false,
        isSending: true,
        createdAt: Date.now()
      });
    }
    const fileTempIds: string[] = [];
    for (let i = 0; i < filesToSend.length; i++) {
      const currentFile = filesToSend[i];
      if (!currentFile) continue;
      const fileId = `temp-file-${Date.now()}-${i}`;
      fileTempIds.push(fileId);
      optimisticMessages.push({
        id: fileId,
        senderId: "provider",
        text: currentFile.type.startsWith("image/") ? "Sent an image" : "Sent a file",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isFromPatient: false,
        isSending: true,
        createdAt: Date.now(),
        file: {
          name: currentFile.name,
          url: currentFile.url,
          type: currentFile.type
        }
      });
    }
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === currentConv.id) {
          const lastMsg = optimisticMessages.length > 0 ? optimisticMessages[optimisticMessages.length - 1] : null;
          const lastMsgText = lastMsg ? lastMsg.text : "";
          return {
            ...c,
            lastMessage: lastMsgText,
            lastMessageTime: "Just now",
            lastMessageTimestamp: Date.now(),
            messages: [...c.messages, ...optimisticMessages],
          };
        }
        return c;
      })
    );
    const isInstagram = currentConv.platform === "instagram";
    const isFacebook = currentConv.platform === "facebook";
    const isWeb = currentConv.platform === "web";
    (async () => {
      try {
        const uploadedAttachments: { name: string; url: string; type: string }[] = [];
        for (const item of filesToSend) {
          const uploadRes = await uploadChatAttachment(item.file);
          const fileData = uploadRes?.data || uploadRes;
          if (fileData && fileData.url) {
            uploadedAttachments.push({
              name: fileData.name,
              url: fileData.url,
              type: fileData.type,
            });
          } else {
            throw new Error(`Failed to upload file: ${item.name}`);
          }
        }
        const messagesToAdd: { tempId: string; realMsg: ConversationMessage }[] = [];
        if (trimmedText) {
          let sentMsg: any;
          if (isInstagram && currentConv.recipientId) {
            sentMsg = await sendInstagramMessage(currentConv.recipientId, trimmedText);
          } else if (isFacebook && currentConv.recipientId) {
            sentMsg = await sendFacebookMessage(currentConv.recipientId, trimmedText);
          } else if (isWeb) {
            sentMsg = await sendWebMessage(currentConv.id, trimmedText);
          }
          messagesToAdd.push({
            tempId: textTempId,
            realMsg: {
              id: sentMsg?.data?.id || sentMsg?.id || Date.now().toString(),
              senderId: "provider",
              text: trimmedText,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isFromPatient: false,
              isSending: false,
              createdAt: Date.now()
            }
          });
        }
        for (let i = 0; i < uploadedAttachments.length; i++) {
          const file = uploadedAttachments[i];
          const tempId = fileTempIds[i];
          if (!file || !tempId) continue;
          let sentMsg: any;
          if (isInstagram && currentConv.recipientId) {
            sentMsg = await sendInstagramMessage(currentConv.recipientId, "", file);
          } else if (isFacebook && currentConv.recipientId) {
            sentMsg = await sendFacebookMessage(currentConv.recipientId, "", file);
          } else if (isWeb) {
            sentMsg = await sendWebMessage(currentConv.id, "", file);
          }
          messagesToAdd.push({
            tempId,
            realMsg: {
              id: sentMsg?.data?.id || sentMsg?.id || `${Date.now()}-${Math.random()}`,
              senderId: "provider",
              text: file.type.startsWith("image/") ? "Sent an image" : "Sent a file",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isFromPatient: false,
              file,
              isSending: false,
              createdAt: Date.now()
            }
          });
        }
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === currentConv.id) {
              let updatedMessages = [...c.messages];
              for (const item of messagesToAdd) {
                const alreadyHasReal = updatedMessages.some((m) => m.id === item.realMsg.id);
                if (alreadyHasReal) {
                  updatedMessages = updatedMessages.filter((m) => m.id !== item.tempId);
                } else {
                  updatedMessages = updatedMessages.map((m) => (m.id === item.tempId ? item.realMsg : m));
                }
              }
              return {
                ...c,
                messages: updatedMessages,
              };
            }
            return c;
          })
        );
      } catch (err: any) {
        console.error("Failed to send message:", err);
        const platformLabel = isInstagram ? "Instagram" : isFacebook ? "Facebook" : "Web widget";
        addToast({
          title: "Error Sending Message",
          description: `This message is being sent outside the allowed window.`,
          color: "danger",
        });
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === currentConv.id) {
              const tempIds = [textTempId, ...fileTempIds];
              const updatedMessages = c.messages.map((m) => {
                if (tempIds.includes(m.id)) {
                  return { ...m, isSending: false, isFailed: true };
                }
                return m;
              });
              return {
                ...c,
                messages: updatedMessages,
              };
            }
            return c;
          })
        );
      }
    })();
  };

  const handleToggleStar = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          const nextStarred = !c.isStarred;
          addToast({
            title: nextStarred ? "Starred" : "Unstarred",
            description: nextStarred ? "Conversation starred" : "Conversation unstarred",
            color: "success",
          });
          return {
            ...c,
            isStarred: nextStarred,
          };
        }
        return c;
      })
    );
  };

  const handleDropdownAction = (key: string, conv: Conversation) => {
    if (key === "archive") {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conv.id) {
            return {
              ...c,
              status: "archived",
            };
          }
          return c;
        })
      );
      addToast({
        title: "Conversation Archived",
        description: `${conv.patientName}'s conversation has been archived`,
        color: "success",
      });
      if (selectedConversationId === conv.id) {
        setSelectedConversationId(null);
      }
    } else if (key === "unarchive") {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conv.id) {
            return {
              ...c,
              status: "active",
            };
          }
          return c;
        })
      );
      addToast({
        title: "Conversation Unarchived",
        description: `${conv.patientName}'s conversation has been unarchived`,
        color: "success",
      });
      if (selectedConversationId === conv.id) {
        setSelectedConversationId(null);
      }
    } else if (key === "block") {
      addToast({
        title: "User Blocked",
        description: `${conv.patientName} has been blocked`,
        color: "danger",
      });
    } else if (key === "view") {
      setModalLead(conv);
      setIsViewLeadModalOpen(true);
    }
  };

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="flex flex-col gap-4 md:gap-5">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
          {stats.map((data, i) => (
            <MiniStatsCard key={i} cardData={data} />
          ))}
        </div>
        <Card
          shadow="none"
          className="border border-foreground/10 bg-white dark:bg-content1 overflow-hidden"
        >
          <CardBody className="p-0">
            {/* Top location filter bar matching Figma design */}
            <div className="px-4 py-3 border-b border-foreground/10 flex items-center gap-3 bg-gray-50/50 dark:bg-content2/30 flex-wrap">
              <span className="text-xs font-bold text-gray-500 dark:text-foreground/50 tracking-wider uppercase select-none">
                SHOW:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {availableLocations.map((locName) => {
                  const index = displayLocations.indexOf(locName);
                  const isSelected = selectedLocations.includes(locName);
                  const theme = LOCATION_THEMES[index >= 0 ? index % LOCATION_THEMES.length : 0];

                  return (
                    <button
                      key={locName}
                      type="button"
                      onClick={() => toggleLocation(locName)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer shadow-2xs select-none ${
                        isSelected
                          ? `${theme?.bg || ""} shadow-xs`
                          : "bg-gray-100/70 dark:bg-content2 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 transition-colors ${
                          isSelected
                            ? theme?.badge || "bg-primary text-white"
                            : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-content1 text-transparent"
                        }`}
                      >
                        {isSelected && <FiCheck className="size-2.5 stroke-[3]" />}
                      </span>
                      <span>{locName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex h-[calc(100vh-380px)] min-h-[480px]">
              <ConversationList
                conversations={conversations}
                filteredConversations={filteredConversations}
                selectedConversationId={selectedConversationId}
                selectedConversation={selectedConversation}
                onConversationClick={handleConversationClick}
                search={search}
                setSearch={setSearch}
                selectedPlatform={selectedPlatform}
                setSelectedPlatform={setSelectedPlatform}
                filterDropdown={filterDropdown}
                setFilterDropdown={setFilterDropdown}
                isMetaConnected={isMetaConnected}
                isIntegrationsLoading={isSocialLoading || isConversationsLoading}
                displayLocations={displayLocations}
                selectedLocations={selectedLocations}
              />
              <ChatArea
                selectedConversation={selectedConversation}
                selectedConversationId={selectedConversationId}
                setSelectedConversationId={setSelectedConversationId}
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                attachedFile={attachedFile}
                setAttachedFile={setAttachedFile}
                handleSendMessage={handleSendMessage}
                fileInputRef={fileInputRef}
                imageInputRef={imageInputRef}
                handleFileChange={handleFileChange}
                handleImageChange={handleImageChange}
                messagesEndRef={messagesEndRef}
                onToggleStar={handleToggleStar}
                onDropdownAction={handleDropdownAction}
                onScheduleClick={() => {
                  setModalLead(selectedConversation);
                  setIsScheduleModalOpen(true);
                }}
                onSendFormsClick={() => {
                  setModalLead(selectedConversation);
                  setIsSendFormsModalOpen(true);
                }}
                onSendQuoteClick={() => {
                  setModalLead(selectedConversation);
                  setIsSendQuoteModalOpen(true);
                }}
                isMetaConnected={isMetaConnected}
                isIntegrationsLoading={isSocialLoading || isConversationsLoading}
                displayLocations={displayLocations}
              />
              <LeadSidebar
                selectedConversation={selectedConversation}
                onArchiveLead={(conv) => {
                  if (conv.status === "archived") {
                    handleDropdownAction("unarchive", conv);
                  } else {
                    handleDropdownAction("archive", conv);
                  }
                }}
                onViewLead={(conv) => handleDropdownAction("view", conv)}
              />
            </div>
          </CardBody>
        </Card>
      </div>
      <ViewLeadModal
        isOpen={isViewLeadModalOpen}
        onClose={() => setIsViewLeadModalOpen(false)}
        lead={modalLead}
        onScheduleClick={() => setIsScheduleModalOpen(true)}
        onSendFormClick={() => {
          setIsViewLeadModalOpen(false);
          setIsSendFormsModalOpen(true);
        }}
        onLeadSaved={(updatedLead) => {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === updatedLead.socialConversationId) {
                return {
                  ...c,
                  leadId: updatedLead._id,
                  leadStatus: updatedLead.status,
                  patientName: `${updatedLead.firstName} ${updatedLead.lastName}`,
                  patientEmail: updatedLead.email,
                  patientPhone: updatedLead.phone,
                  patientLocation: updatedLead.location,
                };
              }
              return c;
            })
          );
          setModalLead((prev) => {
            if (prev && prev.id === updatedLead.socialConversationId) {
              return {
                ...prev,
                leadId: updatedLead._id,
                leadStatus: updatedLead.status,
                patientName: `${updatedLead.firstName} ${updatedLead.lastName}`,
                patientEmail: updatedLead.email,
                patientPhone: updatedLead.phone,
                patientLocation: updatedLead.location,
              };
            }
            return prev;
          });
        }}
      />
      <ScheduleAppointmentModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        lead={modalLead}
      />
      <SendFormsModal
        isOpen={isSendFormsModalOpen}
        onClose={() => setIsSendFormsModalOpen(false)}
        lead={modalLead}
      />
      <SendQuoteModal
        isOpen={isSendQuoteModalOpen}
        onClose={() => setIsSendQuoteModalOpen(false)}
        lead={modalLead}
      />
    </ComponentContainer>
  );
};

export default Conversations;