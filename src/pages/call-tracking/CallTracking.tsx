import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useMemo, useState } from "react";
import { FiPhone, FiPhoneCall, FiSearch } from "react-icons/fi";
import { LuClock, LuFileAudio, LuRefreshCw } from "react-icons/lu";
import { MdTrendingUp } from "react-icons/md";
import { data, Link } from "react-router-dom";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import { CALL_STATUSES, CALL_TYPES } from "../../consts/call";
import { useFetchTwilioConfig } from "../../hooks/integrations/useTwilio";
import { useFetchCallRecords } from "../../hooks/useCall";
import { CallRecord } from "../../types/call";
import CallRecordCard from "./CallRecordCard";
import CallRecordingModal from "./modal/CallRecordingModal";
import Pagination from "../../components/common/Pagination";

const CallTracking = () => {
  const { data: twilioConfig, isPending: isTwilioConfigLoading } =
    useFetchTwilioConfig();

  const isTwilioConnected = !!(
    twilioConfig &&
    twilioConfig.authToken &&
    twilioConfig.accountId &&
    twilioConfig.phone
  );

  const [selectedRecord, setSelectedRecord] = useState<CallRecord | null>(null);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);

  // Filters state matches API params
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
    page: 1,
    limit: 10,
  });

  const { data, isLoading, refetch, isRefetching } =
    useFetchCallRecords(filters);

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
      value: data?.stats?.totalCalls || 0,
      subheading: "All time calls",
    },
    {
      icon: <FiPhoneCall className="text-foreground/60" />,
      heading: "Answer Rate",
      value: data?.stats?.answerRate || "0%",
      subheading: `${data?.stats?.missedCalls || 0} missed calls`,
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
    [refetch, isRefetching]
  );

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-4 md:gap-5">
          {!isTwilioConnected && !isTwilioConfigLoading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
              <p className="text-sm text-yellow-800">
                Twilio is not connected. Connect your Twilio account to enable
                call tracking features.
              </p>
              <Button
                as={Link}
                to="/integrations"
                size="sm"
                color="warning"
                variant="flat"
                className="bg-yellow-200 text-yellow-800"
              >
                Connect Twilio
              </Button>
            </div>
          )}
          {isTwilioConfigLoading && (
            <div className="flex items-center justify-center min-h-[200px] bg-background border border-primary/15 rounded-xl p-4">
              <LoadingState />
            </div>
          )}
          {isTwilioConnected && !isTwilioConfigLoading && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4 justify-between">
                {STATS_CARD_DATA.map((data) => (
                  <MiniStatsCard key={data.heading} cardData={data} />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-primary/15 rounded-xl p-4 bg-background shadow-none">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search calls by name, phone..."
                    size="sm"
                    value={filters.search}
                    onValueChange={onSearchChange}
                    startContent={
                      <FiSearch className="text-gray-400 h-4 w-4" />
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
                        (Array.from(keys)[0] as string) || ""
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
                        (Array.from(keys)[0] as string) || ""
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

              <div className="flex flex-col gap-4 border border-primary/15 bg-background rounded-xl p-4">
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
                      items={data.paginatedCalls.data}
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
