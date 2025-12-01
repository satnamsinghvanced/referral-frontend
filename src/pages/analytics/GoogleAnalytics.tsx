import React from "react";
import {
  LuUsers,
  LuTrendingUp,
  LuTrendingDown,
  LuMonitor,
  LuGlobe,
  LuEye,
  LuClock,
  LuMousePointer,
} from "react-icons/lu";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  
} from "recharts";
import MiniStatsCard from "../../components/cards/MiniStatsCard";

const TrafficTrendsChart: React.FC = () => {
  const data = [
    { name: "Jan", users: 8500, sessions: 4200, pageviews: 3000 },
    { name: "Feb", users: 9800, sessions: 4800, pageviews: 3300 },
    { name: "Mar", users: 9000, sessions: 4500, pageviews: 3100 },
    { name: "Apr", users: 10500, sessions: 5300, pageviews: 3500 },
    { name: "May", users: 11000, sessions: 5600, pageviews: 3700 },
    { name: "Jun", users: 12000, sessions: 6100, pageviews: 4000 },
  ];

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              fontSize: "12px",
            }}
          />
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

const DeviceDonutChart: React.FC = () => {
  const data = [
    { name: "Desktop", value: 1890, color: "#0EA5E9" },
    { name: "Mobile", value: 1650, color: "#F97316" },
    { name: "Tablet", value: 380, color: "#1E40AF" },
  ];

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
    <div className="w-full h-[230px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={85}
            innerRadius={0}
            label={renderLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: React.ReactNode;
  iconColor: string;
}
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

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  iconColor,
}) => {
  const isUp = changeType === "up";
  const changeClass = isUp ? "text-emerald-600" : "text-red-600";
  const ChangeIcon = isUp ? LuTrendingUp : LuTrendingDown;

  return (
    <div className="bg-white rounded-xl border p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        <div className={`p-2 rounded-full`} style={{ color: iconColor }}>
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="flex items-center mt-1">
          <ChangeIcon className={`h-4 w-4 mr-1 ${changeClass}`} />
          <p className={`text-sm font-medium ${changeClass}`}>{change}</p>
        </div>
      </div>
    </div>
  );
};

const TrafficSourceItem: React.FC<TrafficSourceItemProps> = ({
  source,
  sessions,
  users,
  percentage,
}) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
    <div className="flex-1 flex items-center gap-3">
      <div>
        <div className="font-medium text-[14px] text-gray-900">{source}</div>
        <div className="text-[13px] text-gray-500">
          {sessions.toLocaleString()} sessions
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="font-bold text-[16px] text-gray-900">
        {users.toLocaleString()}
      </div>
      <div className="text-[12px] text-gray-500">{percentage.toFixed(1)}%</div>
    </div>
  </div>
);

