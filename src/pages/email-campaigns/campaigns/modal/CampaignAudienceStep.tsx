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

import { getAllAudiences } from "../../../../services/campaign";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "../../../../components/common/LoadingState";

const CampaignAudienceStep: React.ForwardRefRenderFunction<
  CampaignStepRef,
  CampaignStepProps
> = ({ data, onNext }, ref) => {
  const { data: audiencesRaw, isLoading } = useQuery({
    queryKey: ["audiences"],
    queryFn: () => getAllAudiences({ page: 1, limit: 100 }),
  });

  const [selectedAudienceId, setSelectedAudienceId] = useState<string | null>(
    data.audienceId,
  );
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const audiences = audiencesRaw?.audiences || [];
  const selectedAudience = audiences.find((a) => a._id === selectedAudienceId);

  const handleSelect = (id: string) => {
    setSelectedAudienceId(id);
    setLocalError(undefined);
  };

  const handleValidationAndNext = () => {
    if (selectedAudienceId) {
      onNext({
        audienceId: selectedAudienceId,
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Select Audience</h4>

      {localError && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
          {localError}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {audiences.map((audience) => {
          const isSelected = selectedAudienceId === audience._id;
          return (
            <Button
              key={audience._id}
              onPress={() => handleSelect(audience._id)}
              className={clsx(
                "p-3 h-full flex flex-col items-start justify-between text-left gap-1",
                isSelected
                  ? "bg-blue-50 border-2 border-blue-500 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500 shadow-md"
                  : "border-foreground/10 bg-background",
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
                    isSelected
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 dark:text-foreground/40",
                  )}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-foreground/50">
                {audience.type}
              </p>
            </Button>
          );
        })}
      </div>

      <Card
        className="p-4 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20"
        radius="md"
        shadow="none"
      >
        <div className="flex items-center gap-1.5 mb-1.5 text-blue-900 dark:text-blue-200">
          <LuTarget />
          <p className="text-xs font-medium">Selected Audience</p>
        </div>
        <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
          {selectedAudience?.name || "No Audience Selected"}
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-500/80 mt-1">
          {selectedAudience?.description}
        </p>
      </Card>
    </div>
  );
};

export default forwardRef(CampaignAudienceStep);
