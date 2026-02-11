import { Button } from "@heroui/react";
import clsx from "clsx";
import React from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { LuClock, LuGitBranch, LuZap, LuTarget, LuTag } from "react-icons/lu";

interface StepNodeProps {
  step: any;
  onEdit: (stepId: string) => void;
  onDelete: (stepId: string) => void;
}

const STEP_STYLES: any = {
  trigger: {
    bg: "bg-[#f5f3ff] dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-600 dark:text-purple-400",
    icon: LuTarget,
  },
  email: {
    bg: "bg-[#eff6ff] dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-600 dark:text-blue-400",
    icon: FaRegEnvelope,
  },
  wait: {
    bg: "bg-[#fff7ed] dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
    text: "text-orange-600 dark:text-orange-400",
    icon: LuClock,
  },
  condition: {
    bg: "bg-[#f0fdf4] dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-600 dark:text-green-400",
    icon: LuGitBranch,
  },
  action: {
    bg: "bg-[#fefce8] dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800",
    text: "text-yellow-600 dark:text-yellow-400",
    icon: LuZap,
  },
  tag: {
    bg: "bg-[#fdf2f8] dark:bg-pink-900/20",
    border: "border-pink-200 dark:border-pink-800",
    text: "text-pink-600 dark:text-pink-400",
    icon: LuTag,
  },
};

const StepNode: React.FC<StepNodeProps> = ({ step, onEdit, onDelete }) => {
  const style = STEP_STYLES[step.type] || STEP_STYLES.action;
  const Icon = style.icon;

  return (
    <div
      className={clsx(
        "flex items-center gap-3 p-4 rounded-xl border-2 transition-all hover:shadow-md bg-white dark:bg-[#1d1e24] w-full",
        style.bg,
        style.border,
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-center size-9 rounded-full",
          style.bg,
        )}
      >
        <Icon className={clsx("size-4", style.text)} />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className={clsx("text-sm font-medium truncate", style.text)}>
          {step.title}
        </h4>
        <p className="text-xs text-default-500 truncate mt-0.5">
          {step.description}
        </p>
        {/* {step.pills && step.pills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {step.pills.map((pill: string, idx: number) => (
              <div
                key={idx}
                className="bg-default-100 dark:bg-default-100/10 text-[10px] px-1.5 py-0.5 rounded border border-default-200 dark:border-default-700 text-default-600 dark:text-default-400 font-medium"
              >
                {pill}
              </div>
            ))}
          </div>
        )} */}
      </div>

      <div className="flex items-center gap-1">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className={clsx("text-default-400 hover:text-primary", style.text)}
          onPress={() => onEdit(step.id)}
        >
          <FiEdit2 className="size-4" />
        </Button>
        {step.type !== "trigger" && (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-default-400 hover:text-danger"
            onPress={() => onDelete(step.id)}
          >
            <FiTrash2 className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepNode;
