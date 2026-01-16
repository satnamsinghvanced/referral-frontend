import React, { useState, useRef, RefObject } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CampaignSidebar, { steps } from "./CampaignSidebar";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { LuSave, LuSend } from "react-icons/lu";
// Import all step components
import CampaignSetupStep, { CampaignStepRef } from "./CampaignSetupStep";
import CampaignTemplateStep from "./CampaignTemplateStep";
import CampaignContentStep from "./CampaignContentStep";
import CampaignAudienceStep from "./CampaignAudienceStep";
import CampaignScheduleStep from "./CampaignScheduleStep";
import CampaignReviewStep from "./CampaignReviewStep";
import { FaRegEnvelope } from "react-icons/fa";

// --- Interface Definitions ---

export interface CampaignData {
  name: string;
  subject: string;
  type: "One-time Email" | "Automated Sequence";
  category: "Referral Outreach" | "Patient Follow-up" | "Practice Updates";
  abTesting: boolean;
  selectedTemplate: { id: number; title: string; category: string } | null;
  emailContent: string;
  selectedAudience: { name: string; contacts: number } | null;
  schedule: boolean;
  trackingOpens: boolean;
  trackingClicks: boolean;
}

export interface CampaignStepProps {
  data: CampaignData;
  onNext: (data: Partial<CampaignData>) => void;
  validationErrors: Record<string, string>;
}

interface CampaignActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CampaignData) => void;
}

const initialCampaignData: CampaignData = {
  name: "New Campaign Draft",
  subject: "Check out our new offer!",
  type: "One-time Email",
  category: "Referral Outreach",
  abTesting: false,
  selectedTemplate: null,
  emailContent: "Your email content will appear here...",
  selectedAudience: null,
  schedule: true,
  trackingOpens: true,
  trackingClicks: true,
};

const CampaignActionModal: React.FC<CampaignActionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [campaignData, setCampaignData] =
    useState<CampaignData>(initialCampaignData);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Ref to hold the current step component's exposed methods
  const stepRef = useRef<CampaignStepRef>(null);

  const totalSteps = steps.length;

  const stepComponents = [
    CampaignSetupStep,
    CampaignTemplateStep,
    CampaignContentStep,
    CampaignAudienceStep,
    CampaignScheduleStep,
    CampaignReviewStep,
  ];

  const CurrentComponent = stepComponents[currentStep];

  // --- Handlers ---

  const handleNext = (data: Partial<CampaignData>) => {
    setCampaignData((prev) => ({ ...prev, ...data }));
    setValidationErrors({});
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setValidationErrors({});
    }
  };

  const handleStepChange = (stepId: number) => {
    // Only allow navigation to previously completed steps or the current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
      setValidationErrors({});
    }
  };

  const handleClose = () => {
    setCampaignData(initialCampaignData);
    setCurrentStep(0);
    setValidationErrors({});
    onClose();
  };

  const validateAndProceed = () => {
    // Check if the current component exposes a validation function via ref
    if (stepRef.current && stepRef.current.triggerValidationAndProceed) {
      stepRef.current.triggerValidationAndProceed();
    } else {
      // If no custom validation is needed for this step, just proceed
      handleNext({});
    }
  };

  const handleSubmitCampaign = () => {
    onSubmit(campaignData);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      size="5xl"
      classNames={{
        base: `w-full max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex justify-between items-center py-4 px-5 border-b border-foreground/10 font-normal">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center justify-start gap-2">
              <FaRegEnvelope className="text-blue-600" />
              <h4 className="text-base font-medium">Create New Campaign</h4>
            </div>
            <p className="text-xs text-gray-600">
              Build and configure your email campaign with our step-by-step
              builder
            </p>
          </div>
        </ModalHeader>

        <ModalBody className="flex flex-row gap-0 overflow-hidden p-0">
          <CampaignSidebar
            currentStep={currentStep}
            totalSteps={totalSteps}
            onStepChange={handleStepChange}
          />

          <div className="flex-grow p-4 overflow-y-auto">
            {/* @ts-ignore */}
            <CurrentComponent
              ref={currentStep === 0 ? stepRef : undefined}
              data={campaignData}
              onNext={handleNext}
              validationErrors={validationErrors}
            />
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-between items-center py-4 px-5 border-t border-foreground/10">
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            color="default"
            onPress={handlePrevious}
            isDisabled={currentStep === 0}
            startContent={<FiChevronLeft className="w-4 h-4" />}
            className="border-small"
          >
            Previous
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button
              size="sm"
              radius="sm"
              variant="solid"
              color="primary"
              onPress={validateAndProceed}
              endContent={<FiChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          ) : (
            <div className="flex space-x-3">
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                color="default"
                onPress={() => alert("Draft Saved!")}
                startContent={<LuSave className="w-4 h-4" />}
                className="border-small"
              >
                Save as Draft
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="solid"
                color="primary"
                onPress={handleSubmitCampaign}
                startContent={<LuSend className="w-4 h-4" />}
                className="border-small"
              >
                Send Campaign
              </Button>
            </div>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CampaignActionModal;
