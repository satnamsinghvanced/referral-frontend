import { IStep, FlowStep, UIStepType, APIStepType } from "../types/campaign";

const typeMapUItoAPI: Record<string, APIStepType> = {
  trigger: "send-email",
  email: "send-email",
  wait: "wait",
  condition: "condition",
  action: "action",
};

const typeMapAPItoUI: Record<string, UIStepType> = {
  "send-email": "email",
  wait: "wait",
  condition: "condition",
  action: "action",
};

export const mapUIFlowToAPI = (
  steps: FlowStep[],
  flowName: string,
  description: string,
): any => {
  const rootTrigger = steps[0];
  const triggerConfig = rootTrigger?.config || {};

  const mapSteps = (uiSteps: FlowStep[]): any[] => {
    return uiSteps.map((step) => {
      const { templateName, ...cleanConfig } = step.config || {};
      const apiStep: any = {
        type: typeMapUItoAPI[step.type] || "send-email",
        config: cleanConfig,
        steps: step.children ? mapSteps(step.children) : [],
        yesSteps: step.branches?.yes ? mapSteps(step.branches.yes) : [],
        noSteps: step.branches?.no ? mapSteps(step.branches.no) : [],
      };
      if (!step.id.startsWith("step-")) {
        apiStep._id = step.id;
      }
      return apiStep;
    });
  };

  return {
    name: flowName,
    description,
    trigger: {
      type: "New Referrer Added",
      config: triggerConfig,
    },
    steps: rootTrigger?.children ? mapSteps(rootTrigger.children) : [],
  };
};

export const mapAPIFlowToUI = (automation: any): FlowStep[] => {
  const mapSteps = (apiSteps: any[]): FlowStep[] => {
    return apiSteps.map((step) => ({
      id: step._id || `step-${Math.random().toString(36).substr(2, 9)}`,
      type: typeMapAPItoUI[step.type] || "email",
      title: step.type.charAt(0).toUpperCase() + step.type.slice(1),
      description: "Configured from API",
      config: step.config,
      children: step.steps ? mapSteps(step.steps) : [],
      branches: {
        yes: step.yesSteps ? mapSteps(step.yesSteps) : [],
        no: step.noSteps ? mapSteps(step.noSteps) : [],
      },
    }));
  };

  const triggerStep: FlowStep = {
    id: "trigger-step",
    type: "trigger",
    title: "Trigger",
    description: automation.trigger?.type || "Select Trigger",
    config: automation.trigger?.config || {},
    children: automation.steps ? mapSteps(automation.steps) : [],
  };

  return [triggerStep];
};
