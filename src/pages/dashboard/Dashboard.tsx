import { Button } from "@heroui/react";
import { useEffect, useMemo } from "react";
import { FaRegStar } from "react-icons/fa";
import { HiOutlineChartBar, HiOutlineStar } from "react-icons/hi";
import {
  LuCalendar,
  LuTarget,
  LuTrendingDown,
  LuTrendingUp,
  LuUsers,
} from "react-icons/lu";
import { TbSpeakerphone } from "react-icons/tb";
import { Link, useNavigate } from "react-router";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import { TREATMENT_OPTIONS } from "../../consts/referral";
import { useDashboard } from "../../hooks/useDashboard";
import { useTour } from "../../providers/TourProvider";
import { formatNumberWithCommas } from "../../utils/formatNumberWithCommas";
import { timeAgo } from "../../utils/timeAgo";

type Color = "sky" | "orange" | "emerald" | "purple";

interface QuickAction {
  label: string;
  icon: React.ReactNode;
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
    icon: <LuUsers />,
    color: "sky",
    link: "/referrals",
  },
  {
    label: "Marketing Calendar",
    icon: <LuCalendar />,
    color: "orange",
    link: "/marketing-calendar",
  },
  {
    label: "View Reviews",
    icon: <HiOutlineStar />,
    color: "emerald",
    link: "/reviews",
  },
  {
    label: "Analytics",
    icon: <HiOutlineChartBar />,
    color: "purple",
    link: "/analytics",
  },
];

const QUICK_ACTIONS_COLOR_CLASSES: Record<
  Color,
  { bg: string; text: string; border: string; hover: string }
> = {
  sky: {
    bg: "bg-sky-50 dark:bg-sky-900/10",
    text: "text-sky-700 dark:text-sky-300",
    border: "border-sky-200 dark:border-sky-800",
    hover: "hover:bg-sky-100 dark:hover:bg-sky-900/20",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/10",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
    hover: "hover:bg-orange-100 dark:hover:bg-orange-900/20",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/10",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    hover: "hover:bg-emerald-100 dark:hover:bg-emerald-900/20",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/10",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
    hover: "hover:bg-purple-100 dark:hover:bg-purple-900/20",
  },
};

