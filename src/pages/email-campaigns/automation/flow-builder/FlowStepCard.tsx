import { Button } from "@heroui/react";
import clsx from "clsx";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiChevronDown, FiChevronUp, FiEdit } from "react-icons/fi";
import { LuClock, LuTrash2 } from "react-icons/lu";

const FlowStepCard = ({ step, index, totalSteps }: any) => {
  const { title, description, details, icon: Icon, iconColor } = step;
  const isWaitStep = step.type === "wait";

  return (
    <div className="flex items-start gap-3 p-4 border border-foreground/10 rounded-lg">
      {/* Step Number */}
      <div className="flex flex-col items-center">
        <span className="font-medium text-gray-600 dark:text-foreground/60">
          {index}
        </span>
        {index < totalSteps && (
          <div className="h-8 w-px bg-gray-200 dark:bg-foreground/10 my-1"></div>
        )}
      </div>

      {/* Step Content */}
      <div className="flex-grow flex justify-between items-center">
        <div className="flex items-start gap-2.5">
          <Icon className={`mt-1 size-4 ${iconColor}`} />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-gray-600 dark:text-foreground/50">
              {description}
            </p>
            {isWaitStep && details && (
              <p className="text-xs text-orange-600 mt-1 flex items-center">
                <LuClock className="w-3 h-3 mr-1" />
                {details}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Step Actions (Edit, Delete, Move) */}
      <div className="flex items-center gap-2 text-gray-400">
        <Button
          size="sm"
          radius="sm"
          variant="ghost"
          color="default"
          className="border-small"
          onPress={() => console.log(`Edit Step ${index}`)}
          startContent={<FiEdit className="size-3.5" />}
          isIconOnly
        />
        <Button
          size="sm"
          radius="sm"
          variant="ghost"
          color="default"
          className="border-small"
          onPress={() => console.log(`Delete Step ${index}`)}
          startContent={<LuTrash2 className="size-3.5" />}
          isIconOnly
        />
        <div className="flex flex-col">
          <span
            className={clsx(
              "rounded-sm transition !bg-transparent",
              index === 1
                ? "text-gray-200 dark:text-foreground/20 cursor-not-allowed"
                : "hover:bg-gray-100 dark:hover:bg-foreground/5 hover:text-gray-600 dark:hover:text-foreground cursor-pointer",
            )}
            onClick={() => console.log(`Move Up Step ${index}`)}
          >
            <FiChevronUp className="w-4 h-4" />
          </span>
          <span
            className={clsx(
              "rounded-sm transition !bg-transparent",
              index === totalSteps
                ? "text-gray-200 dark:text-foreground/20 cursor-not-allowed"
                : "hover:bg-gray-100 dark:hover:bg-foreground/5 hover:text-gray-600 dark:hover:text-foreground cursor-pointer",
            )}
            onClick={() => console.log(`Move Down Step ${index}`)}
          >
            <FiChevronDown className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlowStepCard;
