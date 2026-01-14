import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import { BsMeta } from "react-icons/bs";
import { LuEye, LuMousePointer, LuTrendingUp, LuUsers } from "react-icons/lu";
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
import { useMetaAds } from "../../hooks/useAnalytics";

const TrafficTrendsChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="-ml-5 text-sm">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
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
  const { data, isLoading } = useMetaAds();

  const STAT_CARD_DATA = [
    {
      icon: <LuMousePointer className="text-blue-500" />,
      heading: "Total Clicks",
      value: isLoading
        ? "..."
        : data?.stats?.totalClicks?.value?.toLocaleString() || "0",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          {isLoading
            ? "..."
            : `${
                data?.stats?.totalClicks?.lastMonthChange || 0
              }% vs last month`}
        </span>
      ),
    },
    {
      icon: <LuUsers className="text-green-500" />,
      heading: "Conversions",
      value: isLoading
        ? "..."
        : data?.stats?.conversions?.value?.toString() || "0",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          {isLoading
            ? "..."
            : `${
                data?.stats?.conversions?.lastMonthChange || 0
              }% vs last month`}
        </span>
      ),
    },
    {
      icon: <LuTrendingUp className="text-orange-500" />,
      heading: "Cost Per Click",
      value: isLoading ? "..." : `$${data?.stats?.costPerClick?.value || "0"}`,
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          {isLoading
            ? "..."
            : `${
                data?.stats?.costPerClick?.lastMonthChange || 0
              }% vs last month`}
        </span>
      ),
    },
    {
      icon: <LuEye className="text-purple-600" />,
      heading: "Click-Through Rate",
      value: isLoading
        ? "..."
        : `${data?.stats?.clickThroughRate?.value || "0"}%`,
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          {isLoading
            ? "..."
            : `${
                data?.stats?.clickThroughRate?.lastMonthChange || 0
              }% vs last month`}
        </span>
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
        <div>
          <h2 className="text-xl font-medium text-gray-700">
            Meta Ads Performance (Facebook & Instagram)
          </h2>
          <p className="text-gray-600 text-[14px]">
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
        <Card shadow="none" className="border border-primary/15 p-5">
          <CardHeader className="p-0 pb-8">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Meta Ads Performance Trends
            </h4>
          </CardHeader>
          <CardBody className="p-0 overflow-visible">
            <TrafficTrendsChart data={data?.performanceTrends || []} />
          </CardBody>
        </Card>

        <Card shadow="none" className="border border-primary/15 p-5">
          <CardHeader className="p-0 pb-8">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Ad Spending & CPC Trends
            </h4>
          </CardHeader>
          <CardBody className="p-0 space-y-4">
            <div className="-ml-5 text-sm">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={AD_SPENDING_GRAPH}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
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

      <Card shadow="none" className="border border-primary/15 p-5">
        <CardHeader className="p-0 pb-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            Campaign Performance
          </h4>
        </CardHeader>

        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs py-3 px-2 font-medium text-gray-700">
                  Campaign
                </th>
                <th className="text-right text-xs py-3 px-2 font-medium text-gray-700">
                  Impressions
                </th>
                <th className="text-right text-xs py-3 px-2 font-medium text-gray-700">
                  Clicks
                </th>
                <th className="text-right text-xs py-3 px-2 font-medium text-gray-700">
                  CTR
                </th>
                <th className="text-right text-xs py-3 px-2 font-medium text-gray-700">
                  Conversions
                </th>
                <th className="text-right text-xs py-3 px-2 font-medium text-gray-700">
                  Conv. Rate
                </th>
                <th className="text-right text-xs not-odd:py-3 px-2 font-medium text-gray-700">
                  Spend
                </th>
              </tr>
            </thead>

            <tbody>
              {CAMPAIGN_PERFORMANCE.length > 0 ? (
                CAMPAIGN_PERFORMANCE.map((campaign, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 text-xs not-last:px-2 font-medium text-gray-900">
                      {campaign.campaign ? campaign.campaign : "N/A"}
                    </td>
                    <td className="py-3 text-xs px-2 text-right text-gray-700">
                      {campaign.impressions}
                    </td>
                    <td className="py-3 text-xs px-2 text-right text-gray-700">
                      {campaign.clicks}
                    </td>
                    <td className="py-3 text-xs not-only-of-type:px-2 text-right text-gray-700">
                      {campaign.ctr}
                    </td>
                    <td className="py-3 text-xs px-2 text-right">
                      {campaign.conversions}
                    </td>
                    <td className="py-3 text-xs px-2 text-right font-medium text-emerald-600">
                      {campaign.convRate}
                    </td>
                    <td className="py-3 text-xs px-2 text-right font-medium">
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
