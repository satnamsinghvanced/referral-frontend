import { Tab, Tabs } from "@heroui/react";
import Templates from "../Templates";
import ActiveFlows from "./ActiveFlows";
import FlowBuilder from "./FlowBuilder";

const Automation = () => {
  return (
    <div className="space-y-5">
      <Tabs
        aria-label="Options"
        variant="light"
        radius="full"
        classNames={{
          base: "bg-primary/15 dark:bg-background rounded-full p-1 w-full",
          tabList: "flex w-full rounded-full p-0 gap-0",
          tab: "flex-1 h-9 text-sm font-medium transition-all",
          cursor: "rounded-full bg-white dark:bg-primary",
          tabContent:
            "dark:group-data-[selected=true]:text-primary-foreground text-default-500 dark:text-foreground/60 transition-colors",
          panel: "p-0",
        }}
        className="w-full"
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
    </div>
  );
};

export default Automation;