const Dashboard = () => {
  const { startTour } = useTour();

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const navigate = useNavigate();

  const { data: dashboard } = useDashboard();

  const renderTrend = (
    status: string,
    percentage: number,
    label: string = "from last month"
  ) => {
    const isIncrement = status === "increment" || percentage > 0;
    const isDecrement = status === "decrement" || percentage < 0; // Assuming 'decrement' is the status for down

    const colorClass = isIncrement
      ? "text-emerald-600 dark:text-emerald-400"
      : isDecrement
      ? "text-red-600 dark:text-red-400"
      : "text-gray-500";

    const Icon = isIncrement
      ? LuTrendingUp
      : isDecrement
      ? LuTrendingDown
      : null;

    return (
      <div className={`flex items-center gap-1 text-xs ${colorClass}`}>
        {Icon && <Icon className="text-sm" />}
        <span className="font-medium">
          {percentage > 0 ? "+" : ""}
          {percentage}%
        </span>
        <span className="text-gray-500 dark:text-foreground/60">{label}</span>
      </div>
    );
  };

  const renderReviewTrend = (status: string, avgRating: number) => {
    const isIncrement = status === "increment";
    const colorClass = isIncrement
      ? "text-emerald-600 dark:text-emerald-400"
      : status === "decrement"
      ? "text-red-600 dark:text-red-400"
      : "text-yellow-600 dark:text-yellow-400"; // Neutral/steady

    const Icon =
      status === "increment"
        ? LuTrendingUp
        : status === "decrement"
        ? LuTrendingDown
        : null;

    return (
      <div className={`flex items-center gap-1 text-xs ${colorClass}`}>
        {Icon && <Icon className="text-sm" />}
        <span className="font-medium">{avgRating} avg rating</span>
      </div>
    );
  };

  const STAT_CARD_DATA = useMemo<StatCard[]>(
    () => [
      {
        icon: <LuUsers className="text-purple-600 dark:text-purple-400" />,
        heading: "Total Referrals",
        value: dashboard?.totalReferrals?.total || 0,
        subheading: renderTrend(
          dashboard?.totalReferrals?.status || "",
          dashboard?.totalReferrals?.percentage || 0
        ),
        onClick: () => navigate("/referrals"),
      },
      {
        icon: <TbSpeakerphone className="text-green-600 dark:text-green-400" />,
        heading: "Active Campaigns",
        value: dashboard?.activeCampaigns?.totalActiveCampaigns || 0,
        subheading: renderTrend(
          dashboard?.activeCampaigns?.status || "",
          dashboard?.activeCampaigns?.percentage || 0,
          "this month"
        ), // Custom label based on image
        onClick: () => navigate("/email-campaigns"),
      },
      {
        icon: <FaRegStar className="text-yellow-600 dark:text-yellow-400" />,
        heading: "Reviews",
        value: dashboard?.reviews?.totalReviews
          ? formatNumberWithCommas(dashboard.reviews.totalReviews)
          : "0",
        subheading: renderReviewTrend(
          dashboard?.reviews?.status || "",
          dashboard?.reviews?.avgRating || 0
        ),
        onClick: () => navigate("/reviews"),
      },
      {
        icon: <LuTarget className="text-rose-600 dark:text-rose-400" />,
        heading: "Total Value",
        value: `$${formatNumberWithCommas(dashboard?.totalValue?.total || 0)}`,
        subheading: renderTrend(
          dashboard?.totalValue?.status || "",
          dashboard?.totalValue?.percentage || 0,
          "vs last month"
        ),
        onClick: () => navigate("/reports"),
      },
    ],
    [dashboard, navigate]
  );

  const recentActivities = [
    dashboard?.recentActivity
      ? {
          icon: "👥",
          iconBg: "bg-sky-50 dark:bg-sky-900/20",
          title: `New referral from ${dashboard?.recentActivity.referrer?.name}`,
          description: `Patient: ${dashboard?.recentActivity.name}${
            dashboard?.recentActivity.treatment
              ? ` - ${
                  TREATMENT_OPTIONS.find(
                    (treatmentOption: any) =>
                      treatmentOption.key ===
                      dashboard?.recentActivity.treatment
                  )?.label
                }`
              : ""
          }`,
          time: `${timeAgo(dashboard?.recentActivity.createdAt)}`,
          onClick: () => navigate("/referrals"),
        }
      : null,
    {
      icon: "⭐",
      iconBg: "bg-yellow-50 dark:bg-yellow-900/20",
      title: "5-star review received",
      description: 'Sarah Johnson - "Excellent service and care!"',
      time: "4 hours ago",
      onClick: () => navigate("/reviews"),
    },
    {
      icon: "📢",
      iconBg: "bg-orange-50 dark:bg-orange-900/20",
      title: "Marketing campaign launched",
      description: "Back-to-School Smile Campaign - Social Media",
      time: "6 hours ago",
      onClick: () => navigate("/marketing-calendar"),
    },
  ];

  const SYSTEM_STATUSES = [
    {
      name: "Google Calendar",
      status: dashboard?.systemStatus?.googleCalendar
        ? "✓ Connected"
        : "Disconnected",
      bg: dashboard?.systemStatus?.googleCalendar
        ? "bg-green-100 dark:bg-green-900/20"
        : "bg-red-100 dark:bg-red-900/20",
      text: dashboard?.systemStatus?.googleCalendar
        ? "text-green-800 dark:text-green-300"
        : "text-red-800 dark:text-red-300",
    },
    {
      name: "Review Tracking",
      status: dashboard?.systemStatus?.reviewTracking ? "✓ Active" : "Inactive",
      bg: dashboard?.systemStatus?.reviewTracking
        ? "bg-green-100 dark:bg-green-900/20"
        : "bg-red-100 dark:bg-red-900/20",
      text: dashboard?.systemStatus?.reviewTracking
        ? "text-green-800 dark:text-green-300"
        : "text-red-800 dark:text-red-300",
    },
    {
      name: "NFC System",
      status: dashboard?.systemStatus?.nfcSetup ? "✓ Active" : "Inactive",
      bg: dashboard?.systemStatus?.nfcSetup
        ? "bg-green-100 dark:bg-green-900/20"
        : "bg-red-100 dark:bg-red-900/20",
      text: dashboard?.systemStatus?.nfcSetup
        ? "text-green-800 dark:text-green-300"
        : "text-red-800 dark:text-red-300",
    },
  ];

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="space-y-4 md:space-y-5">
        {/* <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Navigation is now active!</span> Click
            on any metric card, quick action button, or activity item to
            navigate to different sections.
          </p>
        </div> */}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
          {STAT_CARD_DATA.map((data, i) => (
            <MiniStatsCard key={i} cardData={data} />
          ))}
        </div>

        <div className="bg-background rounded-xl p-4 md:p-5">
          <h4 className="text-sm md:text-base mb-4">Quick Actions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {QUICK_ACTIONS.map((action, i) => {
              const color = QUICK_ACTIONS_COLOR_CLASSES[action.color];
              const Icon = action.icon;

              return (
                <Link
                  key={i}
                  to={action.link || ""}
                  onClick={(e) => {
                    if (!action.link) e.preventDefault();
                  }}
                  className={`flex items-center justify-center gap-x-1.5 px-3 py-2.5 rounded-lg border transition-colors cursor-pointer text-sm
					${color.bg} ${color.text} ${color.border} ${color.hover}`}
                >
                  <span className="text-base">{Icon}</span>
                  <span>{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <div className="md:col-span-2 bg-background rounded-xl p-4 md:p-5">
            <h3 className="text-sm md:text-base mb-4">Recent Activity</h3>
            <div className="space-y-4 md:space-y-2">
              {recentActivities.map((activity, index) =>
                activity ? (
                  <div
                    key={index}
                    className="flex items-start space-x-3 md:p-3 hover:bg-gray-100 dark:hover:bg-foreground/5 rounded-lg transition-colors cursor-pointer"
                    onClick={activity.onClick && activity.onClick}
                  >
                    <div
                      className={`p-0 rounded-lg flex items-center justify-center size-8 md:size-9 ${activity.iconBg}`}
                    >
                      <span className="text-md">{activity.icon}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs md:text-sm font-medium">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>

          <div className="space-y-4 md:space-y-5">
            <div className="bg-background rounded-xl p-4 md:p-5">
              <h3 className="text-sm md:text-base mb-4">
                <span className="mr-1">📱</span>NFC & QR Tracking
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Active Codes
                  </span>
                  <span className="bg-sky-100 dark:bg-sky-900/20 text-sky-800 dark:text-sky-300 h-6 p-0 px-2 flex items-center justify-center rounded text-xs font-medium">
                    {dashboard?.nfcQrData?.activeQRCodes || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Total Scans
                  </span>
                  <span className="bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 h-6 p-0 px-2 flex items-center justify-center rounded text-xs font-medium">
                    {dashboard?.nfcQrData?.totalScans || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Conversion Rate
                  </span>
                  <span className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 h-6 p-0 px-2 flex items-center justify-center rounded text-xs font-medium">
                    {dashboard?.nfcQrData?.conversionRate > 0
                      ? `${dashboard.nfcQrData.conversionRate}%`
                      : "0%"}
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

            <div className="bg-background rounded-xl p-4 md:p-5">
              <h3
                className="text-sm md:text-base mb-4"
                onClick={() => startTour()}
              >
                System Status
              </h3>
              <div className="space-y-2">
                {SYSTEM_STATUSES.map((system, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {system.name}
                    </span>
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
