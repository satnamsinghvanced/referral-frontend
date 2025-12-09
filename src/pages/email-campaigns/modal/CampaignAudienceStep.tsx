import React, { useState, useImperativeHandle, forwardRef } from "react";
import { CampaignData } from "./CampaignActionModal";
import clsx from "clsx";
import { FiUsers } from "react-icons/fi";
import { Card, Button } from "@heroui/react";
import { LuTarget } from "react-icons/lu";

export interface CampaignStepRef {
  triggerValidationAndProceed: () => void;
}

interface CampaignStepProps {
  data: CampaignData;
  onNext: (data: Partial<CampaignData>) => void;
  validationErrors: Record<string, string>;
}

interface AudienceSegment {
  name: string;
  contacts: number;
  description: string;
}

const mockAudiences: AudienceSegment[] = [
  {
    name: "All Dental Practices",
    contacts: 1247,
    description: "All active dental practices in your referral network.",
  },
  {
    name: "A-Level Partners",
    contacts: 45,
    description: "Top-tier referral partners with consistent referrals.",
  },
  {
    name: "Recent Referrers",
    contacts: 89,
    description: "Partners who have referred a patient in the last 30 days.",
  },
  {
    name: "Inactive Practices",
    contacts: 156,
    description: "Practices that haven't referred in 6+ months.",
  },
  {
    name: "Tulsa Area Practices",
    contacts: 234,
    description: "All practices located in the Tulsa metropolitan area.",
  },
  {
    name: "New Practices",
    contacts: 67,
    description: "Practices added to the network in the last 90 days.",
  },
];

const CampaignAudienceStep: React.ForwardRefRenderFunction<
  CampaignStepRef,
  CampaignStepProps
> = ({ data, onNext }, ref) => {
  // Initialize state using the full AudienceSegment structure for ease of use
  const initialAudience =
    mockAudiences.find((a) => a.name === data.selectedAudience?.name) ||
    mockAudiences[0];
  const [selectedAudience, setSelectedAudience] =
    //   @ts-ignore
    useState<AudienceSegment | null>(initialAudience);
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const error = localError;

  const handleSelect = (audience: AudienceSegment) => {
    setSelectedAudience(audience);
    setLocalError(undefined);
  };

  const handleValidationAndNext = () => {
    if (selectedAudience) {
      // Only pass the required structure back to CampaignData
      onNext({
        selectedAudience: {
          name: selectedAudience.name,
          contacts: selectedAudience.contacts,
        },
      });
      return true;
    } else {
      setLocalError("Please select an audience segment.");
      return false;
    }
  };

  useImperativeHandle(ref, () => ({
    triggerValidationAndProceed: handleValidationAndNext,
  }));

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Select Audience</h4>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {mockAudiences.map((audience) => {
          const isSelected = selectedAudience?.name === audience.name;
          return (
            <Button
              key={audience.name}
              onPress={() => handleSelect(audience)}
              className={clsx(
                "p-3 h-full flex flex-col items-start justify-between text-left gap-1",
                isSelected
                  ? "bg-blue-50 border-2 border-blue-500 text-blue-800 shadow-md"
                  : "border-gray-200 bg-white"
              )}
              variant="bordered"
              radius="md"
              color={isSelected ? "primary" : "default"}
            >
              <div className="flex items-center justify-between w-full">
                <p className="text-sm font-medium">{audience.name}</p>
                <FiUsers
                  className={clsx(
                    "size-4 shrink-0",
                    isSelected ? "text-blue-600" : "text-gray-400"
                  )}
                />
              </div>
              <p className="text-xs text-gray-500">
                {audience.contacts} contacts
              </p>
            </Button>
          );
        })}
      </div>

      <Card
        className="p-4 bg-blue-50 border-blue-200"
        radius="md"
        shadow="none"
      >
        <div className="flex items-center gap-1.5 mb-1.5 text-blue-900">
          <LuTarget />
          <p className="text-xs font-medium">
            Selected Audience
          </p>
        </div>
        <p className="text-sm font-medium text-blue-700">
          {selectedAudience?.name || "No Audience Selected"}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          {selectedAudience?.contacts || 0} recipients will receive this
          campaign
        </p>
      </Card>
    </div>
  );
};

export default forwardRef(CampaignAudienceStep);
