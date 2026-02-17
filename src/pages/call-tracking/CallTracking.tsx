import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { FiPhone, FiPhoneCall, FiSearch } from "react-icons/fi";
import { LuClock, LuFileAudio, LuRefreshCw } from "react-icons/lu";
import { MdTrendingUp } from "react-icons/md";
import { Link } from "react-router-dom";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import Pagination from "../../components/common/Pagination";
import { CALL_STATUSES, CALL_TYPES } from "../../consts/call";
import { EVEN_PAGINATION_LIMIT } from "../../consts/consts";
import { useDebouncedValue } from "../../hooks/common/useDebouncedValue";
import { useFetchTwilioConfig } from "../../hooks/integrations/useTwilio";
import { useFetchCallRecords } from "../../hooks/useCall";
import { CallRecord } from "../../types/call";
import CallRecordCard from "./CallRecordCard";
import CallRecordingModal from "./modal/CallRecordingModal";
import { usePaginationAdjustment } from "../../hooks/common/usePaginationAdjustment";

const CallTracking = () => {
  const { data: twilioConfig, isPending: isTwilioConfigLoading } =
    useFetchTwilioConfig();

  const isTwilioConnected = twilioConfig && twilioConfig.status === "Connected";

  const [selectedRecord, setSelectedRecord] = useState<CallRecord | null>(null);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);

  // Filters state matches API params
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
    page: 1,
    limit: EVEN_PAGINATION_LIMIT,
  });

  const debouncedSearch = useDebouncedValue(filters.search, 500);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  const { data, isLoading, refetch, isRefetching } = useFetchCallRecords({
    ...filters,
    search: debouncedSearch,
  });

  usePaginationAdjustment({
    totalPages: data?.paginatedCalls?.totalPages || 0,
    currentPage: filters.page,
    onPageChange: (page) => setFilters((prev) => ({ ...prev, page })),
    isLoading: isLoading || isRefetching,
  });

  const onFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const onSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePlayClick = (record: CallRecord) => {
    setSelectedRecord(record);
    setIsRecordingModalOpen(true);
  };

  const STATS_CARD_DATA: StatCard[] = [
    {
      icon: <FiPhone className="text-foreground/60" />,
      heading: "Total Calls",
      value: data?.stats?.totalCalls?.value || 0,
      subheading: `${
        data?.stats?.totalCalls?.completedCalls || 0
      } completed calls`,
    },
    {
      icon: <FiPhoneCall className="text-foreground/60" />,
      heading: "Answer Rate",
      value: data?.stats?.answerRate?.value || "0%",
      subheading: `${data?.stats?.answerRate?.missedCalls || 0} missed calls`,
    },
    {
      icon: <LuClock className="text-foreground/60" />,
      heading: "Avg Duration",
      value: data?.stats?.avgDuration || "0 sec",
      subheading: "Average call length",
    },
    {
      icon: <LuFileAudio className="text-foreground/60" />,
      heading: "Recordings",
      value: data?.stats?.recordings || 0,
      subheading: "Available for playback",
    },
    {
      icon: <MdTrendingUp className="text-foreground/60" />,
      heading: "Follow-ups",
      value: data?.stats?.followUps || 0,
      subheading: "Require attention",
    },
  ];

  const HEADING_DATA = useMemo(
    () => ({
      heading: "Call Tracking",
      subHeading:
        "Monitor and manage your phone communications with Twilio integration.",
      buttons: [
        {
          label: "Refresh",
          onClick: () => refetch(),
          icon: (
            <LuRefreshCw
              fontSize={15}
              className={isRefetching ? "animate-spin" : ""}
            />
          ),
          variant: "bordered" as const,
          color: "default" as const,
          className: "border-small",
        },
      ],
    }),
    [refetch, isRefetching],
  );

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-4 md:gap-5">
          {!isTwilioConnected && !isTwilioConfigLoading && (
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg p-3 flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm text-yellow-800 dark:text-amber-400">
                Twilio is not connected. Connect your Twilio account to enable
                call tracking features.
              </p>
              <Button
                as={Link}
                to="/integrations"
                size="sm"
                color="warning"
                variant="flat"
                className="bg-yellow-200 dark:bg-amber-500/20 text-yellow-800 dark:text-amber-400"
              >
                Connect Twilio
              </Button>
            </div>
          )}
          {isTwilioConnected && !isTwilioConfigLoading && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-3 md:gap-4 justify-between">
                {STATS_CARD_DATA.map((data) => (
                  <MiniStatsCard key={data.heading} cardData={data} />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-foreground/10 rounded-xl p-4 bg-background shadow-none">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search calls by name, phone..."
                    size="sm"
                    value={filters.search}
                    onValueChange={onSearchChange}
                    startContent={
                      <FiSearch className="text-gray-400 dark:text-foreground/40 h-4 w-4" />
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Select
                    aria-label="Call Types"
                    placeholder="All Types"
                    size="sm"
                    selectedKeys={[filters.type]}
                    disabledKeys={[filters.type]}
                    onSelectionChange={(keys) =>
                      onFilterChange(
                        "type",
                        (Array.from(keys)[0] as string) || "",
                      )
                    }
                  >
                    <>
                      <SelectItem key="" className="capitalize">
                        All Types
                      </SelectItem>
                      {CALL_TYPES.map((type) => (
                        <SelectItem key={type.value} className="capitalize">
                          {type.label}
                        </SelectItem>
                      ))}
                    </>
                  </Select>

                  <Select
                    aria-label="Call Status"
                    placeholder="All Status"
                    size="sm"
                    selectedKeys={[filters.status]}
                    disabledKeys={[filters.status]}
                    onSelectionChange={(keys) =>
                      onFilterChange(
                        "status",
                        (Array.from(keys)[0] as string) || "",
                      )
                    }
                  >
                    <>
                      <SelectItem key="" className="capitalize">
                        All Status
                      </SelectItem>
                      {CALL_STATUSES.map((status) => (
                        <SelectItem key={status.value} className="capitalize">
                          {status.label}
                        </SelectItem>
                      ))}
                    </>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-4 border border-foreground/10 bg-background rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">Call History</p>
                </div>

                {isLoading && (
                  <div className="min-h-[200px] flex items-center justify-center">
                    <LoadingState />
                  </div>
                )}

                {!isLoading &&
                  data?.paginatedCalls.data &&
                  data.paginatedCalls.data.length > 0 && (
                    <div className="space-y-3">
                      {data.paginatedCalls.data.map((record: CallRecord) => (
                        <CallRecordCard
                          key={record._id}
                          record={record}
                          onPlayClick={() => handlePlayClick(record)}
                        />
                      ))}
                    </div>
                  )}

                {!isLoading &&
                  (!data?.paginatedCalls.data ||
                    data.paginatedCalls.data.length === 0) && (
                    <EmptyState title="No call records found with current filters. Try adjusting your search or filters." />
                  )}

                {!isLoading &&
                  data?.paginatedCalls &&
                  data.paginatedCalls.totalPages > 1 && (
                    <Pagination
                      identifier="calls"
                      limit={filters.limit}
                      totalItems={data.paginatedCalls.totalData}
                      currentPage={filters.page}
                      totalPages={data.paginatedCalls.totalPages}
                      handlePageChange={handlePageChange}
                    />
                  )}
              </div>
            </>
          )}
        </div>
      </ComponentContainer>

      <CallRecordingModal
        isOpen={isRecordingModalOpen}
        onClose={() => setIsRecordingModalOpen(false)}
        data={selectedRecord}
      />
    </>
  );
};

export default CallTracking;
