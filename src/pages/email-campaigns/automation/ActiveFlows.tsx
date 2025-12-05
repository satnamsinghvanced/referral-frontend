import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { FiSearch, FiZap } from "react-icons/fi";
import { FLOW_STATUSES } from "../../../consts/campaign";
import FlowCard from "./FlowCard";
import { PiFunnelX } from "react-icons/pi";

const ACTIVE_FLOWS_DATA = [
  {
    id: 1,
    title: "New Referral Partner Welcome",
    description: "Welcome series for newly added referral partners",
    status: "active",
    emails: 3,
    trigger: "New practice added",
    metrics: {
      subscribers: 45,
      openRate: "89.2%",
      clickRate: "34.5%",
      conversions: 12,
    },
    actions: ["Edit Flow", "Duplicate", "Pause", "Analytics", "Delete"],
  },
  {
    id: 2,
    title: "Patient Follow-up Sequence",
    description: "Post-treatment follow-up and review request",
    status: "active",
    emails: 4,
    trigger: "Treatment completed",
    metrics: {
      subscribers: 156,
      openRate: "76.8%",
      clickRate: "28.3%",
      conversions: 34,
    },
    actions: ["Edit Flow", "Duplicate", "Pause", "Analytics", "Delete"],
  },
  {
    id: 3,
    title: "Inactive Partner Re-engagement",
    description: "Re-engage partners who haven't referred recently",
    status: "paused",
    emails: 2,
    trigger: "No referrals in 30 days",
    metrics: {
      subscribers: 23,
      openRate: "52.1%",
      clickRate: "15.7%",
      conversions: 3,
    },
    actions: ["Edit Flow", "Duplicate", "Activate", "Analytics", "Delete"],
  },
  {
    id: 4,
    title: "Quarterly Patient Survey",
    description: "Collect feedback from active patient list",
    status: "draft",
    emails: 1,
    trigger: "Manual launch",
    metrics: {
      subscribers: 0,
      openRate: "0%",
      clickRate: "0%",
      conversions: 0,
    },
    actions: ["Edit Flow", "Duplicate", "Activate", "Analytics", "Delete"],
  },
];

const INITIAL_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  status: "all",
  category: "all",
};

const ActiveFlows = () => {
  const [currentFilters, setCurrentFilters] = useState(INITIAL_FILTERS);

  const handleFilterChange = (key: string, value: string) => {
    setCurrentFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  return (
    <div className="space-y-5">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-primary/15 bg-background">
        <div data-slot="card-content" className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr] gap-3">
            <div className="relative">
              <Input
                placeholder="Search automation flow..."
                size="sm"
                value={currentFilters.search}
                onValueChange={(value) =>
                  setCurrentFilters((prev) => ({ ...prev, search: value }))
                }
                startContent={<FiSearch className="text-gray-600" />}
              />
            </div>
            <div className="relative flex-1">
              <Select
                aria-label="Statuses"
                placeholder="All Status"
                size="sm"
                selectedKeys={[currentFilters.status]}
                disabledKeys={[currentFilters.status]}
                onSelectionChange={(keys) =>
                  handleFilterChange("status", Array.from(keys)[0] as string)
                }
              >
                <>
                  <SelectItem key="all">All Status</SelectItem>
                  {FLOW_STATUSES.map((status) => (
                    <SelectItem key={status.value}>{status.label}</SelectItem>
                  ))}
                </>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onPress={() => setCurrentFilters(INITIAL_FILTERS)}
                size="sm"
                variant="bordered"
                className="border-small flex-1"
                startContent={<PiFunnelX className="h-4 w-4" />}
              >
                Clear Filters
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="solid"
                color="primary"
                startContent={<FiZap className="h-4 w-4" />}
                className="flex-1"
              >
                New Flow
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {ACTIVE_FLOWS_DATA.map((flow) => (
          <FlowCard key={flow.id} flow={flow} />
        ))}

        {ACTIVE_FLOWS_DATA.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No active flows found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveFlows;
