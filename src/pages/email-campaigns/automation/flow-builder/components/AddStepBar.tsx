import { Button } from "@heroui/react";
import React from "react";
import { LuPlus } from "react-icons/lu";

interface AddStepBarProps {
  onAdd: (type: string) => void;
}

const STEP_OPTIONS = [
  { label: "Send Email", type: "email" },
  { label: "Wait", type: "wait" },
  { label: "Condition", type: "condition" },
  { label: "Action", type: "action" },
  // { label: "Add/Remove Tag", type: "tag" },
];

const AddStepBar: React.FC<AddStepBarProps> = ({ onAdd }) => {
  return (
    <div className="flex items-center gap-2">
      {STEP_OPTIONS.map((opt) => (
        <Button
          key={opt.type}
          size="sm"
          variant="bordered"
          className="bg-white dark:bg-default-100/5 border border-default-200 dark:border-default-100 text-default-600 dark:text-default-500 text-xs font-medium h-8 rounded-lg hover:bg-default-50 transition-colors"
          startContent={<LuPlus className="size-[15px]" />}
          onPress={() => onAdd(opt.type)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
};

export default AddStepBar;
