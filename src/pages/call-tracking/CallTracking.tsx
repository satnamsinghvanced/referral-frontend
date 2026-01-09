import { Input, Select, SelectItem } from "@heroui/react";
import { useMemo, useState } from "react";
import { FiPhone, FiPhoneCall, FiSearch, FiSettings } from "react-icons/fi";
import { LuClock, LuFileAudio, LuRefreshCw } from "react-icons/lu";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import { CALL_STATUS_OPTIONS, CALL_TYPE_OPTIONS } from "../../consts/filters";
import { CallFilters, CallRecord } from "../../types/call";
import CallRecordCard from "./CallRecordCard";
import CallRecordingModal from "./modal/CallRecordingModal";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { MdTrendingUp } from "react-icons/md";

export const callRecordsData: CallRecord[] = [
  {
    id: "crd_001",
    callerName: "Sarah Johnson",
    callerPhone: "(555) 123-4567",
    timeAgo: "2 hours ago",
    sentiment: "positive",
    duration: "5:23",
    isVerified: true,
    type: "incoming",
    status: "completed",
    tags: [
      { label: "new-patient", type: "category" },
      { label: "referral", type: "category" },
      { label: "consultation", type: "category" },
      { label: "Completed", type: "status" },
      { label: "Follow-up", type: "action" },
    ],
  },
  {
    id: "crd_002",
    callerName: "Michael Brown",
    callerPhone: "(555) 987-6543",
    timeAgo: "1 day ago",
    sentiment: "negative",
    duration: "1:45",
    isVerified: true,
    type: "outgoing",
    status: "voicemail",
    tags: [
      { label: "existing-client", type: "category" },
      { label: "billing", type: "category" },
      { label: "Voicemail", type: "status" },
      { label: "Unresolved", type: "action" },
    ],
  },
  {
    id: "crd_003",
    callerName: "Emily Davis",
    callerPhone: "(555) 555-0101",
    timeAgo: "3 days ago",
    sentiment: "neutral",
    duration: "12:01",
    isVerified: false,
    type: "incoming",
    status: "recorded",
    tags: [
      { label: "inquiry", type: "category" },
      { label: "Marketing", type: "category" },
      { label: "Recorded", type: "status" },
    ],
  },
  {
    id: "crd_004",
    callerName: "Alex Smith",
    callerPhone: "(555) 222-3333",
    timeAgo: "4 hours ago",
    sentiment: "positive",
    duration: "3:00",
    isVerified: true,
    type: "outgoing",
    status: "completed",
    tags: [
      { label: "follow-up", type: "action" },
      { label: "Marketing", type: "category" },
    ],
  },
];

const CALL_DATA = {
  callerName: "Sarah Johnson",
  callerPhone: "(555) 123-4567",
  date: "2024-01-20",
  duration: "5:23",
  type: "Incoming",
  status: "Completed",
  callSid: "CAxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  recordingStatus: "Available",
  sentiment: "positive",
  source: "Twilio",
  transcription:
    "Hi, I'd like to schedule an appointment for my daughter. She needs braces and we were referred by Dr. Smith.",
  notes: "Patient interested in orthodontic consultation for teenager",
  followUpRequired: true,
  appointmentScheduled: false,
};

