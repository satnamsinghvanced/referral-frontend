import { Button, addToast } from "@heroui/react";
import { useMemo, useState, useEffect } from "react";
import { FaRegStar } from "react-icons/fa";
import { HiOutlineChartBar, HiOutlineStar } from "react-icons/hi";
import { LuCalendar, LuTarget, LuTrendingUp, LuUsers, LuBell } from "react-icons/lu";
import { TrendIndicator } from "../../components/common/TrendIndicator";
import { TbSpeakerphone } from "react-icons/tb";
import { Link, useNavigate, useSearchParams } from "react-router";
import axios from "../../services/axios";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import { TREATMENT_OPTIONS } from "../../consts/referral";
import { useDashboard } from "../../hooks/useDashboard";
import { useTour } from "../../providers/TourProvider";
import { formatNumberWithCommas } from "../../utils/formatNumberWithCommas";
import { timeAgo } from "../../utils/timeAgo";
import { useNotificationSubscription } from "../../hooks/useNotificationSubscription";
import { FiAlertTriangle } from "react-icons/fi";
import { LoadingState } from "../../components/common/LoadingState";
import { useBilling } from "../../hooks/settings/useBilling";
import { usePlanGuard } from "../../hooks/usePlanGuard";
import { useFetchReferrers } from "../../hooks/useReferral";

