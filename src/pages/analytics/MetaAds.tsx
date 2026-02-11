import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import { BsMeta } from "react-icons/bs";
import { LuEye, LuMousePointer, LuTrendingUp, LuUsers } from "react-icons/lu";
import { TrendIndicator } from "../../components/common/TrendIndicator";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import { LoadingState } from "../../components/common/LoadingState";
import ChartTooltip from "../../components/common/ChartTooltip";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useMetaAds } from "../../hooks/useAnalytics";

const TrafficTrendsChart: React.FC<{ data: any[] }> = ({ data }) => {
  const { theme } = useTypedSelector((state) => state.ui);
  return (
    <div className="-ml-5 text-sm">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="opacity-10"
          />
          <XAxis
            dataKey="name"
            stroke="currentColor"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="currentColor"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{
              stroke: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#ccc",
              strokeWidth: 2,
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="#0EA5E9"
            strokeWidth={3}
            name="Clicks"
          />
          <Line
            type="monotone"
            dataKey="conversions"
            stroke="#F97316"
            strokeWidth={3}
            name="Conversions"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MetaAds: React.FC = () => {
  const { theme } = useTypedSelector((state) => state.ui);
  const { data, isLoading } = useMetaAds();

  const STAT_CARD_DATA = [
    {
      icon: <LuMousePointer className="text-blue-500 dark:text-blue-400" />,
      heading: "Total Clicks",
      value: isLoading
        ? "..."
        : data?.stats?.totalClicks?.value?.toLocaleString() || "0",
      subheading: (
        <TrendIndicator
          percentage={data?.stats?.totalClicks?.lastMonthChange}
          label="vs last month"
          isLoading={isLoading}
        />
      ),
    },
    {
      icon: <LuUsers className="text-green-500 dark:text-green-400" />,
      heading: "Conversions",
      value: isLoading
        ? "..."
        : data?.stats?.conversions?.value?.toString() || "0",
      subheading: (
        <TrendIndicator
          percentage={data?.stats?.conversions?.lastMonthChange}
          label="vs last month"
          isLoading={isLoading}
        />
      ),
    },
    {
      icon: <LuTrendingUp className="text-orange-500 dark:text-orange-400" />,
      heading: "Cost Per Click",
      value: isLoading ? "..." : `${data?.stats?.costPerClick?.value || "0"}`,
      subheading: (
        <TrendIndicator
          percentage={data?.stats?.costPerClick?.lastMonthChange}
          label="vs last month"
          isLoading={isLoading}
        />
      ),
    },
    {
      icon: <LuEye className="text-purple-600 dark:text-purple-400" />,
      heading: "Click-Through Rate",
      value: isLoading
        ? "..."
        : `${data?.stats?.clickThroughRate?.value || "0"}`,
      subheading: (
        <TrendIndicator
          percentage={data?.stats?.clickThroughRate?.lastMonthChange}
          label="vs last month"
          isLoading={isLoading}
        />
      ),
    },
  ];

  const CAMPAIGN_PERFORMANCE = data?.campaigns || [];
  const AD_SPENDING_GRAPH = data?.spendingTrends || [];

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <BsMeta className="size-7 text-sky-600" aria-hidden="true" />
        <div className="max-md:space-y-1">
          <h2 className="text-md md:text-xl font-medium text-foreground">
            Meta Ads Performance (Facebook & Instagram)
          </h2>
          <p className="text-foreground/60 text-xs md:text-sm">
            Track your Meta advertising campaigns across Facebook and Instagram
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        {STAT_CARD_DATA.map((data, i) => (
          <MiniStatsCard key={i} cardData={data} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card
          shadow="none"
          className="border border-foreground/10 bg-white dark:bg-background p-4 md:p-5"
        >
          <CardHeader className="p-0 pb-5 md:pb-8">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Meta Ads Performance Trends
            </h4>
          </CardHeader>
          <CardBody className="p-0 overflow-visible">
            <TrafficTrendsChart data={data?.performanceTrends || []} />
          </CardBody>
        </Card>

        <Card
          shadow="none"
          className="border border-foreground/10 bg-white dark:bg-background p-4 md:p-5"
        >
          <CardHeader className="p-0 pb-5 md:pb-8">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Ad Spending & CPC Trends
            </h4>
          </CardHeader>
          <CardBody className="p-0 space-y-4">
            <div className="-ml-5 text-sm overflow-hidden">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={AD_SPENDING_GRAPH}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="opacity-10"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{
                      stroke:
                        theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#ccc",
                      strokeWidth: 2,
                    }}
                  />
                  <Legend />

                  <Area
                    type="monotone"
                    dataKey="spend"
                    stackId="1"
                    stroke="#1aa9ea"
                    fill="#6ec9f2"
                    name="Spend ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card
        shadow="none"
        className="border border-foreground/10 bg-white dark:bg-background p-4 md:p-5"
      >
        <CardHeader className="p-0 pb-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            Campaign Performance
          </h4>
        </CardHeader>

        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/10">
                <th className="text-left text-xs py-3 px-2 font-medium text-foreground/70">
                  Campaign
                </th>
                <th className="text-right text-xs py-3 px-2 font-medium text-foreground/70 whitespace-nowrap">
                  Impressions
                </th>
                <th className="text-right text-xs py-3 px-2 font-medium text-foreground/70 whitespace-nowrap">
                  Clicks
                </th>
                <th className="text-right text-xs py-3 px-2 font-medium text-foreground/70 whitespace-nowrap">
                  CTR
                </th>
                <th className="text-right text-xs py-3 px-2 font-medium text-foreground/70 whitespace-nowrap">
                  Conversions
                </th>
                <th className="text-right text-xs py-3 px-2 font-medium text-foreground/70 whitespace-nowrap">
                  Conv. Rate
                </th>
                <th className="text-right text-xs not-odd:py-3 px-2 font-medium text-foreground/70 whitespace-nowrap">
                  Spend
                </th>
              </tr>
            </thead>

            <tbody>
              {CAMPAIGN_PERFORMANCE.length > 0 ? (
                CAMPAIGN_PERFORMANCE.map((campaign: any, index: number) => (
                  <tr
                    key={index}
                    className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors"
                  >
                    <td className="py-3 text-xs not-last:px-2 font-medium text-foreground">
                      {campaign.campaign ? campaign.campaign : "N/A"}
                    </td>
                    <td className="py-3 text-xs px-2 text-right text-foreground/80">
                      {campaign.impressions}
                    </td>
                    <td className="py-3 text-xs px-2 text-right text-foreground/80">
                      {campaign.clicks}
                    </td>
                    <td className="py-3 text-xs not-only-of-type:px-2 text-right text-foreground/80">
                      {campaign.ctr}
                    </td>
                    <td className="py-3 text-xs px-2 text-right text-foreground/80">
                      {campaign.conversions}
                    </td>
                    <td className="py-3 text-xs px-2 text-right font-medium text-emerald-600 dark:text-emerald-400">
                      {campaign.convRate}
                    </td>
                    <td className="py-3 text-xs px-2 text-right font-medium text-foreground">
                      {campaign.spend}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 text-center text-gray-500 italic"
                  >
                    No active campaigns found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default MetaAds;
