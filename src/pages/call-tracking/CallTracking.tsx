import { Input, Select, SelectItem } from "@heroui/react";
import { useMemo, useState } from "react";
import { FiPhone, FiPhoneCall, FiSearch, FiSettings } from "react-icons/fi";
import { LuClock, LuFileAudio, LuRefreshCw } from "react-icons/lu";
import { MdTrendingUp } from "react-icons/md";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import TwilioConfigurationModal from "./TwilioConfigurationModal";
import { CALL_STATUS_OPTIONS, CALL_TYPE_OPTIONS } from "../../utils/filters";
import { CallFilters, CallRecord } from "../../types/call";
import CallRecordCard from "./CallRecordCard";

export const callRecordsData: CallRecord[] = [
  {
    id: "crd_001",
    callerName: "Sarah Johnson",
    callerPhone: "(555) 123-4567",
    timeAgo: "2 hours ago",
    sentiment: "positive",
    duration: "5:23",
    isVerified: true,
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
    tags: [
      { label: "inquiry", type: "category" },
      { label: "Marketing", type: "category" },
      { label: "Recorded", type: "status" },
    ],
  },
];

const CallTracking = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<CallFilters>({
    search: "",
    type: "all",
    status: "all",
  });

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
        {
          label: "Twilio Settings",
          onClick: () => setIsOpen(true),
          icon: <FiSettings fontSize={15} />,
          variant: "bordered",
          color: "default",
          className: "border-small",
        },
      ],
    }),
    []
  );

  const STATS_CARD_DATA: StatCard[] = [
    {
      icon: <FiPhone className="text-[17px] mt-1 text-foreground/60" />,
      heading: "Total Calls",
      value: 0,
      subheading: "0 completed",
    },
    {
      icon: <FiPhoneCall className="text-[17px] mt-1 text-foreground/60" />,
      heading: "Answer Rate",
      value: `0%`,
      subheading: "0 missed calls",
    },
    {
      icon: <LuClock className="text-[17px] mt-1 text-foreground/60" />,
      heading: "Avg Duration",
      value: `0:00`,
      subheading: "Average call length",
    },
    {
      icon: <LuFileAudio className="text-[17px] mt-1 text-foreground/60" />,
      heading: "Recordings",
      value: 0,
      subheading: "Available for playback",
    },
    {
      icon: <MdTrendingUp className="text-[17px] mt-1 text-foreground/60" />,
      heading: "Follow-ups",
      value: 1,
      subheading: "Require attention",
    },
  ];

  const onFilterChange = (key: keyof CallFilters, value: string) => {
    setCurrentFilters((prev) => ({ ...prev, [key]: value }));
  };

  const onSearchChange = (value: string) => {
    setCurrentFilters((prev) => ({ ...prev, search: value }));
  };

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4 justify-between">
            {STATS_CARD_DATA.map((data) => (
              <MiniStatsCard key={data.heading} cardData={data} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 border border-primary/10 rounded-xl p-4 bg-white shadow-none">
            <div className="relative flex-1">
              <Input
                placeholder="Search calls by name, phone, or transcription..."
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
                selectedKeys={[currentFilters.type]}
                disabledKeys={[currentFilters.type]}
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
                selectedKeys={[currentFilters.status]}
                disabledKeys={[currentFilters.status]}
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
            {callRecordsData.map((record) => (
              <CallRecordCard key={record.id} record={record} />
            ))}
          </div>
        </div>
      </ComponentContainer>
      <TwilioConfigurationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default CallTracking;
