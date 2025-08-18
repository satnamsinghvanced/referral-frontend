"use client";
import { Tab, Tabs } from "@heroui/react";

const RoleToggleTabs = ({ selected, onSelectionChange }) => {
    return (
        <div className="bg-gray-200 rounded-full w-full">
            <Tabs
                selectedKey={selected}
                onSelectionChange={onSelectionChange}
                aria-label="Select Role"
                variant="light"
                radius="full"
                classNames={{
                    tabList: "flex w-full rounded-full",
                    tab: "flex-1 px-4 py-1 text-sm font-medium transition-all",
                    cursor: "rounded-full",
                }}
                className="text-white w-full"
            >
                {["Doctor Referrals", "Patient Referrals"].map((role) => (  
                    <Tab
                        key={role}
                        title={role}
                        classNames={{
                            base: `rounded-full data-[selected=true]:bg-white data-[selected=true]:text-black data-[selected=false]:text-white w-full border-0`,
                        }}
                    />
                ))}
            </Tabs>
        </div>
    );
};

export default RoleToggleTabs;