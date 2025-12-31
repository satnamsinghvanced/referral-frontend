import {
  Button,
  Chip,
  Input,
  Pagination,
  Select,
  SelectItem,
} from "@heroui/react";
import React, { useMemo } from "react";
import { BiCalendar, BiPhone } from "react-icons/bi";
import { CgMail } from "react-icons/cg";
import { FiArrowLeft, FiDownload, FiEye, FiSearch } from "react-icons/fi";
import { LuCalendar, LuSquarePen } from "react-icons/lu";
import { PiFunnelX } from "react-icons/pi";
import { Link } from "react-router";

import PriorityLevelChip from "../../components/chips/PriorityLevelChip";
import ReferralStatusChip from "../../components/chips/ReferralStatusChip";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import { STATUS_OPTIONS } from "../../consts/filters";
import { TREATMENT_OPTIONS } from "../../consts/referral";
import {
  FetchReferralsParams,
  FilterStats,
  Referral,
} from "../../types/referral";
import { formatDateToYYYYMMDD } from "../../utils/formatDateToYYYYMMDD";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";

interface AllReferralsViewProps {
  onBackToOverview: () => void;
  onExport: () => void;
  onSearchChange: (query: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  onViewReferral: (id: string) => void;
  onEditReferral: (id: string) => void;
  referrals: Referral[];
  totalReferrals: number;
  totalPages: number;
  setCurrentFilters: any;
  currentFilters: FetchReferralsParams;
  filterStats: FilterStats;
  isLoading: boolean;
}

const sourceOptions = [
  { label: "All Sources", value: "" },
  { label: "QR Code", value: "QR" },
  { label: "NFC", value: "NFC" },
  { label: "Direct Referral", value: "Direct" },
];

const AllReferralsView: React.FC<AllReferralsViewProps> = ({
  onBackToOverview,
  onExport,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  onViewReferral,
  onEditReferral,
  referrals,
  totalReferrals,
  totalPages,
  setCurrentFilters,
  currentFilters,
  filterStats,
  isLoading,
}) => {
  const isFiltered =
    currentFilters.search !== "" ||
    currentFilters.filter !== "" ||
    currentFilters.source !== "";

  const filteredCountText = useMemo(() => {
    if (!isFiltered) return null;

    const filterStatus = currentFilters.filter
      ? `  •  ${
          STATUS_OPTIONS.find((item) => item.value === currentFilters.filter)
            ?.label
        } status`
      : "";

    const filterSource = currentFilters.source
      ? `  •  ${
          sourceOptions.find((item) => item.value === currentFilters.source)
            ?.label
        } only`
      : "";

    return (
      <span className="text-green-600 capitalize">
        {filterStatus}
        {filterSource}
      </span>
    );
  }, [isFiltered, currentFilters.filter, currentFilters.source]);

  const renderReferralCard = (referral: Referral) => (
    <div
      key={referral._id}
      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr] gap-4 md:gap-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className="text-sm font-medium">{referral.name}</h3>
              {referral.age && (
                <span className="text-xs">Age: {referral.age}</span>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            {referral.phone && (
              <div className="flex items-center space-x-1.5 text-sm">
                <BiPhone className="h-4 w-4 text-gray-400" aria-hidden="true" />
                <span className="text-xs">
                  {formatPhoneNumber(referral.phone)}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-1.5 text-sm">
              <CgMail className="h-4 w-4 text-gray-400" aria-hidden="true" />
              <span className="text-xs">{referral.email}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">{referral?.referredBy?.name}</p>
            <p className="text-xs text-gray-600 mt-0.5">
              {referral?.referredBy?.practiceName}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5">
              <LuCalendar
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
              <span className="text-xs">
                Referred: {formatDateToYYYYMMDD(referral.createdAt as string)}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {referral.treatment && (
              <p className="text-xs">
                <span className="font-medium">Treatment:</span>{" "}
                {
                  TREATMENT_OPTIONS.find(
                    (treatmentOption: any) =>
                      treatmentOption.key === referral.treatment
                  )?.label
                }
              </p>
            )}

            <p className="text-xs">
              <span className="font-medium">Source:</span>{" "}
              {referral.addedVia ? referral.addedVia : "Direct"}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <span
              onClick={() => onEditReferral(referral._id)}
              className="flex cursor-pointer"
            >
              <ReferralStatusChip status={referral.status} />
            </span>
            <PriorityLevelChip level={referral.priority as string} />
          </div>
          {/* <p className="text-xs font-medium">
              Est. Value: ${referral?.estValue}
            </p> */}
          {referral.notes && (
            <p className="text-xs text-gray-600">{referral.notes}</p>
          )}
          {referral.estValue ? (
            <p className="text-xs">
              <span className="font-medium">Estimated Value:</span> $
              {referral.estValue}
            </p>
          ) : (
            ""
          )}
          <div className="flex items-center space-x-1">
            {referral.phone && (
              <Link to={`tel:${referral.phone}`}>
                <Button isIconOnly size="sm" variant="light">
                  <BiPhone className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {referral.email && (
              <Link to={`mailto:${referral.email}`}>
                <Button isIconOnly size="sm" variant="light">
                  <CgMail className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onViewReferral(referral._id)}
            >
              <FiEye className="h-4 w-4" />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onEditReferral(referral._id)}
            >
              <LuSquarePen className="size-3.5" />
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
      tabIndex={0}
      data-slot="tabs-content"
      className="flex-1 outline-none space-y-4 md:space-y-5"
    >
      <div
        data-slot="card"
        className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-primary/15 bg-background"
      >
        <div data-slot="card-content" className="p-4">
          <div className="md:flex md:items-center md:justify-between max-md:space-y-3.5">
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

      {isFiltered && (
        <div
          data-slot="card"
          className="text-card-foreground flex flex-col gap-6 rounded-xl border bg-blue-50 border-blue-200"
        >
          <div data-slot="card-content" className="p-4">
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

      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-primary/15 bg-background">
        <div data-slot="card-content" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="relative">
              <Input
                placeholder="Search referrals..."
                size="sm"
                value={currentFilters.search as string}
                onValueChange={(value) => onSearchChange(value)}
                startContent={<FiSearch className="text-gray-600" />}
              />
            </div>
            <Select
              aria-label="Statuses"
              placeholder="All Statuses"
              size="sm"
              selectedKeys={[currentFilters.filter as string]}
              onSelectionChange={(keys) =>
                onFilterChange("filter", Array.from(keys)[0] as string)
              }
            >
              <>
                <SelectItem key="" className="capitalize">
                  All Statuses
                </SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} className="capitalize">
                    {status.label}
                  </SelectItem>
                ))}
              </>
            </Select>

            <Select
              aria-label="Sources"
              placeholder="All Sources"
              size="sm"
              selectedKeys={[currentFilters.source as string]}
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

            <div className="flex gap-2 md:gap-3">
              <Button
                onPress={onClearFilters}
                size="sm"
                variant="bordered"
                className="border-small flex-1"
                startContent={<PiFunnelX className="h-4 w-4 max-lg:hidden" />}
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
                className="border-small flex-1"
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
                className="border-small flex-1"
                variant="bordered"
                color="default"
              >
                NFC Only
              </Button>
            </div>
          </div>
        </div>
      </div>

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
          {isLoading ? (
            <LoadingState />
          ) : referrals?.length > 0 ? (
            <>
              <div className="space-y-3">
                {referrals.map(renderReferralCard)}
              </div>
              {totalPages > 1 && (
                <div className="mt-5">
                  <Pagination
                    showControls
                    size="sm"
                    radius="sm"
                    initialPage={1}
                    page={currentFilters.page as number}
                    onChange={(page) => {
                      setCurrentFilters((prev: any) => ({ ...prev, page }));
                    }}
                    total={totalPages}
                    classNames={{
                      base: "flex justify-end py-3",
                      wrapper: "gap-1.5",
                      item: "cursor-pointer",
                      prev: "cursor-pointer",
                      next: "cursor-pointer",
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllReferralsView;
