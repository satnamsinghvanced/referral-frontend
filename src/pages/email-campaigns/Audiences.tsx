import { Button, Input, Select, SelectItem } from "@heroui/react";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { PiFunnelX } from "react-icons/pi";
import { Segment } from "../../types/campaign";
import {
  AUDIENCE_SEGMENT_STATUSES,
  AUDIENCE_TYPES,
} from "../../consts/campaign";
import SegmentCard from "./SegmentCard";
import { AiOutlinePlus } from "react-icons/ai";
import { LuUpload } from "react-icons/lu";

const MOCK_SEGMENTS: Segment[] = [
  {
    id: 1,
    name: "A-Level Partners",
    description: "Top-tier referral partners with consistent referrals",
    type: "referralPartners",
    status: "active",
    contacts: 45,
    campaigns: 3,
    updatedAt: "1/23/2024",
    tags: [
      "active",
      "crm",
      "high-value",
      "stacrews",
      "partners",
      "vip",
      "topdoct",
    ],
    avgOpenRate: "89.2%",
    avgClickRate: "34.5%",
    size: 45,
  },
  {
    id: 2,
    name: "Recent Patients",
    description: "Patients who completed treatment in the last 6 months",
    type: "patients",
    status: "active",
    contacts: 234,
    campaigns: 3,
    updatedAt: "1/23/2024",
    tags: [
      "patients",
      "root",
      "expert",
      "reaticollepolus",
      "tula",
      "partners",
      "roundweed",
    ],
    avgOpenRate: "76.8%",
    avgClickRate: "28.3%",
    size: 234,
  },
  {
    id: 3,
    name: "Inactive Practices",
    description: "Dental practices that haven't referred in 6 months",
    type: "dentalPractices",
    status: "active",
    contacts: 89,
    campaigns: 5,
    updatedAt: "1/23/2024",
    tags: ["patients", "nxchs", "nodiyecreation", "reactivation", "practices"],
    avgOpenRate: "78.3%",
    avgClickRate: "15.7%",
    size: 89,
  },
];

const INITIAL_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  status: "all",
  type: "all",
};

const Audiences: React.FC = () => {
  const [currentFilters, setCurrentFilters] = useState(INITIAL_FILTERS);

  const handleFilterChange = (key: string, value: string) => {
    setCurrentFilters((prev: any) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-primary/15 bg-background">
        <div data-slot="card-content" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <Input
                  placeholder="Search segments..."
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
                  {AUDIENCE_SEGMENT_STATUSES.map((status) => (
                    <SelectItem key={status.value}>{status.label}</SelectItem>
                  ))}
                </>
              </Select>

              <Select
                aria-label="Types"
                placeholder="All types"
                size="sm"
                selectedKeys={[currentFilters.type as string]}
                disabledKeys={[currentFilters.type as string]}
                onSelectionChange={(keys) =>
                  handleFilterChange("type", Array.from(keys)[0] as string)
                }
              >
                <>
                  <SelectItem key="all">All Types</SelectItem>
                  {AUDIENCE_TYPES.map((type) => (
                    <SelectItem key={type.value}>{type.label}</SelectItem>
                  ))}
                </>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                color="default"
                className="border-small flex-1"
                startContent={<PiFunnelX className="h-4 w-4" />}
                onPress={() => setCurrentFilters(INITIAL_FILTERS)}
              >
                Clear Filters
              </Button>

              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                color="default"
                className="border-small flex-1"
                startContent={<LuUpload className="size-3.5" />}
                onPress={() => setCurrentFilters(INITIAL_FILTERS)}
              >
                Import
              </Button>

              <Button
                size="sm"
                radius="sm"
                variant="solid"
                color="primary"
                className="flex-1"
                startContent={<AiOutlinePlus className="size-[15px]" />}
                onPress={() => setCurrentFilters(INITIAL_FILTERS)}
              >
                Create Segment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_SEGMENTS.map((segment) => (
          <SegmentCard key={segment.id} segment={segment} />
        ))}
      </div>
    </div>
  );
};

export default Audiences;
