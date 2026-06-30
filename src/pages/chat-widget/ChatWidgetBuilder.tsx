import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, Button, addToast } from "@heroui/react";
import { FiArrowLeft, FiCheckCircle, FiPlay } from "react-icons/fi";
import { LuChevronRight } from "react-icons/lu";
import ComponentContainer from "../../components/common/ComponentContainer";
import ChatWidgetStats from "./components/ChatWidgetStats";
import SetupStepper from "./components/SetupStepper";
import BrandingStep from "./components/BrandingStep";
import MessagesStep from "./components/MessagesStep";
import SmsSetupStep from "./components/SmsSetupStep";
import PrivacyComplianceStep from "./components/PrivacyComplianceStep";
import DeployStep from "./components/DeployStep";
import LivePreview from "./components/LivePreview";
import { fetchChatWidgetConfig, saveChatWidgetConfig, fetchChatWidgetStats } from "../../services/chatWidget";

export default function ChatWidgetBuilder() {
  const currentUserId = useSelector((state: any) => state.auth.user?.userId);
  const [activeStep, setActiveStep] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [initialConfig, setInitialConfig] = useState<any>(null);
  const [userId, setUserId] = useState("");
  const [stats, setStats] = useState({
    activeWebsites: 0,
    totalConversations: 0,
    smsOptIns: 0,
    avgResponseTime: "2.3m"
  });
  const [businessName, setBusinessName] = useState("");

  const checkHasChanges = (payload: any) => {
    if (!initialConfig) return true;
    const keys = Object.keys(payload);
    for (const key of keys) {
      let val1 = payload[key];
      let val2 = initialConfig[key];
      if (typeof val1 === "number" && typeof val2 === "string") {
        val2 = Number(val2);
      } else if (typeof val1 === "string" && typeof val2 === "number") {
        val1 = Number(val1);
      }
      if (val1 !== val2) {
        return true;
      }
    }
    return false;
  };
  const [bubbleText, setBubbleText] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#0ea5e9");
  const [widgetPosition, setWidgetPosition] = useState("bottom-right");
  const [bubbleIcon, setBubbleIcon] = useState("Message");
  const [logoUrl, setLogoUrl] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [welcomeDelay, setWelcomeDelay] = useState("");
  const [enableAutoReply, setEnableAutoReply] = useState(true);
  const [autoReplyMessage, setAutoReplyMessage] = useState("");
  const [offlineMessage, setOfflineMessage] = useState("");
  const [workingHours, setWorkingHours] = useState(true);
  const [enableSmsTransition, setEnableSmsTransition] = useState(true);
  const [smsPromptMessage, setSmsPromptMessage] = useState("");
  const [smsConsentText, setSmsConsentText] = useState("");
  const [triggerAfterMessages, setTriggerAfterMessages] = useState(true);
  const [triggerOnScheduling, setTriggerOnScheduling] = useState(true);
  const [triggerImmediately, setTriggerImmediately] = useState(false);
  const [hipaaMode, setHipaaMode] = useState(true);
  const [requirePatientConsent, setRequirePatientConsent] = useState(true);
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState("");
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState("");
  const [requireName, setRequireName] = useState(true);
  const [requireEmail, setRequireEmail] = useState(true);
  const [requirePhone, setRequirePhone] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState("WordPress");
  const [copiedCode, setCopiedCode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string): string => {
    let error = "";
    switch (name) {
      case "businessName":
        if (!value.trim()) error = "Business Name is required";
        break;
      case "bubbleText":
        if (!value.trim()) error = "Bubble Text is required";
        break;
      case "welcomeMessage":
        if (!value.trim()) error = "Welcome Message is required";
        break;
      case "welcomeDelay":
        if (!value.trim()) {
          error = "Welcome Delay is required";
        } else if (isNaN(Number(value)) || Number(value) < 0) {
          error = "Delay must be a valid number >= 0";
        }
        break;
      case "autoReplyMessage":
        if (enableAutoReply && !value.trim()) {
          error = "Auto-Reply Message is required";
        }
        break;
      case "offlineMessage":
        if (!value.trim()) error = "Offline Message is required";
        break;
      case "smsPromptMessage":
        if (enableSmsTransition && !value.trim()) {
          error = "SMS Prompt Message is required";
        }
        break;
      case "smsConsentText":
        if (enableSmsTransition && !value.trim()) {
          error = "SMS Consent Text is required";
        }
        break;
      case "privacyPolicyUrl":
        if (requirePatientConsent) {
          if (!value.trim()) {
            error = "Privacy Policy URL is required";
          } else {
            try {
              new URL(value);
            } catch (e) {
              error = "Please enter a valid URL (e.g., https://example.com)";
            }
          }
        }
        break;
      case "dataRetentionPeriod":
        if (!value.trim()) {
          error = "Data Retention Period is required";
        } else if (isNaN(Number(value)) || Number(value) < 1) {
          error = "Retention period must be a valid number >= 1";
        }
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleInputChange = (name: string, value: string, setter: (val: string) => void) => {
    setter(value);
    validateField(name, value);
  };

  const validateStep = (stepIdx: number): boolean => {
    let isValid = true;
    if (stepIdx === 0) {
      const e1 = validateField("businessName", businessName);
      const e2 = validateField("bubbleText", bubbleText);
      if (e1 || e2) isValid = false;
    } else if (stepIdx === 1) {
      const e1 = validateField("welcomeMessage", welcomeMessage);
      const e2 = validateField("welcomeDelay", welcomeDelay);
      const e3 = validateField("offlineMessage", offlineMessage);
      let e4 = "";
      if (enableAutoReply) {
        e4 = validateField("autoReplyMessage", autoReplyMessage);
      }
      if (e1 || e2 || e3 || e4) isValid = false;
    } else if (stepIdx === 2) {
      if (enableSmsTransition) {
        const e1 = validateField("smsPromptMessage", smsPromptMessage);
        const e2 = validateField("smsConsentText", smsConsentText);
        if (e1 || e2) isValid = false;
      }
    } else if (stepIdx === 3) {
      if (requirePatientConsent) {
        const e1 = validateField("privacyPolicyUrl", privacyPolicyUrl);
        if (e1) isValid = false;
      }
      const e2 = validateField("dataRetentionPeriod", dataRetentionPeriod);
      if (e2) isValid = false;
    }
    return isValid;
  };

  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [isPreviewChatOpen, setIsPreviewChatOpen] = useState(false);

  useEffect(() => {
    if (copiedCode) {
      const timer = setTimeout(() => setCopiedCode(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedCode]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetchChatWidgetConfig();
        if (res && res.data) {
          const config = res.data;
          setIsPublished(true);
          setUserId(config.userId || "");
          setBusinessName(config.businessName || "");
          setBubbleText(config.bubbleText || "");
          setPrimaryColor(config.primaryColor || "#0ea5e9");
          setWidgetPosition(config.widgetPosition || "bottom-right");
          setBubbleIcon(config.bubbleIcon || "Message");
          setLogoUrl(config.logoUrl || "");
          setWelcomeMessage(config.welcomeMessage || "");
          setWelcomeDelay(config.welcomeDelay?.toString() || "");
          setEnableAutoReply(config.enableAutoReply !== false);
          setAutoReplyMessage(config.autoReplyMessage || "");
          setOfflineMessage(config.offlineMessage || "");
          setWorkingHours(config.workingHours !== false);
          setEnableSmsTransition(config.enableSmsTransition !== false);
          setSmsPromptMessage(config.smsPromptMessage || "");
          setSmsConsentText(config.smsConsentText || "");
          setTriggerAfterMessages(config.triggerAfterMessages !== false);
          setTriggerOnScheduling(config.triggerOnScheduling !== false);
          setTriggerImmediately(!!config.triggerImmediately);
          setHipaaMode(config.hipaaMode !== false);
          setRequirePatientConsent(config.requirePatientConsent !== false);
          setPrivacyPolicyUrl(config.privacyPolicyUrl || "");
          setDataRetentionPeriod(config.dataRetentionPeriod?.toString() || "");
          setRequireName(config.requireName !== false);
          setRequireEmail(config.requireEmail !== false);
          setRequirePhone(config.requirePhone !== false);
          setSelectedPlatform(config.selectedPlatform || "WordPress");

          setActiveStep(4);
          setIsEditing(false);
          setInitialConfig({
            businessName: config.businessName || "",
            bubbleText: config.bubbleText || "",
            primaryColor: config.primaryColor || "#0ea5e9",
            widgetPosition: config.widgetPosition || "bottom-right",
            bubbleIcon: config.bubbleIcon || "Message",
            logoUrl: config.logoUrl || "",
            welcomeMessage: config.welcomeMessage || "",
            welcomeDelay: config.welcomeDelay || 0,
            enableAutoReply: config.enableAutoReply !== false,
            autoReplyMessage: config.autoReplyMessage || "",
            offlineMessage: config.offlineMessage || "",
            workingHours: config.workingHours !== false,
            enableSmsTransition: config.enableSmsTransition !== false,
            smsPromptMessage: config.smsPromptMessage || "",
            smsConsentText: config.smsConsentText || "",
            triggerAfterMessages: config.triggerAfterMessages !== false,
            triggerOnScheduling: config.triggerOnScheduling !== false,
            triggerImmediately: !!config.triggerImmediately,
            hipaaMode: config.hipaaMode !== false,
            requirePatientConsent: config.requirePatientConsent !== false,
            privacyPolicyUrl: config.privacyPolicyUrl || "",
            dataRetentionPeriod: config.dataRetentionPeriod || 0,
            requireName: config.requireName !== false,
            requireEmail: config.requireEmail !== false,
            requirePhone: config.requirePhone !== false,
            selectedPlatform: config.selectedPlatform || "WordPress",
          });
        }
      } catch (err: any) {
        if (err.response?.status !== 404) {
          addToast({
            title: "Error loading config",
            description: err.response?.data?.message || err.message,
            color: "danger"
          });
        }
      }
    };
    const loadStats = async () => {
      try {
        const res = await fetchChatWidgetStats();
        if (res && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    };
    loadConfig();
    loadStats();
  }, []);

  const steps = [
    { name: "Branding", desc: "Customize branding & colors" },
    { name: "Messages", desc: "Configure greetings" },
    { name: "SMS Setup", desc: "SMS transition settings" },
    { name: "Privacy & Compliance", desc: "Security & HIPAA settings" },
    { name: "Deploy", desc: "Deploy your chat widget" }
  ];

  const handlePublishWidget = async () => {
    if (!validateStep(activeStep)) {
      return;
    }
    const payload = {
      businessName,
      bubbleText,
      primaryColor,
      widgetPosition,
      bubbleIcon,
      logoUrl,
      welcomeMessage,
      welcomeDelay: Number(welcomeDelay),
      enableAutoReply,
      autoReplyMessage,
      offlineMessage,
      workingHours,
      enableSmsTransition,
      smsPromptMessage,
      smsConsentText,
      triggerAfterMessages,
      triggerOnScheduling,
      triggerImmediately,
      hipaaMode,
      requirePatientConsent,
      privacyPolicyUrl,
      dataRetentionPeriod: Number(dataRetentionPeriod),
      requireName,
      requireEmail,
      requirePhone,
      selectedPlatform,
    };

    if (isPublished) {
      const hasChanges = checkHasChanges(payload);
      if (!hasChanges) {
        addToast({
          title: "No changes detected",
          description: "No modifications were found to update.",
          color: "warning"
        });
        setIsEditing(false);
        setActiveStep(4);
        return;
      }
    }

    try {
      await saveChatWidgetConfig(payload);
      setIsPublished(true);
      setIsEditing(false);
      setInitialConfig(payload);
      setActiveStep(4);

      const res = await fetchChatWidgetConfig();
      if (res && res.data) {
        setUserId(res.data.userId || "");
      }
      const statsRes = await fetchChatWidgetStats();
      if (statsRes && statsRes.data) {
        setStats(statsRes.data);
      }

      addToast({
        title: "Widget Published!",
        description: "Your chat widget configurations have been saved and deployed live.",
        color: "success"
      });
    } catch (err: any) {
      addToast({
        title: "Failed to publish widget",
        description: err.response?.data?.message || err.message || "An error occurred",
        color: "danger"
      });
    }
  };

  const rawApiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:9090/api";
  const backendUrl = rawApiUrl.startsWith("http")
    ? rawApiUrl.replace(/\/api$/, "")
    : `${window.location.origin}${rawApiUrl}`.replace(/\/api$/, "");

  const embedCodeSnippet = `<!-- Practice ROI Chat Widget -->
<script>
window.practiceROIConfig = {
  "userId": "${userId || currentUserId || ""}",
  "primaryColor": "${primaryColor}",
  "position": "${widgetPosition}",
  "bubbleIcon": "${bubbleIcon.toLowerCase()}",
  "bubbleText": "${bubbleText || "Chat with us"}",
  "businessName": "${businessName || "Practice ROI"}",
  "welcomeMessage": "${welcomeMessage || "Hi there! 👋 How can we help you today?"}",
  "welcomeDelay": ${welcomeDelay ? Number(welcomeDelay) : 2},
  "enableSMSTransition": ${enableSmsTransition},
  "smsPromptMessage": "${smsPromptMessage || "Would you like to continue this conversation via text message? It's more convenient and you'll get faster responses!"}",
  "smsConsentText": "${smsConsentText || "By providing your phone number, you consent to receive text messages from our practice. Message and data rates may apply. Reply STOP to opt out at any time."}",
  "autoReply": ${enableAutoReply},
  "autoReplyMessage": "${autoReplyMessage || "Thanks for reaching out! A team member will respond shortly. Our typical response time is under 5 minutes during business hours."}",
  "offlineMessage": "${offlineMessage || "We're currently offline. Leave us a message and we'll get back to you as soon as possible!"}",
  "workingHours": {
    "enabled": ${workingHours},
    "timezone": "America/Denver",
    "schedule": {
      "monday": { "start": "09:00", "end": "17:00", "enabled": true },
      "tuesday": { "start": "09:00", "end": "17:00", "enabled": true },
      "wednesday": { "start": "09:00", "end": "17:00", "enabled": true },
      "thursday": { "start": "09:00", "end": "17:00", "enabled": true },
      "friday": { "start": "09:00", "end": "17:00", "enabled": true },
      "saturday": { "start": "09:00", "end": "13:00", "enabled": false },
      "sunday": { "start": "09:00", "end": "13:00", "enabled": false }
    }
  },
  "hipaaCompliant": ${hipaaMode},
  "requireConsent": ${requirePatientConsent},
  "privacyPolicyUrl": "${privacyPolicyUrl || "https://practiceroi.com/privacy"}",
  "dataRetentionDays": ${dataRetentionPeriod ? Number(dataRetentionPeriod) : 90},
  "customCSS": "",
  "allowFileUpload": false,
  "collectEmail": ${requireEmail},
  "collectPhone": ${requirePhone},
  "requiredFields": [
    "name"
  ]
};
</script>
<script src="${backendUrl}/chat-widget.js" async></script>
<!-- End Practice ROI Chat Widget -->`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setCopiedCode(true);
    addToast({
      title: "Copied!",
      description: "Code snippet copied to clipboard.",
      color: "success"
    });
  };

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
      } else {
        handlePublishWidget();
      }
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const headingData = {
    heading: "Chat Widget Builder",
    subHeading: "Configure and deploy your HIPAA-compliant patient chat widget",
    buttons: isPublished
      ? [
        {
          label: "Published",
          onClick: undefined,
          variant: "solid" as const,
          color: "success" as const,
          icon: <FiCheckCircle className="w-4 h-4 text-white" />,
          className: "bg-emerald-500 text-white cursor-default hover:bg-emerald-500 active:bg-emerald-500 pointer-events-none"
        },
        {
          label: "Update Widget",
          onClick: () => {
            setActiveStep(0);
            setIsEditing(true);
          },
          variant: "solid" as const,
          color: "primary" as const,
          icon: <FiPlay className="w-4 h-4 text-white" />
        }
      ]
      : [
        {
          label: "Publish Widget",
          onClick: handlePublishWidget,
          variant: "solid" as const,
          color: "primary" as const
        }
      ]
  };

  return (
    <ComponentContainer headingData={headingData}>
      <ChatWidgetStats stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full mt-2 items-start">
        <div className="lg:col-span-7 flex flex-col gap-5">
          <Card className="shadow-none border border-foreground/10 bg-white dark:bg-content1 rounded-xl p-5 md:p-6">
            <SetupStepper
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              isPublished={isPublished}
            />
            <div className="min-h-[360px]">
              {activeStep === 0 && (
                <BrandingStep
                  businessName={businessName}
                  setBusinessName={setBusinessName}
                  bubbleText={bubbleText}
                  setBubbleText={setBubbleText}
                  primaryColor={primaryColor}
                  setPrimaryColor={setPrimaryColor}
                  widgetPosition={widgetPosition}
                  setWidgetPosition={setWidgetPosition}
                  bubbleIcon={bubbleIcon}
                  setBubbleIcon={setBubbleIcon}
                  logoUrl={logoUrl}
                  setLogoUrl={setLogoUrl}
                  errors={errors}
                  handleInputChange={handleInputChange}
                />
              )}

              {activeStep === 1 && (
                <MessagesStep
                  welcomeMessage={welcomeMessage}
                  setWelcomeMessage={setWelcomeMessage}
                  welcomeDelay={welcomeDelay}
                  setWelcomeDelay={setWelcomeDelay}
                  enableAutoReply={enableAutoReply}
                  setEnableAutoReply={setEnableAutoReply}
                  autoReplyMessage={autoReplyMessage}
                  setAutoReplyMessage={setAutoReplyMessage}
                  offlineMessage={offlineMessage}
                  setOfflineMessage={setOfflineMessage}
                  workingHours={workingHours}
                  setWorkingHours={setWorkingHours}
                  errors={errors}
                  handleInputChange={handleInputChange}
                />
              )}

              {activeStep === 2 && (
                <SmsSetupStep
                  enableSmsTransition={enableSmsTransition}
                  setEnableSmsTransition={setEnableSmsTransition}
                  smsPromptMessage={smsPromptMessage}
                  setSmsPromptMessage={setSmsPromptMessage}
                  smsConsentText={smsConsentText}
                  setSmsConsentText={setSmsConsentText}
                  triggerAfterMessages={triggerAfterMessages}
                  setTriggerAfterMessages={setTriggerAfterMessages}
                  triggerOnScheduling={triggerOnScheduling}
                  setTriggerOnScheduling={setTriggerOnScheduling}
                  triggerImmediately={triggerImmediately}
                  setTriggerImmediately={setTriggerImmediately}
                  errors={errors}
                  handleInputChange={handleInputChange}
                />
              )}

              {activeStep === 3 && (
                <PrivacyComplianceStep
                  hipaaMode={hipaaMode}
                  setHipaaMode={setHipaaMode}
                  requirePatientConsent={requirePatientConsent}
                  setRequirePatientConsent={setRequirePatientConsent}
                  privacyPolicyUrl={privacyPolicyUrl}
                  setPrivacyPolicyUrl={setPrivacyPolicyUrl}
                  dataRetentionPeriod={dataRetentionPeriod}
                  setDataRetentionPeriod={setDataRetentionPeriod}
                  requireName={requireName}
                  requireEmail={requireEmail}
                  setRequireEmail={setRequireEmail}
                  requirePhone={requirePhone}
                  setRequirePhone={setRequirePhone}
                  errors={errors}
                  handleInputChange={handleInputChange}
                />
              )}

              {activeStep === 4 && (
                <DeployStep
                  selectedPlatform={selectedPlatform}
                  setSelectedPlatform={setSelectedPlatform}
                  embedCodeSnippet={embedCodeSnippet}
                  copiedCode={copiedCode}
                  copyToClipboard={copyToClipboard}
                />
              )}
            </div>

            <div className="flex justify-between items-center mt-8 pt-4 border-t border-foreground/5">
              <Button
                variant="bordered"
                onClick={handlePrevStep}
                isDisabled={activeStep === 0}
                className="border-foreground/10 rounded-lg text-default-700 font-semibold h-10 px-4 text-xs font-sans cursor-pointer"
                startContent={<FiArrowLeft className="w-3.5 h-3.5" />}
              >
                Previous
              </Button>
              {activeStep === steps.length - 1 ? (
                isPublished && !isEditing ? (
                  <Button
                    variant="solid"
                    color="success"
                    className="bg-emerald-500 text-white cursor-default rounded-lg font-bold h-10 px-5 text-xs font-sans pointer-events-none"
                    startContent={<FiCheckCircle className="w-3.5 h-3.5 text-white" />}
                  >
                    Published
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    onClick={handlePublishWidget}
                    className="rounded-lg text-white font-bold h-10 px-5 text-xs shadow-sm shadow-primary/20 dark:shadow-none font-sans cursor-pointer"
                    startContent={isPublished ? <FiPlay className="w-3.5 h-3.5 text-white" /> : undefined}
                  >
                    {isPublished ? "Update Widget" : "Publish Widget"}
                  </Button>
                )
              ) : (
                <Button
                  color="primary"
                  onClick={handleNextStep}
                  className="rounded-lg text-white font-bold h-10 px-5 text-xs shadow-sm shadow-primary/20 dark:shadow-none font-sans cursor-pointer"
                >
                  Next Step
                  <LuChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 h-[700px]">
          <LivePreview
            previewMode={previewMode}
            setPreviewMode={setPreviewMode}
            businessName={businessName}
            bubbleText={bubbleText}
            primaryColor={primaryColor}
            widgetPosition={widgetPosition}
            bubbleIcon={bubbleIcon}
            logoUrl={logoUrl}
            welcomeMessage={welcomeMessage}
            enableAutoReply={enableAutoReply}
            autoReplyMessage={autoReplyMessage}
            enableSmsTransition={enableSmsTransition}
            smsPromptMessage={smsPromptMessage}
            smsConsentText={smsConsentText}
            requirePatientConsent={requirePatientConsent}
            privacyPolicyUrl={privacyPolicyUrl}
            requireEmail={requireEmail}
            requirePhone={requirePhone}
            hipaaMode={hipaaMode}
            workingHours={workingHours}
            isPreviewChatOpen={isPreviewChatOpen}
            setIsPreviewChatOpen={setIsPreviewChatOpen}
          />
        </div>
      </div>
    </ComponentContainer>
  );
}
