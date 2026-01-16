import React, { useState } from "react";
import { CampaignData } from "./CampaignActionModal";
import clsx from "clsx";
import { Template } from "../../../types/campaign";
import CampaignCategoryChip from "../../../components/chips/CampaignCategoryChip";

interface CampaignStepProps {
  data: CampaignData;
  onNext: (data: Partial<CampaignData>) => void;
  validationErrors: Record<string, string>;
}

const mockTemplates: Template[] = [
  {
    id: 1,
    title: "Patient Welcome Series",
    description: "Warm, friendly welcome sequence for new patients",
    category: "patientFollowUp",
    rating: 4.9,
    usages: 587,
    tags: ["welcome", "patient-care", "sequence"],
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56",
    isPopular: true,
  },
  {
    id: 2,
    title: "New Partner Onboarding",
    description: "Complete onboarding sequence for new referral partners",
    category: "onboarding",
    rating: 4.8,
    usages: 345,
    tags: ["onboarding", "partner", "sequence"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    isPopular: true,
  },
  {
    id: 3,
    title: "Professional Partnership Invitation",
    description:
      "Clean, professional template for reaching out to new dental practices",
    category: "referralOutreach",
    rating: 4.8,
    usages: 234,
    tags: ["referral outreach", "professional", "partnership", "introduction"],
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07",
    isPopular: true,
  },
];

const CampaignTemplateStep: React.FC<CampaignStepProps> = ({
  data,
  onNext,
  validationErrors,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(
    data.selectedTemplate || mockTemplates[0]
  );
  const [error, setError] = useState("");

  const handleSelect = (template: Template) => {
    setSelectedTemplate({
      id: template.id,
      title: template.title,
      category: template.category,
    });
    setError("");
  };

  const handleNext = () => {
    if (selectedTemplate) {
      onNext({
        selectedTemplate,
        category: selectedTemplate.category as CampaignData["category"],
      });
    } else {
      setError("Please select an email template to continue.");
    }
  };

  return (
    <div className="space-y-6">
      <h4 className="font-medium mb-4">Choose Email Template</h4>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {mockTemplates.map((template) => {
          const isSelected = selectedTemplate?.id === template.id;
          return (
            <div
              key={template.id}
              className={clsx(
                "bg-background rounded-lg border-2 p-2.5 cursor-pointer transition-all",
                isSelected
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-foreground/10"
              )}
              onClick={() => handleSelect(template)}
            >
              <div className="h-28 bg-gray-200 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                <img src={template.image} className="size-full object-cover" />
              </div>
              <p className="text-sm font-medium mb-1">{template.title}</p>
              <p className="text-xs text-gray-500 mb-1.5">
                {template.description}
              </p>
              <CampaignCategoryChip category={template.category} />
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

(CampaignTemplateStep as any).validateAndNext = (
  data: CampaignData,
  onNext: (data: Partial<CampaignData>) => void,
  setValidationErrors: (errors: Record<string, string>) => void
) => {
  const component = document.getElementById("submitTemplate");
  if (component) {
    component.click();
  } else {
    // Fallback for direct validation if component isn't mounted (unlikely in this flow)
    if (data.selectedTemplate) {
      onNext(data);
    } else {
      setValidationErrors({
        selectedTemplate: "Template selection is required.",
      });
    }
  }
};

export default CampaignTemplateStep;
