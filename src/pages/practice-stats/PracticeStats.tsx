import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import {
  LuCalendar,
  LuChartColumn,
  LuTarget,
  LuTrendingDown,
  LuTrendingUp,
  LuUsers,
} from "react-icons/lu";
import { TrendIndicator } from "../../components/common/TrendIndicator";
import { Link } from "react-router-dom";
import IntegrationWarningBanner from "../../components/common/IntegrationWarningBanner";
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
import ChartTooltip from "../../components/common/ChartTooltip";
import ComponentContainer from "../../components/common/ComponentContainer";
import { LoadingState } from "../../components/common/LoadingState";
import {
  useGoogleAdsIntegration,
  useMetaAdsIntegration,
} from "../../hooks/integrations/useAds";
import { useAnalyticsIntegration } from "../../hooks/integrations/useGoogleAnalytics";
import { useGeneralAnalytics } from "../../hooks/useAnalytics";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { usePlanGuard } from "../../hooks/usePlanGuard";
import { GoogleAds } from "./GoogleAds";
import { GoogleTrafficStats } from "./GoogleTrafficStats";
import { MetaAds } from "./MetaAds";

const PracticeStats: React.FC = () => {
  const { theme } = useTypedSelector((state) => state.ui);
  const { data, isLoading } = useGeneralAnalytics();
  const { hasAccess, billingData } = usePlanGuard();

  const planPrice = billingData?.price;
  const isStarterPlan =
    planPrice === 199 ||
    billingData?.planId === "starter_199" ||
    billingData?.name?.toLowerCase() === "starter";
  const hasAdsAccess =
    !isStarterPlan &&
    (planPrice ? planPrice >= 399 : hasAccess("roi_analytics"));
  const canAccessRoiAnalytics = hasAdsAccess;

  const { data: gaConfig, isLoading: isGaConfigLoading } =
    useAnalyticsIntegration();
  const { data: googleAdsConfig, isLoading: isGoogleAdsConfigLoading } =
    useGoogleAdsIntegration();
  const { data: metaAdsConfig, isLoading: isMetaAdsConfigLoading } =
    useMetaAdsIntegration();

  const isGaConnected = gaConfig?.status === "Connected";
  const isGoogleAdsConnected = googleAdsConfig?.status === "Connected";
  const isMetaAdsConnected = metaAdsConfig?.status === "Connected";

  const HEADING_DATA = {
    heading: "Analytics Dashboard",
    subHeading:
      "Track your practice performance and referral trends with detailed insights.",
  };

  const ALL_STAT_CARD_DATA = [
    {
      icon: <LuUsers className="text-blue-500 dark:text-blue-400" />,
      heading: "Monthly Referrals",
      value: isLoading
        ? "..."
        : data?.stats?.monthlyReferrals?.totalReferrals?.toString() || "0",
      subheading: (
        <TrendIndicator
          status={data?.stats?.monthlyReferrals?.status}
          percentage={data?.stats?.monthlyReferrals?.percentage}
          isLoading={isLoading}
        />
      ),
    },
    {
      icon: <LuTarget className="text-orange-500 dark:text-orange-400" />,
      heading: "Conversion Rate",
      value: isLoading
        ? "..."
        : `${data?.stats?.conversionRate?.conversionRate || "0"}%`,
      subheading: (
        <TrendIndicator
          status={data?.stats?.conversionRate?.status}
          percentage={data?.stats?.conversionRate?.percentage}
          label="conversion performance"
          isLoading={isLoading}
        />
      ),
    },
    {
      icon: <LuCalendar className="text-blue-500 dark:text-blue-400" />,
      heading: "Appointments",
      value: isLoading
        ? "..."
        : data?.stats?.appointments?.totalAppointments?.toString() || "0",
      subheading: (
        <TrendIndicator
          status={data?.stats?.appointments?.status}
          percentage={data?.stats?.appointments?.percentage}
          isLoading={isLoading}
        />
      ),
    },
    {
      icon: <LuChartColumn className="text-green-500 dark:text-green-400" />,
      heading: "Revenue Growth",
      value: isLoading
        ? "..."
        : `$${data?.stats?.revenue?.totalRevenue?.toLocaleString() || "0"}`,
      subheading: (
        <TrendIndicator
          status={data?.stats?.revenue?.status}
          percentage={data?.stats?.revenue?.percentage}
          label="revenue growth"
          isLoading={isLoading}
        />
      ),
      key: "revenue_growth",
    },
  ];

  const STAT_CARD_DATA = ALL_STAT_CARD_DATA;

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

  const INTEGRATION_WARNINGS = [
    {
      isConnected: isGaConnected,
      isLoading: isGaConfigLoading,
      label: "Google Analytics",
      key: "google_analytics",
      message:
        "Google Analytics is not connected. Connect your Google Analytics property to track website traffic.",
      show: true,
    },
    {
      isConnected: isGoogleAdsConnected,
      isLoading: isGoogleAdsConfigLoading,
      label: "Google Ads",
      key: "google_ads",
      message:
        "Google Ads is not connected. Connect your Google Ads account to track your campaigns.",
      show: hasAdsAccess,
    },
    {
      isConnected: isMetaAdsConnected,
      isLoading: isMetaAdsConfigLoading,
      label: "Meta Ads",
      key: "meta_ads",
      message:
        "Meta Ads is not connected. Connect your Meta Ads account to track your Facebook and Instagram campaigns.",
      show: hasAdsAccess,
    },
  ];

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="space-y-5">
        {/* Integration Warnings */}
        <div className="space-y-3">
          {INTEGRATION_WARNINGS.map(
            (warning, idx) =>
              warning.show &&
              !warning.isConnected &&
              !warning.isLoading && (
                <IntegrationWarningBanner
                  key={idx}
                  platformName={warning.label}
                  integrationKey={warning.key}
                  message={warning.message}
                />
              ),
          )}
        </div>

        <div className="space-y-4 md:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
            {STAT_CARD_DATA.map((card, i) => (
              <MiniStatsCard key={i} cardData={card} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Referral Sources Distribution */}
            <Card
              shadow="none"
              className="border border-foreground/10 bg-white dark:bg-background p-4 md:p-5"
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
                    <Tooltip content={<ChartTooltip />} />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Performance Trends */}
            <Card
              shadow="none"
              className="border border-foreground/10 bg-white dark:bg-background p-4 md:p-5"
            >
              <CardHeader className="p-0 pb-5 md:pb-8">
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
                        content={<ChartTooltip />}
                        cursor={{
                          stroke:
                            theme === "dark"
                              ? "rgba(255, 255, 255, 0.1)"
                              : "#ccc",
                          strokeWidth: 2,
                        }}
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

            {/* Weekly Activity Overview */}
            <Card
              shadow="none"
              className="border border-foreground/10 bg-white dark:bg-background p-4 md:p-5 md:col-span-2"
            >
              <CardHeader className="p-0 pb-5 md:pb-8">
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
                        content={<ChartTooltip />}
                        cursor={{
                          stroke:
                            theme === "dark"
                              ? "rgba(255, 255, 255, 0.1)"
                              : "#ccc",
                          strokeWidth: 2,
                        }}
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

          {(isGaConnected ||
            (isGoogleAdsConnected && hasAdsAccess) ||
            (isMetaAdsConnected && hasAdsAccess)) && (
            <div className="space-y-6 md:space-y-10 mt-6">
              {isGaConnected && <GoogleTrafficStats />}
              {isGoogleAdsConnected && hasAdsAccess && <GoogleAds />}
              {isMetaAdsConnected && hasAdsAccess && <MetaAds />}
            </div>
          )}
        </div>
      </div>
    </ComponentContainer>
  );
};

export default PracticeStats;
