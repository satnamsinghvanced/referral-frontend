import React, { useImperativeHandle, useState, useEffect } from "react";
import { CampaignData, CampaignStepProps } from "./CampaignActionModal";
import clsx from "clsx";
import CampaignCategoryChip from "../../../../../components/chips/CampaignCategoryChip";
import {
  useCampaignTemplates,
  useCampaignTemplate,
} from "../../../../../hooks/useCampaign";
import { LoadingState } from "../../../../../components/common/LoadingState";

import Pagination from "../../../../../components/common/Pagination";

export interface CampaignStepRef {
  triggerValidationAndProceed: () => void;
}

const CampaignTemplateStep: React.ForwardRefRenderFunction<
  CampaignStepRef,
  CampaignStepProps
> = ({ data, onNext, updateData, setIsStepValid }, ref) => {
  const [page, setPage] = useState(1);
  const limitCount = 6;

  const { data: templatesRaw, isLoading } = useCampaignTemplates({
    page,
    limit: limitCount,
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    data.templateId,
  );

  // Fetch full template details to get bodyContent (which might be missing in list view)
  const { data: fullTemplate } = useCampaignTemplate(selectedTemplateId || "");

  // Sync to parent immediately when a template selection is ready or changes
  useEffect(() => {
    // Only update if the selectedTemplateId is different from what's in the parent state
    if (selectedTemplateId && selectedTemplateId !== data.templateId) {
      // We want to update everything in one go once we have the full content
      if (fullTemplate) {
        updateData({
          templateId: selectedTemplateId,
          subjectLine: fullTemplate.subjectLine,
          content: fullTemplate.bodyContent,
        });
      } else {
        // Optional: you could sync just the ID here, but if you do,
        // you must ensure the next run of this effect still catches
        // the content when fullTemplate arrives.
        // For now, we wait for fullTemplate to ensure a clean sync.
      }
    }
  }, [selectedTemplateId, fullTemplate, data.templateId, updateData]);

  const [error, setError] = useState("");

  const templates = templatesRaw?.templates || [];
  const pagination = templatesRaw?.pagination;

  React.useEffect(() => {
    setIsStepValid(!!selectedTemplateId);
  }, [selectedTemplateId, setIsStepValid]);

  const handleSelect = (id: string) => {
    setSelectedTemplateId(id);
    setError("");
  };

  const handleNext = () => {
    if (selectedTemplateId) {
      const listTemplate = templates.find(
        (t: any) => t._id === selectedTemplateId,
      );

      const templateChanged = selectedTemplateId !== data.templateId;

      // Only pass subjectLine and content if the template has actually changed.
      // This prevents overwriting user edits in the Content step if they just navigate back and forth.
      const updateDataPayload: Partial<CampaignData> = {
        templateId: selectedTemplateId,
      };

      if (templateChanged) {
        updateDataPayload.subjectLine =
          fullTemplate?.subjectLine ||
          listTemplate?.subjectLine ||
          data.subjectLine;
        updateDataPayload.content =
          fullTemplate?.bodyContent ||
          listTemplate?.bodyContent ||
          data.content;
      }

      onNext(updateDataPayload);
      return true;
    } else {
      setError("Please select an email template to continue.");
      return false;
    }
  };

  useImperativeHandle(ref, () => ({
    triggerValidationAndProceed: handleNext,
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingState />
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-medium mb-4">Choose Email Template</h4>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {templates.map((template: any) => {
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

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          identifier="templates"
          limit={limitCount}
          totalItems={pagination.totalTemplates}
          currentPage={page}
          totalPages={pagination.totalPages}
          handlePageChange={(newPage: number) => setPage(newPage)}
        />
      )}

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

export default React.forwardRef(CampaignTemplateStep);
