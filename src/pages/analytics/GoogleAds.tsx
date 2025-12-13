import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import { FiActivity } from "react-icons/fi";
import {
  LuDollarSign,
  LuMousePointer,
  LuTarget,
  LuTrendingUp,
} from "react-icons/lu";
import { SiGoogleads } from "react-icons/si";
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
    { name: "Jan", clicks: 450, conversions: 145 },
    { name: "Feb", clicks: 380, conversions: 168 },
    { name: "Mar", clicks: 320, conversions: 156 },
    { name: "Apr", clicks: 390, conversions: 189 },
    { name: "May", clicks: 320, conversions: 215 },
    { name: "Jun", clicks: 490, conversions: 245 },
  ];

  return (
    <div className="-ml-9 text-sm">
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
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Clicks"
          />

          <Line
            type="monotone"
            dataKey="conversions"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Conversions"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const GoogleAds: React.FC = () => {
  const STAT_CARD_DATA = [
    {
      icon: <LuMousePointer className="text-blue-500" />,
      heading: "Total Clicks",
      value: "4,890",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-600" />
          +13.3% vs last month
        </span>
      ),
      subValueClass: "text-green-600",
    },
    {
      icon: <LuTarget className="text-green-500" />,
      heading: "Conversions",
      value: "245",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-600" />
          +14.0% vs last month
        </span>
      ),
    },
    {
      icon: <LuDollarSign className="text-orange-500" />,
      heading: "Cost Per Click",
      value: "$1.07",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-600" />
          -3.6% vs last month
        </span>
      ),
    },
    {
      icon: <FiActivity className="text-purple-600" />,
      heading: "Click-Through Rate",
      value: "7.2%",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-600" />
          +0.4% vs last month
        </span>
      ),
    },
  ];

  const CAMPAIGN_PERFORMANCE = [
    {
      campaign: "Orthodontics - Search",
      impressions: "28,500",
      clicks: "1,890",
      ctr: "6.6%",
      conversions: "95",
      convRate: "5%",
      spend: "$2,150",
    },
    {
      campaign: "Dental Implants - Search",
      impressions: "19,800",
      clicks: "1,240",
      ctr: "6.3%",
      conversions: "68",
      convRate: "5.5%",
      spend: "$1,480",
    },
    {
      campaign: "Braces - Display",
      impressions: "45,600",
      clicks: "1,680",
      ctr: "3.7%",
      conversions: "52",
      convRate: "3.1%",
      spend: "$890",
    },
    {
      campaign: "Invisalign - Shopping",
      impressions: "15,200",
      clicks: "980",
      ctr: "6.4%",
      conversions: "48",
      convRate: "4.9%",
      spend: "$1,120",
    },
  ];

  const AD_SPENDING_GRAPH = [
    { month: "Jan", spend: 3450 },
    { month: "Feb", spend: 3890 },
    { month: "Mar", spend: 3650 },
    { month: "Apr", spend: 4350 },
    { month: "May", spend: 4780 },
    { month: "Jun", spend: 5240 },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <SiGoogleads className="size-7 text-sky-600" aria-hidden="true" />
        <div>
          <h2 className="text-xl font-medium text-gray-700">
            Google Ads Performance
          </h2>
          <p className="text-gray-600 text-[14px]">
            Track your Google Ads campaigns, spending, and conversions
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARD_DATA.map((data, i) => (
          <MiniStatsCard key={i} cardData={data} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card shadow="none" className="border border-primary/15 p-5">
          <CardHeader className="p-0 pb-8">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Google Ads Performance Trends
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

export default GoogleAds;
