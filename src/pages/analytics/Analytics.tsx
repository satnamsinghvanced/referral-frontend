import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import {
  LuCalendar,
  LuChartColumn,
  LuTarget,
  LuTrendingUp,
  LuUsers,
} from "react-icons/lu";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import GoogleAnalytics from "./GoogleAnalytics";

const Analytics: React.FC = () => {
  const HEADING_DATA = {
    heading: "Analytics Dashboard",
    subHeading:
      "Track your practice performance and referral trends with detailed insights.",
  };

  const STAT_CARD_DATA = [
    {
      icon: <LuUsers className="text-blue-500" />,
      heading: "Monthly Referrals",
      value: "247",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          +12% from last month
        </span>
      ),
      subValueClass: "text-green-600",
    },
    {
      icon: <LuTarget className="text-orange-500" />,
      heading: "Conversion Rate",
      value: "86.3%",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          +3.2% from last month
        </span>
      ),
    },
    {
      icon: <LuCalendar className="text-blue-500" />,
      heading: "Appointments",
      value: "189",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          +8% from last month
        </span>
      ),
    },
    {
      icon: <LuChartColumn className="text-green-500" />,
      heading: "Revenue Growth",
      value: "+15%",
      subheading: (
        <span className="text-green-700 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          Monthly revenue increase
        </span>
      ),
    },
  ];

  const donutData = [
    { name: "Direct", value: 30 },
    { name: "Email", value: 22 },
    { name: "Google", value: 18 },
    { name: "Referral", value: 15 },
    { name: "Social Media", value: 13 },
  ];

  const performanceData = [
    { month: "Jan", conversions: 38, referrals: 45 },
    { month: "Feb", conversions: 44, referrals: 52 },
    { month: "Mar", conversions: 41, referrals: 48 },
    { month: "Apr", conversions: 52, referrals: 61 },
    { month: "May", conversions: 49, referrals: 58 },
    { month: "Jun", conversions: 58, referrals: 67 },
  ];

  const COLORS = ["#f97316", "#fbbf24", "#0ea5e9", "#3b82f6", "#1e40af"];

  const WeeklyActivity = [
    { day: "Mon", calls: 22, reviews: 5 },
    { day: "Tue", calls: 28, reviews: 7 },
    { day: "Wed", calls: 31, reviews: 6 },
    { day: "Thu", calls: 36, reviews: 8 },
    { day: "Fri", calls: 33, reviews: 7 },
    { day: "Sat", calls: 18, reviews: 4 },
    { day: "Sun", calls: 12, reviews: 3 },
  ];

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAT_CARD_DATA.map((data, i) => (
            <MiniStatsCard key={i} cardData={data} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card shadow="none" className="border border-primary/15 p-5">
            <CardHeader className="p-0 pb-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                Referral Sources Distribution
              </h4>
            </CardHeader>
            <CardBody className="p-0 overflow-visible">
              <ResponsiveContainer width="100%" maxHeight={320}>
                <PieChart
                  style={{
                    aspectRatio: 1,
                    fontSize: "14px",
                  }}
                >
                  <Pie
                    data={donutData}
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    width={400}
                  >
                    {donutData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card shadow="none" className="border border-primary/15 p-5">
            <CardHeader className="p-0 pb-8">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                Performance Trends
              </h4>
            </CardHeader>
            <CardBody className="p-0 overflow-visible">
              <div className="-ml-10 text-sm">
                <ResponsiveContainer width="100%" aspect={1.85} maxHeight={320}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="conversions"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      name="Conversions"
                    />

                    <Line
                      type="monotone"
                      dataKey="referrals"
                      stroke="#0ea5e9"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      name="Referrals"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          <Card
            shadow="none"
            className="border border-primary/15 p-5 col-span-2"
          >
            <CardHeader className="p-0 pb-8">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                Weekly Activity Overview
              </h4>
            </CardHeader>
            <CardBody className="p-0">
              <div className="-ml-10 text-sm">
                <ResponsiveContainer width="100%" aspect={1.85} maxHeight={380}>
                  <AreaChart data={WeeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    <Area
                      type="monotone"
                      dataKey="calls"
                      stackId="1"
                      stroke="#0ea5e9"
                      fill="#7dd3fc"
                      name="Calls"
                    />
                    <Area
                      type="monotone"
                      dataKey="reviews"
                      stackId="1"
                      stroke="#4f46e5"
                      fill="#818cf8"
                      name="Reviews"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="mt-10">
          <GoogleAnalytics />
        </div>
      </div>
    </ComponentContainer>
  );
};

export default Analytics;
