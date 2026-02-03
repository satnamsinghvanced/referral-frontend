import React, { useState, useImperativeHandle, useEffect } from "react";
import { CampaignData, CampaignStepProps } from "./CampaignActionModal";
import QuillEditor from "../../../../../components/editor/QuillEditor";
import clsx from "clsx";
import { Button } from "@heroui/react";

export interface CampaignStepRef {
  triggerValidationAndProceed: () => void;
}

const CampaignContentStep: React.ForwardRefRenderFunction<
  CampaignStepRef,
  CampaignStepProps
> = ({ data, onNext, updateData, validationErrors, setIsStepValid }, ref) => {
  const [content, setContent] = useState(data.content);
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const error = localError || validationErrors.content;

  // Sync content with data if it changes (e.g. from template selection)
  useEffect(() => {
    setContent(data.content);
  }, [data.content]);

  // Sync back to parent state whenever content changes (to preserve state on navigation)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== data.content) {
        updateData({ content });
      }
    }, 500); // Debounce to avoid excessive parent state updates
    return () => clearTimeout(timer);
  }, [content, data.content, updateData]);

  useEffect(() => {
    setIsStepValid(
      !!content && content.trim().length > 0 && content !== "<p><br></p>",
    );
  }, [content, setIsStepValid]);

  const handleValidationAndNext = () => {
    if (!content || content.trim() === "" || content === "<p><br></p>") {
      setLocalError("Email content cannot be empty.");
      return false;
    }
    setLocalError(undefined);
    onNext({ content });
    return true;
  };

  useImperativeHandle(ref, () => ({
    triggerValidationAndProceed: handleValidationAndNext,
  }));

  return (
    <div className="space-y-4">
      <div className="flex item justify-between">
        <h4 className="font-medium">Email Content</h4>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
          {error}
        </div>
      )}

      <div className="flex flex-grow gap-4 overflow-hidden">
        <div className="flex flex-col w-1/2 min-h-full space-y-2">
          <label htmlFor="content" className="block text-xs font-medium">
            Email Content
          </label>
          <div className="flex-grow overflow-hidden rounded-lg">
            <QuillEditor
              value={content}
              onChange={setContent}
              placeholder="Your email content will appear here..."
              enableImage={true}
            />
          </div>
        </div>

        <div className="w-1/2 flex flex-col items-start overflow-hidden">
          <label className="block text-xs font-medium mb-2">Preview</label>
          <div className="bg-background border border-foreground/10 p-4 rounded-lg overflow-y-auto w-full h-full">
            <div className="pb-3 border-b border-foreground/10 mb-3 space-y-1">
              <p className="font-medium text-[13px]">
                Subject: {data.subjectLine || "Your Subject Line"}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-foreground/50">
                From: Your Practice Name
              </p>
            </div>
            <div
              className="text-sm prose dark:prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:my-2"
              dangerouslySetInnerHTML={{
                __html:
                  content ||
                  "<p class='text-gray-400'>Your email content preview will appear here...</p>",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.forwardRef(CampaignContentStep);