const ConversionGoalsItem: React.FC<ConversationItemProps> = ({
  source,
  sessions,
  price,
  percentage,
}) => {
  return (
    <div className="flex items-center justify-between bg-[#F9FAFB] border border-gray-100 rounded-xl px-5 py-4">
      <div>
        <h5 className="text-[14px] font-semibold text-gray-700">{source}</h5>
        <p className="text-[12px] text-gray-600 mt-1">
          {percentage.toFixed(1)}% conversion rate
        </p>
      </div>
      <div className="text-right">
        <p className="text-[16px] font-bold text-gray-900">
          {sessions.toLocaleString()}
        </p>
        <p className="text-[13px] text-gray-500 mt -1">
          <span className="text-12px text-green-700">
            ${price.toLocaleString()}
          </span>
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
  <div className="space-y-2">
    <div className="flex justify-center">
      {/* {React.cloneElement(icon as React.ReactElement, {
        className: "h-6 w-6",
        style: { color },
      })} */}
    </div>
    <div className="text-[12px] font-medium">{device}</div>
    <div className="text-[12px] font-bold" style={{ color }}>
      {users.toLocaleString()}
    </div>
    <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
  </div>
);

export const GoogleAnalyticsDashboard: React.FC = () => {
  const trafficSources = [
    {
      source: "Organic Search",
      sessions: 2450,
      users: 1580,
      percentage: 40.3,
    },
    {
      source: "Direct",
      sessions: 1520,
      users: 980,
      percentage: 25,
    },
    {
      source: "Social Media",
      sessions: 1050,
      users: 670,
      percentage: 17.1,
    },
    {
      source: "Paid Search",
      sessions: 720,
      users: 450,
      percentage: 11.5,
    },
    {
      source: "Referral",
      sessions: 380,
      users: 240,
      percentage: 6.1,
    },
  ];

  const conversionGoals = [
    {
      source: "Contact Form",
      sessions: 156,
      price: 1580,
      percentage: 4.2,
    },
    {
      source: "Direct",
      sessions: 1520,
      price: 980,
      percentage: 25.0,
    },
    {
      source: "Social",
      sessions: 1020,
      price: 650,
      percentage: 16.6,
    },
    {
      source: "Referral",
      sessions: 650,
      price: 410,
      percentage: 10.5,
    },
  ];

  const deviceMetrics = [
    {
      device: "Desktop",
      users: 1890,
      percentage: 48.2,
      icon: <LuMonitor className="w-[21px] h-[21px]" />,
      color: "rgb(14, 165, 233)",
    },
    {
      device: "Mobile",
      users: 1650,
      percentage: 42.1,
      icon: <LuMonitor />,
      color: "rgb(249, 115, 22)",
    },
    {
      device: "Tablet",
      users: 380,
      percentage: 9.7,
      icon: <LuMonitor />,
      color: "rgb(30, 64, 175)",
    },
  ];

  const STAT_CARD_DATA = [
    {
      icon: <LuUsers className="text-[20px] mt-1 text-blue-500" />,
      heading: "Total Users",
      value: "3,920",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          +6.5% vs last month
        </span>
      ),
      subValueClass: "text-green-600",
    },
    {
      icon: <LuEye className="text-[20px] mt-1 text-blue-500" />,
      heading: "Page Views",
      value: "12,450",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          +8.1% vs last month
        </span>
      ),
    },
    {
      icon: <LuClock className="text-[20px] mt-1 text-orange-500" />,
      heading: "Avg. Session Duration",
      value: "2:47",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          +12s vs last month
        </span>
      ),
    },
    {
      icon: <LuMousePointer className="text-[20px] mt-1 text-purple-600" />,
      heading: "Bounce Rate",
      value: "31%",
      subheading: (
        <span className="text-green-700 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          -11% vs last month
        </span>
      ),
    },
  ];

  const TOP_PAGES = [
    {
      page: "/home",
      views: "3,450",
      unique: "2,890",
      time: "2:45",
      bounce: "28%",
      good: true,
    },
    {
      page: "/services/orthodontics",
      views: "2,890",
      unique: "2,340",
      time: "3:12",
      bounce: "22%",
      good: true,
    },
    {
      page: "/about",
      views: "1,980",
      unique: "1,650",
      time: "2:18",
      bounce: "35%",
      good: false,
    },
    {
      page: "/contact",
      views: "1,560",
      unique: "1,320",
      time: "1:56",
      bounce: "45%",
      good: false,
    },
    {
      page: "/blog/braces-guide",
      views: "1,240",
      unique: "1,050",
      time: "4:23",
      bounce: "18%",
      good: true,
    },
  ];

  return (
    <div className=" min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <LuGlobe
          className="h-[28px] w-[28px] text-sky-600"
          aria-hidden="true"
        />
        <div>
          <h2 className="text-[21px] font-semibold text-gray-700">
            Google Analytics - Website Statistics
          </h2>
          <p className="text-gray-600 text-[14px]">
            Comprehensive website performance and user behavior insights
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STAT_CARD_DATA.map((data, i) => (
          <MiniStatsCard key={i} cardData={data} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm ">
          <h4 className="text-[16px] font-medium color-[#0A0A0A] mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            Website Traffic Trends
          </h4>
          <div className="mt-10">
            <TrafficTrendsChart />
          </div>
        </div>

        <div className="bg-white rounded-xl  p-6 shadow-sm">
          <h4 className="text-[16px] font-medium color-[#0A0A0A] mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            Device Analytics
          </h4>
          <div className="space-y-4">
            <DeviceDonutChart />
            <div className="grid grid-cols-3 gap-4 text-center">
              {deviceMetrics.map((metric) => (
                <DeviceMetric key={metric.device} {...metric} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl  p-6 shadow-sm">
          <h4 className="text-[16px] font-medium color-[#0A0A0A] mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            Traffic Sources
          </h4>
          <div className="space-y-3">
            {trafficSources.map((source) => (
              <TrafficSourceItem key={source.source} {...source} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h4 className="text-[16px] font-medium color-[#0A0A0A] mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            Conversion Goals
          </h4>
          <div className="space-y-3">
            {conversionGoals.map((source: any) => (
              <ConversionGoalsItem key={source.source} {...source} />
            ))}
          </div>
        </div>
      </div>

      {/* Top Pages Here */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-[16px] font-semibold mb-10 flex items-center gap-2 ">
          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
          Top Pages Performance
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-[13px] py-3 px-2 font-medium text-gray-700">
                  Page
                </th>
                <th className="text-right text-[13px] py-3 px-2 font-medium text-gray-700">
                  Page Views
                </th>
                <th className="text-right text-[13px] py-3 px-2 font-medium text-gray-700">
                  Unique Views
                </th>
                <th className="text-right text-[13px] py-3 px-2 font-medium text-gray-700">
                  Avg. Time
                </th>
                <th className="text-right text-[13px] not-odd:py-3 px-2 font-medium text-gray-700">
                  Bounce Rate
                </th>
              </tr>
            </thead>

            <tbody>
              {TOP_PAGES.map((p, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 text-[13px] not-last:px-2 font-medium text-gray-900">
                    {p.page}
                  </td>
                  <td className="py-3 text-[13px] px-2 text-right text-gray-700">
                    {p.views}
                  </td>
                  <td className="py-3 text-[13px] px-2 text-right text-gray-700">
                    {p.unique}
                  </td>
                  <td className="py-3 text-[13px] not-only-of-type:px-2 text-right text-gray-700">
                    {p.time}
                  </td>
                  <td className="py-3 text-[13px] px-2 text-right">
                    <span
                      className={`font-medium ${
                        p.good ? "text-emerald-600" : "text-orange-600"
                      }`}
                    >
                      {p.bounce}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalyticsDashboard;
