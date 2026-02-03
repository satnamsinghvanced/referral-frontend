import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
} from "@heroui/react";
import React from "react";
import { FiDownload, FiEye, FiTarget } from "react-icons/fi";
import {
  LuMail,
  LuMousePointer2,
  LuTrendingUp,
  LuClock,
  LuZap,
} from "react-icons/lu";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TbChartHistogram, TbNotes } from "react-icons/tb";
import { useCampaignDetails } from "../../../../hooks/useCampaign";
import { LoadingState } from "../../../../components/common/LoadingState";
import CampaignStatusChip from "../../../../components/chips/CampaignStatusChip";
import ChartTooltip from "../../../../components/common/ChartTooltip";

interface CampaignReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string | null;
}

// Mock data for the chart - in a real app, this would come from the API
const MOCK_CHART_DATA = [
  { name: "Jan", opens: 1800, clicks: 600, conversions: 150 },
  { name: "Feb", opens: 2100, clicks: 800, conversions: 200 },
  { name: "Mar", opens: 2400, clicks: 950, conversions: 250 },
  { name: "Apr", opens: 2100, clicks: 750, conversions: 180 },
  { name: "May", opens: 2800, clicks: 1100, conversions: 350 },
  { name: "Jun", opens: 3000, clicks: 1250, conversions: 400 },
];

const MOCK_LINKS = [
  { name: "Schedule Consultation", percentage: 65 },
  { name: "View Services", percentage: 42 },
  { name: "Contact Us", percentage: 28 },
];

const MOCK_DEVICES = [
  { name: "Desktop", percentage: 45 },
  { name: "Mobile", percentage: 40 },
  { name: "Tablet", percentage: 15 },
];

