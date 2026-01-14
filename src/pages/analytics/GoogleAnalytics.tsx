import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import {
  LuClock,
  LuEye,
  LuMonitor,
  LuMousePointer,
  LuSmartphone,
  LuTrendingUp,
  LuUsers,
} from "react-icons/lu";
import { SiGoogleanalytics } from "react-icons/si";
import {
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
import { LoadingState } from "../../components/common/LoadingState";
import { useGoogleAnalytics } from "../../hooks/useAnalytics";

const TrafficTrendsChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="-ml-4 text-sm">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#1E40AF"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Users"
          />

          <Line
            type="monotone"
            dataKey="sessions"
            stroke="#F97316"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Sessions"
          />
          <Line
            type="monotone"
            dataKey="pageviews"
            stroke="#0284C7"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Page Views"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const DeviceDonutChart: React.FC<{ data: any[] }> = ({ data: deviceData }) => {
  const data = deviceData.map((d: any) => ({
    name:
      d.device === "desktop"
        ? "Desktop"
        : d.device === "mobile"
        ? "Mobile"
        : "Tablet",
    value: d.users,
    color:
      d.device === "desktop"
        ? "#0EA5E9"
        : d.device === "mobile"
        ? "#F97316"
        : "#1E40AF",
  }));

  const renderLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, name } =
      props as LabelProps;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#555"
        fontSize={13}
        textAnchor={x > cx ? "start" : "end"}
      >
        {`${name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-[280px] flex items-center justify-center text-sm">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            innerRadius={0}
            label={renderLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  percent: number;
  name: string;
}

interface TrafficSourceItemProps {
  source: string;
  sessions: number;
  users: number;
  percentage: number;
}

interface ConversationItemProps {
  source: string;
  sessions: number;
  price: number;
  percentage: number;
}
interface DeviceMetricProps {
  device: string;
  users: number;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

const TrafficSourceItem: React.FC<TrafficSourceItemProps> = ({
  source,
  sessions,
  users,
  percentage,
}) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
    <div className="flex-1 flex items-center gap-3">
      <div className="space-y-0.5">
        <h5 className="font-medium text-sm !font-sans">{source}</h5>
        <p className="text-xs text-gray-500">
          {sessions.toLocaleString()} sessions
        </p>
      </div>
    </div>
    <div className="text-right space-y-0.5">
      <div className="font-semibold text-sm">{users.toLocaleString()}</div>
      <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
    </div>
  </div>
);

const ConversionGoalsItem: React.FC<ConversationItemProps> = ({
  source,
  sessions,
  price,
  percentage,
}) => {
  const safePercentage = typeof percentage === "number" ? percentage : 0;
  const safeSessions = typeof sessions === "number" ? sessions : 0;
  const safePrice = typeof price === "number" ? price : 0;

  return (
    <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg p-3">
      <div className="space-y-0.5">
        <h5 className="text-sm font-medium !font-sans">{source}</h5>
        <p className="text-xs text-gray-600">
          {safePercentage.toFixed(1)}% conversion rate
        </p>
      </div>
      <div className="text-right space-y-0.5">
        <p className="text-sm font-semibold">{safeSessions.toLocaleString()}</p>
        <p className="text-xs text-gray-500">
          <span className="text-green-700">${safePrice.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
};

const DeviceMetric: React.FC<DeviceMetricProps> = ({
  device,
  users,
  percentage,
  icon,
  color,
}) => (
  <div className="space-y-1">
    <div className="flex justify-center">
      {React.cloneElement(icon as React.ReactElement, {
        // @ts-ignore
        className: "h-6 w-6 mb-1",
        style: { color },
      })}
    </div>
    <div className="text-xs font-medium">{device}</div>
    <div className="text-sm font-bold" style={{ color }}>
      {users.toLocaleString()}
    </div>
    <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
  </div>
);

export const GoogleAnalyticsDashboard: React.FC = () => {
  const { data, isLoading } = useGoogleAnalytics();

  const trafficSources = data?.trafficSources?.data || [];
  const conversionGoals = data?.conversions || [];
  const deviceMetrics = (data?.deviceAnalytics || []).map((d: any) => ({
    device: d.device === "desktop" ? "Desktop" : "Mobile",
    users: d.users,
    percentage: 0,
    icon:
      d.device === "desktop" ? (
        <LuMonitor className="w-[21px] h-[21px]" />
      ) : (
        <LuSmartphone />
      ),
    color: d.device === "desktop" ? "rgb(14, 165, 233)" : "rgb(249, 115, 22)",
  }));

  const STAT_CARD_DATA = [
    {
      icon: <LuUsers className="text-blue-500" />,
      heading: "Total Users",
      value: isLoading
        ? "..."
        : data?.donutData?.users?.totalUsers?.toLocaleString() || "0",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-600" />
          {isLoading
            ? "..."
            : `${data?.donutData?.users?.growthPercent || 0} vs last month`}
        </span>
      ),
      subValueClass: "text-green-600",
    },
    {
      icon: <LuEye className="text-blue-500" />,
      heading: "Page Views",
      value: isLoading
        ? "..."
        : data?.donutData?.pageViews?.totalPageViews?.toLocaleString() || "0",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-600" />
          {isLoading
            ? "..."
            : `${data?.donutData?.pageViews?.growthPercent || 0} vs last month`}
        </span>
      ),
    },
    {
      icon: <LuClock className="text-orange-500" />,
      heading: "Total Sessions",
      value: isLoading
        ? "..."
        : data?.donutData?.sessions?.totalSessions?.toLocaleString() || "0",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-600" />
          {isLoading
            ? "..."
            : `${data?.donutData?.sessions?.growthPercent || 0} vs last month`}
        </span>
      ),
    },
    {
      icon: <LuMousePointer className="text-purple-600" />,
      heading: "Bounce Rate",
      value: isLoading
        ? "..."
        : data?.donutData?.bounceRate?.totalBounceRate?.toLocaleString() || "0",
      subheading: (
        <span className="text-green-700 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-600" />
          {isLoading
            ? "..."
            : `${
                data?.donutData?.bounceRate?.growthPercent || 0
              } vs last month`}
        </span>
      ),
    },
  ];

  const TOP_PAGES = data?.topPages || [];

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <SiGoogleanalytics
          className="size-7 text-yellow-500"
          aria-hidden="true"
        />
        <div>
          <h2 className="text-xl font-medium text-gray-700">
            Google Analytics - Website Statistics
          </h2>
          <p className="text-gray-600 text-[14px]">
            Comprehensive website performance and user behavior insights
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
              Website Traffic Trends
            </h4>
          </CardHeader>
          <CardBody className="p-0">
            <TrafficTrendsChart data={data?.trafficTrends || []} />
          </CardBody>
        </Card>

        <Card shadow="none" className="border border-primary/15 p-5">
          <CardHeader className="p-0 pb-8">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Device Analytics
            </h4>
          </CardHeader>
          <CardBody className="p-0 space-y-4">
            <DeviceDonutChart data={data?.deviceAnalytics || []} />
            <div className="grid grid-cols-3 gap-4 text-center">
              {deviceMetrics.map((metric) => (
                <DeviceMetric key={metric.device} {...metric} />
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card shadow="none" className="border border-primary/15 p-5">
          <CardHeader className="p-0 pb-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Traffic Sources
            </h4>
          </CardHeader>
          <CardBody className="p-0 space-y-3">
            {trafficSources.map((source: any) => (
              <TrafficSourceItem
                key={source.source}
                {...source}
                users={source.sessions}
              />
            ))}
          </CardBody>
        </Card>

        <Card shadow="none" className="border border-primary/15 p-5">
          <CardHeader className="p-0 pb-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Key Conversion Events
            </h4>
          </CardHeader>
          <CardBody className="p-0 space-y-3">
            {conversionGoals.map((goal: any, index: number) => (
              <ConversionGoalsItem
                key={goal.event || `goal-${index}`}
                source={goal.event || "Unknown"}
                sessions={goal.count || 0}
                price={0}
                percentage={0}
              />
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Top Pages Here */}
      <Card shadow="none" className="border border-primary/15 p-5">
        <CardHeader className="p-0 pb-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            Top Pages Performance
          </h4>
        </CardHeader>

        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs py-3 px-2 font-medium text-gray-700">
                  Page
                </th>
                <th className="text-right text-xs py-3 px-2 font-medium text-gray-700">
                  Page Views
                </th>
                <th className="text-right text-xs py-3 px-2 font-medium text-gray-700">
                  Unique Views
                </th>
                <th className="text-right text-xs py-3 px-2 font-medium text-gray-700">
                  Avg. Time
                </th>
                <th className="text-right text-xs not-odd:py-3 px-2 font-medium text-gray-700">
                  Bounce Rate
                </th>
              </tr>
            </thead>

            <tbody>
              {TOP_PAGES.map((p: any, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 text-xs not-last:px-2 font-medium text-gray-900">
                    {p.path}
                  </td>
                  <td className="py-3 text-xs px-2 text-right text-gray-700">
                    {p.views}
                  </td>
                  <td className="py-3 text-xs px-2 text-right text-gray-700">
                    {p.users}
                  </td>
                  <td className="py-3 text-xs not-only-of-type:px-2 text-right text-gray-700">
                    {Math.floor(p.avgSessionDuration / 60)}:
                    {String(p.avgSessionDuration % 60).padStart(2, "0")}
                  </td>
                  <td className="py-3 text-xs px-2 text-right">
                    <span
                      className={`font-medium ${
                        p.bounceRate < 30
                          ? "text-emerald-600"
                          : "text-orange-600"
                      }`}
                    >
                      {p.bounceRate}%
                    </span>
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

export default GoogleAnalyticsDashboard;
