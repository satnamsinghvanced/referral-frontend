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
  Bar,
  BarChart,
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

  const ChannelROI = [
    { name: "Google Reviews", leads: 140, roi: 280 },
    { name: "Direct Referrals", leads: 95, roi: 320 },
    { name: "Social Media", leads: 78, roi: 260 },
    { name: "Email Campaigns", leads: 65, roi: 340 },
    { name: "Print Ads", leads: 45, roi: 150 },
  ];

  const WeeklyActivity = [
    { day: "Mon", calls: 22, appointments: 18, reviews: 5 },
    { day: "Tue", calls: 28, appointments: 22, reviews: 7 },
    { day: "Wed", calls: 31, appointments: 25, reviews: 6 },
    { day: "Thu", calls: 36, appointments: 28, reviews: 8 },
    { day: "Fri", calls: 33, appointments: 26, reviews: 7 },
    { day: "Sat", calls: 18, appointments: 12, reviews: 4 },
    { day: "Sun", calls: 12, appointments: 9, reviews: 3 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-lg rounded-lg p-3 border">
          <p className="font-semibold mb-1">{label}</p>

          <div className="flex flex-col gap-1 text-sm">
            <span className="flex items-center gap-2 text-sky-500">
              ● calls: {payload[0]?.value}
            </span>
            <span className="flex items-center gap-2 text-orange-400">
              ● appointments: {payload[1]?.value}
            </span>
            <span className="flex items-center gap-2 text-indigo-600">
              ● reviews: {payload[2]?.value}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const MonthlyReferral = [
    { name: "Google", value: 140 },
    { name: "Direct", value: 95 },
    { name: "Social Media", value: 75 },
    { name: "Referrals", value: 62 },
    { name: "Email", value: 42 },
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
              {/* <div className="h-[350px] sm:h-[300px] md:h-[400px] text-sm"> */}
              <ResponsiveContainer width="100%" maxHeight={320}>
                <PieChart
                  style={{
                    // width: "100%",
                    // maxWidth: "500px",
                    // maxHeight: "80vh",
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
              {/* </div> */}
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

          <Card shadow="none" className="border border-primary/15 p-5">
            <CardHeader className="p-0 pb-8">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                Channel ROI Analysis
              </h4>
            </CardHeader>
            <CardBody className="p-0">
              <div className="-ml-8 text-sm">
                <ResponsiveContainer width="100%" aspect={1.85} maxHeight={380}>
                  <BarChart data={ChannelROI}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-25}
                      textAnchor="end"
                      height={60}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="leads"
                      fill="#0ea5e9"
                      radius={[6, 6, 0, 0]}
                      name="Leads Generated"
                    />
                    <Bar
                      dataKey="roi"
                      fill="#fb923c"
                      radius={[6, 6, 0, 0]}
                      name="ROI %"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          <Card shadow="none" className="border border-primary/15 p-5">
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
                    <Tooltip content={<CustomTooltip />} />
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
                      dataKey="appointments"
                      stackId="1"
                      stroke="#fb923c"
                      fill="#fdba74"
                      name="Appointments"
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

          <Card
            shadow="none"
            className="border border-primary/15 p-5 col-span-2"
          >
            <CardHeader className="p-0 pb-8">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                Monthly Referral Sources Breakdown
              </h4>
            </CardHeader>
            <CardBody className="p-0">
              <div className="-ml-8 text-sm">
                <ResponsiveContainer width="100%" aspect={1.85} maxHeight={380}>
                  <BarChart data={MonthlyReferral} barCategoryGap="20%">
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#0ea5e9"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor="#0ea5e9"
                          stopOpacity={0.4}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(14, 165, 233, 0.1)"
                    />

                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                    />

                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      tickCount={5}
                      domain={[0, 160]}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      fill="url(#barGradient)"
                      stroke="#0ea5e9"
                      strokeWidth={1}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
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
