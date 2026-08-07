import { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  addToast,
} from "@heroui/react";
import {
  FiCopy,
  FiCheck,
  FiDownload,
  FiMail,
  FiCode,
  FiFileText,
  FiInfo,
  FiSend,
} from "react-icons/fi";
import { FaWordpress, FaShopify, FaWix } from "react-icons/fa";
import { LuGlobe } from "react-icons/lu";

const PLATFORMS = [
  { id: "WordPress", name: "WordPress", icon: FaWordpress, color: "text-[#21759b]" },
  { id: "Shopify", name: "Shopify", icon: FaShopify, color: "text-[#96bf48]" },
  { id: "Wix", name: "Wix", icon: FaWix, color: "text-foreground" },
  { id: "Webflow", name: "Webflow", icon: LuGlobe, color: "text-[#4353ff]" },
  { id: "Squarespace", name: "Squarespace", icon: FiFileText, color: "text-foreground" },
  { id: "Custom HTML", name: "Custom HTML", icon: FiCode, color: "text-primary" },
];

interface PlatformDetail {
  title: string;
  description: string;
  warningNotice: string;
  steps: string[];
}

const PLATFORM_INSTRUCTIONS: Record<string, PlatformDetail> = {
  WordPress: {
    title: "WordPress Installation Guide",
    description: "Follow these steps to deploy the chat widget to your WordPress site.",
    warningNotice: "This script configuration and installation guide are optimized specifically for WordPress. If deployed on another platform, instructions and theme file locations will differ.",
    steps: [
      "Copy the embed code snippet above by clicking the 'Copy' button.",
      "Log into your WordPress Admin Dashboard.",
      "Go to Plugins > Add New, search for 'Insert Headers and Footers' (or WPCode), then install & activate it.",
      "Navigate to Code Snippets > Header & Footer (or Settings > Insert Headers and Footers).",
      "Paste the code snippet into the 'Footer' section (directly before the closing </body> tag).",
      "Click 'Save Changes'. The chat widget will go live across all your WordPress pages.",
    ],
  },
  Shopify: {
    title: "Shopify Installation Guide",
    description: "Follow these steps to deploy the chat widget to your Shopify store.",
    warningNotice: "This script configuration and installation guide are optimized specifically for Shopify. Make sure to paste the script into your active theme.liquid file.",
    steps: [
      "Copy the embed code snippet above by clicking the 'Copy' button.",
      "Log into your Shopify Admin Dashboard and go to Online Store > Themes.",
      "Click the '...' (Actions) button next to your active theme and select 'Edit code'.",
      "In the left file browser under 'Layout', click 'theme.liquid'.",
      "Scroll to the bottom of the file and paste the snippet directly above the closing </body> tag.",
      "Click 'Save' in the top right corner. The widget will appear on your Shopify store.",
    ],
  },
  Wix: {
    title: "Wix Installation Guide",
    description: "Follow these steps to deploy the chat widget to your Wix website.",
    warningNotice: "This script configuration and installation guide are optimized specifically for Wix. Use Wix Custom Code settings in your site dashboard.",
    steps: [
      "Copy the embed code snippet above by clicking the 'Copy' button.",
      "Go to your Wix Site Dashboard and click 'Settings' in the left sidebar menu.",
      "Scroll down to the 'Advanced' section and click 'Custom Code'.",
      "Click '+ Add Custom Code' at the top right.",
      "Paste the embed code snippet into the code box.",
      "Under 'Place Code in', select 'Body - End'. Under 'Apply to All Pages', choose 'All Pages'.",
      "Click 'Apply'. Your Wix site is now active with the chat widget.",
    ],
  },
  Webflow: {
    title: "Webflow Installation Guide",
    description: "Follow these steps to deploy the chat widget to your Webflow project.",
    warningNotice: "This script configuration and installation guide are optimized specifically for Webflow. Add it under Project Settings > Custom Code.",
    steps: [
      "Copy the embed code snippet above by clicking the 'Copy' button.",
      "Open your Webflow Dashboard and select your project's Settings.",
      "Click on the 'Custom Code' tab.",
      "Scroll down to the 'Footer Code' box (before </body>).",
      "Paste the embed code snippet into the text area.",
      "Click 'Save Changes' and then 'Publish' your site to your active domains.",
    ],
  },
  Squarespace: {
    title: "Squarespace Installation Guide",
    description: "Follow these steps to deploy the chat widget to your Squarespace site.",
    warningNotice: "This script configuration and installation guide are optimized specifically for Squarespace. Paste the script into Code Injection > Footer.",
    steps: [
      "Copy the embed code snippet above by clicking the 'Copy' button.",
      "Log into your Squarespace account and open your site editor.",
      "Navigate to Website > Website Tools (or Settings) > Code Injection.",
      "Scroll down to the 'Footer' injection section.",
      "Paste the embed code snippet into the Footer text area.",
      "Click 'Save' at the top left. The chat widget is now active on your Squarespace site.",
    ],
  },
  "Custom HTML": {
    title: "Custom HTML / Standard Website Guide",
    description: "Follow these steps to deploy the chat widget on any custom HTML website.",
    warningNotice: "This embed snippet is compatible with any standard HTML5 website, custom web application, or CMS platform.",
    steps: [
      "Copy the embed code snippet above by clicking the 'Copy' button.",
      "Open your website's HTML source file (e.g., index.html or global footer template) in your editor.",
      "Locate the closing </body> tag near the bottom of your file.",
      "Paste the code snippet directly above the </body> tag.",
      "Save the file and upload/deploy the updated HTML file to your web server.",
    ],
  },
};