export default function CampaignReportModal({
  isOpen,
  onClose,
  campaignId,
}: CampaignReportModalProps) {
  const { data: campaign, isLoading } = useCampaignDetails(campaignId || "");

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="md"
      placement="center"
      scrollBehavior="inside"
      classNames={{
        base: `max-sm:!m-3 !m-0 bg-background dark:bg-content1`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent className="max-h-[95vh] overflow-hidden w-full">
        {/* Modal Header */}
        <ModalHeader className="flex gap-1 p-4 pr-10">
          <h4 className="text-base font-medium flex items-center gap-2 text-foreground">
            {/* <TbChartHistogram className="h-6 w-6 text-blue-600 dark:text-blue-400" /> */}
            <span>Campaign Details: {campaign?.name || "Campaign Report"}</span>
          </h4>
          <div className="flex items-center gap-2 ml-2">
            {campaign?.status && (
              <CampaignStatusChip status={campaign.status} />
            )}
          </div>
        </ModalHeader>

        <ModalBody className="px-4 py-0 overflow-y-auto space-y-3 gap-0">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <LoadingState />
            </div>
          ) : (
            <>
              {/* --- Summary Stats --- */}
              <div className="grid grid-cols-4 gap-4 py-3 bg-gray-50 dark:bg-default-100/20 rounded-lg border border-foreground/10">
                <StatPill
                  title="Sent"
                  value={campaign?.stats?.sentCount?.toLocaleString() || "0"}
                  color="blue"
                />
                <StatPill
                  title="Open Rate"
                  value={String(campaign?.stats?.openRate || "0%")}
                  color="green"
                />
                <StatPill
                  title="Click Rate"
                  value={String(campaign?.stats?.clickRate || "0%")}
                  color="orange"
                />
                <StatPill
                  title="Conversions"
                  value={
                    campaign?.stats?.conversionCount?.toLocaleString() || "0"
                  }
                  color="purple"
                />
              </div>

              {/* --- Performance Over Time --- */}
              <div className="space-y-4 border border-foreground/10 p-4 rounded-xl">
                <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <LuTrendingUp className="h-4 w-4" /> Performance Over Time
                </h3>
                <div className="h-[180px] w-full mt-2 text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={MOCK_CHART_DATA}
                      margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorOpens"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#f97316"
                            stopOpacity={0.1}
                          />
                          <stop
                            offset="95%"
                            stopColor="#f97316"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorClicks"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#2563eb"
                            stopOpacity={0.1}
                          />
                          <stop
                            offset="95%"
                            stopColor="#2563eb"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="rgba(0,0,0,0.05)"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9ca3af" }}
                        dy={5}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9ca3af" }}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="opens"
                        name="Opens"
                        stroke="#f97316"
                        strokeWidth={2}
                        fill="url(#colorOpens)"
                      />
                      <Area
                        type="monotone"
                        dataKey="clicks"
                        name="Clicks"
                        stroke="#2563eb"
                        strokeWidth={2}
                        fill="url(#colorClicks)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* --- Links & Devices --- */}
              <div className="space-y-3">
                <div className="space-y-3 border border-foreground/10 p-4 rounded-xl">
                  <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <LuMousePointer2 className="h-4 w-4" /> Top Links
                  </h3>
                  <div className="space-y-3">
                    {MOCK_LINKS.map((link) => (
                      <div key={link.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-foreground/70 font-medium">
                            {link.name}
                          </span>
                          <span className="font-medium text-foreground">
                            {link.percentage}%
                          </span>
                        </div>
                        <Progress
                          aria-label={link.name}
                          value={link.percentage}
                          size="sm"
                          classNames={{ indicator: "bg-blue-500" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 border border-foreground/10 p-4 rounded-xl">
                  <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <FiEye className="h-4 w-4" /> Devices Used
                  </h3>
                  <div className="space-y-3">
                    {MOCK_DEVICES.map((device) => (
                      <div key={device.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-foreground/70 font-medium">
                            {device.name}
                          </span>
                          <span className="font-medium text-foreground">
                            {device.percentage}%
                          </span>
                        </div>
                        <Progress
                          aria-label={device.name}
                          value={device.percentage}
                          size="sm"
                          classNames={{ indicator: "bg-blue-500" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* --- Insights --- */}
              <div className="space-y-3 border border-foreground/10 p-4 rounded-xl">
                <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <TbNotes className="h-4 w-4" /> Key Insights
                </h3>
                <div className="space-y-2.5">
                  <InsightItem
                    icon={<LuTrendingUp className="text-green-600 size-3.5" />}
                    title="High Engagement"
                    description="Open rate is 23% above industry average"
                    bgColor="bg-green-50 dark:bg-green-500/10"
                    textColor="text-green-700 dark:text-green-400"
                  />
                  <InsightItem
                    icon={<LuClock className="text-blue-600 size-3.5" />}
                    title="Best Send Time"
                    description="Most opens occurred between 9-11 AM on Tuesday"
                    bgColor="bg-blue-50 dark:bg-blue-500/10"
                    textColor="text-blue-700 dark:text-blue-400"
                  />
                  <InsightItem
                    icon={<LuZap className="text-purple-600 size-3.5" />}
                    title="Strong Conversion"
                    description="Conversion rate is 2.5x higher than average"
                    bgColor="bg-purple-50 dark:bg-purple-500/10"
                    textColor="text-purple-700 dark:text-purple-400"
                  />
                </div>
              </div>
            </>
          )}
        </ModalBody>

        <ModalFooter className="p-4 flex justify-end gap-2">
          {/* <Button
            size="sm"
            variant="ghost"
            radius="sm"
            className="border-small h-8 dark:border-default-200"
            onPress={() => console.log("Exporting...")}
          >
            <FiDownload className="size-3.5" />
            Export Report
          </Button> */}
          <Button
            size="sm"
            variant="ghost"
            color="default"
            radius="sm"
            onPress={onClose}
            className="border-small"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// --- Reusable Sub-Components ---

const StatPill = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: "blue" | "green" | "orange" | "purple";
}) => (
  <div className="text-center">
    <div
      className={`text-sm font-semibold text-${color}-600 dark:text-${color}-400`}
    >
      {value}
    </div>
    <div className="text-xs text-gray-500 dark:text-foreground/40">{title}</div>
  </div>
);

const InsightItem = ({
  icon,
  title,
  description,
  bgColor,
  textColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
}) => (
  <div className={`p-2 rounded-lg ${bgColor} flex items-center gap-2`}>
    <div className="p-1.5 rounded-full bg-white dark:bg-background/40">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className={`text-xs font-medium ${textColor}`}>{title}</span>
      <span className="text-xs text-foreground/60 leading-tight">
        {description}
      </span>
    </div>
  </div>
);
