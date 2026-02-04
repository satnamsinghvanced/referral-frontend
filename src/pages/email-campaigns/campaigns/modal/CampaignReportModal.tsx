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
import {
  useCampaignAnalytics,
  useCampaignDetails,
} from "../../../../hooks/useCampaign";
import { LoadingState } from "../../../../components/common/LoadingState";
import CampaignStatusChip from "../../../../components/chips/CampaignStatusChip";
import ChartTooltip from "../../../../components/common/ChartTooltip";

interface CampaignReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string | null;
}

export default function CampaignReportModal({
  isOpen,
  onClose,
  campaignId,
}: CampaignReportModalProps) {
  const { data: campaign, isLoading } = useCampaignAnalytics(campaignId || "");
  // const { data: campaignDetails } = useCampaignDetails(campaignId || "");

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
          {/* <div className="flex items-center gap-2 ml-2">
            {campaignDetails?.status && (
              <CampaignStatusChip status={campaignDetails.status} />
            )}
          </div> */}
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
                  value={campaign?.stats?.sent?.toLocaleString() || "0"}
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
                  value={campaign?.stats?.conversions?.toLocaleString() || "0"}
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
                      data={campaign?.performanceOverTime || []}
                      margin={{ top: 10, right: 10, left: -35, bottom: 0 }}
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
                        dataKey="month"
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
                    {campaign?.topLinks?.map((link: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-foreground/70 font-medium">
                            {link.link}
                          </span>
                          <span className="font-medium text-foreground">
                            {link.clicks} clicks
                          </span>
                        </div>
                        <Progress
                          aria-label={link.link}
                          value={Math.min(
                            100,
                            (link.clicks / (campaign.stats.sent || 1)) * 100,
                          )}
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
                    {campaign?.devicesUsed?.map(
                      (device: any, index: number) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-foreground/70 font-medium">
                              {device.device}
                            </span>
                            <span className="font-medium text-foreground">
                              {device.percentage}%
                            </span>
                          </div>
                          <Progress
                            aria-label={device.device}
                            value={device.percentage}
                            size="sm"
                            classNames={{ indicator: "bg-blue-500" }}
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* --- Insights --- */}
              {/* <div className="space-y-3 border border-foreground/10 p-4 rounded-xl">
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
              </div> */}
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
