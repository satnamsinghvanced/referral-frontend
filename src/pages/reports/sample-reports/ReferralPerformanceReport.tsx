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
  from: string;
  to: string;
  borderColor: string;
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
  color: string;
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
      trendColor: "text-emerald-600",
      from: "sky",
      to: "sky",
      borderColor: "sky",
    },
    {
      value: "86.3%",
      label: "Conversion Rate",
      trend: "+3.2% improvement",
      trendColor: "text-emerald-600",
      from: "emerald",
      to: "emerald",
      borderColor: "emerald",
    },
    {
      value: "$284,500",
      label: "Total Revenue",
      trend: "+18% vs last month",
      trendColor: "text-emerald-600",
      from: "blue",
      to: "blue",
      borderColor: "blue",
    },
    {
      value: "$1152",
      label: "Avg Patient Value",
      trend: "+5% improvement",
      trendColor: "text-emerald-600",
      from: "orange",
      to: "orange",
      borderColor: "orange",
    },
    {
      value: "4",
      label: "Active Referrers",
      trend: "Top performers",
      trendColor: "text-sky-600",
      from: "amber",
      to: "amber",
      borderColor: "amber",
    },
    {
      value: "15",
      label: "Patient Referrers",
      trend: "+2 new this month",
      trendColor: "text-emerald-600",
      from: "rose",
      to: "rose",
      borderColor: "rose",
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
      avatarFallback: "DER",
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
    <div
      data-slot="card"
      className={`bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-l-4 border-l-sky-500 card-brand hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <div
        data-slot="card-header"
        className="px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6"
      >
        <h4
          data-slot="card-title"
          className="leading-none flex items-center gap-2"
        >
          <div className="w-1 h-6 bg-brand-gradient rounded-full"></div>
          {Icon && <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />}
          {title}
        </h4>
      </div>
      <div data-slot="card-content" className="px-6 [&:last-child]:pb-6">
        {children}
      </div>
    </div>
  );

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="flex flex-col gap-6">
        {renderReportCard({
          title: "Referral Performance Summary - January 2024",
          icon: Users,
          iconColor: "text-sky-600",
          children: (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {summaryData.map((data, index) => (
                <div
                  key={index}
                  className={`text-center p-4 bg-gradient-to-br from-${data.from}-50 to-${data.to}-100 rounded-xl border border-${data.borderColor}-200`}
                >
                  <div className={`text-3xl font-bold text-${data.borderColor}-700`}>{data.value}</div>
                  <div className="text-sm text-gray-700 font-medium">{data.label}</div>
                  <div className={`text-xs ${data.trendColor} mt-2 font-medium`}>{data.trend}</div>
                </div>
              ))}
            </div>
          ),
        })}

        {renderReportCard({
          title: "Top Doctor Referrers",
          icon: Star,
          iconColor: "text-amber-500",
          children: (
            <div className="space-y-4">
              {topDoctorReferrers.map((referrer, index) => {
                const isTrendingUp =
                  referrer.conversion.includes("93.3%") ||
                  referrer.conversion.includes("92.1%");
                const isTrendingDown = referrer.conversion.includes("82.8%");

                return (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <span
                            data-slot="avatar"
                            className="relative flex size-10 shrink-0 overflow-hidden rounded-full h-12 w-12"
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
                                className="bg-muted flex size-full items-center justify-center rounded-full"
                              >
                                {referrer.avatarFallback}
                              </span>
                            )}
                          </span>
                          <div className="absolute -top-1 -right-1">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">
                                #{referrer.rank}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{referrer.name}</h3>
                          <p className="text-gray-600">{referrer.practice}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              data-slot="badge"
                              className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 border-transparent bg-secondary text-secondary-foreground"
                            >
                              {referrer.specialty}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <MapPin className="h-3 w-3" aria-hidden="true" />
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
                          <span
                            data-slot="badge"
                            className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 border-transparent ${
                              referrer.conversion.includes("green")
                                ? "bg-green-100 text-green-800"
                                : referrer.conversion.includes("yellow")
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {referrer.conversion}
                          </span>
                        </div>
                        <div className="text-lg font-semibold">{referrer.revenue}</div>
                        <div className="text-sm text-gray-600">Revenue Generated</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Referrals</div>
                        <div className="font-medium text-blue-600">{referrer.referrals}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Conversions</div>
                        <div className="font-medium text-green-600">
                          {referrer.conversions}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Avg Patient Value</div>
                        <div className="font-medium">{referrer.avgPatientValue}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Last Referral</div>
                        <div className="font-medium">{referrer.lastReferral}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Contact</div>
                        <div className="font-medium text-blue-600">{referrer.contact}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ),
        })}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderReportCard({
            title: "Top Patient Referrers",
            icon: Users,
            iconColor: "text-orange-600",
            className: "lg:col-span-1",
            children: (
              <div className="space-y-4">
                {topPatientReferrers.map((referrer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        data-slot="avatar"
                        className="relative flex size-10 shrink-0 overflow-hidden rounded-full h-10 w-10"
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
                            className="bg-muted flex size-full items-center justify-center rounded-full"
                          >
                            {referrer.avatarFallback}
                          </span>
                        )}
                      </span>
                      <div>
                        <h4 className="font-medium">{referrer.name}</h4>
                        <p className="text-sm text-gray-600">{referrer.description}</p>
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
                      <div className="font-medium">{referrer.revenue}</div>
                      <div className="text-sm text-gray-600">Revenue</div>
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
              <div className="space-y-4">
                {monthlyTrends.map((trend, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{trend.month}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-blue-600">
                          {trend.referrals} referrals
                        </span>
                        <span className="text-sm text-green-600">
                          {trend.conversions} conversions
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{trend.revenue}</div>
                      <div className="text-sm text-gray-600">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            ),
          })}
        </div>

        {renderReportCard({
          title: "Strategic Recommendations",
          icon: Target,
          iconColor: "text-sky-600",
          children: (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-green-700">
                  Opportunities for Growth
                </h4>
                <div className="space-y-3">
                  {strategicRecommendations
                    .filter((r) => r.type === "opportunity")
                    .map((rec, index) => (
                      <div
                        key={index}
                        className={`border-l-4 border-l-${rec.color}-500 pl-4`}
                      >
                        <h5 className="font-medium">{rec.title}</h5>
                        <p className="text-sm text-gray-600">{rec.description}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-yellow-700">
                  Areas for Improvement
                </h4>
                <div className="space-y-3">
                  {strategicRecommendations
                    .filter((r) => r.type === "improvement")
                    .map((rec, index) => (
                      <div
                        key={index}
                        className={`border-l-4 border-l-${rec.color}-500 pl-4`}
                      >
                        <h5 className="font-medium">{rec.title}</h5>
                        <p className="text-sm text-gray-600">{rec.description}</p>
                      </div>
                    ))}
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