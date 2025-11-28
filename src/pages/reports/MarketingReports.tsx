import { Button, Card } from "@heroui/react";
import clsx from "clsx";
import { IoArrowBack } from "react-icons/io5";
import {
  LuTrendingUp,
  LuChartColumn,
  LuTarget,
  LuUsers,
  LuDollarSign,
  LuTrendingDown,
} from "react-icons/lu";
import React from "react";
import { BsArrowDownRight, BsArrowUpRight } from "react-icons/bs";

const LocalCardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h4
    data-slot="card-title"
    className={clsx("leading-none flex items-center gap-2", className)}
    {...props}
  >
    {children}
  </h4>
);

const LocalCardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    data-slot="card-header"
    className={clsx(
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const LocalCardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    data-slot="card-content"
    className={clsx("px-6 [&:last-child]:pb-6", className)}
    {...props}
  >
    {children}
  </div>
);

interface MetricData {
  value: string;
  label: string;
  change: string;
  color: "sky" | "orange" | "blue" | "amber";
  changeType: "up" | "down";
}

interface ChannelData {
  name: string;
  revenue: string;
  roi: string;
  roiColor: "emerald" | "amber";
  trend: "up" | "down";
  spend: string;
  conversions: string;
  cpa: string;
  efficiency: string;
  efficiencyPercentage: number;
}

interface InsightData {
  title: string;
  description: string;
  color: "emerald" | "sky" | "amber" | "orange";
}

interface ProjectionData {
  value: string;
  label: string;
  color: "emerald" | "sky" | "orange";
  subtext: string;
}

const METRICS_DATA: MetricData[] = [
  {
    value: "$74,300",
    label: "Total Revenue Generated",
    change: "+23% vs Q4 2023",
    color: "sky",
    changeType: "up",
  },
  {
    value: "$15,450",
    label: "Total Marketing Spend",
    change: "+8% vs Q4 2023",
    color: "orange",
    changeType: "up",
  },
  {
    value: "381%",
    label: "Overall ROI",
    change: "+15% vs Q4 2023",
    color: "blue",
    changeType: "up",
  },
  {
    value: "175",
    label: "Total Conversions",
    change: "+18% vs Q4 2023",
    color: "amber",
    changeType: "up",
  },
];

const CHANNELS_DATA: ChannelData[] = [
  {
    name: "Google Ads",
    revenue: "$34,200",
    roi: "302%",
    roiColor: "emerald",
    trend: "up",
    spend: "$8,500",
    conversions: "67",
    cpa: "$127",
    efficiency: "100%",
    efficiencyPercentage: 100,
  },
  {
    name: "Facebook Ads",
    revenue: "$12,800",
    roi: "300%",
    roiColor: "emerald",
    trend: "up",
    spend: "$3,200",
    conversions: "28",
    cpa: "$114",
    efficiency: "100%",
    efficiencyPercentage: 100,
  },
  {
    name: "Email Marketing",
    revenue: "$5,600",
    roi: "1144%",
    roiColor: "emerald",
    trend: "up",
    spend: "$450",
    conversions: "23",
    cpa: "$20",
    efficiency: "100%",
    efficiencyPercentage: 100,
  },
  {
    name: "Referral Program",
    revenue: "$18,900",
    roi: "800%",
    roiColor: "emerald",
    trend: "up",
    spend: "$2,100",
    conversions: "45",
    cpa: "$47",
    efficiency: "100%",
    efficiencyPercentage: 100,
  },
  {
    name: "Social Media",
    revenue: "$2,800",
    roi: "133%",
    roiColor: "amber",
    trend: "down",
    spend: "$1,200",
    conversions: "12",
    cpa: "$100",
    efficiency: "44%",
    efficiencyPercentage: 44,
  },
];

const INSIGHTS_DATA: InsightData[] = [
  {
    title: "Email Marketing Excellence",
    description:
      "Email marketing shows exceptional ROI of 1,144% with the lowest cost per acquisition at $20.",
    color: "emerald",
  },
  {
    title: "Referral Program Success",
    description:
      "Referral program delivers strong 800% ROI with high-quality conversions and low acquisition costs.",
    color: "sky",
  },
  {
    title: "Social Media Optimization Needed",
    description:
      "Social media shows declining ROI and needs strategy optimization to improve performance.",
    color: "amber",
  },
];

const RECOMMENDATIONS_DATA: InsightData[] = [
  {
    title: "Increase Email Budget",
    description:
      "Allocate more budget to email marketing given its exceptional ROI and low CPA.",
    color: "emerald",
  },
  {
    title: "Expand Referral Program",
    description:
      "Implement referral program expansion with additional incentives to drive more high-quality leads.",
    color: "sky",
  },
  {
    title: "Optimize Social Strategy",
    description:
      "Review social media targeting and content strategy to improve conversion rates and ROI.",
    color: "orange",
  },
];

const PROJECTIONS_DATA: ProjectionData[] = [
  {
    value: "$89,200",
    label: "Projected Revenue",
    color: "emerald",
    subtext: "+20% growth target",
  },
  {
    value: "$18,500",
    label: "Recommended Spend",
    color: "sky",
    subtext: "Optimized allocation",
  },
  {
    value: "382%",
    label: "Projected ROI",
    color: "orange",
    subtext: "+10% improvement",
  },
];

const MetricBlock: React.FC<{ metric: MetricData }> = ({ metric }) => {
  const colorMap = {
    sky: {
      from: "from-sky-50",
      to: "to-sky-100",
      border: "border-sky-200",
      text: "text-sky-700",
      textChange: "text-emerald-600",
    },
    orange: {
      from: "from-orange-50",
      to: "to-orange-100",
      border: "border-orange-200",
      text: "text-orange-700",
      textChange: "text-red-600",
    },
    blue: {
      from: "from-blue-50",
      to: "to-blue-100",
      border: "border-blue-200",
      text: "text-blue-700",
      textChange: "text-emerald-600",
    },
    amber: {
      from: "from-amber-50",
      to: "to-amber-100",
      border: "border-amber-200",
      text: "text-amber-700",
      textChange: "text-emerald-600",
    },
  };
  const colors = colorMap[metric.color];
  const Icon = metric.changeType === "up" ? BsArrowUpRight : BsArrowDownRight;
  const changeColor =
    metric.changeType === "up" ? "text-emerald-600" : "text-red-600";

  return (
    <div
      className={clsx(
        "text-center p-4 rounded-xl border",
        `bg-gradient-to-br ${colors.from} ${colors.to}`,
        colors.border
      )}
    >
      <div className={clsx("text-3xl font-bold", colors.text)}>
        {metric.value}
      </div>
      <div className="text-sm text-gray-700 font-medium">{metric.label}</div>
      <div className="flex items-center justify-center gap-1 mt-2">
        <Icon className={clsx("h-3 w-3", changeColor)} aria-hidden="true" />
        <span className={clsx("text-xs font-medium", changeColor)}>
          {metric.change}
        </span>
      </div>
    </div>
  );
};

const ChannelRow: React.FC<{ channel: ChannelData }> = ({ channel }) => {
  const roiBg =
    channel.roiColor === "emerald"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : "bg-amber-100 text-amber-800 border-amber-200";
  const trendText =
    channel.trend === "up" ? "text-emerald-600" : "text-red-600";
  const TrendIcon = channel.trend === "up" ? LuTrendingUp : LuTrendingDown;

  return (
    <div className="border border-sky-100 rounded-lg p-5 bg-gradient-to-r from-white to-sky-50/30 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-lg text-gray-900">
            {channel.name}
          </h3>
          <span
            data-slot="badge"
            className={clsx(
              "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium",
              roiBg
            )}
          >
            {channel.roi} ROI
          </span>
          <TrendIcon
            className={clsx("h-4 w-4", trendText)}
            aria-hidden="true"
          />
        </div>
        <div className="text-right">
          <div className="font-bold text-xl text-sky-700">
            {channel.revenue}
          </div>
          <div className="text-sm text-gray-600 font-medium">Revenue</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
        <div className="bg-white/50 p-3 rounded-lg border border-gray-100">
          <div className="text-sm text-gray-600 font-medium">Spend</div>
          <div className="font-bold text-lg text-gray-900">{channel.spend}</div>
        </div>
        <div className="bg-white/50 p-3 rounded-lg border border-gray-100">
          <div className="text-sm text-gray-600 font-medium">Conversions</div>
          <div className="font-bold text-lg text-gray-900">
            {channel.conversions}
          </div>
        </div>
        <div className="bg-white/50 p-3 rounded-lg border border-gray-100">
          <div className="text-sm text-gray-600 font-medium">
            Cost per Acquisition
          </div>
          <div className="font-bold text-lg text-gray-900">{channel.cpa}</div>
        </div>
        <div className="bg-white/50 p-3 rounded-lg border border-gray-100">
          <div className="text-sm text-gray-600 font-medium">Efficiency</div>
          <div className="flex items-center gap-2">
            <div
              role="progressbar"
              aria-valuemax={100}
              aria-valuemin={0}
              data-slot="progress"
              className="bg-primary/20 relative w-full overflow-hidden rounded-full flex-1 h-3"
            >
              <div
                data-slot="progress-indicator"
                className="bg-primary h-full transition-all"
                style={{
                  transform: `translateX(-${
                    100 - channel.efficiencyPercentage
                  }%)`,
                }}
              ></div>
            </div>
            <span className="text-sm font-bold text-sky-700">
              {channel.efficiency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketingReport = () => {
  const handleBack = () => console.log("Navigating back to reports list.");

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
      <div className="container mx-auto px-6 py-6">
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0 p-6 border-b bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Sample Report
                </h1>
                <p className="text-gray-600 mt-1">
                  Preview of comprehensive marketing analytics
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={handleBack}
                className="has-[&>svg]:px-3"
              >
                <IoArrowBack className="size-4" />
                Back to Reports
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
              <Card className="border-l-4 border-l-sky-500 card-brand hover:shadow-lg transition-all duration-300">
                <LocalCardHeader>
                  <LocalCardTitle>
                    <div className="w-1 h-6 bg-brand-gradient rounded-full"></div>
                    <LuTrendingUp
                      className="h-5 w-5 text-sky-600"
                      aria-hidden="true"
                    />
                    Executive Summary - Q1 2024 Marketing ROI Analysis
                  </LocalCardTitle>
                </LocalCardHeader>
                <LocalCardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {METRICS_DATA.map((metric, index) => (
                      <MetricBlock key={index} metric={metric} />
                    ))}
                  </div>
                </LocalCardContent>
              </Card>

              <Card className="card-brand hover:shadow-lg transition-all duration-300">
                <LocalCardHeader>
                  <LocalCardTitle>
                    <div className="w-1 h-6 bg-brand-gradient rounded-full"></div>
                    <LuChartColumn
                      className="h-5 w-5 text-sky-600"
                      aria-hidden="true"
                    />
                    Channel Performance Breakdown
                  </LocalCardTitle>
                </LocalCardHeader>
                <LocalCardContent>
                  <div className="space-y-4">
                    {CHANNELS_DATA.map((channel, index) => (
                      <ChannelRow key={index} channel={channel} />
                    ))}
                  </div>
                </LocalCardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="card-brand hover:shadow-lg transition-all duration-300">
                  <LocalCardHeader>
                    <LocalCardTitle>
                      <div className="w-1 h-6 bg-brand-gradient rounded-full"></div>
                      <LuTarget
                        className="h-5 w-5 text-sky-600"
                        aria-hidden="true"
                      />
                      Key Insights
                    </LocalCardTitle>
                  </LocalCardHeader>
                  <LocalCardContent>
                    <div className="space-y-4">
                      {INSIGHTS_DATA.map((insight, index) => (
                        <div
                          key={index}
                          className={clsx(
                            "flex items-start gap-3 p-3 rounded-lg border",
                            `bg-${insight.color}-50 border-${insight.color}-200`
                          )}
                        >
                          <div
                            className={clsx(
                              "w-3 h-3 rounded-full mt-2 flex-shrink-0",
                              `bg-${insight.color}-500`
                            )}
                          ></div>
                          <div>
                            <h4
                              className={clsx(
                                "font-semibold",
                                `text-${insight.color}-800`
                              )}
                            >
                              {insight.title}
                            </h4>
                            <p
                              className={clsx(
                                "text-sm",
                                `text-${insight.color}-700`
                              )}
                            >
                              {insight.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </LocalCardContent>
                </Card>

                <Card className="card-brand hover:shadow-lg transition-all duration-300">
                  <LocalCardHeader>
                    <LocalCardTitle>
                      <div className="w-1 h-6 bg-brand-gradient rounded-full"></div>
                      <LuUsers
                        className="h-5 w-5 text-orange-600"
                        aria-hidden="true"
                      />
                      Recommendations
                    </LocalCardTitle>
                  </LocalCardHeader>
                  <LocalCardContent>
                    <div className="space-y-4">
                      {RECOMMENDATIONS_DATA.map((rec, index) => (
                        <div
                          key={index}
                          className={clsx(
                            "pl-4 p-3 rounded-r-lg",
                            `border-l-4 border-l-${rec.color}-500 bg-${rec.color}-50`
                          )}
                        >
                          <h4
                            className={clsx(
                              "font-semibold",
                              `text-${rec.color}-800`
                            )}
                          >
                            {rec.title}
                          </h4>
                          <p
                            className={clsx("text-sm", `text-${rec.color}-700`)}
                          >
                            {rec.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </LocalCardContent>
                </Card>
              </div>

              <Card className="border-l-4 border-l-sky-500 card-brand hover:shadow-lg transition-all duration-300">
                <LocalCardHeader>
                  <LocalCardTitle>
                    <div className="w-1 h-6 bg-brand-gradient rounded-full"></div>
                    <LuDollarSign
                      className="h-5 w-5 text-sky-600"
                      aria-hidden="true"
                    />
                    Q2 2024 Projections Based on Current Performance
                  </LocalCardTitle>
                </LocalCardHeader>
                <LocalCardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PROJECTIONS_DATA.map((proj, index) => (
                      <div
                        key={index}
                        className={clsx(
                          "text-center p-6 rounded-xl border hover:shadow-md transition-all duration-300",
                          `bg-gradient-to-br from-${proj.color}-50 to-${proj.color}-100 border-${proj.color}-200`
                        )}
                      >
                        <div
                          className={clsx(
                            "text-3xl font-bold",
                            `text-${proj.color}-700`
                          )}
                        >
                          {proj.value}
                        </div>
                        <div
                          className={clsx(
                            "text-sm font-medium",
                            `text-${proj.color}-800`
                          )}
                        >
                          {proj.label}
                        </div>
                        <div
                          className={clsx(
                            "text-xs mt-2 font-medium",
                            `text-${proj.color}-600`
                          )}
                        >
                          {proj.subtext}
                        </div>
                      </div>
                    ))}
                  </div>
                </LocalCardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MarketingReport;
