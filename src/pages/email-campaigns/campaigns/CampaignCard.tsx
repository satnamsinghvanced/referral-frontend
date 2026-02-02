import { Button } from "@heroui/react";
import React from "react";
import { FiArchive, FiClock, FiCopy, FiEdit, FiTrash2 } from "react-icons/fi";
import { LuFileText, LuPause, LuPlay, LuSend } from "react-icons/lu";
import CampaignStatusChip from "../../../components/chips/CampaignStatusChip";
import { ICampaign } from "../../../types/campaign";

interface CampaignCardProps {
  campaign: ICampaign;
  onEdit: (campaign: ICampaign) => void;
  onArchive: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const CampaignCard = ({
  campaign,
  onEdit,
  onArchive,
  onDuplicate,
  onDelete,
}: CampaignCardProps) => {
  const {
    _id,
    name,
    subjectLine,
    status,
    stats,
    createdAt,
    schedule,
    audienceId,
  } = campaign;

  const recipients =
    // @ts-ignore
    (audienceId?.contacts || stats?.sentCount || 0) + " recipients";

  const getIconForAction = (action: string) => {
    switch (action) {
      case "Edit":
        return FiEdit;
      case "Duplicate":
        return FiCopy;
      case "Pause":
        return LuPause;
      default:
        return null;
    }
  };

  const isLive = ["sent", "active"].includes(status);

  return (
    <div className="bg-background border border-foreground/10 rounded-xl p-4">
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-start gap-2.5 w-full">
          <span className="inline-block mt-0.5">
            {status === "scheduled" ? (
              <FiClock className="text-blue-500 text-lg" />
            ) : status === "paused" ? (
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
              {subjectLine}
            </p>
            <div className="text-xs text-gray-500 dark:text-foreground/50 mt-0.5">
              <span>{recipients}</span>
              <span className="mx-1.5">•</span>
              <span>Created {new Date(createdAt).toLocaleDateString()}</span>
              {schedule?.date && (
                <>
                  <span className="mx-1.5">•</span>
                  <span>
                    Scheduled {new Date(schedule.date).toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <CampaignStatusChip status={status as any} />
      </div>

      {isLive && stats && (
        <div className="grid grid-cols-4 gap-4 pt-4">
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-content1 rounded-lg space-y-0.5">
            <p className="text-xs text-gray-500 dark:text-foreground/50">
              Sent
            </p>
            <p className="text-sm font-semibold">{stats.sentCount}</p>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-content1 rounded-lg space-y-0.5">
            <p className="text-xs text-gray-500 dark:text-foreground/50">
              Open Rate
            </p>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
              {stats.openRate}
            </p>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-content1 rounded-lg space-y-0.5">
            <p className="text-xs text-gray-500 dark:text-foreground/50">
              Click Rate
            </p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {stats.clickRate}
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

      {/* Action Buttons Row */}
      <div className="flex justify-between items-center pt-4 mt-4 border-t border-foreground/10">
        <div className="flex gap-2">
          {["Edit", "Duplicate"].map((action) => (
            <Button
              key={action}
              size="sm"
              radius="sm"
              variant="ghost"
              color="default"
              onPress={() =>
                action === "Edit" ? onEdit(campaign) : onDuplicate(_id)
              }
              // @ts-ignore
              startContent={React.createElement(getIconForAction(action), {
                className: "size-3.5",
              })}
              className="border-small"
            >
              {action}
            </Button>
          ))}
          {status === "paused" && (
            <Button
              size="sm"
              radius="sm"
              variant="solid"
              color="primary"
              onPress={() => console.log("Resume button clicked")}
              startContent={<LuPlay className="size-3.5" />}
            >
              Resume
            </Button>
          )}
          {status === "active" && (
            <Button
              size="sm"
              radius="sm"
              variant="solid"
              color="warning"
              onPress={() => console.log("Pause button clicked")}
              startContent={<LuPause className="size-3.5" />}
            >
              Pause
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
            startContent={<LuFileText className="size-3.5" />}
            className="border-small"
          >
            View Report
          </Button>
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            color="default"
            onPress={() => onArchive(_id)}
            startContent={<FiArchive className="size-3.5" />}
            className="border-small"
          >
            Archive
          </Button>
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            color="danger"
            onPress={() => onDelete(_id)}
            startContent={<FiTrash2 className="size-3.5" />}
            className="border-small"
            isIconOnly
          />
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