type Color = "sky" | "orange" | "emerald" | "purple";

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  color: Color;
  link: string;
  requiredPlanAccess?: string;
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
    link: "/referrals?action=track",
  },
  {
    label: "Marketing Calendar",
    icon: <LuCalendar />,
    color: "orange",
    link: "/marketing-calendar",
    requiredPlanAccess: "marketing_calendar",
  },
  {
    label: "View Reviews",
    icon: <HiOutlineStar />,
    color: "emerald",
    link: "/reviews",
    requiredPlanAccess: "google_business",
  },
  {
    label: "Analytics",
    icon: <HiOutlineChartBar />,
    color: "purple",
    link: "/analytics",
    requiredPlanAccess: "basic_analytics",
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
  const { requestPermission, permissionStatus } = useNotificationSubscription();
  const [showNotificationBanner, setShowNotificationBanner] = useState(true);
  const [gmbConfig, setGmbConfig] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isGmbLoading, setIsGmbLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchGmbData = async () => {
    try {
      const response = await axios.get("/google_business_integration");
      if (response.data?.success) {
        setGmbConfig(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching Gmb Config:", err);
    }
  };

  const fetchGmbReviews = async () => {
    try {
      const response = await axios.get("/google_business_profile/recent-reviews");
      if (response.data?.success && response.data?.data?.reviews) {
        setReviews(response.data.data.reviews.slice(0, 3));
      }
    } catch (err) {
      console.error("Error fetching Gmb Reviews:", err);
    }
  };

  const handleConnectGoogleBusiness = async () => {
    try {
      const res = await axios.get("/auth/google-business");
      if (res.data?.success && res.data?.data?.authUrl) {
        window.open(res.data.data.authUrl, "_blank", "width=600,height=600");
      } else {
        addToast({
          title: "Error",
          description: "Failed to generate connection URL",
          color: "danger",
        });
      }
    } catch (err: any) {
      console.error("Zernio auth initiation failed:", err);
      addToast({
        title: "Error",
        description: err.response?.data?.message || err.message || "Failed to connect",
        color: "danger",
      });
    }
  };

  useEffect(() => {
    fetchGmbData();
    fetchGmbReviews().finally(() => setIsGmbLoading(false));
  }, []);

  useEffect(() => {
    const status = searchParams.get("status");
    const message = searchParams.get("message");
    if (status === "success" && message) {
      addToast({
        title: "Connection Successful",
        description: message,
        color: "success",
      });
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("status");
          next.delete("message");
          return next;
        },
        { replace: true }
      );
      fetchGmbData();
      fetchGmbReviews();
    } else if (status === "error" && message) {
      addToast({
        title: "Connection Failed",
        description: message,
        color: "danger",
      });
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("status");
          next.delete("message");
          return next;
        },
        { replace: true }
      );
    }
  }, [searchParams]);

  const navigate = useNavigate();
  const { data: dashboard, isLoading } = useDashboard();
  const { data: billingData, isLoading: isBillingLoading } = useBilling();
  const planAccess = billingData?.access;
  const { isLimitReached, getLimit, openPricingPage } = usePlanGuard();
  const { data: referrerData } = useFetchReferrers({ limit: 1 });
  const totalReferrersCount = (referrerData as any)?.total || (referrerData as any)?.pagination?.total || (referrerData as any)?.data?.length || 0;
  const maxReferralLimit = getLimit("referral_connections");
  const isReferrerLimitReached = isLimitReached("referral_connections", totalReferrersCount);

  const filteredQuickActions = QUICK_ACTIONS.filter((action) => {
    if (action.requiredPlanAccess) {
      if (planAccess && planAccess[action.requiredPlanAccess as keyof typeof planAccess] === false) return false;
    }
    return true;
  });
  const STAT_CARD_DATA = useMemo<StatCard[]>(
    () => [
      {
        icon: <LuUsers className="text-purple-600 dark:text-purple-400" />,
        heading: "Total Referrals",
        value: dashboard?.stats?.totalReferrals?.total || 0,
        subheading: (
          <TrendIndicator
            status={dashboard?.stats?.totalReferrals?.status}
            percentage={dashboard?.stats?.totalReferrals?.percentage}
          />
        ),
        onClick: () => navigate("/referrals"),
      },
      {
        icon: <TbSpeakerphone className="text-green-600 dark:text-green-400" />,
        heading: "Total Campaigns",
        value: dashboard?.stats?.activeCampaigns?.totalActiveCampaigns || 0,
        subheading: (
          <TrendIndicator
            status={dashboard?.stats?.activeCampaigns?.status}
            percentage={dashboard?.stats?.activeCampaigns?.percentage}
            label="this month"
          />
        ),
        onClick: () => navigate("/email-campaigns", { state: { tab: "campaigns" } }),
      },
      {
        icon: <FaRegStar className="text-yellow-600 dark:text-yellow-400" />,
        heading: "Reviews",
        value: dashboard?.stats?.reviews?.totalReviews
          ? formatNumberWithCommas(dashboard.stats.reviews.totalReviews)
          : "0",
        subheading: (
          <TrendIndicator
            status={dashboard?.stats?.reviews?.status}
            valueOverride={`${dashboard?.stats?.reviews?.avgRating || 0} avg rating`}
            label=""
          />
        ),
        onClick: () => navigate("/reviews"),
      },
      {
        icon: <LuTarget className="text-rose-600 dark:text-rose-400" />,
        heading: "Total Value",
        value: `$${formatNumberWithCommas(dashboard?.stats?.totalValue?.total || 0)}`,
        subheading: (
          <TrendIndicator
            status={dashboard?.stats?.totalValue?.status}
            percentage={dashboard?.stats?.totalValue?.percentage}
            label="vs last month"
          />
        ),
        onClick: () => navigate("/referrals"),
      },
    ],
    [dashboard, navigate],
  );
  const recentActivities = [
    dashboard?.recentActivity?.referral
      ? {
        icon: "👥",
        iconBg: "bg-sky-50 dark:bg-sky-900/20",
        title: `New referral from ${dashboard.recentActivity.referral.referrer?.name || "N/A"
          }`,
        description: `Patient: ${dashboard.recentActivity.referral.name}${dashboard.recentActivity.referral.treatment
          ? ` - ${TREATMENT_OPTIONS.find(
            (treatmentOption: any) =>
              treatmentOption.key ===
              dashboard.recentActivity.referral!.treatment,
          )?.label || dashboard.recentActivity.referral.treatment
          }`
          : ""
          }`,
        time: `${timeAgo(dashboard.recentActivity.referral.createdAt || "")}`,
        onClick: () => navigate("/referrals"),
      }
      : null,
    dashboard?.recentActivity?.reviews
      ? {
        icon: "⭐",
        iconBg: "bg-yellow-50 dark:bg-yellow-900/20",
        title: "New review received",
        description: (() => {
          const review = dashboard.recentActivity.reviews!;
          const name = review.reviewer?.displayName || "Someone";
          const stars = review.starRating || review.rating || "0";
          const comment = review.comment || review.description;
          return comment
            ? `${name} left a ${stars}-star review: "${comment.length > 80 ? `${comment.slice(0, 80)}…` : comment}"`
            : `${name} left a ${stars}-star review`;
        })(),
        time: `${timeAgo(dashboard.recentActivity.reviews.createTime || "")}`,
        onClick: () => navigate("/reviews"),
      }
      : null,
    dashboard?.recentActivity?.campaigns
      ? {
        icon: "📢",
        iconBg: "bg-orange-50 dark:bg-orange-900/20",
        title: `New email campaign: ${dashboard?.recentActivity?.campaigns?.name || ""}`,
        description: `${dashboard?.recentActivity?.campaigns?.description || ""}`,
        time: `${timeAgo(dashboard?.recentActivity?.campaigns?.createdAt || "")}`,
        onClick: () => navigate("/email-campaigns", { state: { tab: "campaigns" } }),
      }
      : null,
  ].filter((activity) => activity !== null);
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
        {permissionStatus === "default" && showNotificationBanner && (
          <div className="relative group overflow-hidden bg-background border border-divider dark:border-white/5 rounded-2xl p-4 md:p-4 mb-5 transition-all duration-300">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-5 md:gap-4">
              <div className="relative shrink-0">
                <div className="size-10 md:size-11 rounded-xl bg-primary/10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent animate-pulse" />
                  <LuBell className="text-primary text-2xl relative z-10" />
                </div>
                <div className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-background animate-bounce" />
              </div>
              <div className="flex-1 text-center md:text-left space-y-1">
                <h3 className="text-base font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  Stay in the Loop
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
                  Enable real-time notifications to receive instant updates on{" "}
                  <span className="text-primary font-medium">
                    new referrals
                  </span>
                  ,
                  <span className="text-primary font-medium">
                    {" "}
                    urgent cases
                  </span>
                  , and patient feedback.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center max-md:justify-center gap-2 shrink-0 w-full md:w-auto">
                <Button
                  size="sm"
                  color="primary"
                  radius="sm"
                  className="font-medium"
                  onPress={() => {
                    requestPermission();
                    setShowNotificationBanner(false);
                  }}
                >
                  Enable Now
                </Button>
                <Button
                  size="sm"
                  variant="light"
                  radius="sm"
                  className="font-medium text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"
                  onPress={() => setShowNotificationBanner(false)}
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
        )}

        {isReferrerLimitReached && (
          <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 shrink-0">
                <FiAlertTriangle className="text-xl" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">
                  Referrer Limit Reached ({totalReferrersCount}/{maxReferralLimit})
                </h4>
                <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
                  You have reached the maximum number of referrers allowed on your current plan. Please upgrade your plan to add or connect with more referrers.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              color="danger"
              variant="solid"
              className="font-medium shrink-0 shadow-sm"
              onPress={openPricingPage}
            >
              Upgrade Plan
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
          {STAT_CARD_DATA.map((data, i) => (
            <MiniStatsCard key={i} cardData={data} />
          ))}
        </div>

        <div className="bg-background rounded-xl p-4">
          <h4 className="text-sm md:text-base mb-4">Quick Actions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {filteredQuickActions.map((action, i) => {
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
          <div className="md:col-span-2 bg-background rounded-xl p-4">
            <h3 className="text-sm md:text-base mb-4">Recent Activity</h3>
            <div className="space-y-4 md:space-y-2">
              {isLoading ? (
                <div className="py-8 flex items-center justify-center">
                  <LoadingState />
                </div>
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 md:p-3 hover:bg-gray-100 dark:hover:bg-foreground/5 rounded-lg transition-colors cursor-pointer"
                    onClick={activity?.onClick}
                  >
                    <div
                      className={`p-0 rounded-lg flex items-center justify-center size-8 md:size-9 ${activity?.iconBg}`}
                    >
                      <span className="text-md">{activity?.icon}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs md:text-sm font-medium">
                        {activity?.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {activity?.description}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {activity?.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="size-12 rounded-full bg-gray-50 dark:bg-content1 flex items-center justify-center mb-3">
                    <LuTrendingUp className="text-gray-400 text-xl" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-foreground">
                    No recent activity
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Activity will appear here as it happens
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 md:space-y-5">
            {/* Google Business Profile Card */}
            {gmbConfig && gmbConfig.connectionType === "zernio" && gmbConfig.status === "Connected" ? (
              <div className="bg-background rounded-xl p-4 border border-divider dark:border-white/5 space-y-3 animate-fade-in">
                <div className="flex justify-between items-center border-b border-divider pb-2">
                  <h3 className="text-sm md:text-base font-semibold flex items-center gap-1.5">
                    <span>🏢</span> Google Business
                  </h3>
                  <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-2 py-0.5 rounded text-xs font-medium">
                    Connected
                  </span>
                </div>
                
                {gmbConfig.locations?.[0] && (
                  <div className="space-y-1.5 text-xs">
                    <p className="font-semibold text-gray-900 dark:text-foreground">
                      {gmbConfig.locations[0].name}
                    </p>
                    <p className="text-gray-500 leading-relaxed">
                      {gmbConfig.locations[0].address}
                    </p>
                    {gmbConfig.locations[0].coordinates && (
                      <p className="text-gray-400 font-mono text-[10px]">
                        Lat: {gmbConfig.locations[0].coordinates.latitude?.toFixed(4)}, Long: {gmbConfig.locations[0].coordinates.longitude?.toFixed(4)}
                      </p>
                    )}
                  </div>
                )}

                {reviews && reviews.length > 0 && (
                  <div className="pt-2 border-t border-divider space-y-2">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Recent Reviews:
                    </p>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {reviews.map((r: any, idx: number) => (
                        <div key={idx} className="bg-gray-50 dark:bg-foreground/5 p-2 rounded text-[11px] space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800 dark:text-foreground truncate max-w-[120px]">
                              {r.reviewer?.displayName || "Anonymous"}
                            </span>
                            <span className="text-yellow-500 font-semibold shrink-0">
                              ★ {r.starRating ? (typeof r.starRating === 'string' ? r.starRating.charAt(0) : r.starRating) : 5}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 leading-normal line-clamp-2">
                            {r.comment || "Rating only"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-background rounded-xl p-4 border border-divider dark:border-white/5">
                <h3 className="text-sm md:text-base font-semibold mb-2 flex items-center gap-1.5">
                  <span>🏢</span> Google Business
                </h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Connect your Google Business Profile to sync and display your location details and reviews.
                </p>
                <Button
                  size="sm"
                  radius="sm"
                  color="primary"
                  fullWidth
                  onPress={handleConnectGoogleBusiness}
                >
                  Connect Google Business
                </Button>
              </div>
            )}

            <div className="bg-background rounded-xl p-4">
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
                    {dashboard?.nfcQrData?.conversionRate &&
                      dashboard.nfcQrData.conversionRate > 0
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

            <div className="bg-background rounded-xl p-4">
              <h3
                className="text-sm md:text-base mb-4"
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
