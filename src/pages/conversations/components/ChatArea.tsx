import React from "react";
import {
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
  Textarea,
} from "@heroui/react";
import {
  HiOutlineArrowLeft,
  HiOutlineStar,
  HiStar,
  HiOutlineDotsVertical,
  HiOutlinePaperClip,
  HiOutlinePhotograph,
  HiOutlineEmojiHappy,
  HiOutlineCalendar,
  HiOutlineMail,
  HiOutlineCurrencyDollar,
  HiOutlineChat,
  HiOutlineLightningBolt,
} from "react-icons/hi";
import { LuSend } from "react-icons/lu";
import { MdOutlineVideocam } from "react-icons/md";
import { useNavigate } from "react-router";
import { Conversation } from "../../../consts/conversations";
import {
  getPlatformIcon,
  getPlatformLabel,
  getPlatformChipStyle,
  getAvatarColor,
  getInitials,
} from "../utils";
import EmojiPicker from "./EmojiPicker";

const formatSeenTime = (seenAt?: number) => {
  if (!seenAt) return "Seen now";
  const diff = Date.now() - seenAt;
  const diffMins = Math.floor(diff / 60000);
  const diffHours = Math.floor(diff / 3600000);
  
  if (diff < 15000) return "Seen now";
  if (diffMins < 1) return "Seen just now";
  if (diffMins < 60) return `Seen ${diffMins} min ago`;
  if (diffHours < 24) return `Seen ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `Seen ${new Date(seenAt).toLocaleDateString()}`;
};

const SeenStatus = ({ seenAt }: { seenAt?: number | undefined }) => {
  const [statusText, setStatusText] = React.useState("");

  React.useEffect(() => {
    if (!seenAt) {
      setStatusText("Sent");
      return;
    }

    const updateText = () => {
      setStatusText(formatSeenTime(seenAt));
    };

    updateText();
    const interval = setInterval(updateText, 15000);

    return () => clearInterval(interval);
  }, [seenAt]);

  return <>{statusText}</>;
};

interface ChatAreaProps {
  selectedConversation: Conversation | null;
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  messageInput: string;
  setMessageInput: (s: string) => void;
  attachedFile: any[];
  setAttachedFile: (files: any[]) => void;
  handleSendMessage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onToggleStar?: (convId: string) => void;
  onDropdownAction?: (key: string, conv: Conversation) => void;
  onScheduleClick?: () => void;
  onSendFormsClick?: () => void;
  onSendQuoteClick?: () => void;
  isMetaConnected?: boolean;
  isIntegrationsLoading?: boolean;
  isSendingMessage?: boolean;
}

export default function ChatArea({
  selectedConversation,
  selectedConversationId,
  setSelectedConversationId,
  messageInput,
  setMessageInput,
  attachedFile,
  setAttachedFile,
  handleSendMessage,
  fileInputRef,
  imageInputRef,
  handleFileChange,
  handleImageChange,
  messagesEndRef,
  onToggleStar,
  onDropdownAction,
  onScheduleClick,
  onSendFormsClick,
  onSendQuoteClick,
  isMetaConnected = true,
  isIntegrationsLoading = false,
  isSendingMessage = false,
}: ChatAreaProps) {
  const navigate = useNavigate();
  if (!selectedConversation) {
    if (selectedConversationId) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50/10 dark:bg-black/5">
          <Spinner size="lg" label="Loading chat..." color="primary" />
        </div>
      );
    }

    if (isIntegrationsLoading) {
      return (
        <div className="flex-1 flex items-center justify-center hidden md:flex bg-gray-50/10 dark:bg-black/5">
          <Spinner size="lg" label="Checking integrations..." color="primary" />
        </div>
      );
    }



    return (
      <div className="flex-1 items-center justify-center hidden md:flex">
        <div className="text-center text-gray-400 dark:text-foreground/30">
          <HiOutlineChat className="size-16 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">Select a conversation</p>
          <p className="text-xs mt-1">
            Choose a conversation from the list to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col min-w-0 ${selectedConversationId ? "flex" : "hidden md:flex"
        }`}
    >
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
            {selectedConversation.platform === "web" && (
              <div
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-content1 ${selectedConversation.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
              />
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
                startContent={selectedConversation.platform}
                className={`text-[9px] sm:text-[10px] h-4 sm:h-5 font-semibold ${getPlatformChipStyle(
                  selectedConversation.platform,
                )}`}
              >
                {getPlatformLabel(selectedConversation.platform)}
              </Chip>
            </div>
            {selectedConversation.platform === "web" && (
              <p className="text-[10px] sm:text-[11px] text-gray-400 dark:text-foreground/40 flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full inline-block ${selectedConversation.isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                />
                {selectedConversation.isOnline ? "Active now" : "Offline"}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1">


          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={() => onToggleStar?.(selectedConversation.id)}
            className={`text-gray-500 dark:text-foreground/50 hidden sm:inline-flex ${selectedConversation.isStarred ? "text-yellow-500" : ""
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
            <DropdownMenu onAction={(key) => onDropdownAction?.(key as string, selectedConversation)}>
              <DropdownItem key="view">View Profile</DropdownItem>
              <DropdownItem
                key={selectedConversation.status === "archived" ? "unarchive" : "archive"}
              >
                {selectedConversation.status === "archived" ? "Unarchive" : "Archive"}
              </DropdownItem>
              <DropdownItem key="block" className="text-danger">
                Block
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1.5 bg-gray-50/30 dark:bg-black/10">
        <div className="flex items-center justify-center">
          <span className="text-[10px] text-gray-400 dark:text-foreground/40 bg-white dark:bg-content2 px-3 py-1 rounded-full shadow-sm border border-foreground/5">
            {selectedConversation.lastMessageTime}
          </span>
        </div>

        {selectedConversation.messages.map((msg, idx) => {
          const prevMsg = selectedConversation.messages[idx - 1];
          const isNewGroup = !prevMsg || prevMsg.isFromPatient !== msg.isFromPatient;
          const isLastMessage = idx === selectedConversation.messages.length - 1;

          return (
            <div key={msg.id} className="flex flex-col">
              <div
                className={`flex ${msg.isFromPatient ? "justify-start" : "justify-end"} ${isNewGroup ? "mt-3" : "mt-0.5"
                  }`}
              >
                {!msg.isFromPatient && msg.isSending && (
                  <div className="self-center mr-2 flex items-center">
                    <Spinner size="sm" color="primary" className="scale-75" />
                  </div>
                )}
                {!msg.isFromPatient && msg.isFailed && (
                  <div className="self-center mr-2 flex items-center text-red-500" title="Message failed to send">
                    ⚠️
                  </div>
                )}
                <div className="flex items-end gap-2 max-w-[70%]">
                  {msg.isFromPatient && (
                    <div
                      className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[9px] font-bold ${getAvatarColor(
                        selectedConversation.patientName,
                      )}`}
                    >
                      {getInitials(selectedConversation.patientName)}
                    </div>
                  )}
                  <div
                    className={`px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${msg.isFromPatient
                      ? "bg-white dark:bg-content2 text-foreground border border-foreground/5 rounded-bl-md"
                      : "bg-primary text-white rounded-br-md shadow-md shadow-primary/20"
                      }`}
                  >
                    {msg.text && msg.text !== "Sent an image" && msg.text !== "Sent a file" && (
                      <div className="mb-1">{msg.text}</div>
                    )}
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
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 ${msg.isFromPatient
                        ? "text-gray-400 dark:text-foreground/40"
                        : "text-white/70"
                        }`}
                    >
                      <span className="[&>svg]:size-2 flex items-center">
                        {getPlatformIcon(selectedConversation.platform)}
                      </span>
                      <span className="text-[9px]">{msg.timestamp}</span>
                    </div>
                  </div>
                  {!msg.isFromPatient && (
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-800 dark:bg-gray-700 text-white text-[9px] font-bold">
                      P
                    </div>
                  )}
                </div>
              </div>

              {/* Show the seen status for the last message if it's sent by the provider and not sending/failed */}
              {isLastMessage && !msg.isFromPatient && !msg.isSending && !msg.isFailed && (
                <div className="text-[10px] text-gray-400 dark:text-foreground/40 text-right mt-1 mr-9">
                  <SeenStatus seenAt={msg.seenAt} />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 border-t border-foreground/10 bg-white dark:bg-content1">
        {attachedFile.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachedFile.map((file, idx) => (
              <div
                key={idx}
                className="p-1.5 bg-gray-50 dark:bg-content2 border border-foreground/5 rounded-lg flex items-center gap-2"
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={file.url}
                    alt="Attachment preview"
                    className="w-10 h-10 object-contain rounded border border-foreground/10 bg-white dark:bg-black/20 p-0.5"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded flex items-center justify-center text-[10px] font-bold">
                    FILE
                  </div>
                )}
                <p className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                  {file.name}
                </p>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={() => setAttachedFile(attachedFile.filter((_, i) => i !== idx))}
                  className="min-w-6 w-6 h-6 text-gray-500"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 w-full">
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0 pb-1">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-gray-400 dark:text-foreground/40 min-w-8 w-8 hover:bg-[#ffe8d6] hover:text-[#e28a4b] transition-colors rounded-lg"
              onClick={() => fileInputRef.current?.click()}
            >
              <HiOutlinePaperClip className="size-4" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-gray-400 dark:text-foreground/40 min-w-8 w-8 hover:bg-[#ffe8d6] hover:text-[#e28a4b] transition-colors rounded-lg"
              onClick={() => imageInputRef.current?.click()}
            >
              <HiOutlinePhotograph className="size-4" />
            </Button>

            <Popover placement="top-start">
              <PopoverTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="text-gray-400 dark:text-foreground/40 min-w-8 w-8 hover:bg-[#ffe8d6] hover:text-[#e28a4b] transition-colors rounded-lg"
                >
                  <HiOutlineEmojiHappy className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 border-none bg-transparent shadow-none">
                <EmojiPicker
                  onEmojiSelect={(emoji) => {
                    setMessageInput(messageInput + emoji);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
          <Textarea
            placeholder="Type your message..."
            aria-label="Type your message"
            variant="flat"
            size="sm"
            minRows={1}
            maxRows={5}
            className="flex-1 min-w-0"
            classNames={{
              input: "resize-none hide-scrollbar",
            }}
            value={messageInput}
            onValueChange={setMessageInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            isIconOnly
            color="primary"
            size="sm"
            radius="md"
            isDisabled={!messageInput.trim() && attachedFile.length === 0}
            onPress={handleSendMessage}
            className="flex-shrink-0 min-w-8 w-8"
          >
            <span className="flex items-center justify-center w-full h-full">
              <LuSend className="size-3.5 rotate-45 -translate-x-[1px] translate-y-[0.5px]" />
            </span>
          </Button>
        </div>
      </div>

      <div className="px-4 py-2 bg-white dark:bg-content1 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="bordered"
          className="text-xs h-8 border-foreground/10 text-foreground hover:bg-[#ffe8d6] hover:text-[#e28a4b] hover:border-transparent transition-all"
          startContent={<HiOutlineCalendar className="size-3.5 shrink-0" />}
          {...(onScheduleClick ? { onClick: onScheduleClick } : {})}
        >
          Schedule Appointment
        </Button>
        <Button
          size="sm"
          variant="bordered"
          className="text-xs h-8 border-foreground/10 text-foreground hover:bg-[#ffe8d6] hover:text-[#e28a4b] hover:border-transparent transition-all"
          startContent={<HiOutlineMail className="size-3.5 shrink-0" />}
          {...(onSendFormsClick ? { onClick: onSendFormsClick } : {})}
        >
          Send Forms
        </Button>
        <Button
          size="sm"
          variant="bordered"
          className="text-xs h-8 border-foreground/10 text-foreground hover:bg-[#ffe8d6] hover:text-[#e28a4b] hover:border-transparent transition-all"
          startContent={<HiOutlineCurrencyDollar className="size-3.5 shrink-0" />}
          {...(onSendQuoteClick ? { onClick: onSendQuoteClick } : {})}
        >
          Send Quote
        </Button>
      </div>
    </div >
  );
}
