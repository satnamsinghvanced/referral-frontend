import { Button, Card, CardBody, CardHeader, Progress } from "@heroui/react";
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
import ComponentContainer from "../../../components/common/ComponentContainer";
import { useNavigate } from "react-router";

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
        "space-y-1 text-center p-4 rounded-xl border",
        `bg-gradient-to-br ${colors.from} ${colors.to}`,
        colors.border
      )}
    >
      <div className={clsx("text-xl font-bold", colors.text)}>
        {metric.value}
      </div>
      <div className="text-xs text-gray-700 font-medium">{metric.label}</div>
      {/* <div className="flex items-center justify-center gap-1 mt-2">
        <Icon className={clsx("h-3 w-3", changeColor)} aria-hidden="true" />
        <span className={clsx("text-xs font-medium", changeColor)}>
          {metric.change}
        </span>
      </div> */}
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
    <Card shadow="none" className="border border-primary/15 rounded-xl p-4">
      <CardHeader className="p-0 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="font-medium text-sm">{channel.name}</h4>
          <span
            data-slot="badge"
            className={clsx(
              "inline-flex items-center justify-center rounded-md border px-1.5 py-0.5 text-[11px] h-5",
              roiBg
            )}
          >
            {channel.roi} ROI
          </span>
          <TrendIcon
            className={clsx("size-3.5", trendText)}
            aria-hidden="true"
          />
        </div>
        <div className="text-right">
          <div className="font-bold text-base text-sky-700">
            {channel.revenue}
          </div>
          <div className="text-xs text-gray-600">Revenue</div>
        </div>
      </CardHeader>
      <CardBody className="p-0 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-3 rounded-lg border border-gray-100 space-y-0.5 flex flex-col justify-center">
          <div className="text-xs text-gray-600">Spend</div>
          <div className="font-semibold text-sm">{channel.spend}</div>
        </div>
        <div className="p-3 rounded-lg border border-gray-100 space-y-0.5 flex flex-col justify-center">
          <div className="text-xs text-gray-600">Conversions</div>
          <div className="font-semibold text-sm">{channel.conversions}</div>
        </div>
        <div className="p-3 rounded-lg border border-gray-100 space-y-0.5 flex flex-col justify-center">
          <div className="text-xs text-gray-600">Cost per Acquisition</div>
          <div className="font-semibold text-sm">{channel.cpa}</div>
        </div>
        <div className="p-3 rounded-lg border border-gray-100 space-y-0.5 flex flex-col justify-center">
          <div className="text-xs text-gray-600">Efficiency</div>
          <div className="flex items-center gap-2">
            <Progress
              aria-label="Efficiency"
              value={channel.efficiencyPercentage}
              color="primary"
              className="h-2"
              radius="full"
            />
            <span className="text-xs font-semibold text-sky-700">
              {channel.efficiency}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const MarketingReport = () => {
  const navigate = useNavigate();

  const HEADING_DATA = {
    heading: "Sample Report",
    subHeading: "Preview of comprehensive marketing analytics",
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

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="flex flex-col gap-5">
        <div className="space-y-5">
          <Card shadow="none" className="border border-primary/15 p-5">
            <CardHeader className="p-0 pb-4 flex items-center gap-2">
              <LuTrendingUp
                className="size-[18px] text-sky-600"
                aria-hidden="true"
              />
              <h4 className="text-sm">
                Executive Summary - Q1 2024 Marketing ROI Analysis
              </h4>
            </CardHeader>
            <CardBody className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {METRICS_DATA.map((metric, index) => (
                  <MetricBlock key={index} metric={metric} />
                ))}
              </div>
            </CardBody>
          </Card>

          <Card shadow="none" className="border border-primary/15 p-5">
            <CardHeader className="p-0 pb-4 flex items-center gap-2">
              <LuChartColumn
                className="size-[18px] text-sky-600"
                aria-hidden="true"
              />
              <h4 className="text-sm">Channel Performance Breakdown</h4>
            </CardHeader>
            <CardBody className="p-0">
              <div className="space-y-4">
                {CHANNELS_DATA.map((channel, index) => (
                  <ChannelRow key={index} channel={channel} />
                ))}
              </div>
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card shadow="none" className="border border-primary/15 p-5">
              <CardHeader className="p-0 pb-4 flex items-center gap-2">
                <LuTarget
                  className="size-[18px] text-sky-600"
                  aria-hidden="true"
                />
                <h4 className="text-sm">Key Insights</h4>
              </CardHeader>
              <CardBody className="p-0">
                <div className="space-y-3">
                  {INSIGHTS_DATA.map((insight, index) => {
                    let color;

                    switch (index) {
                      case 1:
                        color = "sky";
                        break;

                      case 2:
                        color = "yellow";
                        break;

                      default:
                        color = "emerald";
                        break;
                    }

                    return (
                      <div
                        key={index}
                        className={clsx(
                          "p-3 rounded-lg border space-y-1",
                          `bg-${color}-50 border-${color}-200`
                        )}
                      >
                        <h4
                          className={clsx(
                            "text-sm font-medium",
                            `text-${color}-800`
                          )}
                        >
                          {insight.title}
                        </h4>
                        <p className={clsx("text-xs", `text-${color}-700`)}>
                          {insight.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>

            <Card shadow="none" className="border border-primary/15 p-5">
              <CardHeader className="p-0 pb-4 flex items-center gap-2">
                <LuUsers
                  className="size-[18px] text-orange-600"
                  aria-hidden="true"
                />
                <h4 className="text-sm">Recommendations</h4>
              </CardHeader>
              <CardBody className="p-0">
                <div className="space-y-3">
                  {RECOMMENDATIONS_DATA.map((rec, index) => {
                    let color;

                    switch (index) {
                      case 1:
                        color = "sky";
                        break;

                      case 2:
                        color = "yellow";
                        break;

                      default:
                        color = "emerald";
                        break;
                    }

                    return (
                      <div
                        key={index}
                        className={clsx(
                          "pl-4 p-3 rounded-r-lg space-y-1",
                          `border-l-4 border-l-${color}-500 bg-${color}-50`,
                          index === 0 && "border-l-emerald-500",
                          index === 1 && "border-l-sky-500"
                        )}
                      >
                        <h4
                          className={clsx(
                            "text-sm font-medium",
                            `text-${color}-800`
                          )}
                        >
                          {rec.title}
                        </h4>
                        <p className={clsx("text-xs", `text-${color}-700`)}>
                          {rec.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </div>

          <Card shadow="none" className="border border-primary/15 p-5">
            <CardHeader className="p-0 pb-4 flex items-center gap-1.5">
              <LuDollarSign
                className="size-[18px] text-sky-600"
                aria-hidden="true"
              />
              <h4 className="text-sm">
                Q2 2024 Projections Based on Current Performance
              </h4>
            </CardHeader>
            <CardBody className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PROJECTIONS_DATA.map((proj, index) => (
                  <div
                    key={index}
                    className={clsx(
                      "text-center p-4 rounded-xl border hover:shadow-md transition-all duration-300 space-y-1",
                      `bg-gradient-to-br from-${proj.color}-50 to-${proj.color}-100 border-${proj.color}-200`
                    )}
                  >
                    <div
                      className={clsx(
                        "text-xl font-bold",
                        `text-${proj.color}-700`
                      )}
                    >
                      {proj.value}
                    </div>
                    <div
                      className={clsx(
                        "text-xs font-medium",
                        `text-${proj.color}-800`
                      )}
                    >
                      {proj.label}
                    </div>
                    {/* <div
                      className={clsx(
                        "text-xs mt-2 font-medium",
                        `text-${proj.color}-600`
                      )}
                    >
                      {proj.subtext}
                    </div> */}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </ComponentContainer>
  );
};

export default MarketingReport;
