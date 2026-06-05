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
import { FiEye, FiTarget } from "react-icons/fi";
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
  const { data: campaign, isLoading: isAnalyticsLoading } = useCampaignAnalytics(campaignId || "");
  const { data: campaignDetails, isLoading: isDetailsLoading } = useCampaignDetails(campaignId || "");

  const isLoading = isAnalyticsLoading || isDetailsLoading;

  if (!isOpen) return null;

  // Extract rates and values for dynamic insight calculations
  const openRateNum = parseFloat(String(campaign?.stats?.openRate || "0").replace("%", "")) || 0;
  const clickRateNum = parseFloat(String(campaign?.stats?.clickRate || "0").replace("%", "")) || 0;
  const sentCount = campaign?.stats?.sent || 0;
  const conversionsCount = campaign?.stats?.conversions || 0;

  const insights = [];
  if (sentCount > 0) {
    if (openRateNum >= 50) {
      insights.push({
        title: "High Open Rate",
        description: `Your campaign achieved an exceptional open rate of ${openRateNum}%, showing high audience engagement with the subject line.`,
        color: "text-emerald-500 dark:text-emerald-400",
        bgColor: "bg-emerald-500/5",
        borderColor: "border-emerald-500/10",
        icon: <LuTrendingUp className="text-emerald-500 h-4 w-4" />
      });
    } else if (openRateNum > 0) {
      insights.push({
        title: "Steady Open Rate",
        description: `This campaign has a steady open rate of ${openRateNum}%. Test other subject lines to boost this metric further.`,
        color: "text-blue-500 dark:text-blue-400",
        bgColor: "bg-blue-500/5",
        borderColor: "border-blue-500/10",
        icon: <LuMail className="text-blue-500 h-4 w-4" />
      });
    }

    if (clickRateNum >= 10) {
      insights.push({
        title: "Strong CTA Response",
        description: `Click rate is outstanding at ${clickRateNum}%, showing your call-to-actions are highly effective.`,
        color: "text-purple-500 dark:text-purple-400",
        bgColor: "bg-purple-500/5",
        borderColor: "border-purple-500/10",
        icon: <LuZap className="text-purple-500 h-4 w-4" />
      });
    } else if (clickRateNum > 0) {
      insights.push({
        title: "CTA Engagement",
        description: `Click rate is at ${clickRateNum}%. Make your action links more prominent to drive more clicks.`,
        color: "text-amber-500 dark:text-amber-400",
        bgColor: "bg-amber-500/5",
        borderColor: "border-amber-500/10",
        icon: <LuMousePointer2 className="text-amber-500 h-4 w-4" />
      });
    }

    if (conversionsCount > 0) {
      insights.push({
        title: "Conversions Generated",
        description: `Great job! This campaign directly generated ${conversionsCount} referral conversions.`,
        color: "text-pink-500 dark:text-pink-400",
        bgColor: "bg-pink-500/5",
        borderColor: "border-pink-500/10",
        icon: <FiTarget className="text-pink-500 h-4 w-4" />
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      title: "No Data Tracked Yet",
      description: "Send emails and wait for recipients to open or click to see performance insights here.",
      color: "text-foreground/50",
      bgColor: "bg-default-500/5",
      borderColor: "border-default-500/10",
      icon: <LuClock className="text-foreground/40 h-4 w-4" />
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="2xl"
      placement="center"
      scrollBehavior="inside"
      classNames={{
        base: "max-sm:!m-3 !m-0 bg-background dark:bg-content1 border border-foreground/10 shadow-2xl rounded-2xl",
        closeButton: "cursor-pointer top-5 right-5 hover:bg-default-100/70 active:bg-default-100 p-1.5 rounded-lg transition-colors duration-200",
      }}
    >
      <ModalContent className="max-h-[90vh] overflow-hidden w-full">
        {/* Modal Header */}
        <ModalHeader className="flex flex-col gap-1 p-6 border-b border-foreground/10 bg-default-50/50 dark:bg-default-100/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <TbChartHistogram className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/40">Campaign Performance</span>
              <div className="flex items-center gap-2.5">
                <h4 className="text-base font-bold text-foreground truncate max-w-[280px]">
                  {campaign?.name || "Campaign Report"}
                </h4>
                {campaignDetails?.status && (
                  <CampaignStatusChip status={campaignDetails.status} />
                )}
              </div>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="p-6 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <LoadingState />
            </div>
          ) : (
            <>
              {/* --- Summary Stats --- */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <StatCard
                  title="Sent"
                  value={campaign?.stats?.sent?.toLocaleString() || "0"}
                  icon={<LuMail className="h-5 w-5 text-blue-500 dark:text-blue-400" />}
                  color="text-blue-500 dark:text-blue-400"
                  bgColor="bg-blue-500/5"
                  borderColor="border-blue-500/10"
                />
                <StatCard
                  title="Open Rate"
                  value={String(campaign?.stats?.openRate || "0%")}
                  icon={<FiEye className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />}
                  color="text-emerald-500 dark:text-emerald-400"
                  bgColor="bg-emerald-500/5"
                  borderColor="border-emerald-500/10"
                />
                <StatCard
                  title="Click Rate"
                  value={String(campaign?.stats?.clickRate || "0%")}
                  icon={<LuMousePointer2 className="h-5 w-5 text-amber-500 dark:text-amber-400" />}
                  color="text-amber-500 dark:text-amber-400"
                  bgColor="bg-amber-500/5"
                  borderColor="border-amber-500/10"
                />
                <StatCard
                  title="Conversions"
                  value={campaign?.stats?.conversions?.toLocaleString() || "0"}
                  icon={<LuZap className="h-5 w-5 text-purple-500 dark:text-purple-400" />}
                  color="text-purple-500 dark:text-purple-400"
                  bgColor="bg-purple-500/5"
                  borderColor="border-purple-500/10"
                />
              </div>

              {/* --- Performance Over Time --- */}
              <div className="p-5 border border-foreground/10 rounded-2xl bg-default-50/50 dark:bg-default-100/5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                    <LuTrendingUp className="h-4 w-4 text-primary" /> Performance Trend
                  </h3>
                  <span className="text-xs text-foreground/45 font-medium bg-default-100 dark:bg-default-200/50 px-2 py-0.5 rounded-full">Last 6 Months</span>
                </div>
                <div className="h-[180px] w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={campaign?.performanceOverTime || []}
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
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
                            stopOpacity={0.2}
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
                            stopOpacity={0.2}
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
                        stroke="currentColor"
                        strokeOpacity={0.05}
                      />

                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "currentColor", opacity: 0.5, fontSize: 10 }}
                        dy={6}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "currentColor", opacity: 0.5, fontSize: 10 }}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="opens"
                        name="Opens"
                        stroke="#f97316"
                        strokeWidth={2.5}
                        fill="url(#colorOpens)"
                      />
                      <Area
                        type="monotone"
                        dataKey="clicks"
                        name="Clicks"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        fill="url(#colorClicks)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* --- Links & Devices --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Top Links Card */}
                <div className="p-5 border border-foreground/10 rounded-2xl bg-default-50/50 dark:bg-default-100/5 space-y-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                    <LuMousePointer2 className="h-4 w-4 text-blue-500" /> Top Links
                  </h3>
                  <div className="space-y-4">
                    {campaign?.topLinks && campaign.topLinks.length > 0 ? (
                      campaign.topLinks.map((link: any, index: number) => (
                        <div key={index} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-foreground/75 font-medium truncate max-w-[70%]">
                              {link.link}
                            </span>
                            <span className="font-semibold text-foreground">
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
                            classNames={{
                              indicator: "bg-blue-500",
                              track: "bg-default-100 dark:bg-default-200/30"
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-xs text-foreground/45 font-medium">
                        No links tracked in this campaign
                      </div>
                    )}
                  </div>
                </div>

                {/* Devices Used Card */}
                <div className="p-5 border border-foreground/10 rounded-2xl bg-default-50/50 dark:bg-default-100/5 space-y-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                    <FiEye className="h-4 w-4 text-emerald-500" /> Devices Used
                  </h3>
                  <div className="space-y-4">
                    {campaign?.devicesUsed && campaign.devicesUsed.length > 0 ? (
                      campaign.devicesUsed.map((device: any, index: number) => (
                        <div key={index} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-foreground/75 font-medium capitalize">
                              {device.device}
                            </span>
                            <span className="font-semibold text-foreground">
                              {device.percentage}%
                            </span>
                          </div>
                          <Progress
                            aria-label={device.device}
                            value={device.percentage}
                            size="sm"
                            classNames={{
                              indicator: "bg-emerald-500",
                              track: "bg-default-100 dark:bg-default-200/30"
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-xs text-foreground/45 font-medium">
                        No device data available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* --- Insights --- */}
              <div className="p-5 border border-foreground/10 rounded-2xl bg-default-50/50 dark:bg-default-100/5 space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <TbNotes className="h-4 w-4 text-purple-500" /> Performance Insights
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {insights.map((insight, idx) => (
                    <div key={idx} className={`p-3.5 rounded-xl border ${insight.borderColor} ${insight.bgColor} flex gap-3 items-start`}>
                      <div className="p-1.5 rounded-lg bg-background border border-foreground/5 shadow-sm mt-0.5">
                        {insight.icon}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className={`text-xs font-semibold ${insight.color}`}>{insight.title}</h4>
                        <p className="text-xs text-foreground/70 leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </ModalBody>

        <ModalFooter className="p-6 border-t border-foreground/10 bg-default-50/50 dark:bg-default-100/5 flex justify-end gap-2.5">
          <Button
            size="sm"
            variant="solid"
            color="default"
            radius="lg"
            onPress={onClose}
            className="font-medium px-4"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// --- Reusable Sub-Components ---

const StatCard = ({
  title,
  value,
  icon,
  color,
  bgColor,
  borderColor,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}) => (
  <div className={`p-4 rounded-2xl border ${borderColor} ${bgColor} flex items-center justify-between transition-all duration-300 hover:shadow-sm`}>
    <div className="space-y-1 min-w-0">
      <span className="text-xs text-foreground/50 font-semibold block">{title}</span>
      <span className={`text-lg font-bold tracking-tight truncate block ${color}`}>{value}</span>
    </div>
    <div className="p-2 rounded-xl bg-background border border-foreground/5 shadow-sm flex-shrink-0">
      {icon}
    </div>
  </div>
);

