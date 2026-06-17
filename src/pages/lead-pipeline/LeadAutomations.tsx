import {
  Button,
  Card,
  CardBody,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiChevronDown, FiChevronUp, FiClock, FiEdit2, FiFilter, FiMail, FiMessageSquare, FiPlay, FiTrash2 } from "react-icons/fi";
import { HiOutlineBell, HiOutlineChevronLeft, HiOutlineExclamationCircle } from "react-icons/hi";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import {
  useDeleteLeadAutomation,
  useLeadAutomations,
  useToggleLeadAutomation,
} from "../../hooks/useLeadAutomation";
import LeadAutomationModal from "./modal/LeadAutomationModal";

interface LeadAutomationsProps {
  onBack?: () => void;
}

const LeadAutomations = ({ onBack }: LeadAutomationsProps) => {
  const { data: automationsResponse, isLoading, isError } = useLeadAutomations();
  const { mutateAsync: toggleAutomation } = useToggleLeadAutomation();
  const { mutateAsync: deleteAutomation, isPending: deleting } = useDeleteLeadAutomation();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedAutomation, setSelectedAutomation] = useState<any>(null);
  const [expandedCardIds, setExpandedCardIds] = useState<Set<string>>(new Set());
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const automations = Array.isArray(automationsResponse)
    ? automationsResponse
    : (automationsResponse?.data || []);

  const handleCreateClick = () => {
    setSelectedAutomation(null);
    onOpen();
  };

  const handleEditClick = (automation: any) => {
    setSelectedAutomation(automation);
    onOpen();
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      try {
        await deleteAutomation(deleteTargetId);
        setIsDeleteConfirmOpen(false);
        setDeleteTargetId(null);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleToggleClick = async (id: string) => {
    try {
      await toggleAutomation(id);
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  const toggleExpandCard = (id: string) => {
    const newExpanded = new Set(expandedCardIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCardIds(newExpanded);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Send SMS":
        return <FiMessageSquare className="size-5 text-sky-500" />;
      case "Send Email":
        return <FiMail className="size-5 text-indigo-500" />;
      case "Send Notification":
        return <HiOutlineBell className="size-5 text-amber-500" />;
      default:
        return <FiMessageSquare className="size-5 text-gray-500" />;
    }
  };

  const getTriggerChipColor = (trigger: string) => {
    switch (trigger) {
      case "Lead Created":
        return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400";
      case "Status Changed":
      case "Status Changed to No Show":
        return "bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400";
      case "Appointment Scheduled":
      case "Appointment Confirmed":
        return "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400";
      case "High Value Lead":
        return "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400";
      default:
        return "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-foreground/60";
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action header */}
      {onBack ? (
        <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
          <Button
            size="sm"
            variant="light"
            radius="sm"
            startContent={<HiOutlineChevronLeft className="size-4" />}
            onPress={onBack}
            className="font-bold text-gray-500 hover:text-primary"
          >
            Back to Leads
          </Button>
          <Button
            size="sm"
            radius="sm"
            variant="solid"
            color="primary"
            onPress={handleCreateClick}
            startContent={<AiOutlinePlus className="text-[15px]" />}
          >
            Create Automation
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between pb-2 border-b border-foreground/5">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">⚡ Marketing Automations</span>
          </div>
          <Button
            size="sm"
            radius="sm"
            variant="solid"
            color="primary"
            onPress={handleCreateClick}
            startContent={<AiOutlinePlus className="text-[15px]" />}
            className="font-bold"
          >
            Add Automation
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-96 border border-foreground/10 rounded-xl bg-background shadow-none">
          <LoadingState />
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center h-96 border border-foreground/10 rounded-xl bg-background shadow-none">
          <EmptyState
            icon={<HiOutlineExclamationCircle className="size-10 text-danger" />}
            title="Connection Error"
            message="Could not load your Lead Automations. Please try again."
          />
        </div>
      ) : automations.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-96 border border-foreground/10 rounded-xl bg-background shadow-none p-6 text-center">
          <EmptyState
            title="No Automations Configured"
            message="Get started by creating your first automated lead action sequence."
          />
          <Button
            size="sm"
            radius="sm"
            variant="solid"
            color="primary"
            onPress={handleCreateClick}
            startContent={<AiOutlinePlus className="text-[15px]" />}
            className="mt-4 font-bold"
          >
            Create Automation
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {automations.map((automation: any) => {
            const isExpanded = expandedCardIds.has(automation._id || automation.id);
            const cardId = automation._id || automation.id;
            
            return (
              <Card
                key={cardId}
                shadow="none"
                className={`border transition-all duration-200 bg-white dark:bg-content1 hover:shadow-md cursor-pointer ${
                  automation.isActive
                    ? "border-primary/20 dark:border-primary/40"
                    : "border-foreground/10"
                }`}
                onClick={() => toggleExpandCard(cardId)}
              >
                <CardBody className="p-5 space-y-4">
                  {/* Top card header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start gap-3 w-full sm:w-auto">
                      <div className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-foreground/5 shadow-inner">
                        {getActionIcon(automation.action)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-base text-foreground leading-tight">
                            {automation.name}
                          </h4>
                          {automation.isSystemTemplate && (
                            <Chip size="sm" variant="flat" color="warning" className="text-[10px] h-5 font-bold">
                              System Default
                            </Chip>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-foreground/60 leading-normal">
                          {automation.description || "No description provided."}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-foreground/5 w-full sm:w-auto">
                      <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-foreground/5">
                        <FiPlay className="size-3 text-primary animate-pulse" />
                        <span className="text-xs font-bold text-foreground">
                          {automation.executions || 0} runs
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Switch
                          size="sm"
                          isSelected={automation.isActive}
                          onChange={() => handleToggleClick(cardId)}
                          onClick={(e: any) => e.stopPropagation()}
                        />
                        <div className="flex items-center gap-1">
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="text-gray-400 dark:text-foreground/40 hover:text-primary"
                            onClick={(e: any) => {
                              e.stopPropagation();
                              handleEditClick(automation);
                            }}
                          >
                            <FiEdit2 className="size-4" />
                          </Button>
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="text-gray-400 dark:text-foreground/40 hover:text-danger"
                            onClick={(e: any) => {
                              e.stopPropagation();
                              handleDeleteClick(cardId);
                            }}
                            isDisabled={deleting}
                          >
                            <FiTrash2 className="size-4" />
                          </Button>
                          {isExpanded ? (
                            <FiChevronUp className="size-4 text-gray-400 ml-1" />
                          ) : (
                            <FiChevronDown className="size-4 text-gray-400 ml-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Chips strip */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Chip
                      size="sm"
                      variant="flat"
                      className={`text-[10px] font-bold h-6 ${getTriggerChipColor(automation.triggerEvent)}`}
                    >
                      Trigger: {automation.triggerEvent}
                    </Chip>
                    
                    <Chip
                      size="sm"
                      variant="flat"
                      className="bg-default-100 text-default-600 dark:text-foreground/70 text-[10px] font-bold h-6"
                      startContent={<FiClock className="size-3 mr-1" />}
                    >
                      Delay: {automation.delayAmount} {automation.delayUnit}
                    </Chip>

                    {automation.condition && (
                      <Chip
                        size="sm"
                        variant="flat"
                        color="secondary"
                        className="text-[10px] font-bold h-6"
                        startContent={<FiFilter className="size-3 mr-1" />}
                      >
                        Condition: {automation.condition}
                      </Chip>
                    )}
                  </div>

                  {/* Expandable message template area */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-foreground/5 space-y-2.5 animate-fadeIn">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-foreground/40">
                          Message Template Preview
                        </span>
                        <div className="bg-gray-50 dark:bg-black/20 border border-foreground/10 rounded-xl p-4 shadow-inner">
                          <p className="text-sm font-normal text-foreground whitespace-pre-wrap leading-relaxed">
                            {automation.messageTemplate}
                          </p>
                        </div>
                      </div>

                      {automation.landingPageUrl && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-medium text-gray-400 dark:text-foreground/40">Landing Page:</span>
                          <a
                            href={automation.landingPageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-bold"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {automation.landingPageUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* Seeding LeadAutomationModal inside wrapper */}
      <LeadAutomationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        automation={selectedAutomation}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        size="sm"
        placement="center"
        classNames={{
          base: "max-sm:!m-3 !m-0",
          closeButton: "cursor-pointer",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 px-4">
                <h4 className="text-base font-medium dark:text-white">Delete Automation</h4>
              </ModalHeader>
              <ModalBody className="py-2 px-4">
                <p className="text-sm text-gray-600 dark:text-foreground/80 leading-normal">
                  This action is permanent and cannot be undone. Any leads currently in this automation's queue will stop immediately.
                </p>
              </ModalBody>
              <ModalFooter className="px-4 pb-4 pt-2">
                <Button
                  size="sm"
                  radius="sm"
                  variant="ghost"
                  color="default"
                  onPress={onClose}
                  className="border-small"
                  isDisabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  radius="sm"
                  variant="solid"
                  color="danger"
                  onPress={handleConfirmDelete}
                  isLoading={deleting}
                  isDisabled={deleting}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LeadAutomations;
