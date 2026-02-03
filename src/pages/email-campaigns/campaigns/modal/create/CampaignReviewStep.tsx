import { Chip } from "@heroui/react";
import clsx from "clsx";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import CampaignCategoryChip from "../../../../../components/chips/CampaignCategoryChip";
import { CampaignStepProps } from "./CampaignActionModal";

import {
  useAudienceById,
  useCampaignTemplate,
} from "../../../../../hooks/useCampaign";
import { formatDateToReadable } from "../../../../../utils/formatDateToReadable";

export interface CampaignStepRef {
  triggerValidationAndProceed: () => void;
}

const SummaryItem = ({
  label,
  value,
  isTag = false,
}: {
  label: string;
  value: React.ReactNode;
  isTag?: boolean;
}) => (
  <div className="py-3 border-b border-foreground/5 last:border-0">
    <p className="text-xs font-medium text-gray-500 dark:text-foreground/50 mb-1">
      {label}
    </p>
    {isTag && typeof value === "string" ? (
      <Chip
        size="sm"
        radius="sm"
        variant="flat"
        className="text-gray-700 bg-gray-100 dark:bg-content1 dark:text-foreground/80 text-[11px] h-5 border-none"
      >
        {value}
      </Chip>
    ) : (
      <p className="text-sm font-medium">{value}</p>
    )}
  </div>
);

const CampaignReviewStep: React.ForwardRefRenderFunction<
  CampaignStepRef,
  CampaignStepProps
> = ({ data, onNext, setIsStepValid }, ref) => {
  const { data: templateResponse } = useCampaignTemplate(data.templateId || "");
  const { data: audienceResponse } = useAudienceById(data.audienceId || "");

  const templateName = (templateResponse as any)?.name || "N/A";
  const audienceName = (audienceResponse as any)?.name || "N/A";

  // Define required fields for a successful send
  const isReady =
    !!data.audienceId &&
    data.name.trim() !== "" &&
    !!data.templateId &&
    data.content.trim() !== "" &&
    data.content.trim() !== "Your email content will appear here..."; // Check content

  useEffect(() => {
    setIsStepValid(isReady);
  }, [isReady, setIsStepValid]);

  const getTrackingSummary = () => {
    const tracking = [];
    if (data.tracking.trackOpens) tracking.push("Opens");
    if (data.tracking.trackClicks) tracking.push("Clicks");
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
          <div>
            <SummaryItem label="Campaign Name" value={data.name || "N/A"} />
            <SummaryItem
              label="Subject Line"
              value={data.subjectLine || "N/A"}
            />
            <SummaryItem label="Template" value={templateName} />
          </div>
        </div>

        {/* Delivery Details */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Delivery Details</h5>
          <div>
            <SummaryItem label="Audience" value={audienceName} />
            <SummaryItem
              label="Schedule"
              value={
                data.schedule.sendImmediately
                  ? "Send Immediately"
                  : `${formatDateToReadable(data.schedule.date, true) || "N/A"}`
              }
            />

            {/* <div className="py-2">
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
          </div> */}

            <div className="py-2">
              <p className="text-xs font-medium text-gray-500 dark:text-foreground/50 mb-1.5">
                Category
              </p>
              <div className="flex space-x-2">
                <CampaignCategoryChip category={data.category as any} />
              </div>
            </div>
            {data.isABTesting && (
              <SummaryItem label="A/B Testing" value="Enabled" isTag={true} />
            )}
          </div>
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
              ? `Your campaign is fully configured and ready to be sent.`
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
