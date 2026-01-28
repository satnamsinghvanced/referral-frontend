import { Button, Input, Switch, useDisclosure } from "@heroui/react";
import { useCallback, useState } from "react";
import { LuPlay, LuSave } from "react-icons/lu";
import FlowCanvas from "./components/FlowCanvas";
import ActionModal from "./modal/ActionModal";
import ConditionModal from "./modal/ConditionModal";
import EmailModal from "./modal/EmailModal";
import TagModal from "./modal/TagModal";
import TriggerModal from "./modal/TriggerModal";
import WaitModal from "./modal/WaitModal";

// --- Types ---
export type StepType =
  | "trigger"
  | "email"
  | "wait"
  | "condition"
  | "action"
  | "tag";

export interface FlowStep {
  id: string;
  type: StepType;
  title: string;
  description: string;
  config?: any;
  children?: FlowStep[]; // Standard sequential steps
  branches?: {
    yes: FlowStep[];
    no: FlowStep[];
  };
}

const FlowBuilder = () => {
  const [flowName, setFlowName] = useState("New Automation Flow");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(false);

  const [steps, setSteps] = useState<FlowStep[]>([
    {
      id: "trigger-step",
      type: "trigger",
      title: "Select Trigger",
      description: "When should this flow start?",
      config: {},
      children: [],
    },
  ]);

  // Modal Control States
  const [currentStep, setCurrentStep] = useState<FlowStep | null>(null);
  const triggerModal = useDisclosure();
  const emailModal = useDisclosure();
  const waitModal = useDisclosure();
  const conditionModal = useDisclosure();
  const actionModal = useDisclosure();
  const tagModal = useDisclosure();

  const openModalForStep = (step: FlowStep) => {
    setCurrentStep(step);
    switch (step.type) {
      case "trigger":
        triggerModal.onOpen();
        break;
      case "email":
        emailModal.onOpen();
        break;
      case "wait":
        waitModal.onOpen();
        break;
      case "condition":
        conditionModal.onOpen();
        break;
      case "action":
        actionModal.onOpen();
        break;
      case "tag":
        tagModal.onOpen();
        break;
    }
  };

  const findStepById = (id: string, stepList: FlowStep[]): FlowStep | null => {
    for (const step of stepList) {
      if (step.id === id) return step;
      if (step.children) {
        const found = findStepById(id, step.children);
        if (found) return found;
      }
      if (step.branches) {
        const foundYes = findStepById(id, step.branches.yes);
        if (foundYes) return foundYes;
        const foundNo = findStepById(id, step.branches.no);
        if (foundNo) return foundNo;
      }
    }
    return null;
  };

  const updateStepAtId = (
    id: string,
    stepList: FlowStep[],
    newConfig: any,
  ): FlowStep[] => {
    return stepList.map((step) => {
      if (step.id === id) {
        return {
          ...step,
          config: newConfig,
          description: generateDescription(step.type, newConfig),
        };
      }
      return {
        ...step,
        children: step.children
          ? updateStepAtId(id, step.children, newConfig)
          : [],
        branches: step.branches
          ? {
              yes: updateStepAtId(id, step.branches.yes, newConfig),
              no: updateStepAtId(id, step.branches.no, newConfig),
            }
          : undefined,
      } as FlowStep;
    });
  };

  const generateDescription = (type: StepType, config: any) => {
    switch (type) {
      case "wait":
        return `Wait for ${config.duration} ${config.unit}`;
      case "email":
        return `Send template: ${config.template}`;
      case "condition":
        return `Condition: ${config.conditionType}`;
      case "action":
        return `Action: ${config.actionType}`;
      case "tag":
        return `Tag: ${config.tagName}`;
      default:
        return "Configured successfully";
    }
  };

  const handleAddStepAt = useCallback((type: string, path: string) => {
    const newId = `step-${Math.random().toString(36).substr(2, 9)}`;
    const newStep: FlowStep = {
      id: newId,
      type: type as StepType,
      title:
        type === "tag"
          ? "Add/Remove Tag"
          : type.charAt(0).toUpperCase() + type.slice(1),
      description: "Click to configure this step",
      config: {},
      children: [],
      ...(type === "condition" ? { branches: { yes: [], no: [] } } : {}),
    };

    setSteps((prev) => insertStepAt(prev, path, newStep));
  }, []);

  const insertStepAt = (
    stepList: FlowStep[],
    path: string,
    newStep: FlowStep,
  ): FlowStep[] => {
    const parts = path.split(".");
    const index = parseInt(parts[0] as string);

    // If we're at the target level
    if (parts.length === 1) {
      const newList = [...stepList];
      newList.splice(index + 1, 0, newStep); // Sibling insertion
      return newList;
    }

    // Special handling for adding to 'last' of a collection
    if (parts[1] === "children" && parts[2] === "last") {
      return stepList.map((step, idx) => {
        if (idx === index) {
          return { ...step, children: [...(step.children || []), newStep] };
        }
        return step;
      });
    }

    if (
      parts[1] === "branches" &&
      (parts[2] === "yes" || parts[2] === "no") &&
      parts[3] === "last"
    ) {
      const branchName = parts[2] as "yes" | "no";
      return stepList.map((step, idx) => {
        if (idx === index) {
          return {
            ...step,
            branches: {
              ...step.branches!,
              [branchName]: [...step.branches![branchName], newStep],
            },
          };
        }
        return step;
      });
    }

    // Recurse deeper
    return stepList.map((step, idx) => {
      if (idx === index) {
        if (parts[1] === "children") {
          return {
            ...step,
            children: insertStepAt(
              step.children || [],
              parts.slice(2).join("."),
              newStep,
            ),
          };
        }
        if (parts[1] === "branches") {
          const branchName = parts[2] as "yes" | "no";
          return {
            ...step,
            branches: {
              ...step.branches!,
              [branchName]: insertStepAt(
                step.branches![branchName],
                parts.slice(3).join("."),
                newStep,
              ),
            },
          };
        }
      }
      return step;
    });
  };

  const handleDeleteStep = useCallback((stepId: string) => {
    const remove = (list: FlowStep[]): FlowStep[] => {
      return list
        .filter((item) => item.id !== stepId)
        .map(
          (item) =>
            ({
              ...item,
              children: remove(item.children || []),
              branches: item.branches
                ? {
                    yes: remove(item.branches.yes),
                    no: remove(item.branches.no),
                  }
                : undefined,
            }) as FlowStep,
        );
    };
    setSteps((prev) => remove(prev));
  }, []);

  const handleEditStep = useCallback(
    (stepId: string) => {
      const step = findStepById(stepId, steps);
      if (step) openModalForStep(step);
    },
    [steps],
  );

  const onSaveConfig = (newConfig: any) => {
    if (currentStep) {
      setSteps((prev) => updateStepAtId(currentStep.id, prev, newConfig));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-background rounded-xl border border-foreground/10 p-4 space-y-4">
        <div className="w-full space-y-4">
          <Input
            label="Flow Name"
            labelPlacement="outside-top"
            placeholder="e.g., New Referrer Welcome Sequence"
            value={flowName}
            onValueChange={setFlowName}
            size="sm"
            variant="flat"
          />
          <Input
            label="Description"
            labelPlacement="outside-top"
            placeholder="Describe what this automation does..."
            value={description}
            onValueChange={setDescription}
            size="sm"
            variant="flat"
          />
          <div className="flex items-center justify-between">
            <Switch
              isSelected={isActive}
              onValueChange={setIsActive}
              color="primary"
              size="sm"
            >
              <span className="text-sm font-semibold">
                {isActive ? "Active" : "Inactive"}
              </span>
            </Switch>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                className="border-small"
                startContent={<LuSave className="size-[14px]" />}
              >
                Save
              </Button>
              <Button
                color="primary"
                size="sm"
                radius="sm"
                variant="solid"
                startContent={<LuPlay className="size-[14px]" />}
              >
                Activate
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-background rounded-xl border border-foreground/10 p-4 overflow-hidden flex flex-col gap-5">
        <h4 className="font-medium text-sm">Flow Canvas</h4>
        <FlowCanvas
          steps={steps}
          onAddStep={handleAddStepAt}
          onEditStep={handleEditStep}
          onDeleteStep={handleDeleteStep}
        />
      </div>

      <TriggerModal
        isOpen={triggerModal.isOpen}
        onOpenChange={triggerModal.onOpenChange}
        onSave={onSaveConfig}
        initialData={currentStep?.config}
      />
      <EmailModal
        isOpen={emailModal.isOpen}
        onOpenChange={emailModal.onOpenChange}
        onSave={onSaveConfig}
        initialData={currentStep?.config}
      />
      <WaitModal
        isOpen={waitModal.isOpen}
        onOpenChange={waitModal.onOpenChange}
        onSave={onSaveConfig}
        initialData={currentStep?.config}
      />
      <ConditionModal
        isOpen={conditionModal.isOpen}
        onOpenChange={conditionModal.onOpenChange}
        onSave={onSaveConfig}
        initialData={currentStep?.config}
      />
      <ActionModal
        isOpen={actionModal.isOpen}
        onOpenChange={actionModal.onOpenChange}
        onSave={onSaveConfig}
        initialData={currentStep?.config}
      />
      <TagModal
        isOpen={tagModal.isOpen}
        onOpenChange={tagModal.onOpenChange}
        onSave={onSaveConfig}
        initialData={currentStep?.config}
      />
    </div>
  );
};

export default FlowBuilder;
