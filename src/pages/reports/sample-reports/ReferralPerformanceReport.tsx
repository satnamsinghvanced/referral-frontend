import {
  IoArrowBack,
  IoTrendingUp,
  IoPeople,
  IoLocation,
  IoPulse,
  IoStar,
  IoSearch,
} from "react-icons/io5";
import ComponentContainer from "../../../components/common/ComponentContainer";
import { useNavigate } from "react-router";
import React from "react";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { LuTarget, LuUsers } from "react-icons/lu";
import { FaRegStar } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import clsx from "clsx";

const Users = IoPeople;
const TrendingUp = IoTrendingUp;
const MapPin = IoLocation;
const Activity = IoPulse;
const Star = IoStar;
const Target = IoSearch;

type SummaryMetricData = {
  value: string;
  label: string;
  trend: string;
  trendColor: string;
  color: "sky" | "emerald" | "blue" | "orange" | "amber" | "rose";
};

type TopReferrerData = {
  rank: number;
  name: string;
  practice: string;
  specialty: string;
  location: string;
  conversion: string;
  revenue: string;
  referrals: string;
  conversions: string;
  avgPatientValue: string;
  lastReferral: string;
  contact: string;
  avatarSrc: string | null;
  avatarFallback: string;
};

type PatientReferrerData = {
  name: string;
  description: string;
  referrals: string;
  conversion: string;
  revenue: string;
  avatarSrc: string | null;
  avatarFallback: string;
};

type MonthlyTrendData = {
  month: string;
  referrals: string;
  conversions: string;
  revenue: string;
};

type RecommendationData = {
  type: string;
  title: string;
  description: string;
  color: "green" | "blue" | "yellow" | "purple";
};

const THEME_STYLES = {
  sky: {
    summary:
      "bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200 dark:from-sky-500/20 dark:to-sky-500/30 dark:border-sky-500/40",
    summaryText: "text-sky-700 dark:text-sky-300",
    recommendation: "border-l-4 border-l-sky-500 bg-sky-50 dark:bg-sky-500/10",
  },
  emerald: {
    summary:
      "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-500/20 dark:to-emerald-500/30 dark:border-emerald-500/40",
    summaryText: "text-emerald-700 dark:text-emerald-300",
    recommendation:
      "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
  },
  blue: {
    summary:
      "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-500/20 dark:to-blue-500/30 dark:border-blue-500/40",
    summaryText: "text-blue-700 dark:text-blue-300",
    recommendation:
      "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-500/10",
  },
  orange: {
    summary:
      "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-500/20 dark:to-orange-500/30 dark:border-orange-500/40",
    summaryText: "text-orange-700 dark:text-orange-300",
    recommendation:
      "border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-500/10",
  },
  amber: {
    summary:
      "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-500/20 dark:to-amber-500/30 dark:border-amber-500/40",
    summaryText: "text-amber-700 dark:text-amber-300",
    recommendation:
      "border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-500/10",
  },
  rose: {
    summary:
      "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 dark:from-rose-500/20 dark:to-rose-500/30 dark:border-rose-500/40",
    summaryText: "text-rose-700 dark:text-rose-300",
    recommendation:
      "border-l-4 border-l-rose-500 bg-rose-50 dark:bg-rose-500/10",
  },
  green: {
    summary:
      "bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-500/20 dark:to-green-500/30 dark:border-green-500/40",
    summaryText: "text-green-700 dark:text-green-300",
    recommendation:
      "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-500/10",
  },
  yellow: {
    summary:
      "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-500/20 dark:to-yellow-500/30 dark:border-yellow-500/40",
    summaryText: "text-yellow-700 dark:text-yellow-300",
    recommendation:
      "border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-500/10",
  },
  purple: {
    summary:
      "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-500/20 dark:to-purple-500/30 dark:border-purple-500/40",
    summaryText: "text-purple-700 dark:text-purple-300",
    recommendation:
      "border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-500/10",
  },
};

