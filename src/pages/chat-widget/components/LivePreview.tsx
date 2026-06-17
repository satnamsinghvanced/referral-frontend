import React, { useState, useEffect } from "react";
import { FiMonitor, FiSmartphone, FiMessageSquare, FiMessageCircle, FiShield, FiPaperclip, FiMaximize2, FiMinimize2, FiSend, FiX } from "react-icons/fi";
import { HiOutlineChat } from "react-icons/hi";
import { Button, Card } from "@heroui/react";

interface LivePreviewProps {
  previewMode: "desktop" | "mobile";
  setPreviewMode: (mode: "desktop" | "mobile") => void;
  businessName: string;
  bubbleText: string;
  primaryColor: string;
  widgetPosition: string;
  bubbleIcon: string;
  logoUrl: string;
  welcomeMessage: string;
  enableAutoReply: boolean;
  autoReplyMessage: string;
  enableSmsTransition: boolean;
  smsPromptMessage: string;
  smsConsentText: string;
  requirePatientConsent: boolean;
  privacyPolicyUrl: string;
  requireEmail: boolean;
  requirePhone: boolean;
  hipaaMode: boolean;
  workingHours: boolean;
  isPreviewChatOpen: boolean;
  setIsPreviewChatOpen: (open: boolean) => void;
}

