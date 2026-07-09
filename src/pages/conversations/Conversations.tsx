import { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardBody, addToast } from "@heroui/react";
import { HiOutlineFilter } from "react-icons/hi";
import { LuMessageSquare } from "react-icons/lu";
import { HiOutlineMail, HiOutlineClock, HiOutlineTrendingUp } from "react-icons/hi";
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
import { useQueryClient } from "@tanstack/react-query";
import {
  subscribeToNewMessage,
  unsubscribeFromNewMessage,
  subscribeToNewWebMessage,
  unsubscribeFromNewWebMessage,
  type NewMessagePayload,
  type NewWebMessagePayload,
} from "../../services/socket";

const Conversations = () => {
  const { data: socialCreds, isLoading: isSocialLoading } = useSocialCredentials();
  const queryClient = useQueryClient();


  const isMetaConnected = useMemo(() => {
    const credentials = (socialCreds && typeof socialCreds === "object" && "data" in socialCreds && socialCreds.data)
      ? (socialCreds.data as any)
      : socialCreds;
    const metaCreds = credentials?.meta;
    return metaCreds?.status === "Connected" || metaCreds?.status === "connected";
  }, [socialCreds]);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [filterDropdown, setFilterDropdown] = useState("all");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isViewLeadModalOpen, setIsViewLeadModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isSendFormsModalOpen, setIsSendFormsModalOpen] = useState(false);
  const [isSendQuoteModalOpen, setIsSendQuoteModalOpen] = useState(false);
  const [modalLead, setModalLead] = useState<Conversation | null>(null);

  const applySeenOverrides = (convs: Conversation[]): Conversation[] => {
    return convs.map((conv) => {
      if (!conv.messages || conv.messages.length === 0) {
        return { ...conv, unreadCount: 0 };
      }
      let lastProviderIndex = -1;
      for (let i = conv.messages.length - 1; i >= 0; i--) {
        const msg = conv.messages[i];
        if (msg && (msg.senderId === "provider" || msg.senderId === "practice" || !msg.isFromPatient)) {
          lastProviderIndex = i;
          break;
        }
      }
      let computedCount = 0;
      for (let i = lastProviderIndex + 1; i < conv.messages.length; i++) {
        const msg = conv.messages[i];
        if (msg && msg.isFromPatient) {
          computedCount++;
        }
      }
      const lastMsg = conv.messages[conv.messages.length - 1];
      if (lastMsg) {
        const seenMsgId = localStorage.getItem(`seen_msg_${conv.id}`);
        if (seenMsgId === lastMsg.id) {
          computedCount = 0;
        }
      }
      return { ...conv, unreadCount: computedCount };
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
    fetchIGConversations();
    fetchFBConversations();
    fetchWebConversations();
  }, []);

  useEffect(() => {
    const handleNewMessage = (payload: NewMessagePayload) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (
            conv.platform === payload.platform &&
            (conv.recipientId === payload.recipientId ||
              conv.id === payload.conversationId)
          ) {
            const updatedMessages = [...conv.messages, payload.message];
            return {
              ...conv,
              messages: updatedMessages,
              lastMessage: payload.message.text,
              lastMessageTime: "Just now",
              lastMessageTimestamp: Date.now(),
              unreadCount: conv.unreadCount + 1,
            };
          }
          return conv;
        })
      );
    };

    const handleNewWebMessage = (payload: NewWebMessagePayload) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.platform === "web" && conv.id === payload.conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, payload.message],
              lastMessage: payload.message.text,
              lastMessageTime: "Just now",
              lastMessageTimestamp: Date.now(),
              unreadCount: conv.unreadCount + 1,
            };
          }
          return conv;
        })
      );
    };
    subscribeToNewMessage(handleNewMessage);
    subscribeToNewWebMessage(handleNewWebMessage);
    return () => {
      unsubscribeFromNewMessage(handleNewMessage);
      unsubscribeFromNewWebMessage(handleNewWebMessage);
    };
  }, []);

  const [messageInput, setMessageInput] = useState("");
  const MAX_ATTACHMENTS = 5;
  const [attachedFile, setAttachedFile] = useState<{ file: File; name: string; url: string; type: string }[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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
    const newAttachments = selectedFiles.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));

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
    const newAttachments = selectedFiles.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));
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
        return matchesSearch && matchesPlatform && matchesFilter;
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
  }, [search, selectedPlatform, filterDropdown, conversations]);

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
      if (selectedConversation.unreadCount > 0) {
        setConversations((prev) =>
          prev.map((c) => (c.id === selectedConversation.id ? { ...c, unreadCount: 0 } : c))
        );
      }
    }
  }, [selectedConversation, queryClient]);

  const stats = useMemo<StatCard[]>(() => {
    const activeCount = conversations.filter(
      (c) => c.status === "active",
    ).length;
    const unreadCount = conversations.reduce(
      (acc, c) => acc + c.unreadCount,
      0,
    );
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
  }, [conversations]);

  const handleSendAutomatedMessage = async (text: string) => {
    if (!selectedConversationId) return;
    const currentConv = conversations.find((c) => c.id === selectedConversationId);
    if (!currentConv) return;
    const isInstagram = currentConv.platform === "instagram";
    const isFacebook = currentConv.platform === "facebook";
    const isWeb = currentConv.platform === "web";
    try {
      if (isInstagram && currentConv.recipientId) {
        await sendInstagramMessage(currentConv.recipientId, text);
      } else if (isFacebook && currentConv.recipientId) {
        await sendFacebookMessage(currentConv.recipientId, text);
      } else if (isWeb) {
        await sendWebMessage(currentConv.id, text);
      }
    } catch (err) {
      console.error("Failed to send automated message:", err);
      addToast({
        title: "Error Sending Message",
        description: "Could not deliver automated message.",
        color: "danger",
      });
      return;
    }

    const newMsg: ConversationMessage = {
      id: Date.now().toString(),
      senderId: "provider",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isFromPatient: false,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedConversationId) {
          return {
            ...c,
            lastMessage: newMsg.text,
            lastMessageTime: "Just now",
            lastMessageTimestamp: Date.now(),
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    addToast({
      title: "Message Sent",
      description: "Automated template sent successfully",
      color: "success",
    });
  };

  const handleSendMessage = async () => {
    const trimmedText = messageInput.trim();
    if (!trimmedText && attachedFile.length === 0) return;
    if (isSendingMessage) return;
    const currentConv = conversations.find((c) => c.id === selectedConversationId);
    if (!currentConv) return;
    const isInstagram = currentConv.platform === "instagram";
    const isFacebook = currentConv.platform === "facebook";
    const isWeb = currentConv.platform === "web";
    setIsSendingMessage(true);
    try {
      const messagesToAdd: ConversationMessage[] = [];

      const uploadedAttachments: { name: string; url: string; type: string }[] = [];
      for (const item of attachedFile) {
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

      // 2. Send messages to the API
      // If we have text, we send a text message.
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
          id: sentMsg?.data?.id || sentMsg?.id || Date.now().toString(),
          senderId: "provider",
          text: trimmedText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isFromPatient: false,
        });
      }

      for (const file of uploadedAttachments) {
        let sentMsg: any;
        if (isInstagram && currentConv.recipientId) {
          sentMsg = await sendInstagramMessage(currentConv.recipientId, "", file);
        } else if (isFacebook && currentConv.recipientId) {
          sentMsg = await sendFacebookMessage(currentConv.recipientId, "", file);
        } else if (isWeb) {
          sentMsg = await sendWebMessage(currentConv.id, "", file);
        }
        messagesToAdd.push({
          id: sentMsg?.data?.id || sentMsg?.id || `${Date.now()}-${Math.random()}`,
          senderId: "provider",
          text: file.type.startsWith("image/") ? "Sent an image" : "Sent a file",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isFromPatient: false,
          file
        });
      }


      if (messagesToAdd.length > 0) {
        const lastMsg = messagesToAdd[messagesToAdd.length - 1];
        const lastMsgText = lastMsg ? lastMsg.text : "";
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === selectedConversationId) {
              return {
                ...c,
                lastMessage: lastMsgText,
                lastMessageTime: "Just now",
                lastMessageTimestamp: Date.now(),
                messages: [...c.messages, ...messagesToAdd],
              };
            }
            return c;
          })
        );
      }

      addToast({
        title: "Message Sent",
        description: "Your message has been sent successfully",
        color: "success",
      });

      setMessageInput("");
      setAttachedFile([]);

    } catch (err: any) {
      console.error("Failed to send message:", err);
      const platformLabel =
        isInstagram ? "Instagram" : isFacebook ? "Facebook" : "Web widget";
      addToast({
        title: "Error Sending Message",
        description: err.message || `Could not deliver message to ${platformLabel}.`,
        color: "danger",
      });
    } finally {
      setIsSendingMessage(false);
    }
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

  const HEADING_DATA = {
    heading: "Conversations",
    subHeading: "Unified inbox for all patient communications",
    // buttons: [
    //   {
    //     label: "Filters",
    //     onClick: () => {
    //       addToast({
    //         title: "Coming Soon",
    //         description: "Advanced filters are in progress",
    //         color: "primary",
    //       });
    //     },
    //     icon: <HiOutlineFilter fontSize={15} />,
    //     variant: "ghost" as const,
    //     color: "default" as const,
    //     className: "border-small",
    //   },
    //   {
    //     label: "Quick Actions",
    //     onClick: () => {
    //       addToast({
    //         title: "Coming Soon",
    //         description: "Quick actions are in progress",
    //         color: "primary",
    //       });
    //     },
    //     variant: "solid" as const,
    //     color: "primary" as const,
    //   },
    // ],
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
            <div className="flex h-[calc(100vh-340px)] min-h-[500px]">
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
                isIntegrationsLoading={isSocialLoading}
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
                isIntegrationsLoading={isSocialLoading}
                isSendingMessage={isSendingMessage}
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
