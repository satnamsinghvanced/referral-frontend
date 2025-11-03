import React from "react";
import { Tab, Tabs } from "@heroui/react";

interface RoleToggleTabsProps {
  selected?: string;
  onSelectionChange: (key: string) => void;
}

const RoleToggleTabs: React.FC<RoleToggleTabsProps> = ({
  selected = "Referrals",
  onSelectionChange,
}) => {
  return (
    <div className="bg-primary/10 rounded-full w-full">
      <Tabs
        selectedKey={selected}
        onSelectionChange={onSelectionChange as any}
        aria-label="Select Role"
        variant="light"
        radius="full"
        classNames={{
          tabList: "flex w-full rounded-full",
          tab: "flex-1 px-4 py-1 text-sm font-medium transition-all",
          cursor: "rounded-full",
        }}
        className="text-background w-full"
      >
        {["Referrals", "Referrers", "NFC & QR Tracking"].map((role) => (
          <Tab
            key={role}
            title={role}
            className="rounded-full data-[selected=true]:bg-white data-[selected=true]:text-black data-[selected=false]:text-white w-full border-0"
          />
        ))}
      </Tabs>
    </div>
  );
};

export default RoleToggleTabs;
