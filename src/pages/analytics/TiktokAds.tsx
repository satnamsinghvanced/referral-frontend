import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import { FaTiktok } from "react-icons/fa";
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
import ChartTooltip from "../../components/common/ChartTooltip";
import { useTypedSelector } from "../../hooks/useTypedSelector";

const TrafficTrendsChart: React.FC = () => {
  const { theme } = useTypedSelector((state) => state.ui);
  const data = [
    { name: "Jan", clicks: 2400, conversions: 45 },
    { name: "Feb", clicks: 2800, conversions: 55 },
    { name: "Mar", clicks: 3200, conversions: 62 },
    { name: "Apr", clicks: 3700, conversions: 72 },
    { name: "May", clicks: 4300, conversions: 95 },
    { name: "Jun", clicks: 4900, conversions: 105 },
  ];

  return (
    <div className="-ml-5 text-sm">
      <ResponsiveContainer width="100%" aspect={1.85} maxHeight={380}>
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

export const TiktokAds: React.FC = () => {
  const { theme } = useTypedSelector((state) => state.ui);
  const STAT_CARD_DATA = [
    {
      icon: <LuMousePointer className="text-blue-500 dark:text-blue-400" />,
      heading: "Total Clicks",
      value: "4,980",
      subheading: <TrendIndicator percentage="+16.1%" label="vs last month" />,
    },
    {
      icon: <LuUsers className="text-green-500 dark:text-green-400" />,
      heading: "Conversions",
      value: "105",
      subheading: <TrendIndicator percentage="+18.0%" label="vs last month" />,
    },
    {
      icon: <LuTrendingUp className="text-orange-500 dark:text-orange-400" />,
      heading: "Cost Per Click",
      value: "$0.75",
      subheading: <TrendIndicator percentage="-1.3%" label="vs last month" />,
    },
    {
      icon: <LuEye className="text-purple-600 dark:text-purple-400" />,
      heading: "Click-Through Rate",
      value: "3.4%",
      subheading: <TrendIndicator percentage="+0.1%" label="vs last month" />,
    },
  ];

  const CAMPAIGN_PERFORMANCE = [
    {
      campaign: "TikTok - Gen Z Braces",
      impressions: "78,000",
      clicks: "2,890",
      ctr: "3.7%",
      conversions: "68",
      convRate: "2.4%",
      spend: "$2,180",
    },
    {
      campaign: "TikTok - Before/After",
      impressions: "54,000",
      clicks: "1,850",
      ctr: "3.4%",
      conversions: "45",
      convRate: "2.4%",
      spend: "$1,450",
    },
    {
      campaign: "TikTok - Patient Stories",
      impressions: "42,000",
      clicks: "1,420",
      ctr: "3.4%",
      conversions: "32",
      convRate: "2.3%",
      spend: "$1,080",
    },
  ];

  const AD_SPENDING_GRAPH = [
    { month: "Jan", spend: 1800 },
    { month: "Feb", spend: 2000 },
    { month: "Mar", spend: 2400 },
    { month: "Apr", spend: 2900 },
    { month: "May", spend: 3300 },
    { month: "Jun", spend: 3800 },
  ];

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <FaTiktok className="size-7 text-foreground" aria-hidden="true" />
        <div className="max-md:space-y-1">
          <h2 className="text-md md:text-xl font-medium text-foreground">
            TikTok Ads Performance
          </h2>
          <p className="text-foreground/60 text-xs md:text-sm">
            Track your TikTok advertising campaigns and engagement
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
              TikTok Ads Performance Trends
            </h4>
          </CardHeader>
          <CardBody className="p-0 overflow-visible">
            <TrafficTrendsChart />
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
            <div className="-ml-5 text-sm">
              <ResponsiveContainer width="100%" aspect={1.85} maxHeight={380}>
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
              {CAMPAIGN_PERFORMANCE.map((campaign, index) => (
                <tr
                  key={index}
                  className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors"
                >
                  <td className="py-3 text-xs not-last:px-2 font-medium text-foreground">
                    {campaign.campaign}
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
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default TiktokAds;
