import { useState, useMemo, useRef, useEffect } from "react";
import {
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  addToast,
} from "@heroui/react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import {
  HiOutlineSearch,
  HiOutlinePhone,
  HiOutlineStar,
  HiStar,
  HiOutlineFilter,
  HiOutlineDotsVertical,
  HiOutlineEye,
  HiOutlineArchive,
  HiOutlineCalendar,
  HiOutlineMail,
  HiOutlineCurrencyDollar,
  HiOutlineLocationMarker,
  HiOutlineChat,
  HiOutlineClock,
  HiOutlineTrendingUp,
  HiOutlinePaperClip,
  HiOutlinePhotograph,
  HiOutlineEmojiHappy,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import { LuMessageSquare, LuSend } from "react-icons/lu";
import { FaFacebookF, FaInstagram, FaGlobe, FaPhoneAlt } from "react-icons/fa";
import { MdOutlineVideocam } from "react-icons/md";
import ComponentContainer from "../../components/common/ComponentContainer";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import TrendIndicator from "../../components/common/TrendIndicator";
import {
  CONVERSATION_PLATFORMS,
  CONVERSATION_TAGS,
  MOCK_CONVERSATIONS,
  Conversation,
  ConversationMessage,
} from "../../consts/conversations";

const getPlatformIcon = (platform: string) => {
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

const getPlatformLabel = (platform: string) => {
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

const getPlatformChipStyle = (platform: string) => {
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

const getAvatarColor = (name: string) => {
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

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const POPULAR_EMOJIS = ["😊", "👍", "👋", "❤️", "🙌", "🔥", "✨", "🎉", "💡", "🤔"];

const Conversations = () => {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [search, setSearch] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [filterDropdown, setFilterDropdown] = useState("all");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messageInput, setMessageInput] = useState("");
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    url: string;
    type: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAttachedFile({ name: file.name, url, type: file.type });
      addToast({
        title: "File Attached",
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        color: "success",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAttachedFile({ name: file.name, url, type: file.type });
      addToast({
        title: "Image Attached",
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        color: "success",
      });
    }
  };

  const handleConversationClick = (conv: Conversation) => {
    setSelectedConversationId(conv.id);
  };

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const matchesSearch =
        !search ||
        conv.patientName.toLowerCase().includes(search.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(search.toLowerCase());
      const matchesPlatform =
        selectedPlatform === "all" || conv.platform === selectedPlatform;
      return matchesSearch && matchesPlatform;
    });
  }, [search, selectedPlatform, conversations]);

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

  const stats = useMemo<StatCard[]>(() => {
    const activeCount = MOCK_CONVERSATIONS.filter(
      (c) => c.status === "active",
    ).length;
    const unreadCount = MOCK_CONVERSATIONS.reduce(
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
  }, []);

  const handleSendMessage = () => {
    if (!messageInput.trim() && !attachedFile) return;

    const newMsg: ConversationMessage = {
      id: Date.now().toString(),
      senderId: "provider",
      text: messageInput.trim() || (attachedFile?.type.startsWith("image/") ? "Sent an image" : "Sent a file"),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isFromPatient: false,
      ...(attachedFile ? { file: { name: attachedFile.name, url: attachedFile.url, type: attachedFile.type } } : {}),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedConversationId) {
          return {
            ...c,
            lastMessage: newMsg.text,
            lastMessageTime: "Just now",
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    addToast({
      title: "Message Sent",
      description: "Your message has been sent successfully",
      color: "success",
    });

    setMessageInput("");
    setAttachedFile(null);
  };

  const HEADING_DATA = {
    heading: "Conversations",
    subHeading: "Unified inbox for all patient communications",
    buttons: [
      {
        label: "Filters",
        onClick: () => {
          addToast({
            title: "Coming Soon",
            description: "Advanced filters are in progress",
            color: "primary",
          });
        },
        icon: <HiOutlineFilter fontSize={15} />,
        variant: "ghost" as const,
        color: "default" as const,
        className: "border-small",
      },
      {
        label: "Quick Actions",
        onClick: () => {
          addToast({
            title: "Coming Soon",
            description: "Quick actions are in progress",
            color: "primary",
          });
        },
        variant: "solid" as const,
        color: "primary" as const,
      },
    ],
  };

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="flex flex-col gap-4 md:gap-5">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
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
              <div className={`w-full md:w-[320px] md:min-w-[280px] border-r border-foreground/10 flex flex-col ${selectedConversationId ? "hidden md:flex" : "flex"}`}>
                <div className="p-3 border-b border-foreground/10">
                  <Input
                    placeholder="Search conversations..."
                    startContent={
                      <HiOutlineSearch className="text-gray-400 dark:text-foreground/40" />
                    }
                    variant="flat"
                    size="sm"
                    value={search}
                    onValueChange={setSearch}
                  />
                </div>
                <div className="px-3 py-2 border-b border-foreground/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Select
                      placeholder="All Platforms"
                      size="sm"
                      className="flex-1"
                      variant="flat"
                      selectedKeys={new Set([selectedPlatform])}
                      onSelectionChange={(keys) =>
                        setSelectedPlatform(Array.from(keys)[0] as string)
                      }
                    >
                      {CONVERSATION_PLATFORMS.map((p) => (
                        <SelectItem key={p.key}>{p.label}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      placeholder="All"
                      size="sm"
                      className="flex-1"
                      variant="flat"
                      selectedKeys={new Set([filterDropdown])}
                      onSelectionChange={(keys) =>
                        setFilterDropdown(Array.from(keys)[0] as string)
                      }
                    >
                      <SelectItem key="all">All</SelectItem>
                      <SelectItem key="unread">Unread</SelectItem>
                      <SelectItem key="starred">Starred</SelectItem>
                      <SelectItem key="archived">Archived</SelectItem>
                    </Select>
                  </div>
                  <div className="flex gap-1">
                    {CONVERSATION_PLATFORMS.map((p) => (
                      <button
                        key={p.key}
                        onClick={() => setSelectedPlatform(p.key)}
                        className={`flex-1 px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${
                          selectedPlatform === p.key
                            ? "bg-primary text-white shadow-sm"
                            : "bg-gray-100 dark:bg-default-100 text-gray-500 dark:text-foreground/40 hover:bg-gray-200 dark:hover:bg-default-200"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => handleConversationClick(conv)}
                      className={`flex gap-3 p-3 cursor-pointer border-b border-foreground/5 transition-all hover:bg-gray-50 dark:hover:bg-white/5 ${
                        selectedConversation?.id === conv.id
                          ? "bg-sky-50/70 dark:bg-sky-900/10 border-l-2 border-l-primary"
                          : ""
                      }`}
                    >
                      {" "}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(
                            conv.patientName,
                          )}`}
                        >
                          {getInitials(conv.patientName)}
                        </div>
                        {conv.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-content1 rounded-full" />
                        )}
                        <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 rounded-full bg-white dark:bg-content1 flex items-center justify-center shadow-sm">
                          <span
                            className={`${getPlatformChipStyle(conv.platform)} rounded-full p-0.5`}
                          >
                            {getPlatformIcon(conv.platform)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-foreground truncate">
                            {conv.patientName}
                          </h4>
                          <span className="text-[10px] text-gray-400 dark:text-foreground/40 flex-shrink-0 ml-2">
                            {conv.lastMessageTime}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-foreground/50 truncate mt-0.5">
                          {conv.lastMessage}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex gap-1 flex-wrap">
                            {conv.tags.slice(0, 2).map((tag) => {
                              const tagDef = CONVERSATION_TAGS.find(
                                (t) => t.key === tag,
                              );
                              return (
                                <span
                                  key={tag}
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                                    tagDef?.color ||
                                    "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                  }`}
                                >
                                  {tag}
                                </span>
                              );
                            })}
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedConversation ? (
                <div className={`flex-1 flex flex-col min-w-0 ${selectedConversationId ? "flex" : "hidden md:flex"}`}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10 bg-white dark:bg-content1">
                    <div className="flex items-center gap-3">
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        className="md:hidden text-gray-500 dark:text-foreground/50 min-w-8 w-8 h-8"
                        onClick={() => setSelectedConversationId(null)}
                      >
                        <HiOutlineArrowLeft className="size-4" />
                      </Button>
                      <div className="relative">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(
                            selectedConversation.patientName,
                          )}`}
                        >
                          {getInitials(selectedConversation.patientName)}
                        </div>
                        {selectedConversation.isOnline && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-content1 rounded-full" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap sm:flex-nowrap">
                          <h4 className="text-xs sm:text-sm font-bold text-foreground truncate max-w-[100px] sm:max-w-none">
                            {selectedConversation.patientName}
                          </h4>
                          <Chip
                            size="sm"
                            variant="flat"
                            startContent={getPlatformIcon(
                              selectedConversation.platform,
                            )}
                            className={`text-[9px] sm:text-[10px] h-4 sm:h-5 font-semibold ${getPlatformChipStyle(
                              selectedConversation.platform,
                            )}`}
                          >
                            {getPlatformLabel(selectedConversation.platform)}
                          </Chip>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 dark:text-foreground/40 flex items-center gap-1">
                          {selectedConversation.isOnline ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                              Active now
                            </>
                          ) : (
                            "Offline"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        className="text-gray-500 dark:text-foreground/50 hidden sm:inline-flex"
                      >
                        <HiOutlinePhone className="size-4" />
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        className="text-gray-500 dark:text-foreground/50 hidden sm:inline-flex"
                      >
                        <MdOutlineVideocam className="size-5" />
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        className={`text-gray-500 dark:text-foreground/50 hidden sm:inline-flex ${
                          selectedConversation.isStarred ? "text-yellow-500" : ""
                        }`}
                      >
                        {selectedConversation.isStarred ? (
                          <HiStar className="size-4" />
                        ) : (
                          <HiOutlineStar className="size-4" />
                        )}
                      </Button>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="text-gray-500 dark:text-foreground/50"
                          >
                            <HiOutlineDotsVertical className="size-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownItem key="view">View Profile</DropdownItem>
                          <DropdownItem key="archive">Archive</DropdownItem>
                          <DropdownItem key="block" className="text-danger">
                            Block
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 dark:bg-black/10">
                    <div className="flex items-center justify-center">
                      <span className="text-[10px] text-gray-400 dark:text-foreground/40 bg-white dark:bg-content2 px-3 py-1 rounded-full shadow-sm border border-foreground/5">
                        {selectedConversation.lastMessageTime}
                      </span>
                    </div>

                    {selectedConversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.isFromPatient ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`flex items-end gap-2 max-w-[70%] ${
                            msg.isFromPatient ? "" : "flex-row-reverse"
                          }`}
                        >
                          {msg.isFromPatient && (
                            <div
                              className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[9px] font-bold ${getAvatarColor(
                                selectedConversation.patientName,
                              )}`}
                            >
                              {getInitials(selectedConversation.patientName)}
                            </div>
                          )}
                          <div>
                            <div
                              className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                                msg.isFromPatient
                                  ? "bg-white dark:bg-content2 text-foreground border border-foreground/5 rounded-bl-md"
                                  : "bg-primary text-white rounded-br-md shadow-md shadow-primary/20"
                              }`}
                            >
                              {msg.text}
                              {msg.file && (
                                <div className="mt-2 pt-2 border-t border-foreground/10 dark:border-white/10">
                                  {msg.file.type?.startsWith("image/") ? (
                                    <img
                                      src={msg.file.url}
                                      alt="Attached upload"
                                      className="max-w-[240px] max-h-[180px] rounded-lg border border-foreground/10 dark:border-white/10 object-contain cursor-pointer hover:opacity-95 transition-opacity mt-1.5 bg-gray-50/50 dark:bg-black/20 p-1"
                                      onClick={() => window.open(msg.file?.url, "_blank")}
                                    />
                                  ) : (
                                    <a
                                      href={msg.file.url}
                                      download={msg.file.name}
                                      className="flex items-center gap-1.5 underline font-medium text-xs break-all hover:opacity-80 transition-opacity"
                                    >
                                      <HiOutlinePaperClip className="size-3.5 flex-shrink-0" />
                                      {msg.file.name}
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                            <p
                              className={`text-[9px] text-gray-400 dark:text-foreground/30 mt-1 flex items-center gap-1 ${
                                msg.isFromPatient ? "" : "justify-end"
                              }`}
                            >
                              {!msg.isFromPatient && (
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                              )}
                              {msg.timestamp}
                            </p>
                          </div>
                          {!msg.isFromPatient && (
                            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center bg-primary text-white text-[9px] font-bold">
                              P
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="px-4 py-3 border-t border-foreground/10 bg-white dark:bg-content1">
                    {/* Attachment Preview */}
                    {attachedFile && (
                      <div className="mb-2 p-1.5 bg-gray-50 dark:bg-content2 border border-foreground/5 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          {attachedFile.type.startsWith("image/") ? (
                            <img
                              src={attachedFile.url}
                              alt="Attachment preview"
                              className="w-10 h-10 object-contain rounded border border-foreground/10 bg-white dark:bg-black/20 p-0.5"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded flex items-center justify-center text-[10px] font-bold">
                              FILE
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate max-w-[200px]">
                              {attachedFile.name}
                            </p>
                          </div>
                        </div>
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          onPress={() => setAttachedFile(null)}
                          className="min-w-6 w-6 h-6 text-gray-500"
                        >
                          ✕
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        className="text-gray-400 dark:text-foreground/40"
                        onPress={() => fileInputRef.current?.click()}
                      >
                        <HiOutlinePaperClip className="size-4" />
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        className="text-gray-400 dark:text-foreground/40"
                        onPress={() => imageInputRef.current?.click()}
                      >
                        <HiOutlinePhotograph className="size-4" />
                      </Button>
                      
                      <Popover placement="top-start">
                        <PopoverTrigger>
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="text-gray-400 dark:text-foreground/40"
                          >
                            <HiOutlineEmojiHappy className="size-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 border-none bg-transparent shadow-none">
                          <EmojiPicker
                            onEmojiClick={(emojiObject) => {
                              setMessageInput((prev) => prev + emojiObject.emoji);
                            }}
                            theme={document.documentElement.classList.contains("dark") ? Theme.DARK : Theme.LIGHT}
                            height={350}
                            width={300}
                          />
                        </PopoverContent>
                      </Popover>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Input
                        placeholder="Type your message..."
                        variant="flat"
                        size="sm"
                        className="flex-1"
                        value={messageInput}
                        onValueChange={setMessageInput}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSendMessage();
                        }}
                      />
                      <Button
                        isIconOnly
                        color="primary"
                        size="sm"
                        radius="full"
                        onPress={handleSendMessage}
                        className="shadow-md shadow-primary/30"
                      >
                        <LuSend className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-foreground/5 bg-white dark:bg-content1 flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      className="text-xs h-7 bg-gray-100 dark:bg-default-100 text-gray-600 dark:text-foreground/60 flex-1 sm:flex-initial"
                      startContent={<HiOutlineCalendar className="size-3" />}
                    >
                      Schedule Appointment
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      className="text-xs h-7 bg-gray-100 dark:bg-default-100 text-gray-600 dark:text-foreground/60 flex-1 sm:flex-initial"
                      startContent={<HiOutlineMail className="size-3" />}
                    >
                      Send Forms
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      className="text-xs h-7 bg-gray-100 dark:bg-default-100 text-gray-600 dark:text-foreground/60 flex-1 sm:flex-initial"
                      startContent={
                        <HiOutlineCurrencyDollar className="size-3" />
                      }
                    >
                      Send Quote
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 items-center justify-center hidden md:flex">
                  <div className="text-center text-gray-400 dark:text-foreground/30">
                    <HiOutlineChat className="size-16 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">Select a conversation</p>
                    <p className="text-xs mt-1">
                      Choose a conversation from the list to start chatting
                    </p>
                  </div>
                </div>
              )}

              {selectedConversation && (
                <div className="w-[280px] min-w-[250px] border-l border-foreground/10 overflow-y-auto hidden xl:block">
                  <div className="p-5 flex flex-col items-center border-b border-foreground/10">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3 ${getAvatarColor(
                        selectedConversation.patientName,
                      )}`}
                    >
                      {getInitials(selectedConversation.patientName)}
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      {selectedConversation.patientName}
                    </h3>
                    <p className="text-[11px] text-gray-400 dark:text-foreground/40 mt-0.5">
                      {getPlatformLabel(selectedConversation.platform)}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="flat"
                        className="text-xs h-7"
                        startContent={<HiOutlineEye className="size-3" />}
                      >
                        View Lead
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        className="text-xs h-7"
                        startContent={<HiOutlineArchive className="size-3" />}
                      >
                        Archive
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 border-b border-foreground/10">
                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-foreground/40 uppercase tracking-wider mb-3">
                      Contact Info
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2.5">
                        <HiOutlineMail className="size-3.5 text-gray-400 dark:text-foreground/40 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 dark:text-foreground/40">
                            Email
                          </p>
                          <p className="text-xs text-foreground font-medium">
                            {selectedConversation.patientEmail}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <HiOutlinePhone className="size-3.5 text-gray-400 dark:text-foreground/40 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 dark:text-foreground/40">
                            Phone
                          </p>
                          <p className="text-xs text-foreground font-medium">
                            {selectedConversation.patientPhone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <HiOutlineLocationMarker className="size-3.5 text-gray-400 dark:text-foreground/40 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 dark:text-foreground/40">
                            Location
                          </p>
                          <p className="text-xs text-foreground font-medium">
                            {selectedConversation.patientLocation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b border-foreground/10">
                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-foreground/40 uppercase tracking-wider mb-3">
                      Lead Info
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2.5">
                        <HiOutlineCurrencyDollar className="size-3.5 text-gray-400 dark:text-foreground/40 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 dark:text-foreground/40">
                            Estimated Value
                          </p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                            $
                            {selectedConversation.estimatedValue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 dark:text-foreground/40 mb-1.5 flex items-center gap-1">
                          <HiOutlineStar className="size-3" /> Treatment
                          Interest
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {selectedConversation.treatmentInterest.map(
                            (treatment) => (
                              <Chip
                                key={treatment}
                                size="sm"
                                variant="flat"
                                className="text-[10px] h-5 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 font-semibold"
                              >
                                {treatment}
                              </Chip>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-foreground/40 uppercase tracking-wider mb-3">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedConversation.tags.map((tag) => {
                        const tagDef = CONVERSATION_TAGS.find(
                          (t) => t.key === tag,
                        );
                        return (
                          <Chip
                            key={tag}
                            size="sm"
                            variant="flat"
                            className={`text-[10px] h-5 font-semibold ${
                              tagDef?.color ||
                              "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {tag}
                          </Chip>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </ComponentContainer>
  );
};

export default Conversations;
