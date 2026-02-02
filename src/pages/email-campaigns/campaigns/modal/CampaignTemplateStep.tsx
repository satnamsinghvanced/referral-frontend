import React, { useState } from "react";
import { CampaignData } from "./CampaignActionModal";
import clsx from "clsx";
import { Template } from "../../../../types/campaign";
import CampaignCategoryChip from "../../../../components/chips/CampaignCategoryChip";

interface CampaignStepProps {
  data: CampaignData;
  onNext: (data: Partial<CampaignData>) => void;
  validationErrors: Record<string, string>;
}

import { useCampaignTemplates } from "../../../../hooks/useCampaign";
import { LoadingState } from "../../../../components/common/LoadingState";

const CampaignTemplateStep: React.FC<CampaignStepProps> = ({
  data,
  onNext,
  validationErrors,
}) => {
  const { data: templatesRaw, isLoading } = useCampaignTemplates({
    page: 1,
    limit: 100,
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    data.templateId,
  );
  const [error, setError] = useState("");

  const templates = templatesRaw?.templates || [];

  const handleSelect = (id: string) => {
    setSelectedTemplateId(id);
    setError("");
  };

  const handleNext = () => {
    if (selectedTemplateId) {
      onNext({
        templateId: selectedTemplateId,
      });
    } else {
      setError("Please select an email template to continue.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h4 className="font-medium mb-4">Choose Email Template</h4>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {templates.map((template) => {
          const isSelected = selectedTemplateId === template._id;
          return (
            <div
              key={template._id}
              className={clsx(
                "bg-background rounded-lg border-2 p-2.5 cursor-pointer transition-all",
                isSelected
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-foreground/10",
              )}
              onClick={() => handleSelect(template._id)}
            >
              <div className="h-28 bg-gray-200 dark:bg-content1 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                {template.mainImage ? (
                  <img
                    src={template.mainImage}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="text-xs text-gray-400">No Preview</div>
                )}
              </div>
              <p className="text-sm font-medium mb-1">{template.name}</p>
              <p className="text-xs text-gray-500 dark:text-foreground/50 mb-1.5 line-clamp-2">
                {template.subjectLine}
              </p>
              <CampaignCategoryChip category={template.category as any} />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        id="submitTemplate"
        className="hidden"
        onClick={handleNext}
      >
        Submit
      </button>
    </div>
  );
};

export default CampaignTemplateStep;
