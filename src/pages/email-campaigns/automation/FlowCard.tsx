import { Button } from "@heroui/react";
import React from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { FiCopy, FiEdit } from "react-icons/fi";
import { IoTrendingUp } from "react-icons/io5";
import { LuPause, LuPlay, LuTarget, LuTrash2, LuUsers } from "react-icons/lu";
import FlowStatusChip from "../../../components/chips/FlowStatusChip";

const FlowCard = ({ flow }: any) => {
  const { title, description, status, emails, trigger, metrics, actions } =
    flow;

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

  return (
    <div className="bg-background border border-foreground/10 rounded-xl p-5">
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-start gap-2.5 w-full">
          <span className="inline-block mt-0.5">
            {status === "paused" ? (
              <LuPause className="text-yellow-500 text-lg" />
            ) : status === "draft" ? (
              <FiEdit className="text-gray-500 text-lg" />
            ) : (
              <LuPlay className="text-green-500 text-lg" />
            )}
          </span>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">{title}</h4>
            </div>
            <p className="text-xs text-gray-600">{description}</p>
            <div className="text-xs text-gray-500 mt-1 flex gap-2.5">
              <p className="inline-flex items-center gap-1.5">
                <FaRegEnvelope />
                <span>{emails} emails</span>
              </p>
              <p className="inline-flex items-center gap-1.5">
                <LuUsers />
                <span>{metrics.subscribers} subscribers</span>
              </p>
              <p className="inline-flex items-center gap-1.5">
                <LuTarget />
                <span>Trigger: {trigger}</span>
              </p>
            </div>
          </div>
        </div>
        <FlowStatusChip status={status} />
      </div>

      {status === "active" && metrics && (
        <div className="grid grid-cols-4 gap-4 pt-4">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg space-y-0.5">
            <p className="text-xs text-gray-500">Subscribers</p>
            <p className="text-sm font-semibold">{metrics.subscribers}</p>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg space-y-0.5">
            <p className="text-xs text-gray-500">Open Rate</p>
            <p className="text-sm font-semibold text-green-600">
              {metrics.openRate}
            </p>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg space-y-0.5">
            <p className="text-xs text-gray-500">Click Rate</p>
            <p className="text-sm font-semibold text-blue-600">
              {metrics.clickRate}
            </p>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg space-y-0.5">
            <p className="text-xs text-gray-500">Conversions</p>
            <p className="text-sm font-semibold">{metrics.conversions}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 mt-4 border-t border-primary/10">
        <div className="flex gap-2">
          {actions
            .filter((a: any) => ["Edit Flow", "Duplicate", "Pause"].includes(a))
            .map((action: any) => (
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
            startContent={<IoTrendingUp className="size-3.5" />}
            className="border-small"
          >
            Analytics
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

export default FlowCard;
