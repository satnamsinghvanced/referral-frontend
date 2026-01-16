import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import {
  LuCalendar,
  LuChartColumn,
  LuTarget,
  LuTrendingDown,
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
import { LoadingState } from "../../components/common/LoadingState";
import { useGeneralAnalytics } from "../../hooks/useAnalytics";
import GoogleAds from "./GoogleAds";
import GoogleAnalytics from "./GoogleAnalytics";
import MetaAds from "./MetaAds";

const Analytics: React.FC = () => {
  const { data, isLoading } = useGeneralAnalytics();

  const HEADING_DATA = {
    heading: "Analytics Dashboard",
    subHeading:
      "Track your practice performance and referral trends with detailed insights.",
  };

  const renderTrend = (
    status: string,
    percentage: number,
    label: string = "from last month"
  ) => {
    const isIncrement = status === "increment" || percentage > 0;
    const isDecrement = status === "decrement" || percentage < 0;

    const colorClass = isIncrement
      ? "text-green-600 dark:text-emerald-400"
      : isDecrement
      ? "text-red-600 dark:text-red-400"
      : "text-gray-500";

    const Icon = isIncrement
      ? LuTrendingUp
      : isDecrement
      ? LuTrendingDown
      : null;

    return (
      <span className={`${colorClass} flex items-center`}>
        {Icon && <Icon className="h-4 w-4 mr-1" />}
        {isLoading ? "..." : `${percentage}% ${label}`}
      </span>
    );
  };

  const STAT_CARD_DATA = [
    {
      icon: <LuUsers className="text-blue-500 dark:text-blue-400" />,
      heading: "Monthly Referrals",
      value: isLoading
        ? "..."
        : data?.stats?.monthlyReferrals?.totalReferrals?.toString() || "0",
      subheading: renderTrend(
        data?.stats?.monthlyReferrals?.status || "",
        data?.stats?.monthlyReferrals?.percentage || 0
      ),
    },
    {
      icon: <LuTarget className="text-orange-500 dark:text-orange-400" />,
      heading: "Conversion Rate",
      value: isLoading
        ? "..."
        : `${data?.stats?.conversionRate?.conversionRate || "0"}%`,
      subheading: renderTrend(
        data?.stats?.conversionRate?.status || "",
        data?.stats?.conversionRate?.percentage || 0,
        "conversion performance"
      ),
    },
    {
      icon: <LuCalendar className="text-blue-500 dark:text-blue-400" />,
      heading: "Appointments",
      value: isLoading
        ? "..."
        : data?.stats?.appointments?.totalAppointments?.toString() || "0",
      subheading: renderTrend(
        data?.stats?.appointments?.status || "",
        data?.stats?.appointments?.percentage || 0
      ),
    },
    {
      icon: <LuChartColumn className="text-green-500 dark:text-green-400" />,
      heading: "Revenue Growth",
      value: isLoading
        ? "..."
        : `$${data?.stats?.revenue?.totalRevenue?.toLocaleString() || "0"}`,
      subheading: renderTrend(
        data?.stats?.revenue?.status || "",
        data?.stats?.revenue?.percentage || 0,
        "revenue growth"
      ),
    },
  ];

  const donutData = data?.referralSources || [];
  const performanceData = data?.performanceData || [];
  const WeeklyActivity = data?.weeklyActivity || [];

  const COLORS = ["#f97316", "#fbbf24", "#0ea5e9", "#3b82f6", "#1e40af"];

  if (isLoading) {
    return (
      <ComponentContainer headingData={HEADING_DATA}>
        <LoadingState />
      </ComponentContainer>
    );
  }

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="space-y-4 md:space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAT_CARD_DATA.map((data, i) => (
            <MiniStatsCard key={i} cardData={data} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            shadow="none"
            className="border border-foreground/10 bg-white dark:bg-background p-5"
          >
            <CardHeader className="p-0 pb-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                Referral Sources Distribution
              </h4>
            </CardHeader>
            <CardBody className="p-0 overflow-visible flex items-center justify-center">
              <ResponsiveContainer width="100%" height={320} aspect={1}>
                <PieChart
                  style={{
                    aspectRatio: 1,
                    fontSize: "14px",
                  }}
                >
                  <Pie
                    data={donutData.map((item: any) => ({
                      name: item.name,
                      value: item.value,
                    }))}
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    width={400}
                  >
                    {donutData.map((item: any, index: number) => (
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

          <Card
            shadow="none"
            className="border border-foreground/10 bg-white dark:bg-background p-5"
          >
            <CardHeader className="p-0 pb-8">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                Performance Trends
              </h4>
            </CardHeader>
            <CardBody className="p-0 overflow-visible">
              <div className="-ml-10 text-sm">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
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
                      contentStyle={{
                        backgroundColor: "hsl(var(--heroui-background))",
                        border: "1px solid hsl(var(--heroui-default-200))",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ fontSize: "12px" }}
                    />
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
            className="border border-foreground/10 bg-white dark:bg-background p-5 col-span-2"
          >
            <CardHeader className="p-0 pb-8">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                Weekly Activity Overview
              </h4>
            </CardHeader>
            <CardBody className="p-0">
              <div className="-ml-10 text-sm">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={WeeklyActivity}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="currentColor"
                      className="opacity-10"
                    />
                    <XAxis
                      dataKey="day"
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
                      contentStyle={{
                        backgroundColor: "hsl(var(--heroui-background))",
                        border: "1px solid hsl(var(--heroui-default-200))",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ fontSize: "12px" }}
                    />
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

        <div className="mt-10 space-y-10">
          <GoogleAnalytics />
          <GoogleAds />
          <MetaAds />
          {/* <TiktokAds /> */}
        </div>
      </div>
    </ComponentContainer>
  );
};

export default Analytics;
