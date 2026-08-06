import { Button, Card, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import clsx from "clsx";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { LuTarget } from "react-icons/lu";
import { CampaignStepProps } from "./CampaignActionModal";

export interface CampaignStepRef {
  triggerValidationAndProceed: () => void;
}

import { LoadingState } from "../../../../../components/common/LoadingState";
import { useAudiences } from "../../../../../hooks/useCampaign";

const CampaignAudienceStep: React.ForwardRefRenderFunction<CampaignStepRef, CampaignStepProps> = ({ data, onNext, setIsStepValid }, ref) => {
  const { data: audiencesRaw, isLoading } = useAudiences({ page: 1, limit: 100 });
  const [selectedAudienceId, setSelectedAudienceId] = useState<string | null>(data.audienceId);
  const [localError, setLocalError] = useState<string | undefined>(undefined);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    setIsStepValid(!!selectedAudienceId);
  }, [selectedAudienceId, setIsStepValid]);

  const audiences = audiencesRaw?.audiences || [];
  const selectedAudience = audiences.find((a) => a._id === selectedAudienceId);

  const getAudienceRecipients = (audience: any) => {
    const list: { name: string; email: string; type: string }[] = [];
    if (audience?.referrers) {
      audience.referrers.forEach((r: any) => {
        if (r.email) {
          list.push({ name: r.name, email: r.email, type: "Referrer" });
        }
      });
    }
    if (audience?.referrals) {
      audience.referrals.forEach((r: any) => {
        if (r.email) {
          list.push({ name: r.name, email: r.email, type: "Referral" });
        }
      });
    }
    if (audience?.practices) {
      audience.practices.forEach((p: any) => {
        const contactEmail = p.createdBy?.email || "No email";
        list.push({ name: p.name, email: contactEmail, type: "Practice" });
      });
    }
    return list;
  };

  const recipientsList = selectedAudience ? getAudienceRecipients(selectedAudience) : [];

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
                {(audience.referrers?.length || 0) +
                  (audience.practices?.length || 0) +
                  (audience.referrals?.length || 0)}{" "}
                contacts
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
        <div className="flex items-center justify-between w-full">
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
              {selectedAudience?.name || "No Audience Selected"}
            </p>
            {selectedAudience && selectedAudience.description && (
              <p className="text-xs text-blue-600 dark:text-blue-500/80 mt-0.5">
                {selectedAudience.description}
              </p>
            )}
          </div>
          {selectedAudience && (
            <Button
              size="sm"
              variant="flat"
              color="primary"
              className="h-7 text-xs font-medium"
              onPress={onOpen}
            >
              View Recipients
            </Button>
          )}
        </div>
        {selectedAudience ? (
          <p className="text-xs text-blue-600 dark:text-blue-500/80 mt-2">
            {((selectedAudience.referrers?.length || 0) +
              (selectedAudience.practices?.length || 0) +
              (selectedAudience.referrals?.length || 0))}{" "}
            recipients will receive this campaign
          </p>
        ) : (
          <p className="text-xs text-blue-600 dark:text-blue-500/80 mt-1">
            Please select an audience segment for this campaign.
          </p>
        )}
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl" scrollBehavior="inside" backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Audience Details: {selectedAudience?.name}
              </ModalHeader>
              <ModalBody className="pb-6">
                <p className="text-xs text-default-500 mb-2">
                  Showing the list of contacts associated with this audience segment.
                </p>
                {recipientsList.length === 0 ? (
                  <div className="py-8 text-center text-sm text-default-400">
                    No contacts found in this audience.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-divider rounded-lg max-h-[300px]">
                    <table className="min-w-full divide-y divide-divider text-xs text-left">
                      <thead className="bg-default-100 font-medium text-default-700 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-2 bg-default-100">Name</th>
                          <th className="px-4 py-2 bg-default-100">Email</th>
                          <th className="px-4 py-2 bg-default-100">Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-divider">
                        {recipientsList.map((recipient, index) => (
                          <tr key={index} className="hover:bg-default-50 dark:hover:bg-default-100/5 transition-colors">
                            <td className="px-4 py-2 font-medium text-foreground">
                              {recipient.name}
                            </td>
                            <td className="px-4 py-2 text-default-600 dark:text-foreground/75">
                              {recipient.email}
                            </td>
                            <td className="px-4 py-2">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                                {recipient.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose} size="sm" radius="md">
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default forwardRef(CampaignAudienceStep);
