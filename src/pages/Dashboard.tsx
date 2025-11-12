import { Button } from "@heroui/react";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router";
import MiniStatsCard, { StatCard } from "../components/cards/MiniStatsCard";
import ComponentContainer from "../components/common/ComponentContainer";
import { useDashboard } from "../hooks/useDashboard";
import { useTypedSelector } from "../hooks/useTypedSelector";

type Color = "sky" | "orange" | "emerald" | "purple";

interface QuickAction {
  label: string;
  icon: string;
  color: Color;
  link: string;
}

const HEADING_DATA = {
  heading: "Dashboard Overview",
  subHeading:
    "Welcome back! Here's what's happening with your referrals today.",
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Add Referral",
    icon: "👥",
    color: "sky",
    link: "/referrals",
  },
  {
    label: "Marketing Calendar",
    icon: "📅",
    color: "orange",
    link: "/marketing-calendar",
  },
  { label: "View Reviews", icon: "⭐", color: "emerald", link: "/reviews" },
  { label: "Analytics", icon: "📊", color: "purple", link: "/analytics" },
];

const QUICK_ACTIONS_COLOR_CLASSES: Record<
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

const SYSTEM_STATUSES = [
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
  // --- All Hooks must be called unconditionally first ---

  // HOOK 1
  const navigate = useNavigate();

  // HOOK 2
  const { user } = useTypedSelector((state) => state.auth);
  const userId = user?.userId || "";

  // HOOK 3 (useDashboard is a custom hook which internally uses other hooks)
  const { data: dashboard, isLoading, isError, error } = useDashboard(userId);

  // HOOK 4: useMemo must be called here, before any conditional returns
  const STAT_CARD_DATA = useMemo<StatCard[]>(
    () => [
      {
        icon: "👥",
        heading: "Total Referrals",
        value: dashboard?.totalReferrals as number,
        subheading:
          dashboard?.totalLastMonth > 0
            ? `↗ +${dashboard.totalLastMonth}% from last month`
            : "0 from last month",
        onClick: () => navigate("/referrals"),
      },
      {
        icon: "📢",
        heading: "Active Campaigns",
        value: "12",
        subheading: "↗ +2 this month",
        onClick: () => navigate("/email-campaigns"),
      },
      {
        icon: "⭐",
        heading: "Reviews",
        value: "1,248",
        subheading: "↗ 4.8 avg rating",
        onClick: () => navigate("/reviews"),
      },
      {
        icon: "🎯",
        heading: "ROI",
        value: "284%",
        subheading: "↗ +12% vs last month",
        onClick: () => navigate("/reports"),
      },
    ],
    [dashboard]
  );

  // Define regular functions (these are fine anywhere)
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

  // --- Conditional Renders follow all Hook calls ---
  // if (isLoading) {
  //   return <div></div>;
  // }

  // if (isError) {
  //   return <div>Error: {error.message}</div>;
  // }

  // --- Rest of the component logic (which relies on `dashboard` being defined) ---
  console.log(dashboard);
  const recentActivities = [
    ...(dashboard?.recentReferrals?.length > 0
      ? [
        {
          icon: "👥",
          iconBg: "bg-sky-50",
          title: `New referral from ${dashboard?.referrer?.name || "Unknown"
            }`,
          description: `Patient: ${dashboard?.recentReferrals[0]?.name || "Unknown"
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

  const handleClick = (item: any, e: any) => {
    if (!item.link) {
      e.preventDefault();
    }
  };

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="space-y-5">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Navigation is now active!</span> Click
            on any metric card, quick action button, or activity item to
            navigate to different sections.
          </p>
        </div>

        <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-4">
          {STAT_CARD_DATA.map((data, i) => (
            <MiniStatsCard key={i} cardData={data} />
          ))}
        </div>

        <div className="bg-background rounded-xl p-5">
          <h1 className="text-base mb-5">Quick Actions</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((action, i) => {
              const color = QUICK_ACTIONS_COLOR_CLASSES[action.color];
              return (
                <Link
                  key={i}
                  to={action.link || ""}
                  onClick={(e) => {
                    if (!action.link) e.preventDefault();
                  }}
                  className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg border transition-colors cursor-pointer text-sm
                    ${color.bg} ${color.text} ${color.border} ${color.hover}`}
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 bg-background rounded-xl p-5">
            <h3 className="text-base mb-4">Recent Activity</h3>
            <div className="space-y-2">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <div
                    className={`p-0 rounded-lg flex items-center justify-center size-9 ${activity.iconBg}`}
                  >
                    <span className="text-md">{activity.icon}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-600">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-background rounded-xl p-5">
              <h3 className="text-base mb-4">
                <span className="mr-1">📱</span>NFC & QR Tracking
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Active Codes</span>
                  <span className="bg-sky-100 text-sky-800 size-6 p-0 flex items-center justify-center rounded text-xs font-medium">
                    {dashboard?.nfcQrData?.activeQRCodes || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Scans Today</span>
                  <span className="bg-orange-100 text-orange-800 size-6 p-0 flex items-center justify-center rounded text-xs font-medium">
                    {dashboard?.nfcQrData?.totalScansToday || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Conversion Rate</span>
                  <span className="bg-emerald-100 text-emerald-800 size-6 p-0 flex items-center justify-center rounded text-xs font-medium">
                    {dashboard?.nfcQrData?.avgConversionRate > 0
                      ? `${dashboard.nfcQrData.avgConversionRate}%`
                      : "0"}
                  </span>
                </div>
                <Link to="/qr-generator">
                  <Button
                    size="sm"
                    radius="sm"
                    variant="solid"
                    color="primary"
                    fullWidth
                    className="mt-2"
                  >
                    📱 Generate New Code
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-background rounded-xl p-5">
              <h3 className="text-base mb-4">System Status</h3>
              <div className="space-y-2">
                {SYSTEM_STATUSES.map((system, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-gray-600">{system.name}</span>
                    <span
                      className={`${system.bg} ${system.text} px-2 py-1 rounded text-xs`}
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
    </ComponentContainer>
  );
};

export default Dashboard;
