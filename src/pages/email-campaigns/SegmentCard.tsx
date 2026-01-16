import { Button } from "@heroui/react";
import React from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { FiCopy, FiEdit } from "react-icons/fi";
import { IoTrendingUp } from "react-icons/io5";
import {
  LuCalendar,
  LuDownload,
  LuPause,
  LuPlay,
  LuTarget,
  LuTrash2,
  LuUsers,
} from "react-icons/lu";
import AudienceSegmentTypeChip from "../../components/chips/AudienceSegmentTypeChip";
import AudienceSegmentStatusChip from "../../components/chips/AudienceSegmentStatusChip";

const SegmentCard = ({ segment }: any) => {
  const {
    name,
    description,
    type,
    status,
    contacts,
    campaigns,
    updatedAt,
    tags,
    avgOpenRate,
    avgClickRate,
    size,
  } = segment;

  const getIconForAction = (action: string) => {
    switch (action) {
      case "Edit":
        return FiEdit;
      case "Duplicate":
        return FiCopy;
      case "Create Campaign":
        return FaRegEnvelope;
      default:
        return null;
    }
  };

  return (
    <div className="bg-background border border-foreground/10 rounded-xl p-5">
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-start gap-2.5 w-full">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">{name}</h4>
            </div>
            <p className="text-xs text-gray-600">{description}</p>
            <div className="text-xs text-gray-500 mt-1 flex gap-2.5">
              <p className="inline-flex items-center gap-1.5">
                <LuUsers />
                <span>{contacts} contacts</span>
              </p>
              <p className="inline-flex items-center gap-1.5">
                <FaRegEnvelope />
                <span>{campaigns} campaigns</span>
              </p>
              <p className="inline-flex items-center gap-1.5">
                <LuCalendar />
                <span>Updated At: {updatedAt}</span>
              </p>
            </div>
            <div className="mt-2 flex items-center flex-wrap gap-1.5">
              <AudienceSegmentTypeChip type={type} />
              <div className="flex items-center flex-wrap gap-1.5">
                {tags.slice(0, 3).map((tag: string) => (
                  <span
                    key={tag}
                    className="border border-foreground/10 text-[11px] rounded-md px-1.5 py-0.5"
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <AudienceSegmentStatusChip status={status} />
      </div>

      {status === "active" && (
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg space-y-0.5">
            <p className="text-xs text-gray-500">Size</p>
            <p className="text-sm font-semibold">{size}</p>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg space-y-0.5">
            <p className="text-xs text-gray-500">Avg Open Rate</p>
            <p className="text-sm font-semibold text-green-600">
              {avgOpenRate}
            </p>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg space-y-0.5">
            <p className="text-xs text-gray-500">Avg Click Rate</p>
            <p className="text-sm font-semibold text-blue-600">
              {avgClickRate}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 mt-4 border-t border-primary/10">
        <div className="flex gap-2">
          {["Edit", "Duplicate", "Create Campaign"].map((action: any) => (
            <Button
              key={action}
              size="sm"
              radius="sm"
              variant="ghost"
              color="default"
              onPress={() => console.log(`${action} button clicked`)}
              // @ts-ignore
              startContent={React.createElement(getIconForAction(action), {
                className: "size-3.5",
              })}
              className="border-small"
            >
              {action}
            </Button>
          ))}
          {status === "draft" && (
            <Button
              size="sm"
              radius="sm"
              variant="solid"
              color="primary"
              onPress={() => console.log("Send Now button clicked")}
              startContent={<LuPlay className="size-3.5" />}
            >
              Activate
            </Button>
          )}
        </div>
        <div className="flex gap-2 text-sm font-medium text-gray-600">
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            color="default"
            onPress={() => console.log("View Report clicked")}
            startContent={<LuDownload className="size-3.5" />}
            className="border-small"
          >
            Export
          </Button>
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            color="default"
            onPress={() => console.log("Archive clicked")}
            startContent={<LuTrash2 className="size-3.5" />}
            className="border-small"
            isIconOnly
          />
        </div>
      </div>
    </div>
  );
};

export default SegmentCard;
