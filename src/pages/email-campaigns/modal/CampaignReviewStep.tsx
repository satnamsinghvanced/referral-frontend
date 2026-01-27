import React, { useImperativeHandle, forwardRef } from "react";
import { CampaignData } from "./CampaignActionModal";
import clsx from "clsx";
import { FiAlertTriangle } from "react-icons/fi";
import { Chip } from "@heroui/react";
import CampaignCategoryChip from "../../../components/chips/CampaignCategoryChip";

export interface CampaignStepRef {
  triggerValidationAndProceed: () => void;
}

interface CampaignStepProps {
  data: CampaignData;
  onNext: (data: Partial<CampaignData>) => void;
  validationErrors: Record<string, string>;
}

interface SummaryItemProps {
  label: string;
  value: React.ReactNode;
  isTag?: boolean;
}

const SummaryItem: React.FC<SummaryItemProps> = ({
  label,
  value,
  isTag = false,
}) => (
  <div className="py-1.5">
    <p className="text-xs font-medium text-gray-500 dark:text-foreground/50">
      {label}
    </p>
    <div className="text-blue-900 dark:text-foreground">
      {isTag ? (
        <CampaignCategoryChip category={value as any} />
      ) : (
        <span className="text-xs">{value}</span>
      )}
    </div>
  </div>
);

const CampaignReviewStep: React.ForwardRefRenderFunction<
  CampaignStepRef,
  CampaignStepProps
> = ({ data, onNext }, ref) => {
  const totalRecipients = data.selectedAudience?.contacts || 0;

  // Define required fields for a successful send
  const isReady =
    totalRecipients > 0 &&
    data.name.trim() !== "" &&
    !!data.selectedTemplate &&
    data.emailContent.trim() !== "" &&
    data.emailContent.trim() !== "Your email content will appear here..."; // Check content

  const getTrackingSummary = () => {
    const tracking = [];
    if (data.trackingOpens) tracking.push("Opens");
    if (data.trackingClicks) tracking.push("Clicks");
    return tracking.length > 0 ? tracking : ["None"];
  };

  const handleProceed = () => {
    // This step is validation-free; it just signals completion.
    onNext({});
  };

  useImperativeHandle(ref, () => ({
    triggerValidationAndProceed: handleProceed,
  }));

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Review & Send</h4>

      {/* --- Summary Grid --- */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {/* Campaign Details */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Campaign Details</h5>
          <SummaryItem label="Campaign Name" value={data.name || "N/A"} />
          <SummaryItem label="Subject Line" value={data.subject || "N/A"} />
          <SummaryItem
            label="Template"
            value={data.selectedTemplate?.title || "N/A"}
          />
          <SummaryItem
            label="Category"
            value={data.category || "N/A"}
            isTag={true}
          />
        </div>

        {/* Delivery Details */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Delivery Details</h5>
          <SummaryItem
            label="Audience"
            value={
              <>
                <span>{data.selectedAudience?.name || "N/A"}</span>
                <span className="block text-xs font-normal text-gray-500 dark:text-foreground/50">
                  {totalRecipients} recipients
                </span>
              </>
            }
          />
          <SummaryItem label="Schedule" value={data.schedule} />

          <div className="py-2">
            <p className="text-xs font-medium text-gray-500 dark:text-foreground/50 mb-1.5">
              Tracking
            </p>
            <div className="flex space-x-2">
              {getTrackingSummary().map((item) => (
                <Chip
                  key={item}
                  size="sm"
                  radius="sm"
                  variant="flat"
                  className="text-blue-700 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 text-[11px] h-5 border-none"
                >
                  {item}
                </Chip>
              ))}
            </div>
          </div>
          {data.abTesting && (
            <SummaryItem label="A/B Testing" value="Enabled" isTag={true} />
          )}
        </div>
      </div>

      {/* --- Alert Box --- */}
      <div
        className={clsx(
          "p-4 rounded-lg flex items-start space-x-3",
          isReady
            ? "bg-yellow-50 border border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/20"
            : "bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/20",
        )}
      >
        <FiAlertTriangle
          className={clsx(
            "size-5 shrink-0 mt-0.5",
            isReady
              ? "text-yellow-700 dark:text-yellow-400"
              : "text-red-700 dark:text-red-400",
          )}
        />
        <div>
          <h4
            className={clsx(
              "text-sm font-medium mb-1",
              isReady
                ? "text-yellow-700 dark:text-yellow-400"
                : "text-red-700 dark:text-red-400",
            )}
          >
            {isReady ? "Ready to Send" : "Attention Required"}
          </h4>
          <p className="text-xs text-gray-600 dark:text-foreground/60">
            {isReady
              ? `Your campaign is fully configured and ready to be sent to ${totalRecipients} recipients.`
              : "Please ensure all previous steps (Setup, Template, Audience, Content) are complete before sending."}
          </p>
        </div>
      </div>

      {/* Hidden button for accessibility/testing, calls the ref handler */}
      <button
        type="button"
        id="submitReview"
        className="hidden"
        onClick={handleProceed}
      >
        Submit
      </button>
    </div>
  );
};

export default forwardRef(CampaignReviewStep);
