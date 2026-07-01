import { Input, Select, SelectItem, Button, Spinner } from "@heroui/react";
import { HiOutlineSearch, HiOutlineLightningBolt } from "react-icons/hi";
import { useNavigate } from "react-router";
import {
  CONVERSATION_PLATFORMS,
  CONVERSATION_TAGS,
  Conversation,
} from "../../../consts/conversations";
import {
  getPlatformIcon,
  getPlatformChipStyle,
  getAvatarColor,
  getInitials,
} from "../utils";

interface ConversationListProps {
  conversations: Conversation[];
  filteredConversations: Conversation[];
  selectedConversationId: string | null;
  selectedConversation: Conversation | null;
  onConversationClick: (conv: Conversation) => void;
  search: string;
  setSearch: (s: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (p: string) => void;
  filterDropdown: string;
  setFilterDropdown: (f: string) => void;
  isMetaConnected?: boolean;
  isIntegrationsLoading?: boolean;
}

export default function ConversationList({
  filteredConversations,
  selectedConversationId,
  selectedConversation,
  onConversationClick,
  search,
  setSearch,
  selectedPlatform,
  setSelectedPlatform,
  filterDropdown,
  setFilterDropdown,
  isMetaConnected = true,
  isIntegrationsLoading = false,
}: ConversationListProps) {
  const navigate = useNavigate();

  const showMetaWarning = !isMetaConnected && (selectedPlatform === "all" || selectedPlatform === "facebook" || selectedPlatform === "instagram");
  return (
    <div
      className={`w-full md:w-[320px] md:min-w-[280px] border-r border-foreground/10 flex flex-col ${selectedConversationId ? "hidden md:flex" : "flex"
        }`}
    >
      <div className="p-3 border-b border-foreground/10">
        <Input
          placeholder="Search conversations..."
          aria-label="Search conversations"
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
            aria-label="Filter by platform"
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
            aria-label="Filter by status"
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
              className={`flex-1 px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${selectedPlatform === p.key
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
        {isIntegrationsLoading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner size="sm" label="Loading chats..." color="primary" />
          </div>
        ) : showMetaWarning ? (
          <div className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[300px]">
            <div className="max-w-[240px] bg-white dark:bg-content1 rounded-2xl p-6 border border-foreground/10 shadow-md shadow-black/5 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center animate-pulse">
                <HiOutlineLightningBolt className="size-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-foreground">Meta Disconnected</h4>
                <p className="text-[10px] text-gray-500 dark:text-foreground/55 leading-relaxed">
                  Connect your Meta to start texting
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full mt-1">
                <Button
                  color="primary"
                  size="sm"
                  className="w-full font-semibold text-[10px] h-8 rounded-lg shadow-sm"
                  onClick={() => navigate("/social-media")}
                >
                  Connect Meta
                </Button>
              </div>
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-foreground/30 py-8">
            <p className="text-xs font-medium">No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onConversationClick(conv)}
              className={`flex gap-3 p-3 cursor-pointer border-b border-foreground/5 transition-all hover:bg-gray-50 dark:hover:bg-white/5 ${selectedConversation?.id === conv.id
                ? "bg-sky-50/70 dark:bg-sky-900/10 border-l-2 border-l-primary"
                : ""
                }`}
            >
              <div className="relative flex-shrink-0 w-10 h-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(
                    conv.patientName,
                  )}`}
                >
                  {getInitials(conv.patientName)}
                </div>

                {conv.isOnline && (
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-content1 rounded-full" />
                )}

                <div className="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4 w-4 h-4 rounded-full bg-white dark:bg-content1 ring-2 ring-white dark:ring-content1 flex items-center justify-center shadow-md z-10">
                  <span
                    className={`${getPlatformChipStyle(conv.platform)} rounded-full w-full h-full flex items-center justify-center`}
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
                      const tagDef = CONVERSATION_TAGS.find((t) => t.key === tag);
                      return (
                        <span
                          key={tag}
                          className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${tagDef?.color ||
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
          ))
        )}
      </div>
    </div>
  );
}