export default function LivePreview({
  previewMode,
  setPreviewMode,
  businessName,
  bubbleText,
  primaryColor,
  widgetPosition,
  bubbleIcon,
  logoUrl,
  welcomeMessage,
  privacyPolicyUrl,
  isPreviewChatOpen,
  setIsPreviewChatOpen
}: LivePreviewProps) {
  const displayBusinessName = businessName || "Practice ROI";
  const displayBubbleText = bubbleText || "Chat with us";
  const displayWelcomeMessage = welcomeMessage || "Hi there! 👋 How can we help you today?";
  const displayPrivacyPolicyUrl = privacyPolicyUrl || "https://practiceroi.com/privacy";

  const [chatOpenState, setChatOpenState] = useState<"closed" | "open" | "collapsed">("closed");
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPreviewChatOpen) {
      if (chatOpenState === "closed") {
        setChatOpenState("open");
      }
    } else {
      setChatOpenState("closed");
    }
  }, [isPreviewChatOpen]);

  useEffect(() => {
    if (chatOpenState === "open" && messagesEndRef.current) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [userMessages, isChatStarted, chatOpenState]);

  const handleCloseChat = () => {
    setChatOpenState("closed");
    setIsPreviewChatOpen(false);
  };

  const handleOpenChat = () => {
    setChatOpenState("open");
    setIsPreviewChatOpen(true);
  };

  const handleCollapseChat = () => {
    setChatOpenState("collapsed");
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setUserMessages(prev => [...prev, inputValue]);
    setInputValue("");
  };

  const renderBubbleIcon = (sizeClass = "w-5 h-5") => {
    switch (bubbleIcon) {
      case "Message":
        return <FiMessageSquare className={sizeClass} />;
      case "Chat":
        return <FiMessageCircle className={sizeClass} />;
      case "Support":
      default:
        return <HiOutlineChat className={sizeClass} />;
    }
  };

  return (
    <Card className="shadow-none border border-foreground/10 bg-white dark:bg-content1 rounded-xl p-4 md:p-5 h-full flex flex-col gap-3">
      <style>{`
        @keyframes float-bubble {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-float-bubble {
          animation: float-bubble 3s ease-in-out infinite;
        }
      `}</style>
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-bold text-foreground font-sans">Live Preview</span>
        <div className="flex gap-1 border border-foreground/10 rounded-lg p-0.5 bg-foreground/3 dark:bg-default-100/20">
          <button
            type="button"
            onClick={() => setPreviewMode("desktop")}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${previewMode === "desktop" ? "bg-background shadow-sm text-primary" : "text-default-400 hover:text-default-700"}`}
          >
            <FiMonitor className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode("mobile")}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${previewMode === "mobile" ? "bg-background shadow-sm text-primary" : "text-default-400 hover:text-default-700"}`}
          >
            <FiSmartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center w-full min-h-[420px] bg-foreground/3 dark:bg-default-100/10 rounded-xl p-3 md:p-4 transition-all duration-300 relative border border-foreground/5">
        <div
          className={`transition-all duration-300 relative overflow-hidden bg-[#f4f5f7] dark:bg-[#1a1f24] shadow-md border border-foreground/10 rounded-xl
            ${previewMode === "desktop"
              ? "w-full max-w-[550px] h-[550px]"
              : "w-[250px] sm:w-[400px] h-[550px]"
            }`}
        >
          <div className="p-4 space-y-4 select-none relative h-full overflow-hidden bg-transparent">
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="w-18 h-18 rounded-full bg-[#d1d5dc] dark:bg-default-300 mt-1" />
              <div className="space-y-1.5 w-full flex flex-col items-center">
                <div className="w-1/2 h-6 bg-[#d1d5dc] dark:bg-default-300 rounded" />
                <div className="w-2/3 h-4.5 bg-[#d1d5dc]/60 dark:bg-default-200 rounded" />
                <div className="w-1/3 h-4.5 bg-[#d1d5dc]/40 dark:bg-default-200 rounded" />
              </div>
              <div className="grid grid-cols-3 gap-2 w-full pt-4 px-1 mt-6">
                <div className="h-40 bg-[#d1d5dc]/50 dark:bg-default-200 rounded-lg" />
                <div className="h-40 bg-[#d1d5dc]/50 dark:bg-default-200 rounded-lg" />
                <div className="h-40 bg-[#d1d5dc]/50 dark:bg-default-200 rounded-lg" />
              </div>
            </div>

            {chatOpenState === "closed" && (
              <div
                className={`absolute z-30 transition-all duration-300 cursor-pointer flex items-center gap-2 animate-float-bubble group
                  ${widgetPosition === "bottom-right" ? "bottom-4 right-4" : "bottom-4 left-4"}`}
                onClick={handleOpenChat}
              >
                {previewMode === "desktop" && (
                  <div className="bg-background shadow-md border border-foreground/10 text-[10px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none font-sans">
                    {displayBubbleText}
                  </div>
                )}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white relative shadow-lg hover:scale-105 active:scale-95 transition-transform"
                  style={{ backgroundColor: primaryColor }}
                >
                  {renderBubbleIcon("w-6 h-6")}
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center text-[10px] font-bold font-sans">1</span>
                </div>
              </div>
            )}

            {chatOpenState === "open" && (
              <div
                className={`absolute z-40 bg-background shadow-2xl border border-foreground/10 flex flex-col transition-all duration-300
                  ${previewMode === "desktop"
                    ? `bottom-4 w-[calc(100%-32px)] max-w-[400px] h-[520px] rounded-xl ${widgetPosition === "bottom-right" ? "right-4" : "left-4"}`
                    : `bottom-2 w-[calc(100%-16px)] h-[440px] rounded-xl ${widgetPosition === "bottom-right" ? "right-2" : "left-2"}`
                  }`}
              >
                <div
                  className="px-3.5 py-2.5 text-white flex items-center justify-between rounded-t-xl"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="flex items-center gap-2">
                    {logoUrl && logoUrl.startsWith("http") ? (
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="w-6 h-6 rounded-full bg-white object-contain p-0.5 border border-white/20"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold font-sans"
                        style={{ color: primaryColor }}
                      >
                        {displayBusinessName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-[13px] font-extrabold truncate max-w-[140px] font-sans">{displayBusinessName}</span>
                      <span className="text-[10px] text-white/80 font-sans font-medium flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Online
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCollapseChat();
                      }}
                      className="text-white hover:bg-white/10 p-0.5 rounded text-[11px] cursor-pointer"
                      title="Minimize"
                    >
                      <FiMinimize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseChat();
                      }}
                      className="text-white hover:bg-white/10 p-0.5 rounded text-xs cursor-pointer flex items-center justify-center"
                      title="Close"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-2.5 overflow-hidden bg-[#fafafa] dark:bg-[#0f1214] flex flex-col justify-between rounded-b-xl">
                  {!isChatStarted ? (
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div className="bg-[#f0f7ff] dark:bg-primary-950/20 border border-[#cfe2ff] dark:border-primary-900/50 rounded-xl p-2.5 text-left space-y-1.5 font-sans">
                        <div className="flex items-center gap-1.5 text-primary font-bold">
                          <FiShield className="w-4 h-4 text-primary" />
                          <span className="text-[13px] font-sans">Before We Chat</span>
                        </div>
                        <p className="text-[11px] md:text-[9px] text-default-600 leading-normal font-sans">
                          We respect your privacy. Please do not share sensitive health information in this chat. For medical emergencies, call 911.
                        </p>
                        <div className="flex items-start gap-1.5 pt-0.5">
                          <input
                            type="checkbox"
                            id="consent-checkbox"
                            checked={isConsentChecked}
                            onChange={(e) => setIsConsentChecked(e.target.checked)}
                            className="w-5 h-5 rounded-xl cursor-pointer scale-75 text-primary border-foreground/10 focus:ring-primary"
                          />
                          <label htmlFor="consent-checkbox" className="text-[10px] md:text-[11px] text-default-500 leading-tight block select-none cursor-pointer font-sans">
                            I agree to the <a href={displayPrivacyPolicyUrl} target="_blank" rel="noreferrer" className="underline text-primary font-semibold">Privacy Policy</a> and understand this is not for medical emergencies.
                          </label>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full text-white font-bold h-10 rounded-lg text-[14px] font-sans mt-auto"
                        style={{ backgroundColor: primaryColor }}
                        isDisabled={!isConsentChecked}
                        onClick={() => setIsChatStarted(true)}
                      >
                        Start Chat
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full justify-between flex-1 space-y-3">
                      <div className="flex-1 overflow-y-auto space-y-3 pr-0.5 max-h-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex gap-1.5 items-center">
                          <div
                            className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white font-sans"
                            style={{ backgroundColor: primaryColor }}
                          >
                            {displayBusinessName.charAt(0).toUpperCase()}
                          </div>
                          <div className="bg-white dark:bg-[#1a1f24] border border-foreground/5 shadow-sm text-[11px] rounded-xl rounded-tl-none p-2 text-foreground leading-normal max-w-[84%] font-sans">
                            {displayWelcomeMessage}
                          </div>
                        </div>
                        {userMessages.map((msg, i) => (
                          <React.Fragment key={i}>
                            <div className="flex justify-end animate-in fade-in duration-200">
                              <div
                                className="text-white text-[10px] rounded-xl rounded-tr-none p-2 leading-normal max-w-[84%] font-sans shadow-sm"
                                style={{ backgroundColor: primaryColor }}
                              >
                                {msg}
                              </div>
                            </div>
                            <div className="flex gap-1.5 items-center animate-in fade-in duration-200">
                              <div
                                className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white font-sans"
                                style={{ backgroundColor: primaryColor }}
                              >
                                {displayBusinessName.charAt(0).toUpperCase()}
                              </div>
                              <div className="bg-white dark:bg-[#1a1f24] border border-foreground/5 shadow-sm text-[10px] rounded-xl rounded-tl-none p-2 text-foreground leading-normal max-w-[84%] font-sans">
                                Thanks for your message! A team member will respond shortly.
                              </div>
                            </div>
                          </React.Fragment>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                      <div className="border-t border-default-200 pt-3 flex-shrink-0 w-full overflow-x-hidden ">
                        <div className="flex items-center gap-2 bg-[#f4f5f7] dark:bg-default-100/10 rounded-full px-3 py-1.5 border border-foreground/5 shadow-sm">
                          <FiPaperclip className="w-3.5 h-3.5 text-default-400 cursor-pointer hover:text-default-600 flex-shrink-0" />
                          <input
                            type="text"
                            placeholder="Type your message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && inputValue.trim()) {
                                handleSendMessage();
                              }
                            }}
                            className="bg-transparent border-none text-[13px] w-full text-foreground outline-none font-sans font-normal py-1"
                          />
                          <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${inputValue.trim() ? "text-white cursor-pointer" : "text-default-600"
                              }`}
                            style={{ backgroundColor: inputValue.trim() ? primaryColor : "#60bae4ff" }}
                          >
                            <FiSend className="w-4 h-4 text-white transform rotate-45 mr-0.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-default-400 leading-tight text-center font-sans font-light select-none mt-1.5">
                          Powered by Practice ROI
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {chatOpenState === "collapsed" && (
              <div
                className={`absolute z-40 text-white flex items-center justify-between shadow-2xl transition-all duration-300 cursor-pointer rounded-t-xl px-4 py-2 h-10
                  ${previewMode === "desktop"
                    ? `bottom-0 w-[240px] ${widgetPosition === "bottom-right" ? "right-4" : "left-4"}`
                    : "bottom-0 left-4 right-4 w-full"
                  }`}
                style={{ backgroundColor: primaryColor }}
                onClick={handleOpenChat}
              >
                <div className="flex items-center gap-2">
                  {logoUrl && logoUrl.startsWith("http") ? (
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="w-5 h-5 rounded-full bg-white object-contain p-0.5"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[9px] font-bold font-sans"
                      style={{ color: primaryColor }}
                    >
                      {displayBusinessName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold truncate max-w-[100px] font-sans">{displayBusinessName}</span>
                    <span className="flex items-center gap-1 text-[8px] text-white/95 font-sans font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Online
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={handleOpenChat}
                    className="text-white hover:bg-white/10 p-0.5 rounded text-[11px] cursor-pointer"
                    title="Maximize"
                  >
                    <FiMaximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleCloseChat}
                    className="text-white hover:bg-white/10 p-0.5 rounded text-[11px] cursor-pointer flex items-center justify-center"
                    title="Close"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
