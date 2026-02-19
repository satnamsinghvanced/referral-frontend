import { Button, Chip, Input, Select, SelectItem } from "@heroui/react";
import React, { useMemo } from "react";
import { BiPhone } from "react-icons/bi";
import { CgMail } from "react-icons/cg";
import {
  FiArrowLeft,
  FiDownload,
  FiEdit,
  FiEye,
  FiSearch,
} from "react-icons/fi";
import { LuCalendar, LuDownload } from "react-icons/lu";
import { PiFunnelX } from "react-icons/pi";
import { Link } from "react-router";

import { FaRegEnvelope } from "react-icons/fa";
import PriorityLevelChip from "../../../components/chips/PriorityLevelChip";
import ReferralStatusChip from "../../../components/chips/ReferralStatusChip";
import EmptyState from "../../../components/common/EmptyState";
import { LoadingState } from "../../../components/common/LoadingState";
import { STATUS_OPTIONS } from "../../../consts/filters";
import {
  REFERRER_TYPE_LABELS,
  SOURCE_OPTIONS,
  TREATMENT_OPTIONS,
} from "../../../consts/referral";
import {
  FetchReferralsParams,
  FilterStats,
  Referral,
} from "../../../types/referral";
import { formatDateToYYYYMMDD } from "../../../utils/formatDateToYYYYMMDD";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { formatDateToReadable } from "../../../utils/formatDateToReadable";
import Pagination from "../../../components/common/Pagination";

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
          SOURCE_OPTIONS.find((item) => item.key === currentFilters.source)
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
      className="p-4 border border-foreground/10 rounded-lg hover:bg-gray-50 dark:hover:bg-background/10 transition-colors dark:bg-content1"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr] gap-4 md:gap-6">
        <div className="space-y-3">
          <div className="flex flex-col items-start space-y-1">
            <h3 className="text-sm font-medium dark:text-white">
              {referral.name}
            </h3>
            {referral.age && (
              <span className="text-xs dark:text-foreground/60">
                Age: {referral.age}
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            {referral.phone && (
              <div className="flex items-center space-x-1.5 text-sm">
                <BiPhone
                  className="h-4 w-4 text-gray-400 dark:text-foreground/40"
                  aria-hidden="true"
                />
                <span className="text-xs dark:text-foreground/60">
                  {formatPhoneNumber(referral.phone)}
                </span>
              </div>
            )}
            {referral.email && (
              <div className="flex items-center space-x-1.5 text-sm">
                <CgMail
                  className="h-4 w-4 text-gray-400 dark:text-foreground/40"
                  aria-hidden="true"
                />
                <span className="text-xs dark:text-foreground/60">
                  {referral.email}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium dark:text-white">
              {referral?.referredBy?.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-foreground/60">
              {referral?.referredBy?.practiceName &&
              referral?.referredBy?.practiceName !== "Unknown"
                ? referral?.referredBy?.practiceName
                : REFERRER_TYPE_LABELS[referral?.referredBy?.type] ||
                  referral?.referredBy?.type}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5">
              <LuCalendar
                className="h-4 w-4 text-gray-400 dark:text-foreground/40"
                aria-hidden="true"
              />
              <span className="text-xs dark:text-foreground/60">
                Referred:{" "}
                {formatDateToReadable(referral.createdAt as string, true)}
              </span>
            </div>
            {referral.scheduledDate && (
              <div className="flex items-center space-x-1.5">
                <LuCalendar
                  className="h-4 w-4 text-primary-600"
                  aria-hidden="true"
                />
                <span className="text-xs dark:text-foreground/60">
                  Scheduled:{" "}
                  {formatDateToReadable(referral.scheduledDate as string, true)}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            {referral.treatment && (
              <p className="text-xs">
                <span className="font-medium dark:text-foreground/60">
                  Treatment:
                </span>{" "}
                <span className="dark:text-white">
                  {
                    TREATMENT_OPTIONS.find(
                      (treatmentOption: any) =>
                        treatmentOption.key === referral.treatment,
                    )?.label
                  }
                </span>
              </p>
            )}

            <p className="text-xs">
              <span className="font-medium dark:text-foreground/60">
                Source:
              </span>{" "}
              <span className="dark:text-white">
                {referral.addedVia ? referral.addedVia : "Direct"}
              </span>
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
          {referral.notes && (
            <p className="text-xs text-gray-600 dark:text-foreground/60">
              {referral.notes}
            </p>
          )}
          {referral.estValue ? (
            <p className="text-xs">
              <span className="font-medium dark:text-foreground/60">
                Estimated Value:
              </span>{" "}
              <span className="dark:text-white">${referral.estValue}</span>
            </p>
          ) : (
            ""
          )}
          <div className="flex items-center space-x-1">
            {referral.email && (
              <Link to={`mailto:${referral.email}`}>
                <Button isIconOnly size="sm" variant="light">
                  <FaRegEnvelope className="size-3.5" />
                </Button>
              </Link>
            )}
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onViewReferral(referral._id)}
            >
              <FiEye className="size-4" />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onEditReferral(referral._id)}
            >
              <FiEdit className="size-3.5" />
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
        className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-foreground/10 bg-background"
      >
        <div data-slot="card-content" className="p-4">
          <div className="md:flex md:items-center md:justify-between max-md:space-y-3.5">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-medium dark:text-white">
                    All Referrals
                  </h4>
                  {isFiltered && (
                    <Chip
                      size="sm"
                      variant="solid"
                      color="primary"
                      className="h-5 text-[11px] font-medium bg-[#e0f2fe] text-[#0c4a6e] dark:bg-blue-900/20 dark:text-blue-300"
                      radius="sm"
                    >
                      Filtered
                    </Chip>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-foreground/60">
                  Manage all referrals
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onPress={onBackToOverview}
                size="sm"
                variant="bordered"
                className="border-small"
                startContent={<FiArrowLeft className="size-3.5" />}
              >
                Back to Overview
              </Button>
              <Button
                onPress={onExport}
                size="sm"
                variant="bordered"
                className="border-small"
                startContent={<LuDownload className="size-3.5" />}
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
          className="text-card-foreground flex flex-col gap-6 rounded-xl border bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-500/30"
        >
          <div data-slot="card-content" className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center gap-0.5">
                <div className="font-semibold text-blue-900 dark:text-blue-300">
                  {filterStats?.totalReferrals}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-400">
                  Total Filtered
                </div>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="font-semibold text-green-900 dark:text-green-300">
                  ${filterStats?.totalValue}
                </div>
                <div className="text-xs text-green-700 dark:text-green-400">
                  Total Value
                </div>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="font-semibold text-orange-900 dark:text-orange-300">
                  {filterStats?.activeCount}
                </div>
                <div className="text-xs text-orange-700 dark:text-orange-400">
                  Active
                </div>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="font-semibold text-purple-900 dark:text-purple-300">
                  {filterStats?.highPriorityCount}
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-400">
                  High Priority
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-foreground/10 bg-background">
        <div data-slot="card-content" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="relative">
              <Input
                placeholder="Search referrals..."
                size="sm"
                value={currentFilters.search as string}
                onValueChange={(value) => onSearchChange(value)}
                startContent={
                  <FiSearch className="text-gray-600 dark:text-foreground/60" />
                }
              />
            </div>
            <Select
              aria-label="Statuses"
              placeholder="All Statuses"
              size="sm"
              selectedKeys={[currentFilters.filter as string]}
              disabledKeys={[currentFilters.filter as string]}
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
              disabledKeys={[currentFilters.source as string]}
              onSelectionChange={(keys) =>
                onFilterChange("source", Array.from(keys)[0] as string)
              }
            >
              <>
                <SelectItem key="" className="capitalize">
                  All Sources
                </SelectItem>
                {SOURCE_OPTIONS.map((source) => (
                  <SelectItem key={source.key} className="capitalize">
                    {source.label}
                  </SelectItem>
                ))}
              </>
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
        className="bg-card text-card-foreground flex flex-col gap-4 rounded-xl border border-foreground/10 bg-background"
      >
        <div data-slot="card-header" className="px-4 pt-4">
          <h4
            data-slot="card-title"
            className="font-medium text-sm dark:text-white"
          >
            Referrals Details
          </h4>
        </div>
        <div data-slot="card-content" className="px-4 pb-4 space-y-4">
          {isLoading ? (
            <LoadingState />
          ) : referrals?.length > 0 ? (
            <>
              <div className="space-y-3">
                {referrals.map(renderReferralCard)}
              </div>
              {totalPages > 1 && (
                <Pagination
                  identifier="referrals"
                  totalItems={totalReferrals}
                  currentPage={currentFilters.page || 1}
                  totalPages={totalPages}
                  handlePageChange={(page: number) => {
                    setCurrentFilters((prev: any) => ({ ...prev, page }));
                  }}
                />
              )}
            </>
          ) : (
            <EmptyState title="No referrals found with current filters. Try adjusting your search or filters." />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllReferralsView;
