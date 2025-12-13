import { Button, Checkbox, Input, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { FaEnvelope } from "react-icons/fa6";
import { FiGitBranch } from "react-icons/fi";
import { LuArrowDown, LuClock, LuGitBranch, LuPlus } from "react-icons/lu";
import FlowStepCard from "./FlowStepCard";
import { FaRegEnvelope } from "react-icons/fa";

// --- Flow Step Data ---
const FLOW_STEPS_DATA = [
  {
    id: 1,
    type: "email",
    title: "Welcome Email",
    description: "Initial welcome message with practice information",
    icon: FaRegEnvelope,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    id: 2,
    type: "wait",
    title: "Wait 3 Days",
    description: "Allow time for initial email to be processed",
    details: "3 days",
    icon: LuClock,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50",
  },
  {
    id: 3,
    type: "email",
    title: "Resources & Guidelines",
    description: "Send referral guidelines and helpful resources",
    icon: FaRegEnvelope,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    id: 4,
    type: "wait",
    title: "Wait 7 Days",
    description: "Wait for engagement before next email",
    details: "7 days",
    icon: LuClock,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50",
  },
  {
    id: 5,
    type: "branch",
    title: "Check Engagement",
    description: "Branch based on email opens/clicks",
    icon: LuGitBranch,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
  {
    id: 6,
    type: "action",
    title: "Follow-up & Contact",
    description: "Personal follow-up with contact information",
    icon: LuArrowDown, // Using a generic icon for final action
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
  },
];

const FlowBuilder = () => {
  const [flowName, setFlowName] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("select");
  const [isActivated, setIsActivated] = useState(false);

  return (
    <div className="bg-background rounded-xl border border-primary/15 p-5">
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
        <div className="space-y-4 md:space-y-5">
          {/* Flow Settings Card */}
          <div className="border border-primary/15 p-4 rounded-xl">
            <h4 className="text-sm font-medium mb-4">Flow Settings</h4>

            <div className="space-y-4">
              <div className="space-y-4 flex">
                <Input
                  size="sm"
                  radius="sm"
                  label="Flow Name"
                  labelPlacement="outside-top"
                  placeholder="Enter flow name..."
                  value={flowName}
                  onValueChange={setFlowName}
                />
              </div>
              <div className="space-y-4 flex">
                <Select
                  label="Trigger Event"
                  labelPlacement="outside"
                  placeholder="Select trigger"
                  size="sm"
                  radius="sm"
                  selectedKeys={[triggerEvent]}
                  disabledKeys={[triggerEvent]}
                  onSelectionChange={(keys) =>
                    setTriggerEvent(Array.from(keys)[0] as string)
                  }
                >
                  <SelectItem key="select">Select trigger</SelectItem>
                  <SelectItem key="new-partner">New Partner Added</SelectItem>
                  <SelectItem key="treatment-end">
                    Treatment Completed
                  </SelectItem>
                  <SelectItem key="no-referral">
                    No Referral in 30 Days
                  </SelectItem>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  size="sm"
                  radius="sm"
                  checked={isActivated}
                  onChange={(e) => setIsActivated(e.target.checked)}
                >
                  Activate immediately
                </Checkbox>
              </div>
            </div>
          </div>

          {/* Flow Steps List */}
          <div className="border border-primary/15 p-4 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Flow Steps</h4>
              <Button
                size="sm"
                variant="solid"
                color="primary"
                startContent={<LuPlus className="w-4 h-4" />}
                onPress={() => console.log("Add Step clicked")}
              >
                Add Step
              </Button>
            </div>

            <div className="space-y-4">
              {FLOW_STEPS_DATA.map((step, index) => (
                <FlowStepCard
                  key={step.id}
                  step={step}
                  index={index + 1}
                  totalSteps={FLOW_STEPS_DATA.length}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Button
              size="sm"
              radius="sm"
              variant="ghost"
              color="default"
              onPress={() => console.log("Save as Draft clicked")}
              className="border-small"
            >
              Save as Draft
            </Button>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                color="default"
                onPress={() => console.log("Test Flow clicked")}
                className="border-small"
              >
                Test Flow
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="solid"
                color="primary"
                onPress={() => console.log("Activate Flow clicked")}
              >
                Activate Flow
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="border border-primary/15 p-4 rounded-xl space-y-4">
            <h4 className="text-sm font-medium">Flow Preview</h4>
            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <div className="flex flex-col items-center gap-3">
                <div className="text-gray-600 text-4xl">
                  <FiGitBranch />
                </div>
                <p className="text-xs text-gray-500">
                  Flow steps will appear here as you build
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder;