interface DeployStepProps {
  selectedPlatform: string;
  setSelectedPlatform: (val: string) => void;
  embedCodeSnippet: string;
  copiedCode: boolean;
  copyToClipboard: () => void;
}

export default function DeployStep({
  selectedPlatform,
  setSelectedPlatform,
  embedCodeSnippet,
  copiedCode,
  copyToClipboard,
}: DeployStepProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [emailError, setEmailError] = useState("");

  const DEFAULT_HTML_GUIDE: PlatformDetail = {
    title: "Custom HTML / Standard Website Guide",
    description: "Follow these steps to deploy the chat widget on any custom HTML website.",
    warningNotice: "This embed snippet is compatible with any standard HTML5 website, custom web application, or CMS platform.",
    steps: [
      "Copy the embed code snippet above by clicking the 'Copy' button.",
      "Open your website's HTML source file in your editor.",
      "Paste the code snippet directly above the closing </body> tag.",
      "Save and deploy the updated file to your server.",
    ],
  };

  const currentPlatformInfo: PlatformDetail =
    PLATFORM_INSTRUCTIONS[selectedPlatform] || PLATFORM_INSTRUCTIONS["Custom HTML"] || DEFAULT_HTML_GUIDE;

  // Download instructions file handler
  const handleDownloadDocumentation = () => {
    const info = currentPlatformInfo;
    const fileContent = `===================================================================
PRACTICE ROI CHAT WIDGET - DEPLOYMENT INSTRUCTIONS
Target Platform: ${selectedPlatform}
===================================================================

${info.title.toUpperCase()}
${info.description}

PLATFORM SPECIFICITY NOTICE:
${info.warningNotice}

-------------------------------------------------------------------
STEP-BY-STEP INSTALLATION INSTRUCTIONS:
-------------------------------------------------------------------
${info.steps.map((step, idx) => `${idx + 1}. ${step}`).join("\n\n")}

-------------------------------------------------------------------
EMBED CODE SNIPPET:
-------------------------------------------------------------------
${embedCodeSnippet}

-------------------------------------------------------------------
Need help? Contact support@practiceroi.com
===================================================================`;

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chat_widget_${selectedPlatform.toLowerCase().replace(/\s+/g, "_")}_instructions.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    try {
      addToast({
        title: "Documentation Downloaded",
        description: `Installation guide for ${selectedPlatform} downloaded.`,
        color: "success",
      });
    } catch (err) {
      console.log("Toast notification:", err);
    }
  };

  // Real-time email validation helper
  const validateEmail = (val: string): string => {
    const trimmed = val.trim();
    if (!trimmed) {
      return "Recipient email address is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const handleEmailChange = (val: string) => {
    setEmailAddress(val);
    setEmailError(validateEmail(val));
  };

  // Mailto or email dispatch handler
  const handleSendEmailInstructions = () => {
    const errorMsg = validateEmail(emailAddress);
    if (errorMsg) {
      setEmailError(errorMsg);
      return;
    }

    setEmailError("");

    const subject = encodeURIComponent(
      `Practice ROI Chat Widget Deployment Instructions for ${selectedPlatform}`
    );
    const bodyText = `Hi,

Here are the deployment instructions and code snippet for installing the Practice ROI Chat Widget on ${selectedPlatform}:

PLATFORM: ${selectedPlatform}

INSTALLATION STEPS:
${currentPlatformInfo.steps.map((step, idx) => `${idx + 1}. ${step}`).join("\n")}

EMBED CODE SNIPPET:
${embedCodeSnippet}

If you have any questions, please reach out to support@practiceroi.com.`;

    const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    window.open(mailtoUrl, "_blank");

    try {
      addToast({
        title: "Email Client Opened",
        description: `Instructions prepared for ${emailAddress}`,
        color: "success",
      });
    } catch (err) {
      console.log(err);
    }

    setIsEmailModalOpen(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200 font-sans">
      <div className="border-b border-foreground/5 pb-2">
        <h3 className="text-base font-bold text-foreground font-sans">Deploy Your Chat Widget</h3>
        <p className="text-xs text-default-500 mt-1 font-sans">
          Copy the embed code and add it to your website based on your selected platform.
        </p>
      </div>

      <div className="border border-success/20 bg-success-50/10 dark:bg-success-950/10 text-success rounded-lg p-3 text-xs flex items-center gap-2 font-sans font-medium">
        <FiCheck className="w-4 h-4 flex-shrink-0" />
        <span>
          Your widget is ready to deploy! Copy the code below and paste it before the closing &lt;/body&gt; tag on your website.
        </span>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-foreground/10 bg-[#0f172a] text-[#f8fafc] p-4 text-xs font-mono h-[420px] overflow-y-auto">
        <pre className="whitespace-pre-wrap">{embedCodeSnippet}</pre>
        <Button
          size="sm"
          onClick={copyToClipboard}
          className="absolute top-2.5 right-2.5 bg-background/25 hover:bg-background/45 text-white border border-white/20 h-8 min-w-[70px] rounded"
          startContent={
            copiedCode ? <FiCheck className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />
          }
        >
          {copiedCode ? "Copied" : "Copy"}
        </Button>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold text-default-600 block font-sans">
          Integration Platforms
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatform === platform.id;
            return (
              <div
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`border rounded-lg h-24 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all text-center active:scale-95 p-2
                  ${isSelected
                    ? "border-primary bg-primary-50/10 dark:bg-primary-950/20 font-bold shadow-sm ring-1 ring-primary"
                    : "border-foreground/10 text-default-500 hover:bg-foreground/5"
                  }`}
              >
                <Icon className={`w-7 h-7 ${platform.color}`} />
                <span className="text-[10px] truncate max-w-full font-semibold font-sans">
                  {platform.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Specificity Alert Notice */}
      <div className="border border-blue-200 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 rounded-xl p-3.5 text-xs flex items-start gap-2.5 font-sans">
        <FiInfo className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Platform Notice ({selectedPlatform}): </span>
          <span>{currentPlatformInfo.warningNotice}</span>
        </div>
      </div>

      {/* Dynamic Installation Instructions */}
      <div className="border border-foreground/10 bg-foreground/5 dark:bg-default-100/10 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-foreground/5 pb-2">
          <h4 className="text-xs font-bold text-foreground font-sans">
            {currentPlatformInfo.title}
          </h4>
          <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {selectedPlatform} Optimized
          </span>
        </div>
        <p className="text-xs text-default-500 font-sans">{currentPlatformInfo.description}</p>

        <div className="space-y-3">
          {currentPlatformInfo.steps.map((stepText, idx) => (
            <div key={idx} className="flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0 font-sans mt-0.5">
                {idx + 1}
              </div>
              <span className="text-xs text-default-700 font-sans font-medium leading-relaxed">
                {stepText}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Download & Email Actions */}
      <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
        <Button
          variant="bordered"
          onClick={handleDownloadDocumentation}
          className="border-foreground/10 font-semibold flex-1 rounded-lg font-sans text-xs h-9 cursor-pointer hover:bg-foreground/5"
          startContent={<FiDownload className="w-4 h-4 text-primary" />}
        >
          Download Instructions (.txt)
        </Button>
        <Button
          variant="bordered"
          onClick={() => setIsEmailModalOpen(true)}
          className="border-foreground/10 font-semibold flex-1 rounded-lg font-sans text-xs h-9 cursor-pointer hover:bg-foreground/5"
          startContent={<FiMail className="w-4 h-4 text-primary" />}
        >
          Email Instructions
        </Button>
      </div>

      {/* Email Instructions Modal */}
      <Modal
        isOpen={isEmailModalOpen}
        onOpenChange={setIsEmailModalOpen}
        size="lg"
        classNames={{
          base: "max-sm:!m-3 !m-0 bg-background border border-foreground/10 text-foreground rounded-2xl shadow-xl overflow-hidden font-sans",
          closeButton: "cursor-pointer text-foreground/50 hover:text-foreground top-4 right-4 z-20 p-1.5 rounded-full hover:bg-foreground/5 transition-all",
        }}
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-3 p-5 pb-3 border-b border-foreground/5 font-sans">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <FiMail className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-foreground">
                  Email Installation Guide
                </h3>
                <span className="text-[10px] font-bold bg-primary-50 dark:bg-primary-950/40 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {selectedPlatform}
                </span>
              </div>
              <p className="text-xs text-default-500 font-normal mt-0.5">
                Send instructions and embed code directly to your web developer or team member.
              </p>
            </div>
          </ModalHeader>

          <ModalBody className="p-5 space-y-4 font-sans">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/90 block">
                Developer / Recipient Email Address <span className="text-danger">*</span>
              </label>
              <Input
                type="email"
                placeholder="e.g. example@practiceroi.com"
                value={emailAddress}
                onValueChange={handleEmailChange}
                size="sm"
                variant="bordered"
                isInvalid={!!emailError}
                startContent={<FiMail className="w-4 h-4 text-primary flex-shrink-0" />}
                classNames={{
                  inputWrapper: `border-foreground/15 hover:border-primary focus-within:!border-primary rounded-lg h-10 shadow-2xs bg-background ${emailError ? "!border-danger" : ""
                    }`,
                  input: "text-xs font-medium",
                }}
              />
              {emailError && (
                <span className="text-[11px] text-danger font-medium flex items-center gap-1 mt-1 font-sans">
                  • {emailError}
                </span>
              )}
            </div>

            {/* Clean Instructions Package Preview */}
            <div className="rounded-xl border border-foreground/10 bg-default-50/50 dark:bg-default-100/10 p-4 space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-foreground/5 pb-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 font-sans">
                  <FiCheck className="w-4 h-4 text-success" />
                  Deployment Guide Package ({selectedPlatform})
                </span>
                <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans">
                  Complete Setup
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans">
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-background border border-foreground/5 shadow-2xs">
                  <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Step-by-Step Guide</p>
                    <p className="text-[11px] text-default-500 mt-0.5">
                      {currentPlatformInfo.steps.length} tailored instructions for {selectedPlatform}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-background border border-foreground/5 shadow-2xs">
                  <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiCode className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">HTML Embed Code</p>
                    <p className="text-[11px] text-default-500 mt-0.5">
                      Full production JavaScript code snippet
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-foreground/5 space-y-1.5 font-sans">
                <span className="text-[10px] font-bold text-default-400 uppercase tracking-wider block">
                  Installation Steps Overview:
                </span>
                <div className="space-y-1.5 text-xs text-default-700 font-medium">
                  {currentPlatformInfo.steps.map((stepText, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="font-bold text-primary text-[11px] min-w-[16px]">
                        {idx + 1}.
                      </span>
                      <span className="text-xs text-default-700 leading-snug">
                        {stepText}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="p-5 pt-3 flex gap-3 justify-end border-t border-foreground/5 bg-background">
            <Button
              variant="bordered"
              size="sm"
              onClick={() => {
                setIsEmailModalOpen(false);
                setEmailError("");
              }}
              className="border-foreground/15 hover:bg-foreground/5 rounded-lg text-xs font-semibold h-9 px-4 cursor-pointer font-sans"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              size="sm"
              onClick={handleSendEmailInstructions}
              startContent={<FiSend className="w-3.5 h-3.5" />}
              className="bg-primary hover:bg-primary-600 rounded-lg text-xs font-bold h-9 px-5 text-white cursor-pointer font-sans shadow-sm"
            >
              Send Instructions
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
