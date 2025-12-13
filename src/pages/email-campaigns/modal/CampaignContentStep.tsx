import React, { useState, useImperativeHandle, forwardRef } from "react";
import { CampaignData } from "./CampaignActionModal";
import { FiBold, FiImage, FiLink, FiAperture } from "react-icons/fi";
import clsx from "clsx";
import { Button, Textarea } from "@heroui/react";
import { IoText } from "react-icons/io5";
import { MdOutlinePalette } from "react-icons/md";

export interface CampaignStepRef {
  triggerValidationAndProceed: () => void;
}

interface CampaignStepProps {
  data: CampaignData;
  onNext: (data: Partial<CampaignData>) => void;
  validationErrors: Record<string, string>;
}

const CampaignContentStep: React.ForwardRefRenderFunction<
  CampaignStepRef,
  CampaignStepProps
> = ({ data, onNext, validationErrors }, ref) => {
  const [emailContent, setEmailContent] = useState(data.emailContent);
  const [view, setView] = useState<"desktop" | "mobile">("desktop");
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const error = localError || validationErrors.emailContent;

  const handleValidationAndNext = () => {
    if (
      !emailContent ||
      emailContent.trim() === "" ||
      emailContent.trim().length === 0
    ) {
      setLocalError("Email content cannot be empty.");
      // In a real application, you might also update parent state here
      // setValidationErrors({ emailContent: "Email content cannot be empty." });
      return false;
    }
    setLocalError(undefined);
    onNext({ emailContent });
    return true;
  };

  useImperativeHandle(ref, () => ({
    triggerValidationAndProceed: handleValidationAndNext,
  }));

  return (
    <div className="space-y-4">
      <div className="flex item justify-between">
        <h4 className="font-medium">Email Content</h4>
        <div className="flex space-x-2">
          <Button
            size="sm"
            radius="sm"
            variant={view === "desktop" ? "solid" : "bordered"}
            color={view === "desktop" ? "primary" : "default"}
            onPress={() => setView("desktop")}
            className="border-small"
          >
            Desktop
          </Button>
          <Button
            size="sm"
            radius="sm"
            variant={view === "mobile" ? "solid" : "bordered"}
            color={view === "mobile" ? "primary" : "default"}
            onPress={() => setView("mobile")}
            className="border-small"
          >
            Mobile
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
          {error}
        </div>
      )}

      <div className="flex flex-grow gap-4 overflow-hidden">
        <div className="flex flex-col w-1/2 min-h-full">
          <label
            htmlFor="emailContent"
            className="block text-xs font-medium mb-2"
          >
            Email Content
          </label>
          <Textarea
            id="emailContent"
            placeholder="Your email content will appear here..."
            minRows={15}
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            className="flex-grow resize-none"
            isInvalid={!!error}
          />

          <div className="flex items-center space-x-2 mt-3">
            <Button
              size="sm"
              radius="sm"
              variant="ghost"
              color="default"
              className="border-small"
              startContent={<IoText className="w-4 h-4" />}
            >
              Format
            </Button>
            <Button
              size="sm"
              radius="sm"
              variant="ghost"
              color="default"
              className="border-small"
              startContent={<FiImage className="w-4 h-4" />}
            >
              Image
            </Button>
            <Button
              size="sm"
              radius="sm"
              variant="ghost"
              color="default"
              className="border-small"
              startContent={<FiLink className="w-4 h-4" />}
            >
              Link
            </Button>
            <Button
              size="sm"
              radius="sm"
              variant="ghost"
              color="default"
              className="border-small"
              startContent={<MdOutlinePalette className="w-4 h-4" />}
            >
              Style
            </Button>
          </div>
        </div>

        <div className="w-1/2 flex flex-col items-start">
          <label
            className="block text-xs font-medium mb-2"
          >
            Preview
          </label>
          <div
            className={clsx(
              "bg-background border border-gray-200 p-4 rounded-lg",
              view === "mobile" ? "w-full max-w-sm h-[80%]" : "w-full h-[80%]"
            )}
          >
            <p className="font-medium text-xs mb-1">
              Subject: {data.subject || "Your Subject Line"}
            </p>
            <p className="text-xs text-gray-500">
              From: Your Practice Name
            </p>
            <div className="text-xs text-gray-700 whitespace-pre-wrap border-t border-gray-200 pt-2.5 mt-2.5">
              {emailContent
                ? emailContent
                : "Your email content will appear here..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(CampaignContentStep);
