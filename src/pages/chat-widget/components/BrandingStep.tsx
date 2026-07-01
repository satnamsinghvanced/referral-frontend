import { useState } from "react";
import { Input, Select, SelectItem, Tooltip, Button, Spinner } from "@heroui/react";
import { FiMessageSquare, FiMessageCircle, FiUploadCloud, FiTrash2, FiImage } from "react-icons/fi";
import { HiOutlineChat } from "react-icons/hi";
import axios from "../../../services/axios";
import GalleryMediaUploadModal from "../../media-management/modal/GalleryMediaUploadModal";
import { Media } from "../../../types/media";

const COLOR_PRESETS = [
  { value: "#0ea5e9", label: "Sky Blue", class: "bg-[#0ea5e9]" },
  { value: "#10b981", label: "Emerald Green", class: "bg-[#10b981]" },
  { value: "#8b5cf6", label: "Violet Purple", class: "bg-[#8b5cf6]" },
  { value: "#f97316", label: "Orange Practice", class: "bg-[#f97316]" }
];

interface BrandingStepProps {
  businessName: string;
  setBusinessName: (val: string) => void;
  bubbleText: string;
  setBubbleText: (val: string) => void;
  primaryColor: string;
  setPrimaryColor: (val: string) => void;
  widgetPosition: string;
  setWidgetPosition: (val: string) => void;
  bubbleIcon: string;
  setBubbleIcon: (val: string) => void;
  logoUrl: string;
  setLogoUrl: (val: string) => void;
  errors: Record<string, string>;
  handleInputChange: (name: string, value: string, setter: (val: string) => void) => void;
}