const CallTracking = () => {
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<CallFilters>({
    search: "",
    type: "all",
    status: "all",
  });

  const { user } = useTypedSelector((state) => state.auth);
  const userId = user?.userId || "mock-user-id";

  const onFilterChange = (key: keyof CallFilters, value: string) => {
    setCurrentFilters((prev) => ({ ...prev, [key]: value }));
  };

  const onSearchChange = (value: string) => {
    setCurrentFilters((prev) => ({ ...prev, search: value }));
  };

  const filteredCalls = useMemo(() => {
    const { search, type, status } = currentFilters;
    const normalizedSearch = search.toLowerCase().trim();

    return callRecordsData.filter((record) => {
      const matchesSearch =
        normalizedSearch === "" ||
        record.callerName.toLowerCase().includes(normalizedSearch) ||
        record.callerPhone.toLowerCase().includes(normalizedSearch) ||
        record.tags.some((tag) =>
          tag.label.toLowerCase().includes(normalizedSearch)
        );

      const matchesType = type === "all" || (record as any).type === type;

      const matchesStatus =
        status === "all" || (record as any).status === status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [currentFilters]);

  const STATS_CARD_DATA: StatCard[] = [
    {
      icon: <FiPhone className="text-foreground/60" />,
      heading: "Total Calls",
      value: callRecordsData.length,
      subheading: `${
        callRecordsData.filter((r) => (r as any).status === "completed").length
      } completed`,
    },
    {
      icon: <FiPhoneCall className="text-foreground/60" />,
      heading: "Answer Rate",
      value: `${
        Math.round(
          (callRecordsData.filter(
            (r) =>
              (r as any).status === "completed" ||
              (r as any).status === "recorded"
          ).length /
            callRecordsData.length) *
            100
        ) || 0
      }%`,
      subheading: `${
        callRecordsData.filter((r) => (r as any).status === "voicemail").length
      } missed calls`,
    },
    {
      icon: <LuClock className="text-foreground/60" />,
      heading: "Avg Duration",
      value: `3:00`,
      subheading: "Average call length",
    },
    {
      icon: <LuFileAudio className="text-foreground/60" />,
      heading: "Recordings",
      value: callRecordsData.filter(
        (r) =>
          (r as any).status === "recorded" || (r as any).status === "completed"
      ).length,
      subheading: "Available for playback",
    },
    {
      icon: <MdTrendingUp className="text-foreground/60" />,
      heading: "Follow-ups",
      value: callRecordsData.filter((r) =>
        r.tags.some((t) => t.label === "Follow-up")
      ).length,
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
          onClick: () => {},
          icon: <LuRefreshCw fontSize={15} />,
          variant: "bordered",
          color: "default",
          className: "border-small",
        },
      ],
    }),
    []
  );

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA as any}>
        <div className="flex flex-col gap-4 md:gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4 justify-between">
            {STATS_CARD_DATA.map((data) => (
              <MiniStatsCard key={data.heading} cardData={data} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-primary/15 rounded-xl p-4 bg-background shadow-none">
            <div className="relative flex-1">
              <Input
                placeholder="Search calls by name, phone, or tags..."
                size="sm"
                value={currentFilters.search}
                onValueChange={onSearchChange}
                startContent={<FiSearch className="text-gray-400 h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                aria-label="Call Types"
                placeholder="All Types"
                size="sm"
                selectedKeys={new Set([currentFilters.type])}
                disabledKeys={new Set([currentFilters.type])}
                onSelectionChange={(keys) =>
                  onFilterChange("type", Array.from(keys)[0] as string)
                }
              >
                {CALL_TYPE_OPTIONS.map((type) => (
                  <SelectItem key={type.value} className="capitalize">
                    {type.label}
                  </SelectItem>
                ))}
              </Select>

              <Select
                aria-label="Call Status"
                placeholder="All Status"
                size="sm"
                selectedKeys={new Set([currentFilters.status])}
                disabledKeys={new Set([currentFilters.status])}
                onSelectionChange={(keys) =>
                  onFilterChange("status", Array.from(keys)[0] as string)
                }
              >
                {CALL_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} className="capitalize">
                    {status.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-4 border border-primary/15 bg-background rounded-xl p-4">
            <p className="font-medium text-sm">Call History</p>

            {filteredCalls.length > 0 ? (
              <div className="space-y-3">
                {filteredCalls.map((record) => (
                  <CallRecordCard
                    key={record.id}
                    record={record}
                    onPlayClick={() => setIsRecordingModalOpen(true)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 text-sm">
                No call records found matching your filters.
              </div>
            )}
          </div>
        </div>
      </ComponentContainer>

      <CallRecordingModal
        isOpen={isRecordingModalOpen}
        onClose={() => setIsRecordingModalOpen(false)}
        data={CALL_DATA}
      />
    </>
  );
};

export default CallTracking;