const ReferralPerformanceReport = () => {
  const navigate = useNavigate();

  const HEADING_DATA = {
    heading: "Referral Performance Report",
    subHeading:
      "Preview of comprehensive referral performance for January 2024",
    buttons: [
      {
        label: "Back to Reports",
        onClick: () => navigate(-1),
        icon: <IoArrowBack fontSize={15} />,
        variant: "ghost" as const,
        color: "default" as const,
        className: "border-small",
      },
    ],
  };

  const summaryData: SummaryMetricData[] = [
    {
      value: "247",
      label: "Total Referrals",
      trend: "+12.4% vs last month",
      trendColor: "text-emerald-600 dark:text-emerald-400",
      color: "sky",
    },
    {
      value: "86.3%",
      label: "Conversion Rate",
      trend: "+3.2% improvement",
      trendColor: "text-emerald-600 dark:text-emerald-400",
      color: "emerald",
    },
    {
      value: "$284,500",
      label: "Total Revenue",
      trend: "+18% vs last month",
      trendColor: "text-emerald-600 dark:text-emerald-400",
      color: "blue",
    },
    {
      value: "$1152",
      label: "Avg Patient Value",
      trend: "+5% improvement",
      trendColor: "text-emerald-600 dark:text-emerald-400",
      color: "orange",
    },
    {
      value: "4",
      label: "Active Referrers",
      trend: "Top performers",
      trendColor: "text-sky-600 dark:text-sky-400",
      color: "amber",
    },
    {
      value: "15",
      label: "Patient Referrers",
      trend: "+2 new this month",
      trendColor: "text-emerald-600 dark:text-emerald-400",
      color: "rose",
    },
  ];

  const topDoctorReferrers: TopReferrerData[] = [
    {
      rank: 1,
      name: "Dr. Sarah Johnson",
      practice: "Johnson Family Dentistry",
      specialty: "General Dentist",
      location: "Downtown",
      conversion: "93.3% conversion",
      revenue: "$48,300",
      referrals: "45",
      conversions: "42",
      avgPatientValue: "$1150",
      lastReferral: "1/20/2024",
      contact: "(555) 123-4567",
      avatarSrc: null,
      avatarFallback: "SJ",
    },
    {
      rank: 2,
      name: "Dr. Michael Brown",
      practice: "Brown Dental Care",
      specialty: "Pediatric Dentist",
      location: "Westside",
      conversion: "92.1% conversion",
      revenue: "$40,250",
      referrals: "38",
      conversions: "35",
      avgPatientValue: "$1060",
      lastReferral: "1/19/2024",
      contact: "(555) 234-5678",
      avatarSrc: null,
      avatarFallback: "MB",
    },
    {
      rank: 3,
      name: "Dr. Emily Rodriguez",
      practice: "Rodriguez Oral Surgery",
      specialty: "Oral Surgeon",
      location: "Medical District",
      conversion: "87.5% conversion",
      revenue: "$35,600",
      referrals: "32",
      conversions: "28",
      avgPatientValue: "$1270",
      lastReferral: "1/18/2024",
      contact: "(555) 345-6789",
      avatarSrc: null,
      avatarFallback: "DE",
    },
    {
      rank: 4,
      name: "Dr. James Wilson",
      practice: "Wilson Periodontics",
      specialty: "Periodontist",
      location: "Northside",
      conversion: "82.8% conversion",
      revenue: "$31,200",
      referrals: "29",
      conversions: "24",
      avgPatientValue: "$1300",
      lastReferral: "1/17/2024",
      contact: "(555) 456-7890",
      avatarSrc: null,
      avatarFallback: "JW",
    },
  ];

  const topPatientReferrers: PatientReferrerData[] = [
    {
      name: "Jennifer Wilson",
      description: "Satisfied Patient",
      referrals: "12",
      conversion: "91.7%",
      revenue: "$12,650",
      avatarSrc: null,
      avatarFallback: "JW",
    },
    {
      name: "Robert Davis",
      description: "Parent Referrer",
      referrals: "8",
      conversion: "87.5%",
      revenue: "$8,100",
      avatarSrc: null,
      avatarFallback: "RD",
    },
    {
      name: "Maria Garcia",
      description: "Community Leader",
      referrals: "6",
      conversion: "100%",
      revenue: "$6,900",
      avatarSrc: null,
      avatarFallback: "MG",
    },
  ];

  const monthlyTrends: MonthlyTrendData[] = [
    {
      month: "Oct 2023",
      referrals: "189",
      conversions: "158",
      revenue: "$182,400",
    },
    {
      month: "Nov 2023",
      referrals: "201",
      conversions: "171",
      revenue: "$197,350",
    },
    {
      month: "Dec 2023",
      referrals: "224",
      conversions: "189",
      revenue: "$218,200",
    },
    {
      month: "Jan 2024",
      referrals: "247",
      conversions: "213",
      revenue: "$284,500",
    },
  ];

  const strategicRecommendations: RecommendationData[] = [
    {
      type: "opportunity",
      title: "Expand Top Performer Programs",
      description:
        "Dr. Sarah Johnson shows exceptional performance. Consider developing a preferred provider program.",
      color: "green",
    },
    {
      type: "opportunity",
      title: "Patient Referral Incentives",
      description:
        "Patient referrers show high conversion rates. Implement formal referral rewards program.",
      color: "blue",
    },
    {
      type: "improvement",
      title: "Re-engage Declining Referrers",
      description:
        "Dr. James Wilson shows declining trend. Schedule visit to address concerns and re-engage.",
      color: "yellow",
    },
    {
      type: "improvement",
      title: "Conversion Rate Optimization",
      description:
        "Overall conversion rate of 86.3% is good but can be improved through better follow-up processes.",
      color: "purple",
    },
  ];

  const renderReportCard = ({
    title,
    icon: Icon,
    iconColor,
    children,
    className = "",
  }: {
    title: string;
    icon: React.ElementType;
    iconColor: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <Card
      shadow="none"
      className={clsx(
        "border border-foreground/10 dark:bg-background/50 p-5",
        className
      )}
    >
      <CardHeader className="p-0 pb-4">
        <h4 className="text-sm leading-none flex items-center gap-2">
          {Icon && (
            <Icon className={`size-[18px] ${iconColor}`} aria-hidden="true" />
          )}
          {title}
        </h4>
      </CardHeader>
      <CardBody className="p-0">{children}</CardBody>
    </Card>
  );

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="flex flex-col gap-4 md:gap-5">
        {renderReportCard({
          title: "Referral Performance Summary - January 2024",
          icon: LuUsers,
          iconColor: "text-sky-600",
          children: (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {summaryData.map((data, index) => {
                const styles = THEME_STYLES[data.color];
                return (
                  <div
                    key={index}
                    className={clsx(
                      "text-center p-4 rounded-xl border space-y-1",
                      styles.summary
                    )}
                  >
                    <h4
                      className={clsx(
                        "!font-sans text-xl font-bold",
                        styles.summaryText
                      )}
                    >
                      {data.value}
                    </h4>
                    <div className="text-xs text-gray-700 dark:text-foreground/60 font-medium">
                      {data.label}
                    </div>
                  </div>
                );
              })}
            </div>
          ),
        })}

        {renderReportCard({
          title: "Top Doctor Referrers",
          icon: FaRegStar,
          iconColor: "text-amber-500",
          children: (
            <div className="space-y-3">
              {topDoctorReferrers.map((referrer, index) => {
                const isTrendingUp =
                  referrer.conversion.includes("93.3%") ||
                  referrer.conversion.includes("92.1%");
                const isTrendingDown = referrer.conversion.includes("82.8%");

                return (
                  <Card
                    key={index}
                    shadow="none"
                    className="border border-foreground/10 dark:bg-background/50 p-4"
                  >
                    <CardHeader className="flex items-start justify-between p-0 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <span
                            data-slot="avatar"
                            className="relative flex size-10 shrink-0 overflow-hidden rounded-full"
                          >
                            {referrer.avatarSrc ? (
                              <img
                                data-slot="avatar-image"
                                className="aspect-square size-full"
                                src={referrer.avatarSrc}
                                alt={referrer.name}
                              />
                            ) : (
                              <span
                                data-slot="avatar-fallback"
                                className="bg-[#f0f9ff] dark:bg-blue-500/10 flex size-full items-center justify-center rounded-full font-medium text-sm text-blue-700 dark:text-blue-400"
                              >
                                {referrer.avatarFallback}
                              </span>
                            )}
                          </span>
                          <div className="absolute -top-1 -right-1">
                            <div className="size-5 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                                #{referrer.rank}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">
                            {referrer.name}
                          </h4>
                          <p className="text-gray-600 dark:text-foreground/60 text-xs mt-0.5">
                            {referrer.practice}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Chip
                              size="sm"
                              radius="sm"
                              className="text-[#0c4a6e] bg-[#e0f2fe] dark:text-sky-400 dark:bg-sky-500/10 h-5 text-[11px]"
                            >
                              {referrer.specialty}
                            </Chip>
                            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-foreground/40">
                              <GrLocation
                                className="size-3.5"
                                aria-hidden="true"
                              />
                              {referrer.location}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          {isTrendingUp ? (
                            <TrendingUp
                              className="h-4 w-4 text-green-600"
                              aria-hidden="true"
                            />
                          ) : isTrendingDown ? (
                            <TrendingUp
                              className="h-4 w-4 text-red-600 rotate-180"
                              aria-hidden="true"
                            />
                          ) : (
                            <Activity
                              className="h-4 w-4 text-gray-600"
                              aria-hidden="true"
                            />
                          )}
                          <Chip
                            size="sm"
                            radius="sm"
                            className={`h-5 text-[11px] ${
                              referrer.conversion.includes("green")
                                ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                                : referrer.conversion.includes("yellow")
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400"
                                : "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400"
                            }`}
                          >
                            {referrer.conversion}
                          </Chip>
                        </div>
                        <div className="text-base font-semibold">
                          {referrer.revenue}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-foreground/60 mt-0.5">
                          Revenue Generated
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="grid grid-cols-2 md:grid-cols-5 gap-4 p-0">
                      <div className="space-y-0.5">
                        <div className="text-xs text-gray-600 dark:text-foreground/60">
                          Referrals
                        </div>
                        <div className="text-sm font-medium text-blue-600">
                          {referrer.referrals}
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs text-gray-600 dark:text-foreground/60">
                          Conversions
                        </div>
                        <div className="text-sm font-medium text-green-600">
                          {referrer.conversions}
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs text-gray-600 dark:text-foreground/60">
                          Avg Patient Value
                        </div>
                        <div className="text-sm font-medium">
                          {referrer.avgPatientValue}
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs text-gray-600 dark:text-foreground/60">
                          Last Referral
                        </div>
                        <div className="text-sm font-medium">
                          {referrer.lastReferral}
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs text-gray-600 dark:text-foreground/60">
                          Contact
                        </div>
                        <div className="text-sm font-medium text-blue-600">
                          {referrer.contact}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          ),
        })}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {renderReportCard({
            title: "Top Patient Referrers",
            icon: LuUsers,
            iconColor: "text-orange-600",
            className: "lg:col-span-1",
            children: (
              <div className="space-y-3">
                {topPatientReferrers.map((referrer, index) => (
                  <div
                    key={index}
                    className="border border-foreground/10 p-4 dark:bg-background/50 flex items-center justify-between rounded-xl"
                  >
                    <div className="flex items-center gap-2.5 p-0">
                      <span
                        data-slot="avatar"
                        className="relative flex size-10 shrink-0 overflow-hidden rounded-full"
                      >
                        {referrer.avatarSrc ? (
                          <img
                            data-slot="avatar-image"
                            className="aspect-square size-full"
                            src={referrer.avatarSrc}
                            alt={referrer.name}
                          />
                        ) : (
                          <span
                            data-slot="avatar-fallback"
                            className="bg-[#f0f9ff] dark:bg-blue-500/10 flex size-full items-center justify-center rounded-full font-medium text-sm text-blue-700 dark:text-blue-400"
                          >
                            {referrer.avatarFallback}
                          </span>
                        )}
                      </span>
                      <div>
                        <h4 className="text-sm font-medium">{referrer.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-foreground/60 mt-0.5">
                          {referrer.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-blue-600">
                            {referrer.referrals} referrals
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-green-600">
                            {referrer.conversion} conversion
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {referrer.revenue}
                      </div>
                      <div className="text-xs text-gray-600">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            ),
          })}

          {renderReportCard({
            title: "Monthly Growth Trends",
            icon: TrendingUp,
            iconColor: "text-emerald-600",
            className: "lg:col-span-1",
            children: (
              <div className="space-y-3">
                {monthlyTrends.map((trend, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-content1 rounded-lg"
                  >
                    <div>
                      <h4 className="!font-sans text-sm font-medium">
                        {trend.month}
                      </h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-blue-600">
                          {trend.referrals} referrals
                        </span>
                        <span className="text-xs text-green-600">
                          {trend.conversions} conversions
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {trend.revenue}
                      </div>
                      <div className="text-xs text-gray-600">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            ),
          })}
        </div>

        {renderReportCard({
          title: "Strategic Recommendations",
          icon: LuTarget,
          iconColor: "text-sky-600",
          children: (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-green-700 dark:text-green-300">
                  Opportunities for Growth
                </h4>
                <div className="space-y-3">
                  {strategicRecommendations
                    .filter((r) => r.type === "opportunity")
                    .map((rec, index) => {
                      const styles = THEME_STYLES[rec.color];
                      return (
                        <div
                          key={index}
                          className={clsx(
                            "space-y-1 p-3 rounded-r-lg",
                            styles.recommendation
                          )}
                        >
                          <h5 className="text-sm font-medium dark:text-gray-200">
                            {rec.title}
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-foreground/60">
                            {rec.description}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  Areas for Improvement
                </h4>
                <div className="space-y-3">
                  {strategicRecommendations
                    .filter((r) => r.type === "improvement")
                    .map((rec, index) => {
                      const styles = THEME_STYLES[rec.color];
                      return (
                        <div
                          key={index}
                          className={clsx(
                            "space-y-1 p-3 rounded-r-lg",
                            styles.recommendation
                          )}
                        >
                          <h5 className="text-sm font-medium dark:text-gray-200">
                            {rec.title}
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-foreground/60">
                            {rec.description}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ),
        })}
      </div>
    </ComponentContainer>
  );
};

export default ReferralPerformanceReport;
