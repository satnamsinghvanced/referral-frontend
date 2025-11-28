import React from "react";
import {
  LuUsers,
  LuTrendingUp,
  LuTrendingDown,
  LuMonitor,
  LuClock,
  LuEye,
  LuMousePointer,
  LuGlobe,
  LuHardHat,
  LuZap,
  LuTag,
} from "react-icons/lu";
import { MdBarChart } from "react-icons/md";

// --- Placeholder Components for Charts ---

const TrafficTrendsChart: React.FC = () => (
  <div className="h-[350px] w-full bg-gray-50 flex items-center justify-center rounded-lg border border-dashed border-gray-300">
    <MdBarChart className="h-12 w-12 text-blue-400" />
    <span className="ml-2 text-sm text-gray-500">
      Traffic Trends Line Chart Placeholder
    </span>
  </div>
);

const DeviceDonutChart: React.FC = () => (
  <div className="h-[250px] w-full bg-gray-50 flex items-center justify-center rounded-lg border border-dashed border-gray-300">
    <LuMonitor className="h-12 w-12 text-sky-600" />
    <span className="ml-2 text-sm text-gray-500">
      Device Donut Chart Placeholder
    </span>
  </div>
);

// --- Interface Definitions ---

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: React.ReactNode;
  iconColor: string;
}

interface TrafficSourceItemProps {
  source: string;
  sessions: number;
  users: number;
  percentage: number;
  icon: React.ReactNode;
}

interface DeviceMetricProps {
  device: string;
  users: number;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

// --- Component Definitions ---

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
  // Using LuTrendingUp/LuTrendingDown from react-icons/lu
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
  icon,
}) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
    <div className="flex-1 flex items-center gap-3">
      <div className="text-gray-500">{icon}</div>
      <div>
        <div className="font-medium text-gray-900">{source}</div>
        <div className="text-sm text-gray-500">
          {sessions.toLocaleString()} sessions
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="font-bold text-lg text-gray-900">
        {users.toLocaleString()}
      </div>
      <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
    </div>
  </div>
);

const DeviceMetric: React.FC<DeviceMetricProps> = ({
  device,
  users,
  percentage,
  icon,
  color,
}) => (
  <div className="space-y-2">
    <div className="flex justify-center">
      {React.cloneElement(icon as React.ReactElement, {
        className: "h-6 w-6",
        style: { color },
      })}
    </div>
    <div className="text-sm font-medium">{device}</div>
    <div className="text-lg font-bold" style={{ color }}>
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
      icon: <LuGlobe />,
    },
    {
      source: "Direct",
      sessions: 1520,
      users: 980,
      percentage: 25.0,
      icon: <LuHardHat />,
    },
    {
      source: "Social",
      sessions: 1020,
      users: 650,
      percentage: 16.6,
      icon: <LuZap />,
    },
    {
      source: "Referral",
      sessions: 650,
      users: 410,
      percentage: 10.5,
      icon: <LuTag />,
    },
  ];

  const deviceMetrics = [
    {
      device: "Desktop",
      users: 1890,
      percentage: 48.2,
      icon: <LuMonitor />,
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-8 bg-white p-6 rounded-xl shadow-md">
        <LuGlobe className="h-8 w-8 text-sky-600" aria-hidden="true" />
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Google Analytics - Website Statistics
          </h2>
          <p className="text-gray-600">
            Comprehensive website performance and user behavior insights
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value="3,920"
          change="+6.5% vs last month"
          changeType="up"
          icon={<LuUsers className="h-5 w-5" />}
          iconColor="rgb(14, 165, 233)"
        />
        <StatCard
          title="Page Views"
          value="12,450"
          change="+8.1% vs last month"
          changeType="up"
          icon={<LuEye className="h-5 w-5" />}
          iconColor="rgb(37, 99, 235)"
        />
        <StatCard
          title="Avg. Session Duration"
          value="2:47"
          change="+12s vs last month"
          changeType="up"
          icon={<LuClock className="h-5 w-5" />}
          iconColor="rgb(234, 88, 12)"
        />
        <StatCard
          title="Bounce Rate"
          value="31%"
          change="-11% vs last month"
          changeType="down"
          icon={<LuMousePointer className="h-5 w-5" />}
          iconColor="rgb(168, 85, 247)"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            Website Traffic Trends
          </h4>
          <TrafficTrendsChart />
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
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
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            Traffic Sources
          </h4>
          <div className="space-y-3">
            {trafficSources.map((source) => (
              <TrafficSourceItem key={source.source} {...source} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            Conversion Goals
          </h4>
          <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded-lg">
            Conversion Goals Data Area
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalyticsDashboard;
