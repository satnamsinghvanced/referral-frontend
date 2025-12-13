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

const TrafficTrendsChart: React.FC = () => {
  const data = [
    { name: "Jan", clicks: 3600, conversions: 70 },
    { name: "Feb", clicks: 4000, conversions: 80 },
    { name: "Mar", clicks: 4300, conversions: 85 },
    { name: "Apr", clicks: 4800, conversions: 95 },
    { name: "May", clicks: 5300, conversions: 105 },
    { name: "Jun", clicks: 6000, conversions: 118 },
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

export const MetaAds: React.FC = () => {
  const STAT_CARD_DATA = [
    {
      icon: <LuMousePointer className="text-blue-500" />,
      heading: "Total Clicks",
      value: "6,120",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          +12.9% vs last month
        </span>
      ),
    },
    {
      icon: <LuUsers className="text-green-500" />,
      heading: "Conversions",
      value: "189",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          +14.5% vs last month
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
          +0.2% vs last month
        </span>
      ),
    },
  ];

  const CAMPAIGN_PERFORMANCE = [
    {
      campaign: "Facebook - Brand Awareness",
      impressions: "89,000",
      clicks: "2,680",
      ctr: "3%",
      conversions: "78",
      convRate: "2.9%",
      spend: "$2,150",
    },
    {
      campaign: "Instagram - New Patients",
      impressions: "64,000",
      clicks: "2,340",
      ctr: "3.7%",
      conversions: "85",
      convRate: "3.6%",
      spend: "$1,850",
    },
    {
      campaign: "Facebook - Retargeting",
      impressions: "18,500",
      clicks: "890",
      ctr: "4.8%",
      conversions: "34",
      convRate: "3.8%",
      spend: "$680",
    },
    {
      campaign: "Instagram Stories - Promo",
      impressions: "45,000",
      clicks: "1,580",
      ctr: "3.5%",
      conversions: "42",
      convRate: "2.7%",
      spend: "$1,180",
    },
  ];

  const AD_SPENDING_GRAPH = [
    { month: "Jan", spend: 2900 },
    { month: "Feb", spend: 3100 },
    { month: "Mar", spend: 3300 },
    { month: "Apr", spend: 3600 },
    { month: "May", spend: 4000 },
    { month: "Jun", spend: 4500 },
  ];

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

export default MetaAds;
