import React from "react";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
} from "@heroui/react";
import {
  HiOutlineArrowLeft,
  HiOutlinePhone,
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
} from "react-icons/hi";
import { LuSend } from "react-icons/lu";
import { MdOutlineVideocam } from "react-icons/md";
import { Conversation } from "../../../consts/conversations";
import {
  getPlatformIcon,
  getPlatformLabel,
  getPlatformChipStyle,
  getAvatarColor,
  getInitials,
} from "../utils";
import EmojiPicker from "./EmojiPicker";

interface ChatAreaProps {
  selectedConversation: Conversation | null;
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  messageInput: string;
  setMessageInput: (s: string) => void;
  attachedFile: { name: string; url: string; type: string } | null;
  setAttachedFile: (file: { name: string; url: string; type: string } | null) => void;
  handleSendMessage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onToggleStar?: (convId: string) => void;
  onDropdownAction?: (key: string, conv: Conversation) => void;
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
}: ChatAreaProps) {
  if (!selectedConversation) {
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
      className={`flex-1 flex flex-col min-w-0 ${
        selectedConversationId ? "flex" : "hidden md:flex"
      }`}
    >
      {/* Header */}
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
                startContent={getPlatformIcon(selectedConversation.platform)}
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
            onClick={() => onToggleStar?.(selectedConversation.id)}
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
            <DropdownMenu onAction={(key) => onDropdownAction?.(key as string, selectedConversation)}>
              <DropdownItem key="view">View Profile</DropdownItem>
              <DropdownItem key="archive">Archive</DropdownItem>
              <DropdownItem key="block" className="text-danger">
                Block
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Messages Feed */}
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

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-foreground/10 bg-white dark:bg-content1">
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

        <div className="flex items-center gap-2 w-full">
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-gray-400 dark:text-foreground/40 min-w-8 w-8"
              onPress={() => fileInputRef.current?.click()}
            >
              <HiOutlinePaperClip className="size-4" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-gray-400 dark:text-foreground/40 min-w-8 w-8"
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
                  className="text-gray-400 dark:text-foreground/40 min-w-8 w-8 hidden xs:flex"
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
            aria-label="Type your message"
            variant="flat"
            size="sm"
            className="flex-1 min-w-0"
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
            className="shadow-md shadow-primary/30 flex-shrink-0 min-w-8 w-8"
          >
            <LuSend className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="px-4 py-2 border-t border-foreground/5 bg-white dark:bg-content1 grid grid-cols-2 sm:grid-cols-3 gap-2">
        <Button
          size="sm"
          variant="flat"
          className="text-xs h-8 bg-gray-100 dark:bg-default-100 text-gray-600 dark:text-foreground/60 w-full"
          startContent={<HiOutlineCalendar className="size-3 flex-shrink-0" />}
        >
          <span className="truncate">Schedule Appointment</span>
        </Button>
        <Button
          size="sm"
          variant="flat"
          className="text-xs h-8 bg-gray-100 dark:bg-default-100 text-gray-600 dark:text-foreground/60 w-full"
          startContent={<HiOutlineMail className="size-3 flex-shrink-0" />}
        >
          <span className="truncate">Send Forms</span>
        </Button>
        <Button
          size="sm"
          variant="flat"
          className="text-xs h-8 bg-gray-100 dark:bg-default-100 text-gray-600 dark:text-foreground/60 w-full col-span-2 sm:col-span-1"
          startContent={<HiOutlineCurrencyDollar className="size-3 flex-shrink-0" />}
        >
          <span className="truncate">Send Quote</span>
        </Button>
      </div>
    </div>
  );
}
