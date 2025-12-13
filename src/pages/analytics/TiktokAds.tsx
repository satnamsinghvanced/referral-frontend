import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import { FaTiktok } from "react-icons/fa";
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

const TrafficTrendsChart: React.FC = () => {
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

export const TiktokAds: React.FC = () => {
  const STAT_CARD_DATA = [
    {
      icon: <LuMousePointer className="text-blue-500" />,
      heading: "Total Clicks",
      value: "4,980",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          +16.1% vs last month
        </span>
      ),
    },
    {
      icon: <LuUsers className="text-green-500" />,
      heading: "Conversions",
      value: "105",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          +18.0% vs last month
        </span>
      ),
    },
    {
      icon: <LuTrendingUp className="text-orange-500" />,
      heading: "Cost Per Click",
      value: "$0.75",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          -1.3% vs last month
        </span>
      ),
    },
    {
      icon: <LuEye className="text-purple-600" />,
      heading: "Click-Through Rate",
      value: "3.4%",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          +0.1% vs last month
        </span>
      ),
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
        <FaTiktok className="size-7 text-black" aria-hidden="true" />
        <div>
          <h2 className="text-xl font-medium text-gray-700">
            TikTok Ads Performance
          </h2>
          <p className="text-gray-600 text-[14px]">
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
        <Card shadow="none" className="border border-primary/15 p-5">
          <CardHeader className="p-0 pb-8">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Meta Ads Performance Trends
            </h4>
          </CardHeader>
          <CardBody className="p-0 overflow-visible">
            <TrafficTrendsChart />
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
              <ResponsiveContainer width="100%" aspect={1.85} maxHeight={380}>
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
              {CAMPAIGN_PERFORMANCE.map((campaign, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 text-xs not-last:px-2 font-medium text-gray-900">
                    {campaign.campaign}
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
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default TiktokAds;
