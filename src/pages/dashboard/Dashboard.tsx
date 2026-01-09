import { Button } from "@heroui/react";
import { useMemo } from "react";
import { FaRegStar } from "react-icons/fa";
import { HiOutlineChartBar, HiOutlineStar } from "react-icons/hi";
import { LuCalendar, LuTarget, LuUsers } from "react-icons/lu";
import { MdTrendingUp } from "react-icons/md";
import { TbSpeakerphone } from "react-icons/tb";
import { Link, useNavigate } from "react-router";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import { TREATMENT_OPTIONS } from "../../consts/referral";
import { useDashboard } from "../../hooks/useDashboard";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { timeAgo } from "../../utils/timeAgo";
import { useTour } from "../../providers/TourProvider";
import { formatNumberWithCommas } from "../../utils/formatNumberWithCommas";

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

const Dashboard = () => {
  const { startTour } = useTour();

  const navigate = useNavigate();

  const { data: dashboard } = useDashboard();

  const STAT_CARD_DATA = useMemo<StatCard[]>(
    () => [
      {
        icon: <LuUsers className="text-purple-600" />,
        heading: "Total Referrals",
        value: dashboard?.totalReferrals as number,
        // subheading: (
        //   <p className="text-emerald-600 flex items-center gap-1.5">
        //     <MdTrendingUp fontSize={15} />
        //     {dashboard?.totalLastMonth ? dashboard.totalLastMonth : "0"}% from
        //     last month
        //   </p>
        // ),
        onClick: () => navigate("/referrals"),
      },
      {
        icon: <TbSpeakerphone className="text-green-600" />,
        heading: "Active Campaigns",
        value: "0",
        // subheading: (
        //   <p className="text-emerald-600 flex items-center gap-1.5">
        //     <MdTrendingUp fontSize={15} />
        //     +0 this month
        //   </p>
        // ),
        onClick: () => navigate("/email-campaigns"),
      },
      {
        icon: <FaRegStar className="text-yellow-600" />,
        heading: "Reviews",
        value: "0",
        // subheading: (
        //   <p className="text-emerald-600 flex items-center gap-1.5">
        //     <MdTrendingUp fontSize={15} />0 avg rating
        //   </p>
        // ),
        onClick: () => navigate("/reviews"),
      },
      {
        icon: <LuTarget className="text-rose-600" />,
        heading: "Total Value",
        value: `$${formatNumberWithCommas(dashboard?.totalValue as number)}`,
        // subheading: (
        //   <p className="text-emerald-600 flex items-center gap-1.5">
        //     <MdTrendingUp fontSize={15} />
        //     +0 vs last month
        //   </p>
        // ),
        onClick: () => navigate("/reports"),
      },
    ],
    [dashboard, navigate]
  );

  const recentActivities = [
    dashboard?.recentActivity
      ? {
          icon: "👥",
          iconBg: "bg-sky-50",
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
      iconBg: "bg-yellow-50",
      title: "5-star review received",
      description: 'Sarah Johnson - "Excellent service and care!"',
      time: "4 hours ago",
      onClick: () => navigate("/reviews"),
    },
    {
      icon: "📢",
      iconBg: "bg-orange-50",
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
        ? "bg-green-100"
        : "bg-red-100",
      text: dashboard?.systemStatus?.googleCalendar
        ? "text-green-800"
        : "text-red-800",
    },
    {
      name: "Review Tracking",
      status: dashboard?.systemStatus?.reviewTracking ? "✓ Active" : "Inactive",
      bg: dashboard?.systemStatus?.reviewTracking
        ? "bg-green-100"
        : "bg-red-100",
      text: dashboard?.systemStatus?.reviewTracking
        ? "text-green-800"
        : "text-red-800",
    },
    {
      name: "NFC System",
      status: dashboard?.systemStatus?.nfcSetup ? "✓ Active" : "Inactive",
      bg: dashboard?.systemStatus?.nfcSetup ? "bg-green-100" : "bg-red-100",
      text: dashboard?.systemStatus?.nfcSetup
        ? "text-green-800"
        : "text-red-800",
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
                    className="flex items-start space-x-3 md:p-3 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
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
                      <p className="text-xs text-gray-600">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
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
                  <span className="text-xs text-gray-600">Active Codes</span>
                  <span className="bg-sky-100 text-sky-800 h-6 p-0 px-2 flex items-center justify-center rounded text-xs font-medium">
                    {dashboard?.nfcQrData?.activeQRCodes || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Scans</span>
                  <span className="bg-orange-100 text-orange-800 h-6 p-0 px-2 flex items-center justify-center rounded text-xs font-medium">
                    {dashboard?.nfcQrData?.totalScansToday || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Conversion Rate</span>
                  <span className="bg-emerald-100 text-emerald-800 h-6 p-0 px-2 flex items-center justify-center rounded text-xs font-medium">
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