export default function BrandingStep({
  businessName,
  setBusinessName,
  bubbleText,
  setBubbleText,
  primaryColor,
  setPrimaryColor,
  widgetPosition,
  setWidgetPosition,
  bubbleIcon,
  setBubbleIcon,
  logoUrl,
  setLogoUrl,
  errors,
  handleInputChange
}: BrandingStepProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="pb-2">
        <h3 className="text-base font-bold text-foreground font-sans">Customize Your Widget Branding</h3>
        <p className="text-xs text-default-500 mt-1 font-sans">Personalize the look and feel of your chat widget to match your practice brand.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-xs font-bold text-default-700 block mb-1.5 font-sans">
            Business Name <span className="text-danger">*</span>
          </label>
          <Input
            placeholder="e.g. Practice ROI"
            value={businessName}
            onValueChange={(val) => handleInputChange("businessName", val, setBusinessName)}
            variant="flat"
            classNames={{ inputWrapper: "bg-default-100/50 hover:bg-default-100 border-none shadow-none rounded-lg" }}
            isInvalid={!!errors.businessName}
            errorMessage={errors.businessName}
            aria-label="Business Name"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-bold text-default-700 block mb-1.5 font-sans">
            Bubble Text <span className="text-danger">*</span>
          </label>
          <Input
            placeholder="e.g. Chat with us"
            value={bubbleText}
            onValueChange={(val) => handleInputChange("bubbleText", val, setBubbleText)}
            variant="flat"
            classNames={{ inputWrapper: "bg-default-100/50 hover:bg-default-100 border-none shadow-none rounded-lg" }}
            isInvalid={!!errors.bubbleText}
            errorMessage={errors.bubbleText}
            aria-label="Bubble Text"
          />
        </div>
      </div>
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-default-700 block font-sans">Primary Color</label>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="size-8 rounded border border-foreground/20 cursor-pointer relative flex-shrink-0"
              style={{ backgroundColor: primaryColor || "#0ea5e9" }}
            >
              <input
                type="color"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                value={primaryColor || "#0ea5e9"}
                onChange={(e) => handleInputChange("primaryColor", e.target.value, setPrimaryColor)}
              />
            </div>
            <Input
              size="sm"
              variant="flat"
              classNames={{ inputWrapper: "bg-default-100/50 hover:bg-default-100 border-none shadow-none rounded-lg" }}
              value={primaryColor}
              onValueChange={(val) => handleInputChange("primaryColor", val, setPrimaryColor)}
              className="max-w-[100px]"
              placeholder="#0ea5e9"
              aria-label="Primary Color Hex"
            />
          </div>
          <div className="flex items-center gap-2">
            {COLOR_PRESETS.map((preset, i) => (
              <Tooltip key={i} content={preset.label} shadow="sm">
                <button
                  type="button"
                  onClick={() => handleInputChange("primaryColor", preset.value, setPrimaryColor)}
                  className={`w-8 h-8 rounded-lg cursor-pointer border-2 transition-transform active:scale-95 ${preset.class} 
                    ${primaryColor.toLowerCase() === preset.value.toLowerCase() ? "border-foreground scale-105 shadow-sm" : "border-transparent"}`}
                />
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-xs font-bold text-default-700 block mb-1.5 font-sans">Widget Position</label>
          <Select
            selectedKeys={[widgetPosition]}
            onSelectionChange={(keys) => setWidgetPosition(Array.from(keys)[0] as string)}
            variant="flat"
            classNames={{ trigger: "bg-default-100/50 hover:bg-default-100 border-none shadow-none rounded-lg" }}
            aria-label="Widget Position"
          >
            <SelectItem key="bottom-right" textValue="Bottom Right">Bottom Right</SelectItem>
            <SelectItem key="bottom-left" textValue="Bottom Left">Bottom Left</SelectItem>
          </Select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-bold text-default-700 block mb-1.5 font-sans">Business Logo (Optional)</label>
          <div className="flex gap-2 items-center">
            {logoUrl && (
              <div className="relative w-10 h-10 rounded-lg bg-white border border-default-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm animate-in fade-in zoom-in duration-200">
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="w-full h-full object-contain p-0.5"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/100?text=Error";
                  }}
                />
              </div>
            )}
            <Input
              placeholder="e.g. https://yourwebsite.com/logo.png"
              value={logoUrl}
              onValueChange={(val) => setLogoUrl(val)}
              variant="flat"
              classNames={{ inputWrapper: "bg-default-100/50 hover:bg-default-100 border-none shadow-none rounded-lg flex-1" }}
              aria-label="Business Logo URL"
            />
            <span className="text-xs text-default-400 font-sans font-medium px-1 select-none">or</span>
            <Button
              variant="bordered"
              className="border border-default-300 bg-transparent text-black dark:text-white hover:bg-default-100 font-bold text-xs h-10 flex-shrink-0"
              onClick={() => setIsGalleryOpen(true)}
            >
              Upload Logo
            </Button>
            {logoUrl && (
              <Button
                variant="bordered"
                className="border border-danger bg-transparent text-danger font-bold rounded-lg min-w-0 px-2.5 h-10 flex-shrink-0 hover:bg-danger-50"
                onClick={() => setLogoUrl("")}
                aria-label="Remove Logo"
              >
                <FiTrash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          <span className="text-[10px] text-default-400 font-sans font-light mt-1 block">Upload a file or enter an external image URL. Displays in the chat header.</span>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-default-700 block font-sans">Bubble Icon</label>
        <div className="grid grid-cols-3 gap-3">
          {["Message", "Chat", "Support"].map((type) => {
            const isSelected = bubbleIcon === type;
            return (
              <div
                key={type}
                onClick={() => setBubbleIcon(type)}
                className={`border rounded-lg p-3.5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all active:scale-98
                  ${isSelected
                    ? "border-primary bg-primary-50/5 dark:bg-primary-950/5 font-bold shadow-sm animate-in fade-in duration-200"
                    : "border-foreground/10 text-default-500 hover:bg-foreground/5"}`}
              >
                <div className={`p-2 rounded-full ${isSelected ? "text-primary bg-primary-100/30" : "bg-default-100 text-default-400"}`}>
                  {type === "Message" && <FiMessageSquare className="w-5 h-5" />}
                  {type === "Chat" && <FiMessageCircle className="w-5 h-5" />}
                  {type === "Support" && <HiOutlineChat className="w-5 h-5" />}
                </div>
                <span className="text-xs font-sans">{type}</span>
              </div>
            );
          })}
        </div>
      </div>
      <GalleryMediaUploadModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelect={(media: Media[]) => {
          const selectedImage = media[0];
          if (selectedImage) {
            setLogoUrl(selectedImage.path);
          }
          setIsGalleryOpen(false);
        }}
        maxSelection={1}
        allowedImageFormats={["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]}
        maxImageSize={2 * 1024 * 1024}
      />
    </div>
  );
}
