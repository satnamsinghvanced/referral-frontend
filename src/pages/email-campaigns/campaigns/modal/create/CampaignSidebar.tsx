import clsx from "clsx";
import React from "react";
import {
  FiCheckSquare,
  FiClock,
  FiFileText,
  FiLayout,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import { LuCircleCheckBig } from "react-icons/lu";

export const steps = [
  { id: 0, name: "Setup", icon: FiSettings },
  { id: 1, name: "Template", icon: FiLayout },
  { id: 2, name: "Content", icon: FiFileText },
  { id: 3, name: "Audience", icon: FiUsers },
  { id: 4, name: "Schedule", icon: FiClock },
  { id: 5, name: "Review", icon: FiCheckSquare },
];

interface CampaignSidebarProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (stepId: number) => void;
}

const CampaignSidebar: React.FC<
  CampaignSidebarProps & { isStepValid?: boolean }
> = ({ currentStep, onStepChange, isStepValid = false }) => {
  return (
    <nav className="w-64 flex-shrink-0 bg-gray-50 dark:bg-content1 p-4 border-r border-foreground/10">
      <ul role="list" className="space-y-2  ">
        {steps.map((step) => {
          const isCurrent = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isForwardEnabled = step.id > currentStep && isStepValid;
          const isClickable = isCompleted || isCurrent || isForwardEnabled;

          return (
            <li key={step.name}>
              <button
                className={clsx(
                  "w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isCurrent
                    ? "!bg-blue-50 !text-blue-600 dark:!bg-blue-500/10 dark:!text-blue-400"
                    : isCompleted
                      ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                      : "text-gray-600 dark:text-foreground/60 hover:bg-gray-100 dark:hover:bg-foreground/5",
                  isClickable ? "cursor-pointer" : "cursor-default",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  if (isClickable) {
                    onStepChange(step.id);
                  }
                }}
                aria-current={isCurrent ? "step" : undefined}
              >
                <div
                  className={clsx(
                    "size-6 mr-2.5 flex items-center justify-center rounded-full border",
                    isCurrent
                      ? "border-blue-600 bg-blue-50 dark:bg-background text-blue-600 dark:text-blue-400"
                      : isCompleted
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-gray-300 dark:border-foreground/20 text-gray-400 dark:text-foreground/40 bg-background",
                  )}
                >
                  {isCompleted ? (
                    <LuCircleCheckBig />
                  ) : (
                    <step.icon className="size-3.5" />
                  )}
                </div>

                <span
                  className={clsx(
                    isCompleted ? "text-green-700 dark:text-green-400" : "",
                  )}
                >
                  {step.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CampaignSidebar;
