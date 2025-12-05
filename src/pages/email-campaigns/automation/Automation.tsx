import { Tab, Tabs } from "@heroui/react";
import ActiveFlows from "./ActiveFlows";
import Templates from "../Templates";
import FlowBuilder from "./FlowBuilder";

const Automation = () => {
  return (
    <Tabs
      aria-label="Options"
      classNames={{
        tabList: "flex w-full rounded-full bg-primary/10 text-xs",
        tab: "flex-1 text-sm font-medium transition-all",
        cursor: "rounded-full text-xs",
        panel: "p-0 mt-5",
      }}
      className="text-background w-full text-xs"
    >
      <Tab key="active-flows" title="Active Flows">
        <ActiveFlows />
      </Tab>

      <Tab key="templates" title="Templates">
        <Templates />
      </Tab>

      <Tab key="flow-builder" title="Flow Builder">
        <FlowBuilder />
      </Tab>
    </Tabs>
  );
};

export default Automation;
