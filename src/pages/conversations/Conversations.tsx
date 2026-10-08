import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Card, CardBody, addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { LuMessageSquare } from "react-icons/lu";
import { HiOutlineClock, HiOutlineTrendingUp } from "react-icons/hi";
import { FiCheck } from "react-icons/fi";
import ComponentContainer from "../../components/common/ComponentContainer";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import { Conversation, ConversationMessage } from "../../consts/conversations";
import ConversationList from "./components/ConversationList";
import ChatArea from "./components/ChatArea";
import LeadSidebar from "./components/LeadSidebar";
import ViewLeadModal from "./modal/ViewLeadModal";
import ScheduleAppointmentModal from "./modal/ScheduleAppointmentModal";
import SendFormsModal from "./modal/SendFormsModal";
import SendQuoteModal from "./modal/SendQuoteModal";
import {
  getInstagramConversations,
  sendInstagramMessage,
  markInstagramSeen,
  ConversationQueryParams,
} from "../../services/igMessage";
import { getFacebookConversations, sendFacebookMessage, markFacebookSeen } from "../../services/fbMessage";
import { getWebConversations, sendWebMessage, markWebConversationRead } from "../../services/chatWidget";
import { getConversationStats, ConversationStatsResponse } from "../../services/conversationStats";
import { uploadChatAttachment } from "../../services/conversationAttachment";
import { useSocialCredentials } from "../../hooks/useSocial";
import { useLocationContext, LOCATION_COLORS } from "../../providers/LocationContext";
import {
  subscribeToNewMessage,
  unsubscribeFromNewMessage,
  subscribeToNewWebMessage,
  unsubscribeFromNewWebMessage,
  subscribeToEvent,
  unsubscribeFromEvent,
  NewMessagePayload,
  NewWebMessagePayload,
} from "../../services/sse";

export const getConversationLocation = (
  conv?: Partial<Conversation> | null,
  locationsList: Array<{ _id?: string; name?: string }> = []
): string => {
  if (!conv) return "";
  const target = (conv.locationId || conv.patientLocation || "").toString().trim();
  if (!target) return "";
  const matched = locationsList.find(
    (l) => l._id === target || l.name?.toLowerCase() === target.toLowerCase()
  );
  if (matched?.name) return matched.name;
  if (!/^[0-9a-fA-F]{24}$/.test(target)) {
    return target;
  }
  return "";
};

export const getAssignedLocation = (convIdOrConv: any, locations: any[] = []): string => {
  if (typeof convIdOrConv === "object" && convIdOrConv !== null) {
    return getConversationLocation(convIdOrConv, locations);
  }
  return "";
};

export interface LocationThemeInfo {
  key?: string;
  bg?: string;
  badge?: string;
  dot?: string;
  color: string;
  style?: React.CSSProperties;
  dotStyle?: React.CSSProperties;
  badgeStyle?: React.CSSProperties;
}

