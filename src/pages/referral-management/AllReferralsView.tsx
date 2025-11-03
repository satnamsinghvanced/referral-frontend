import { Button, Chip, Input, Select, SelectItem } from "@heroui/react";
import React from "react";
import { BiCalendar, BiPhone } from "react-icons/bi";
import { CgMail } from "react-icons/cg";
import { FiArrowLeft, FiDownload, FiEye, FiSearch } from "react-icons/fi";
import { LuExternalLink, LuSquarePen } from "react-icons/lu";
import { PiFunnelX } from "react-icons/pi";
import { formatDateToYYYYMMDD } from "../../utils/formatDateToYYYYMMDD";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";

// --- Types (Mocked based on HTML data structure) ---
interface Referral {
  _id: string;
  name: string;
  age: number;
  mobile: string;
  email: string;
  referrerName: string;
  referrerPractice: string;
  referredDate: string;
  scheduledDate: string;
  treatment: string;
  source: string;
  status: "Scheduled" | "Pending" | "Completed";
  priority: "High Priority" | "Medium Priority" | "Low Priority";
  estimatedValue: string;
  notes: string;
  createdAt: string;
  addedVia: string;
  estValue: string;
  referredBy: { name: string; practiceName: string };
}

interface AllReferralsViewProps {
  // Functions to handle user interactions
  onBackToOverview: () => void;
  onExport: () => void;
  onSearchChange: (query: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  onViewReferral: (id: string) => void;
  onEditReferral: (id: string) => void;
  onViewReferralPage: (id: string) => void;
  onCall: (phone: string) => void;
  onEmail: (email: string) => void;

  // Data to display
  referrals: Referral[];
  totalReferrals: number;
  setCurrentFilters: any;
  currentFilters: {
    page: number;
    limit: number;
    search: string;
    filter: string;
    source: string;
  };
  filterStats: {
    totalReferrals: number;
    totalValue: number;
    activeCount: number;
    highPriorityCount: number;
    filterTotalReferrals: number;
  };
}

const statusOptions = [
  { label: "All Statuses", value: "" },
  { label: "New", value: "new" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Consultation Complete", value: "consultation_completed" },
  { label: "In Treatment", value: "in_treatment" },
  { label: "Completed", value: "completed" },
  { label: "No Show", value: "no_show" },
];

const sourceOptions = [
  { label: "All Sources", value: "" },
  { label: "QR Code", value: "QR" },
  { label: "NFC", value: "NFC" },
  { label: "Direct Referral", value: "Direct" },
];

// Utility to determine chip color
const getStatusColor = (status: Referral["status"] | string) => {
  switch (status) {
    case "new":
      return "primary";
    case "scheduled":
      return "warning";
    case "pending":
      return "default";
    case "completed":
      return "success";
    default:
      return "default";
  }
};

const getPriorityColor = (priority: Referral["priority"]) => {
  switch (priority) {
    case "High Priority":
      return "danger";
    case "Medium Priority":
      return "warning";
    default:
      return "default";
  }
};

const AllReferralsView: React.FC<AllReferralsViewProps> = ({
  onBackToOverview,
  onExport,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  onViewReferral,
  onEditReferral,
  onViewReferralPage,
  onCall,
  onEmail,
  referrals,
  totalReferrals,
  setCurrentFilters,
  currentFilters,
  filterStats,
}) => {
  console.log("referrals>>>>>>", referrals)
  const isFiltered =
    currentFilters.search !== "" ||
    currentFilters.filter !== "" ||
    currentFilters.source !== "";

  const filteredCountText = isFiltered ? (
    <span className="text-green-600 capitalize">
      {currentFilters.filter !== ""
        ? `  •  ${statusOptions.find((item) => item.value === currentFilters.filter)
          ?.label
        } status`
        : ""}
      {currentFilters.source !== ""
        ? `  •  ${sourceOptions.find((item) => item.value === currentFilters.source)
          ?.label
        } only`
        : ""}
    </span>
  ) : null;

  const LucideFunnelX = PiFunnelX;

  // Helper to render a single referral card
  const renderReferralCard = (referral: Referral) => (
    <div
      key={referral._id}
      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className="text-sm font-medium">{referral.name}</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Age: {referral.age}
              </p>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5 text-sm">
              <BiPhone className="h-4 w-4 text-gray-400" aria-hidden="true" />
              <span className="text-xs">
                {formatPhoneNumber(referral.mobile)}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-sm">
              <CgMail className="h-4 w-4 text-gray-400" aria-hidden="true" />
              <span className="text-xs">{referral.email}</span>
            </div>
          </div>
        </div>

        {/* Referrer & Dates Info */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">{referral?.referredBy?.name}</p>
            <p className="text-xs text-gray-600 mt-0.5">
              {referral?.referredBy?.practiceName}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5">
              <BiCalendar
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
              <span className="text-xs">
                Referred: {formatDateToYYYYMMDD(referral.createdAt)}
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <BiCalendar
                className="h-4 w-4 text-blue-400"
                aria-hidden="true"
              />
              <span className="text-xs">
                Scheduled: {formatDateToYYYYMMDD(referral.scheduledDate)}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs">
              <strong>Treatment:</strong> {referral.treatment}
            </p>
            <p className="text-xs">
              <strong>Source:</strong> {referral.addedVia}
            </p>
          </div>
        </div>

        {/* Status, Value & Actions */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Chip
              color={getStatusColor(referral.status)}
              size="sm"
              variant="flat"
              radius="sm"
              className="capitalize text-[11px] h-5"
            >
              {referral.status}
            </Chip>
            <Chip
              color={getPriorityColor(referral.priority)}
              size="sm"
              variant="flat"
              radius="sm"
              className="capitalize text-[11px] h-5"
            >
              {referral.priority}
            </Chip>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium">
              Est. Value: ${referral?.estValue}
            </p>
            <p className="text-xs text-gray-600">{referral.notes}</p>
          </div>
          <div className="flex items-center space-x-1">
            {/* Phone */}
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onCall(referral.mobile)}
            >
              <BiPhone className="h-4 w-4" />
            </Button>
            {/* Mail */}
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onEmail(referral.email)}
            >
              <CgMail className="h-4 w-4" />
            </Button>
            {/* View */}
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onViewReferral(referral._id)}
            >
              <FiEye className="h-4 w-4" />
            </Button>
            {/* Edit */}
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onEditReferral(referral._id)}
            >
              <LuSquarePen className="size-3.5" />
            </Button>
            {/* External Link */}
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onViewReferralPage(referral._id)}
            >
              <LuExternalLink className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      data-state="active"
      data-orientation="horizontal"
      role="tabpanel"
      id="radix-:r3:-content-referrals"
      tabIndex={0}
      data-slot="tabs-content"
      className="flex-1 outline-none space-y-6"
    >
      {/* 1. Header and Export Button */}
      <div
        data-slot="card"
        className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-primary/15 bg-background"
      >
        <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-medium">All Referrals</h4>
                  {isFiltered && (
                    <Chip
                      size="sm"
                      variant="solid"
                      color="primary"
                      className="h-5 text-[11px] font-medium bg-[#e0f2fe] text-[#0c4a6e]"
                      radius="sm"
                    >
                      Filtered
                    </Chip>
                  )}
                </div>
                <p className="text-xs text-gray-600">
                  Showing{" "}
                  {isFiltered ? filterStats?.totalReferrals : totalReferrals} of{" "}
                  {totalReferrals} referrals
                  {filteredCountText}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onPress={onBackToOverview}
                size="sm"
                variant="bordered"
                className="border-small"
                startContent={<FiArrowLeft className="h-4 w-4" />}
              >
                Back to Overview
              </Button>
              <Button
                onPress={onExport}
                size="sm"
                variant="bordered"
                className="border-small"
                startContent={<FiDownload className="h-4 w-4" />}
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Stats Card (Blue Box) */}
      {isFiltered && (
        <div
          data-slot="card"
          className="text-card-foreground flex flex-col gap-6 rounded-xl border bg-blue-50 border-blue-200"
        >
          <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center gap-0.5">
                <div className="font-semibold text-blue-900">
                  {filterStats?.totalReferrals}
                </div>
                <div className="text-xs text-blue-700">Total Filtered</div>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="font-semibold text-green-900">
                  ${filterStats?.totalValue}
                </div>
                <div className="text-xs text-green-700">Total Value</div>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="font-semibold text-orange-900">
                  {filterStats?.activeCount}
                </div>
                <div className="text-xs text-orange-700">Active</div>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="font-semibold text-purple-900">
                  {filterStats?.highPriorityCount}
                </div>
                <div className="text-xs text-purple-700">High Priority</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Search and Filters Bar */}
      <div
        data-slot="card"
        className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-primary/15 bg-background"
      >
        <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Input
                placeholder="Search referrals..."
                size="sm"
                onValueChange={(value) => onSearchChange(value)}
                startContent={<FiSearch className="text-gray-600" />}
              />
            </div>
            {/* Status Select */}
            <Select
              aria-label="Statuses"
              placeholder="All Statuses"
              size="sm"
              selectedKeys={[currentFilters.filter]}
              onSelectionChange={(keys) =>
                onFilterChange("filter", Array.from(keys)[0] as string)
              }
            >
              {statusOptions.map((status) => (
                <SelectItem key={status.value} className="capitalize">
                  {status.label}
                </SelectItem>
              ))}
            </Select>

            {/* Source Select */}
            <Select
              aria-label="Sources"
              placeholder="All Sources"
              size="sm"
              selectedKeys={[currentFilters.source]}
              onSelectionChange={(keys) =>
                onFilterChange("source", Array.from(keys)[0] as string)
              }
            >
              {sourceOptions.map((source) => (
                <SelectItem key={source.value} className="capitalize">
                  {source.label}
                </SelectItem>
              ))}
            </Select>

            {/* Action/Toggle Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                onPress={onClearFilters}
                size="sm"
                variant="bordered"
                className="border-small"
                startContent={<LucideFunnelX className="h-4 w-4" />}
              >
                Clear Filters
              </Button>
              <Button
                onPress={() =>
                  setCurrentFilters((prev: any) => ({
                    ...prev,
                    filter: "new",
                    source: "",
                  }))
                }
                size="sm"
                className="border-small"
                variant="bordered"
                color="default"
              >
                New Only
              </Button>
              <Button
                onPress={() =>
                  setCurrentFilters((prev: any) => ({
                    ...prev,
                    filter: "",
                    source: "NFC",
                  }))
                }
                size="sm"
                className="border-small"
                variant="bordered"
                color="default"
              >
                NFC Only
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Referral List */}
      <div
        data-slot="card"
        className="bg-card text-card-foreground flex flex-col gap-4 rounded-xl border border-primary/15 bg-background"
      >
        <div data-slot="card-header" className="px-4 pt-4">
          <h4 data-slot="card-title" className="font-medium text-sm">
            Referrals Details
          </h4>
        </div>
        <div data-slot="card-content" className="px-4 pb-4">
          {referrals && referrals?.length > 0 ? (
            <div className="space-y-4">
              {referrals?.map(renderReferralCard)}
            </div>
          ) : (
            <p className="bg-background text-xs text-center text-gray-600">
              No data to display
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllReferralsView;
