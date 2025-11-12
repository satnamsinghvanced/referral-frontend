import ComponentContainer from "../components/common/ComponentContainer";
import { useDashboard } from "../hooks/useDashboard";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
  Input,
  Link,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";

type Color = "sky" | "orange" | "emerald" | "purple";

interface QuickAction {
  label: string;
  icon: string;
  color: Color;
  link: string;
}

const headingData = {
  heading: "Dashboard Overview",
  subHeading:
    "Welcome back! Here's what's happening with your referrals today.",
};

const quickActions: QuickAction[] = [
  {
    label: "Add Referral",
    icon: "👥",
    color: "sky",
    link: "/referral-retrieve/referrals",
  },
  { label: "Marketing Calendar", icon: "📅", color: "orange", link: "" },
  { label: "View Reviews", icon: "⭐", color: "emerald", link: "" },
  { label: "Analytics", icon: "📊", color: "purple", link: "" },
];

const colorClasses: Record<
  Color,
  { bg: string; text: string; border: string; hover: string }
> = {
  sky: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    hover: "hover:bg-sky-100",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    hover: "hover:bg-orange-100",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    hover: "hover:bg-emerald-100",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    hover: "hover:bg-purple-100",
  },
};

const systemStatuses = [
  {
    name: "Google Calendar",
    status: "✓ Connected",
    bg: "bg-green-100",
    text: "text-green-800",
  },
  {
    name: "Review Tracking",
    status: "✓ Active",
    bg: "bg-green-100",
    text: "text-green-800",
  },
  {
    name: "NFC System",
    status: "✓ Online",
    bg: "bg-green-100",
    text: "text-green-800",
  },
];

const Dashboard = () => {
  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : undefined;
  const userId = userData?.userId;

  const { data: dashboard, isLoading, isError, error } = useDashboard(userId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const stats = [
    {
      title: "Total Referrals",
      value: dashboard?.totalReferrals,
      change:
        dashboard?.totalLastMonth > 0
          ? `↗ +${dashboard.totalLastMonth}% from last month`
          : "0 from last month",
      icon: "👥",
      color: "sky",
      link: "/referral-retrieve/referrals",
    },
    {
      title: "Active Campaigns",
      value: "12",
      change: "↗ +2 this month",
      icon: "📢",
      color: "orange",
    },
    {
      title: "Reviews",
      value: "1,248",
      change: "↗ 4.8 avg rating",
      icon: "⭐",
      color: "emerald",
    },
    {
      title: "ROI",
      value: "284%",
      change: "↗ +12% vs last month",
      icon: "🎯",
      color: "purple",
    },
  ];

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const createdAt = new Date(dateString);
    const diffMs = now.getTime() - createdAt.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  console.log(dashboard);
  const recentActivities = [
    ...(dashboard?.recentReferrals?.length > 0
      ? [
          {
            icon: "👥",
            iconBg: "bg-sky-50",
            title: `New referral from ${
              dashboard?.referrer?.name || "Unknown"
            }`,
            description: `Patient: ${
              dashboard?.recentReferrals[0]?.name || "Unknown"
            } - ${dashboard?.referrer?.type || "Unknown"}`,
            time: `${getTimeAgo(dashboard?.recentReferrals[0]?.createdAt)}`,
          },
        ]
      : []),
    {
      icon: "⭐",
      iconBg: "bg-yellow-50",
      title: "5-star review received",
      description: 'Sarah Johnson - "Excellent service and care!"',
      time: "4 hours ago",
    },
    {
      icon: "📢",
      iconBg: "bg-orange-50",
      title: "Marketing campaign launched",
      description: "Back-to-School Smile Campaign - Social Media",
      time: "6 hours ago",
    },
  ];

   const handleClick = (item : any, e: any) => {
    if (!item.link) {
      e.preventDefault();
    }
  };

  return (
    <ComponentContainer headingData={headingData}>
      <div className="container mx-auto">
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-full mx-auto">
            <div className="mb-6">
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Navigation is now active!</span>{" "}
                  Click on any metric card, quick action button, or activity
                  item to navigate to different sections.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats?.map((item, i) => (
                <Link
                  key={i}
                  href={item.link || ""}
                  onClick={(e) => handleClick(item, e)}
                  className={`
    bg-white rounded-lg shadow p-6 border border-transparent 
    hover:border-${item.color}-300 hover:shadow-lg 
    transition-all block
  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-sm">{item.title}</h1>
                    <div
                      className={`w-8 h-8 bg-${item.color}-100 rounded-lg flex items-center justify-center`}
                    >
                      <span className={`text-${item.color}-600 text-lg`}>
                        {item.icon}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg mt-4 mb-0.5 font-bold">
                    {item.value}
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-emerald-600">
                      {item.change}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h1 className="text-lg mb-4">Quick Actions</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, i) => {
                  const color = colorClasses[action.color];
                  return (
                    <Link
                      key={i}
                      href={action.link || ""}
                      onClick={(e) => {
                        if (!action.link) e.preventDefault();
                      }}
                      className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer text-sm
                   ${color.bg} ${color.text} ${color.border} ${color.hover}`}
                    >
                      <span>{action.icon}</span>
                      <span>{action.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <div className={`p-2 rounded-lg ${activity.iconBg}`}>
                          <span className="text-lg">{activity.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">📱</span>NFC & QR Tracking
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Active Codes
                      </span>
                      <span className="bg-sky-100 text-sky-800 px-2 py-1 rounded text-sm font-medium">
                        {dashboard?.nfcQrData?.activeQRCodes || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Scans Today</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium">
                        {dashboard?.nfcQrData?.totalScansToday || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Conversion Rate
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm font-medium">
                        {dashboard?.nfcQrData?.avgConversionRate > 0
                          ? `${dashboard.nfcQrData.avgConversionRate}%`
                          : "0"}
                      </span>
                    </div>
                    <button className="w-full mt-4 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors cursor-pointer">
                      📱 Generate New Code
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    System Status
                  </h3>
                  <div className="space-y-2">
                    {systemStatuses.map((system, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-600">{system.name}</span>
                        <span
                          className={`${system.bg} ${system.text} px-2 py-1 rounded text-sm`}
                        >
                          {system.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentContainer>
  );
};

export default Dashboard;