export const getLocationTheme = (
  locationNameOrId: string,
  locationsList: any[] = []
): LocationThemeInfo => {
  if (!locationNameOrId) {
    const fallbackColor = LOCATION_COLORS[0] || "#3b82f6";
    return {
      color: fallbackColor,
      style: {
        backgroundColor: `${fallbackColor}18`,
        borderColor: `${fallbackColor}45`,
        color: fallbackColor,
      },
      dotStyle: { backgroundColor: fallbackColor },
      badgeStyle: { backgroundColor: fallbackColor, borderColor: fallbackColor, color: "#ffffff" },
      bg: "",
      dot: "",
      badge: "",
    };
  }

  let matchedLoc: any;
  let locIndex = -1;

  if (Array.isArray(locationsList) && locationsList.length > 0) {
    if (typeof locationsList[0] === "object" && locationsList[0] !== null) {
      locIndex = locationsList.findIndex(
        (l: any) =>
          l._id === locationNameOrId ||
          l.name?.toLowerCase() === locationNameOrId.toLowerCase()
      );
      if (locIndex >= 0) matchedLoc = locationsList[locIndex];
    } else {
      locIndex = (locationsList as string[]).findIndex(
        (n: string) => n?.toLowerCase() === locationNameOrId.toLowerCase()
      );
    }
  }

  const color =
    matchedLoc?.color ||
    LOCATION_COLORS[locIndex >= 0 ? locIndex % LOCATION_COLORS.length : 0] ||
    LOCATION_COLORS[0] ||
    "#3b82f6";

  return {
    color,
    style: {
      backgroundColor: `${color}18`,
      borderColor: `${color}45`,
      color: color,
    },
    dotStyle: { backgroundColor: color },
    badgeStyle: { backgroundColor: color, borderColor: color, color: "#ffffff" },
    bg: "",
    dot: "",
    badge: "",
  };
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
  const [typingMap, setTypingMap] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

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

  const { locations: contextLocations, getLocationColor } = useLocationContext();

  const displayLocations = useMemo(() => {
    if (contextLocations && Array.isArray(contextLocations) && contextLocations.length > 0) {
      return contextLocations.map((l) => l.name).filter(Boolean);
    }
    return [];
  }, [contextLocations]);

  const availableLocations = useMemo(() => {
    if (!displayLocations || displayLocations.length === 0) return [];
    return displayLocations;
  }, [displayLocations]);

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
    return conversations;
  }, [conversations]);

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

  const deduplicateConversations = (convs: Conversation[]): Conversation[] => {
    const seen = new Set<string>();
    const unique: Conversation[] = [];
    for (const c of convs) {
      const key = `${c.platform}_${c.recipientId || c.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(c);
      }
    }
    return unique;
  };

  const applySeenOverrides = (convs: Conversation[]): Conversation[] => {
    return convs.map((conv) => {
      if (!conv.messages || conv.messages.length === 0) {
        return { ...conv, unreadCount: conv.unreadCount ?? 0 };
      }
      const lastMsg = conv.messages[conv.messages.length - 1];
      if (!lastMsg || !lastMsg.isFromPatient) {
        return { ...conv, unreadCount: 0 };
      }
      const seenMsgId =
        localStorage.getItem(`seen_msg_${conv.id}`) ||
        (conv.recipientId ? localStorage.getItem(`seen_msg_${conv.recipientId}`) : null);
      if (seenMsgId && seenMsgId !== "read") {
        if (seenMsgId === lastMsg.id) {
          return { ...conv, unreadCount: 0 };
        }
        const seenIdx = conv.messages.findIndex((m) => m.id === seenMsgId);
        if (seenIdx !== -1) {
          const unseenCount = conv.messages.slice(seenIdx + 1).filter((m) => m.isFromPatient).length;
          return { ...conv, unreadCount: unseenCount };
        }
      }
      let lastPracticeIdx = -1;
      for (let i = conv.messages.length - 1; i >= 0; i--) {
        const msg = conv.messages[i];
        if (msg && !msg.isFromPatient) {
          lastPracticeIdx = i;
          break;
        }
      }
      const unreadSinceReply =
        lastPracticeIdx !== -1
          ? conv.messages.slice(lastPracticeIdx + 1).filter((m) => m.isFromPatient).length
          : conv.messages.filter((m) => m.isFromPatient).length;

      const unread = conv.unreadCount && conv.unreadCount > 0
        ? Math.min(conv.unreadCount, Math.max(1, unreadSinceReply))
        : Math.max(1, unreadSinceReply);

      return { ...conv, unreadCount: unread };
    });
  };

  const [isConversationsLoading, setIsConversationsLoading] = useState(true);

  const mergeConversations = useCallback((prevConvs: Conversation[], newConvs: Conversation[]): Conversation[] => {
    const processedNew = applySeenOverrides(deduplicateConversations(newConvs));
    return processedNew.map((newC) => {
      const existing = prevConvs.find((p) => p.id === newC.id || (p.recipientId && p.recipientId === newC.recipientId));
      if (!existing) return newC;

      const optimisticMsgs = (existing.messages || []).filter((m) => m.isSending || m.id.startsWith("temp-"));
      const mergedMessages = [...(newC.messages || [])];
      for (const opt of optimisticMsgs) {
        if (!mergedMessages.some((m) => m.id === opt.id || (m.text === opt.text && Math.abs((m.createdAt || 0) - (opt.createdAt || 0)) < 10000))) {
          mergedMessages.push(opt);
        }
      }
      return {
        ...newC,
        messages: mergedMessages
      };
    });
  }, []);

  const loadConversations = useCallback(
    async (isBackground = false) => {
      let locationParam: string | undefined = undefined;
      if (contextLocations && Array.isArray(contextLocations) && contextLocations.length > 0) {
        if (selectedLocations.length > 0 && selectedLocations.length < contextLocations.length) {
          const matched = contextLocations.filter(
            (l) => selectedLocations.includes(l.name) || (l._id && selectedLocations.includes(l._id))
          );
          const ids = matched.map((l) => l._id || l.name).filter(Boolean);
          if (ids.length > 0) {
            locationParam = ids.join(",");
          }
        }
      } else if (selectedLocations.length === 1) {
        locationParam = selectedLocations[0];
      }

      const params: ConversationQueryParams = {};
      if (locationParam) params.locationId = locationParam;
      if (filterDropdown && filterDropdown !== "all") params.filter = filterDropdown;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const normalizeData = (res: any) => {
        if (Array.isArray(res)) return res;
        if (res?.data && Array.isArray(res.data)) return res.data;
        return [];
      };

      const fetchIGConversations = async () => {
        try {
          const res = await getInstagramConversations(params);
          return normalizeData(res);
        } catch (err) {
          console.error("Failed to load Instagram conversations:", err);
          return [];
        }
      };

      const fetchFBConversations = async () => {
        try {
          const res = await getFacebookConversations(params);
          return normalizeData(res);
        } catch (err) {
          console.error("Failed to load Facebook conversations:", err);
          return [];
        }
      };

      const fetchWebConversations = async () => {
        try {
          const res = await getWebConversations(params);
          return normalizeData(res);
        } catch (err) {
          console.error("Failed to load Web conversations:", err);
          return [];
        }
      };

      if (!isBackground) {
        setIsConversationsLoading(true);
      }

      try {
        let rawList: Conversation[] = [];
        if (selectedPlatform === "all") {
          const [web, fb, ig] = await Promise.all([fetchWebConversations(), fetchFBConversations(), fetchIGConversations()]);
          rawList = [...web, ...fb, ...ig];
        } else if (selectedPlatform === "web") {
          rawList = await fetchWebConversations();
        } else if (selectedPlatform === "facebook") {
          rawList = await fetchFBConversations();
        } else if (selectedPlatform === "instagram") {
          rawList = await fetchIGConversations();
        }

        setConversations((prev) => {
          if (isBackground && prev.length > 0) {
            return mergeConversations(prev, rawList);
          }
          return applySeenOverrides(deduplicateConversations(rawList));
        });
      } finally {
        if (!isBackground) {
          setIsConversationsLoading(false);
        }
      }
    },
    [selectedPlatform, selectedLocations, filterDropdown, debouncedSearch, contextLocations, mergeConversations]
  );

  useEffect(() => {
    loadConversations(false);
  }, [loadConversations]);

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
          let isNewMessageAdded = false;
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
              isNewMessageAdded = true;
            }
          } else {
            updatedMessages.push(payload.message);
            isNewMessageAdded = true;
          }
          const updatedConv: Conversation = {
            ...conv,
            patientName: (payload as any).patientName || conv.patientName,
            messages: updatedMessages,
            lastMessage: msgText,
            lastMessageTime: "Just now",
            lastMessageTimestamp: payload.message.createdAt || Date.now(),
            unreadCount: isFocused
              ? 0
              : !payload.message.isFromPatient
                ? 0
                : isNewMessageAdded && payload.message.isFromPatient
                  ? (conv.unreadCount || 0) + 1
                  : (conv.unreadCount || 0),
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
            isOnline: false,
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
      console.log("[Conversations View] 🌐 Received 'new_web_message' via SSE:", payload);
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
          let isNewMessageAdded = false;
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
              isNewMessageAdded = true;
            }
          } else {
            updatedMessages.push(payload.message);
            isNewMessageAdded = true;
          }

          const updatedConv: Conversation = {
            ...conv,
            messages: updatedMessages,
            lastMessage: msgText,
            lastMessageTime: "Just now",
            lastMessageTimestamp: payload.message.createdAt || Date.now(),
            unreadCount: isFocused
              ? 0
              : !payload.message.isFromPatient
                ? 0
                : isNewMessageAdded && payload.message.isFromPatient
                  ? (conv.unreadCount || 0) + 1
                  : (conv.unreadCount || 0),
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
            isOnline: false,
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

    const handleTypingStatus = (payload: { platform: string; conversationId: string; recipientId?: string; isTyping: boolean }) => {
      if (!payload.conversationId) return;
      setTypingMap((prev) => ({
        ...prev,
        [payload.conversationId]: payload.isTyping,
        ...(payload.recipientId ? { [payload.recipientId]: payload.isTyping } : {})
      }));
    };

    const handleMessageRead = (payload: { conversationId: string; recipientId?: string; platform?: string }) => {
      console.log("[Conversations View] 👁️ Received 'message_read' via SSE:", payload);
      setConversations((prev) =>
        prev.map((conv) => {
          if (
            conv.id === payload.conversationId ||
            conv.recipientId === payload.conversationId ||
            (payload.recipientId && (conv.id === payload.recipientId || conv.recipientId === payload.recipientId))
          ) {
            const lastMsg = conv.messages && conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;
            if (lastMsg?.id) {
              localStorage.setItem(`seen_msg_${conv.id}`, lastMsg.id);
              if (conv.recipientId) localStorage.setItem(`seen_msg_${conv.recipientId}`, lastMsg.id);
            }
            return {
              ...conv,
              unreadCount: 0,
            };
          }
          return conv;
        })
      );
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    };

    subscribeToNewMessage(handleNewMessage);
    subscribeToNewWebMessage(handleNewWebMessage);
    subscribeToEvent("message_read", handleMessageRead);
    subscribeToEvent("message_read_watermark", handleMessageReadWatermark);
    subscribeToEvent("messages_read_by_patient", handleMessagesReadByPatient);
    subscribeToEvent("typing_status", handleTypingStatus);

    return () => {
      unsubscribeFromNewMessage(handleNewMessage);
      unsubscribeFromNewWebMessage(handleNewWebMessage);
      unsubscribeFromEvent("message_read", handleMessageRead);
      unsubscribeFromEvent("message_read_watermark", handleMessageReadWatermark);
      unsubscribeFromEvent("messages_read_by_patient", handleMessagesReadByPatient);
      unsubscribeFromEvent("typing_status", handleTypingStatus);
    };
  }, [queryClient]);

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
    const lastMsg = conv.messages && conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;
    const lastMsgId = lastMsg?.id;

    if (lastMsgId) {
      if (conv.id) localStorage.setItem(`seen_msg_${conv.id}`, lastMsgId);
      if (conv.recipientId) localStorage.setItem(`seen_msg_${conv.recipientId}`, lastMsgId);
    }

    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
    );

    const markPromise =
      conv.platform === "instagram"
        ? markInstagramSeen(conv.recipientId || "", conv.id, lastMsgId)
        : conv.platform === "facebook"
          ? markFacebookSeen(conv.recipientId || "", conv.id, lastMsgId)
          : conv.platform === "web"
            ? markWebConversationRead(conv.id)
            : Promise.resolve();

    markPromise.finally(() => {
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    });
  };

  const filteredConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const getTimestamp = (conv: Conversation) => {
        if (conv.lastMessageTimestamp !== undefined) return conv.lastMessageTimestamp;
        if (!conv.lastMessageTime) return 0;
        if (conv.lastMessageTime === "Just now") return Date.now();
        const parsed = new Date(conv.lastMessageTime).getTime();
        return isNaN(parsed) ? 0 : parsed;
      };
      return getTimestamp(b) - getTimestamp(a);
    });
  }, [conversations]);

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

  const lastMarkedSeenRef = useRef<string>("");
  useEffect(() => {
    if (selectedConversation) {
      const lastMsg = selectedConversation.messages && selectedConversation.messages.length > 0
        ? selectedConversation.messages[selectedConversation.messages.length - 1]
        : null;
      const lastMsgId = lastMsg?.id || "";
      const markKey = `${selectedConversation.id}_${lastMsgId}`;

      if (selectedConversation.unreadCount > 0 || lastMarkedSeenRef.current !== markKey) {
        lastMarkedSeenRef.current = markKey;
        if (lastMsg) {
          localStorage.setItem(`seen_msg_${selectedConversation.id}`, lastMsg.id);
          if (selectedConversation.recipientId) {
            localStorage.setItem(`seen_msg_${selectedConversation.recipientId}`, lastMsg.id);
          }
        }
        const markAsSeenOnPlatform = async () => {
          try {
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
    }
  }, [selectedConversationId, selectedConversation?.messages?.length, queryClient]);

  const [backendStats, setBackendStats] = useState<ConversationStatsResponse | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      let locationParam: string | undefined = undefined;
      if (contextLocations && Array.isArray(contextLocations) && contextLocations.length > 0) {
        if (selectedLocations.length > 0 && selectedLocations.length < contextLocations.length) {
          const matched = contextLocations.filter(
            (l) => selectedLocations.includes(l.name) || (l._id && selectedLocations.includes(l._id))
          );
          const ids = matched.map((l) => l._id || l.name).filter(Boolean);
          if (ids.length > 0) {
            locationParam = ids.join(",");
          }
        }
      } else if (selectedLocations.length === 1) {
        locationParam = selectedLocations[0];
      }

      const res = await getConversationStats({
        platform: selectedPlatform,
        locationId: locationParam,
        filter: filterDropdown && filterDropdown !== "all" ? filterDropdown : undefined,
        search: debouncedSearch.trim() || undefined,
      });
      if (res) {
        setBackendStats(res);
      }
    } catch (err) {
      console.warn("Failed to fetch backend conversation stats:", err);
    }
  }, [selectedPlatform, selectedLocations, filterDropdown, debouncedSearch, contextLocations]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, conversations]);

  const stats = useMemo<StatCard[]>(() => {
    const totalCount = backendStats ? backendStats.totalCount : locationFilteredConversations.length;
    const activeCount = backendStats ? backendStats.activeCount : locationFilteredConversations.filter((c) => c.status === "active").length;
    const conversionRate = backendStats ? backendStats.conversionRate : (totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0);
    const avgResponseTime = backendStats ? backendStats.avgResponseTime : (totalCount > 0 ? "< 2m" : "0m");
    const activeSub = backendStats?.activeSubheading || (activeCount > 0 ? "Active patient chats" : "No active chats");
    const avgResponseSub = backendStats?.avgResponseTimeSubheading || (totalCount > 0 ? "Fast response rate" : "No recent activity");
    const convSub = backendStats?.conversionRateSubheading || "Patient response rate";

    return [
      {
        heading: "Active Conversations",
        value: activeCount.toString(),
        icon: <LuMessageSquare className="text-blue-600 dark:text-blue-400" />,
        subheading: (
          <span className="text-xs text-gray-500 dark:text-foreground/50 font-normal">
            {activeSub}
          </span>
        ),
      },
      {
        heading: "Avg Response Time",
        value: avgResponseTime,
        icon: (
          <HiOutlineClock className="text-emerald-600 dark:text-emerald-400" />
        ),
        subheading: (
          <span className="text-xs text-gray-500 dark:text-foreground/50 font-normal">
            {avgResponseSub}
          </span>
        ),
      },
      {
        heading: "Conversion Rate",
        value: `${conversionRate}%`,
        icon: (
          <HiOutlineTrendingUp className="text-purple-600 dark:text-purple-400" />
        ),
        subheading: (
          <span className="text-xs text-gray-500 dark:text-foreground/50 font-normal">
            {convSub}
          </span>
        ),
      },
    ];
  }, [backendStats, locationFilteredConversations]);

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
          console.log(`[Conversations View] 🚀 Sending message to ${currentConv.platform} (recipient/id: ${currentConv.recipientId || currentConv.id}):`, trimmedText);
          let sentMsg: any;
          if (isInstagram && currentConv.recipientId) {
            sentMsg = await sendInstagramMessage(currentConv.recipientId, trimmedText);
          } else if (isFacebook && currentConv.recipientId) {
            sentMsg = await sendFacebookMessage(currentConv.recipientId, trimmedText);
          } else if (isWeb) {
            sentMsg = await sendWebMessage(currentConv.id, trimmedText);
          }
          console.log(`[Conversations View] ✅ Message send API response:`, sentMsg);
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
    if (key === "block") {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
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
                  const isSelected = selectedLocations.includes(locName);
                  const locColor = getLocationColor(locName);

                  return (
                    <button
                      key={locName}
                      type="button"
                      onClick={() => toggleLocation(locName)}
                      style={
                        isSelected
                          ? {
                            backgroundColor: `${locColor}18`,
                            borderColor: `${locColor}50`,
                            color: locColor,
                          }
                          : undefined
                      }
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer shadow-2xs select-none ${isSelected
                        ? "shadow-xs"
                        : "bg-gray-100/70 dark:bg-content2 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 opacity-60 hover:opacity-100"
                        }`}
                    >
                      <span
                        style={
                          isSelected
                            ? { backgroundColor: locColor, borderColor: locColor }
                            : undefined
                        }
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 transition-colors ${isSelected
                          ? "text-white"
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
                isTyping={Boolean(selectedConversation && (typingMap[selectedConversation.id] || typingMap[selectedConversation.recipientId || ""]))}
              />
              <LeadSidebar
                selectedConversation={selectedConversation}
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
          const rawLoc = updatedLead.locationId || updatedLead.location || "";
          const foundLoc = contextLocations?.find(
            (l) => l._id === rawLoc || l.name.toLowerCase() === rawLoc.toLowerCase()
          );
          const locName = foundLoc ? foundLoc.name : (typeof rawLoc === "string" ? rawLoc : "");
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
                  patientLocation: locName,
                  locationId: updatedLead.locationId || (foundLoc ? foundLoc._id : undefined),
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
                patientLocation: locName,
                locationId: updatedLead.locationId || (foundLoc ? foundLoc._id : undefined),
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
        onAppointmentScheduled={(updatedLead) => {
          const leadId = updatedLead?._id || updatedLead?.id || modalLead?.leadId;
          const socId = updatedLead?.socialConversationId || modalLead?.id;
          const scheduledAppt = updatedLead?.scheduledAppointment || modalLead?.scheduledAppointment;
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === socId || (leadId && c.leadId === leadId)) {
                return {
                  ...c,
                  leadStatus: "appointmentScheduled",
                  scheduledAppointment: scheduledAppt,
                  tags: Array.from(new Set([...(c.tags || []), "scheduled"])),
                };
              }
              return c;
            })
          );
          setModalLead((prev) => {
            if (prev && (prev.id === socId || (leadId && prev.leadId === leadId))) {
              return {
                ...prev,
                leadStatus: "appointmentScheduled",
                scheduledAppointment: scheduledAppt,
                tags: Array.from(new Set([...(prev.tags || []), "scheduled"])),
              };
            }
            return prev;
          });
        }}
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