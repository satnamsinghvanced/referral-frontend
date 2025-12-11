import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { PiFunnelX } from "react-icons/pi";
import { CAMPAIGN_CATEGORIES, CAMPAIGN_STATUSES } from "../../consts/campaign";
import CampaignCard from "./CampaignCard";

const CAMPAIGNS = [
  {
    id: 1,
    title: "New Referral Partner Outreach",
    subtitle: "Partnership Opportunity - Referral Retriever",
    recipients: 245,
    createdDate: "1/15/2024",
    status: "active",
    metrics: {
      sent: 245,
      openRate: "68.5%",
      clickRate: "24.3%",
      conversions: 12,
    },
    actions: ["Edit", "Duplicate", "Pause", "View Report", "Archive"],
  },
  {
    id: 2,
    title: "Patient Thank You Series",
    subtitle: "Thank you for choosing our practice!",
    recipients: 892,
    createdDate: "1/10/2024",
    status: "active",
    metrics: {
      sent: 892,
      openRate: "82.1%",
      clickRate: "31.7%",
      conversions: 45,
    },
    actions: ["Edit", "Duplicate", "Pause", "View Report", "Archive"],
  },
  {
    id: 3,
    title: "Monthly Practice Newsletter",
    subtitle: "January Updates & New Services",
    recipients: 1247,
    createdDate: "1/20/2024",
    scheduledDate: "2/1/2024",
    status: "scheduled",
    actions: ["Edit", "Duplicate", "View Report", "Archive"],
  },
  {
    id: 4,
    title: "Referral Partner Check-in",
    subtitle: "How can we better serve your patients?",
    recipients: 58,
    createdDate: "1/22/2024",
    status: "draft",
    actions: ["Edit", "Duplicate", "Send Now", "View Report", "Archive"],
  },
];

const INITIAL_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  status: "all",
  category: "all",
};

const Campaigns = () => {
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Input
                placeholder="Search referrals..."
                size="sm"
                value={currentFilters.search as string}
                onValueChange={(value) =>
                  setCurrentFilters((prev) => ({ ...prev, search: value }))
                }
                startContent={<FiSearch className="text-gray-600" />}
              />
            </div>
            <Select
              aria-label="Statuses"
              placeholder="All Statuses"
              size="sm"
              selectedKeys={[currentFilters.status as string]}
              disabledKeys={[currentFilters.status as string]}
              onSelectionChange={(keys) =>
                handleFilterChange("status", Array.from(keys)[0] as string)
              }
            >
              <>
                <SelectItem key="all">All Statuses</SelectItem>
                {CAMPAIGN_STATUSES.map((status) => (
                  <SelectItem key={status.value}>{status.label}</SelectItem>
                ))}
              </>
            </Select>

            <Select
              aria-label="Categories"
              placeholder="All categories"
              size="sm"
              selectedKeys={[currentFilters.category as string]}
              disabledKeys={[currentFilters.category as string]}
              onSelectionChange={(keys) =>
                handleFilterChange("category", Array.from(keys)[0] as string)
              }
            >
              <>
                <SelectItem key="all">All Categories</SelectItem>
                {CAMPAIGN_CATEGORIES.map((source) => (
                  <SelectItem key={source.value}>{source.label}</SelectItem>
                ))}
              </>
            </Select>

            <Button
              onPress={() => setCurrentFilters(INITIAL_FILTERS)}
              size="sm"
              variant="ghost"
              color="default"
              className="border-small flex-1"
              startContent={<PiFunnelX className="h-4 w-4" />}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {CAMPAIGNS.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}

        {CAMPAIGNS.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No campaigns found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
