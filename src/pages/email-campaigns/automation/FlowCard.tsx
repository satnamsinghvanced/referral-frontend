import { Button, useDisclosure } from "@heroui/react";
import React from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { FiCopy, FiEdit } from "react-icons/fi";
import { IoTrendingUp } from "react-icons/io5";
import { LuPause, LuPlay, LuTarget, LuTrash2, LuUsers } from "react-icons/lu";
import FlowStatusChip from "../../../components/chips/FlowStatusChip";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";
import { IAutomation } from "../../../types/campaign";
import {
  useDeleteAutomation,
  useDuplicateAutomation,
  useUpdateAutomation,
} from "../../../hooks/useCampaign";

const FlowCard = ({
  flow,
  onEdit,
}: {
  flow: IAutomation;
  onEdit: (id: string) => void;
}) => {
  const { name, description, status, trigger, stats, steps } = flow;
  const deleteMutation = useDeleteAutomation();
  const duplicateMutation = useDuplicateAutomation();
  const updateMutation = useUpdateAutomation(flow._id);
  const deleteModal = useDisclosure();

  const getIconForAction = (action: string) => {
    switch (action) {
      case "Edit Flow":
        return FiEdit;
      case "Duplicate":
        return FiCopy;
      case "Pause":
        return LuPause;
      default:
        return null;
    }
  };

  const emailStepsCount = steps.filter((s) => s.type === "send-email").length;

  const handleDelete = () => {
    deleteModal.onOpen();
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(flow._id, {
      onSuccess: () => {
        deleteModal.onClose();
      },
    });
  };

  const handleDuplicate = () => {
    duplicateMutation.mutate(flow._id);
  };

  const handleStatusChange = (newStatus: "active" | "inActive" | "draft") => {
    updateMutation.mutate({ status: newStatus });
  };

  return (
    <div className="bg-background border border-foreground/10 rounded-xl p-4">
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-start gap-2.5 w-full">
          <span className="inline-block mt-0.5">
            {status === "inActive" ? (
              <LuPause className="text-yellow-500 text-lg" />
            ) : status === "draft" ? (
              <FiEdit className="text-gray-500 text-lg" />
            ) : (
              <LuPlay className="text-green-500 text-lg" />
            )}
          </span>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">{name}</h4>
            </div>
            <p className="text-xs text-gray-600 dark:text-foreground/60">
              {description}
            </p>
            <div className="text-xs text-gray-500 dark:text-foreground/50 mt-1 flex gap-2.5">
              <p className="inline-flex items-center gap-1.5">
                <FaRegEnvelope />
                <span>{emailStepsCount} emails</span>
              </p>
              <p className="inline-flex items-center gap-1.5">
                <LuUsers />
                <span>{stats.subscriberCount} subscribers</span>
              </p>
              <p className="inline-flex items-center gap-1.5">
                <LuTarget />
                <span>Trigger: {trigger?.type || "Custom"}</span>
              </p>
            </div>
          </div>
        </div>
        <FlowStatusChip status={status} />
      </div>

      {stats && (
        <div className="grid grid-cols-4 gap-4 pt-4">
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-content1 rounded-lg space-y-0.5">
            <p className="text-xs text-gray-500 dark:text-foreground/50">
              Subscribers
            </p>
            <p className="text-sm font-semibold">{stats.subscriberCount}</p>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-content1 rounded-lg space-y-0.5">
            <p className="text-xs text-gray-500 dark:text-foreground/50">
              Open Rate
            </p>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
              {stats.openRate}%
            </p>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-content1 rounded-lg space-y-0.5">
            <p className="text-xs text-gray-500 dark:text-foreground/50">
              Click Rate
            </p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {stats.clickRate}%
            </p>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-content1 rounded-lg space-y-0.5">
            <p className="text-xs text-gray-500 dark:text-foreground/50">
              Conversions
            </p>
            <p className="text-sm font-semibold">{stats.conversionCount}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 mt-4 border-t border-foreground/10">
        <div className="flex gap-2">
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            color="default"
            onPress={() => onEdit(flow._id)}
            startContent={<FiEdit className="size-3.5" />}
            className="border-small"
          >
            Edit Flow
          </Button>
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            color="default"
            onPress={handleDuplicate}
            isLoading={duplicateMutation.isPending}
            startContent={
              !duplicateMutation.isPending && <FiCopy className="size-3.5" />
            }
            className="border-small"
          >
            Duplicate
          </Button>
          {status === "active" ? (
            <Button
              size="sm"
              radius="sm"
              variant="ghost"
              color="default"
              onPress={() => handleStatusChange("inActive")}
              isLoading={updateMutation.isPending}
              startContent={
                !updateMutation.isPending && <LuPause className="size-3.5" />
              }
              className="border-small"
            >
              Pause
            </Button>
          ) : (
            <Button
              size="sm"
              radius="sm"
              variant="solid"
              color="primary"
              onPress={() => handleStatusChange("active")}
              isLoading={updateMutation.isPending}
              startContent={
                !updateMutation.isPending && <LuPlay className="size-3.5" />
              }
            >
              Activate
            </Button>
          )}
        </div>
        <div className="flex gap-2 text-sm font-medium text-gray-600 dark:text-foreground/60">
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            color="default"
            onPress={() => console.log("View Report clicked")}
            startContent={<IoTrendingUp className="size-3.5" />}
            className="border-small"
          >
            Analytics
          </Button>
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            color="danger"
            onPress={handleDelete}
            isLoading={deleteMutation.isPending}
            startContent={
              !deleteMutation.isPending && <LuTrash2 className="size-3.5" />
            }
            className="border-small"
            isIconOnly
          />
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        title="Delete Automation"
        description={`Are you sure you want to delete the automation "${name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default FlowCard;
