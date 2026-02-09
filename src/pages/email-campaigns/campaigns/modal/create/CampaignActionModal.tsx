import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React, { useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { LuSave, LuSend } from "react-icons/lu";
import CampaignSidebar, { steps } from "./CampaignSidebar";
// Import all step components
import { useEffect } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import {
  useCreateCampaign,
  useUpdateCampaign,
} from "../../../../../hooks/useCampaign";
import { ICampaign, ICampaignPayload } from "../../../../../types/campaign";
import CampaignAudienceStep from "./CampaignAudienceStep";
import CampaignContentStep from "./CampaignContentStep";
import CampaignReviewStep from "./CampaignReviewStep";
import CampaignScheduleStep from "./CampaignScheduleStep";
import CampaignSetupStep, { CampaignStepRef } from "./CampaignSetupStep";
import CampaignTemplateStep from "./CampaignTemplateStep";
import { CAMPAIGN_CATEGORIES } from "../../../../../consts/campaign";
import { CampaignTemplate } from "../../../../../types/campaign";

// --- Interface Definitions ---

export interface CampaignData {
  name: string;
  subjectLine: string;
  type: string;
  category: string;
  isABTesting: boolean;
  templateId: string | null;
  content: string;
  audienceId: string | null;
  schedule: {
    sendImmediately: boolean;
    date?: string | undefined;
  };
  tracking: {
    trackOpens: boolean;
    trackClicks: boolean;
  };
}

export interface CampaignStepProps {
  data: CampaignData;
  onNext: (data: Partial<CampaignData>) => void;
  updateData: (data: Partial<CampaignData>) => void;
  validationErrors: Record<string, string>;
  setIsStepValid: (isValid: boolean) => void;
}

interface CampaignActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCampaign?: ICampaign | null;
  prefillTemplate?: CampaignTemplate | null;
}

const initialCampaignData: CampaignData = {
  name: "",
  subjectLine: "",
  type: "oneTimeEmail",
  category: "referralOutreach",
  isABTesting: false,
  templateId: null,
  content: "",
  audienceId: null,
  schedule: {
    sendImmediately: true,
  },
  tracking: {
    trackOpens: true,
    trackClicks: true,
  },
};

const CampaignActionModal: React.FC<CampaignActionModalProps> = ({
  isOpen,
  onClose,
  editingCampaign,
  prefillTemplate,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [campaignData, setCampaignData] =
    useState<CampaignData>(initialCampaignData);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isStepValid, setIsStepValid] = useState(false);
  const [actionType, setActionType] = useState<"draft" | "submit" | null>(null);

  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();

  useEffect(() => {
    if (editingCampaign) {
      setCampaignData({
        name: editingCampaign.name,
        subjectLine: editingCampaign.subjectLine,
        type: editingCampaign.type,
        category: editingCampaign.category,
        isABTesting: editingCampaign.isABTesting,
        templateId:
          typeof editingCampaign.templateId === "string"
            ? editingCampaign.templateId
            : editingCampaign.templateId?._id || null,
        content: editingCampaign.content,
        audienceId:
          typeof editingCampaign.audienceId === "string"
            ? editingCampaign.audienceId
            : editingCampaign.audienceId?._id || null,
        schedule: editingCampaign.schedule,
        tracking: editingCampaign.tracking,
      });
    } else if (prefillTemplate) {
      const categoryValue =
        CAMPAIGN_CATEGORIES.find((c) => c.label === prefillTemplate.category)
          ?.value || prefillTemplate.category;

      setCampaignData({
        ...initialCampaignData,
        name: `${prefillTemplate.name}`,
        subjectLine: prefillTemplate.subjectLine,
        category: categoryValue,
        templateId: prefillTemplate._id,
        content: prefillTemplate.bodyContent,
      });
    } else {
      setCampaignData(initialCampaignData);
    }
  }, [editingCampaign, prefillTemplate]);

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

  const updateData = (data: Partial<CampaignData>) => {
    setCampaignData((prev) => ({ ...prev, ...data }));
  };

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
    // Only allow navigation if:
    // 1. Moving to a previous step
    // 2. Moving to the current step
    // 3. Moving to NO MORE than the next step, IF current step is valid
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      setValidationErrors({});
    } else if (stepId === currentStep) {
      // Stay here
    } else if (isStepValid) {
      // If valid, treat any forward click as "Next"
      validateAndProceed();
    }
  };

  const handleClose = () => {
    setCampaignData(initialCampaignData);
    setCurrentStep(0);
    setValidationErrors({});
    setIsStepValid(false);
    setActionType(null);
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
    const payload: ICampaignPayload = {
      ...campaignData,
      status: campaignData.schedule.sendImmediately ? "active" : "scheduled",
      templateId: campaignData.templateId || undefined,
      audienceId: campaignData.audienceId || undefined,
    } as ICampaignPayload;

    setActionType("submit");
    if (editingCampaign) {
      updateMutation.mutate(
        { id: editingCampaign._id, payload },
        {
          onSuccess: handleClose,
          onError: () => setActionType(null),
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: handleClose,
        onError: () => setActionType(null),
      });
    }
  };

  const handleSaveDraft = () => {
    const payload: ICampaignPayload = {
      ...campaignData,
      status: "draft",
      templateId: campaignData.templateId || undefined,
      audienceId: campaignData.audienceId || undefined,
    } as ICampaignPayload;

    setActionType("draft");
    if (editingCampaign) {
      updateMutation.mutate(
        { id: editingCampaign._id, payload },
        {
          onSuccess: handleClose,
          onError: () => setActionType(null),
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: handleClose,
        onError: () => setActionType(null),
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      size="5xl"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex justify-between items-center p-4 border-b border-foreground/10 font-normal">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center justify-start gap-2">
              <FaRegEnvelope className="text-blue-600" />
              <h4 className="text-base font-medium">Create New Campaign</h4>
            </div>
            <p className="text-xs text-gray-600 dark:text-foreground/60">
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
            isStepValid={isStepValid}
          />

          <div className="flex-grow p-4 overflow-y-auto">
            {/* @ts-ignore */}
            <CurrentComponent
              ref={stepRef}
              data={campaignData}
              onNext={handleNext}
              updateData={updateData}
              validationErrors={validationErrors}
              setIsStepValid={setIsStepValid}
            />
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-between items-center p-4 border-t border-foreground/10">
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
              isDisabled={!isStepValid}
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
                onPress={handleSaveDraft}
                isLoading={actionType === "draft"}
                startContent={
                  actionType !== "draft" && <LuSave className="w-4 h-4" />
                }
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
                isDisabled={!isStepValid}
                isLoading={actionType === "submit"}
                startContent={
                  actionType !== "submit" && <LuSend className="w-4 h-4" />
                }
                className="border-small"
              >
                {editingCampaign ? "Update Campaign" : "Send Campaign"}
              </Button>
            </div>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CampaignActionModal;
