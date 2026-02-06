import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import React from "react";
import { FiCalendar, FiCopy, FiHeart, FiUsers } from "react-icons/fi";
import CampaignCategoryChip from "../../../../components/chips/CampaignCategoryChip";
import {
  useCampaignTemplate,
  useToggleFavoriteTemplate,
} from "../../../../hooks/useCampaign";
import { CampaignTemplate } from "../../../../types/campaign";
import { LoadingState } from "../../../../components/common/LoadingState";

interface ViewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: CampaignTemplate | null;
  onUseTemplate: (template: CampaignTemplate) => void;
}

const ViewTemplateModal: React.FC<ViewTemplateModalProps> = ({
  isOpen,
  onClose,
  template,
  onUseTemplate,
}) => {
  const toggleFavoriteMutation = useToggleFavoriteTemplate();

  // Fetch fresh data when modal is open and we have an ID
  const { data: campaignResponse, isLoading } = useCampaignTemplate(
    isOpen && template?._id ? template._id : "",
  );

  const displayTemplate = campaignResponse || template;

  if (!displayTemplate && !isLoading) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const handleToggleFavorite = () => {
    if (!displayTemplate) return;

    toggleFavoriteMutation.mutate(displayTemplate._id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        base: `max-lg:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="3xl"
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent className="p-0 overflow-hidden">
        {isLoading && !displayTemplate ? (
          <div className="flex justify-center items-center h-64">
            <LoadingState />
          </div>
        ) : (
          <>
            <ModalHeader className="flex flex-col gap-1.5 flex-shrink-0 p-4">
              <div className="flex items-start justify-between gap-4 pr-6">
                <div className="space-y-1.5">
                  <h4 className="text-base leading-none font-medium text-foreground">
                    {displayTemplate!.name}
                  </h4>
                  <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal">
                    {displayTemplate!.description}
                  </p>
                </div>
                {displayTemplate!.category && (
                  <div className="shrink-0">
                    <CampaignCategoryChip
                      category={displayTemplate!.category}
                    />
                  </div>
                )}
              </div>
            </ModalHeader>

            <ModalBody className="px-4 pt-0 pb-4 gap-4 bg-background dark:bg-content1">
              {/* Template Info Section */}
              <div className="">
                <div className="rounded-lg p-4 bg-default-100 dark:bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="grid grid-cols-3 gap-2">
                    <InfoItem
                      icon={<FiUsers className="size-4" />}
                      label="Uses"
                      value={displayTemplate!.usageCount?.toString() || "0"}
                    />
                    <InfoItem
                      icon={<FiCalendar className="size-4" />}
                      label="Last Updated"
                      value={formatDate(
                        displayTemplate!.updatedAt ||
                          displayTemplate!.createdAt,
                      )}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={
                        displayTemplate!.isFavorite ? "solid" : "bordered"
                      }
                      color={displayTemplate!.isFavorite ? "danger" : "default"}
                      size="sm"
                      radius="sm"
                      startContent={
                        <FiHeart
                          className={`size-3.5 ${displayTemplate!.isFavorite ? "fill-current" : ""}`}
                        />
                      }
                      className={`font-medium border-small ${
                        !displayTemplate!.isFavorite
                          ? "border-default-200 text-gray-600 dark:text-foreground bg-background"
                          : "border-danger bg-danger-50 text-danger dark:bg-danger/20"
                      }`}
                      onPress={handleToggleFavorite}
                      isLoading={
                        toggleFavoriteMutation.isPending &&
                        toggleFavoriteMutation.variables ===
                          displayTemplate?._id
                      }
                    >
                      {displayTemplate!.isFavorite ? "Favorited" : "Favorite"}
                    </Button>
                    <Button
                      color="primary"
                      variant="solid"
                      size="sm"
                      radius="sm"
                      startContent={<FiCopy className="size-3.5" />}
                      className="font-medium"
                      onPress={() => onUseTemplate(displayTemplate!)}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>

                {displayTemplate!.tags && displayTemplate!.tags.length > 0 && (
                  <div className="my-6 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-semibold text-default-400 tracking-wider">
                      Tags:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {displayTemplate!.tags.map(
                        (tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 rounded-md bg-transparent border border-foreground/10 text-[11px] font-medium text-foreground/70"
                          >
                            {tag}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Template Preview Box */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">
                  Template Preview
                </h4>
                <div className="border border-divider rounded-xl overflow-hidden bg-white dark:bg-background">
                  {/* Preview Header - Dynamic Color */}
                  <div
                    className="py-3 px-4 text-center text-white"
                    style={{
                      backgroundColor:
                        displayTemplate!.designOptions?.headerColor ||
                        "#0ea5e9",
                    }}
                  >
                    <h3 className="text-base font-medium">
                      {displayTemplate!.designOptions?.organizationName ||
                        "Practice ROI"}
                    </h3>
                  </div>

                  {/* Preview Content */}
                  <div className="p-4 space-y-4 min-h-[300px]">
                    {/* Subject Line */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Subject Line
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {displayTemplate!.subjectLine}
                      </p>
                    </div>

                    <div className="h-px bg-divider w-full" />

                    {/* Email Body */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500">
                        Email Body
                      </p>
                      <div
                        className="prose prose-sm max-w-none dark:prose-invert text-gray-600 dark:text-gray-300 leading-relaxed text-xs"
                        dangerouslySetInnerHTML={{
                          __html: displayTemplate!.bodyContent || "",
                        }}
                      />
                    </div>

                    {/* Action Buttons in Preview */}
                    <div className="flex flex-wrap gap-3 mt-5">
                      <button
                        className="px-3 py-2 rounded-md text-white text-xs transition-transform active:scale-95 cursor-pointer"
                        style={{
                          backgroundColor:
                            displayTemplate!.designOptions?.accentColor ||
                            "#f97316",
                        }}
                      >
                        {displayTemplate!.designOptions?.buttonText ||
                          "Schedule Meeting"}
                      </button>
                      {displayTemplate!.designOptions?.secondaryButtonText && (
                        <button className="px-5 py-2 rounded-md border border-gray-200 dark:border-white/20 text-gray-700 dark:text-gray-300 text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                          {displayTemplate!.designOptions.secondaryButtonText}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Preview Footer */}
                  <div className="py-3 text-center bg-gray-50 dark:bg-black/20 border-t border-divider">
                    <p className="text-xs text-gray-600 dark:text-gray-500">
                      © {new Date().getFullYear()}{" "}
                      {displayTemplate!.designOptions?.organizationName ||
                        "Practice ROI"}{" "}
                      - Unsubscribe
                    </p>
                  </div>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
  valueClassName = "text-foreground",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <div className="flex items-center gap-2.5">
    <div className="min-w-0">
      <p
        className={`text-sm font-semibold truncate leading-none ${valueClassName}`}
      >
        {value}
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-none mt-1">
        {label}
      </p>
    </div>
  </div>
);

export default ViewTemplateModal;
