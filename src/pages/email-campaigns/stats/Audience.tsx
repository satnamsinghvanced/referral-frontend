import { Card, CardBody, CardHeader, Progress } from "@heroui/react";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "../../../components/common/ChartTooltip";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { useAnalyticsAudience } from "../../../hooks/useCampaign";
import { LoadingState } from "../../../components/common/LoadingState";
import { AnalyticsFilter } from "../../../types/campaign";

interface AudienceProps {
  filter: AnalyticsFilter;
}

const Audience: React.FC<AudienceProps> = ({ filter }) => {
  const { theme } = useTypedSelector((state) => state.ui);
  const { data: audienceData, isLoading } = useAnalyticsAudience(filter);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingState />
      </div>
    );
  }

  const engagementData = audienceData?.audienceEngagement || [];

  return (
    <div className="grid grid-cols-2 gap-5">
      <Card
        shadow="none"
        className="bg-background border border-foreground/10 p-5"
      >
        <CardHeader className="p-0 pb-5 md:pb-8">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            Audience Engagement
          </h4>
        </CardHeader>
        <CardBody className="p-0 overflow-visible">
          <div className="space-y-4 text-sm">
            {engagementData.map((item) => (
              <div className="space-y-1.5" key={item.label}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-gray-600 dark:text-foreground/60">
                    {item.percentage}%
                  </span>
                </div>
                <Progress
                  size="sm"
                  radius="sm"
                  aria-label={item.label}
                  value={item.percentage || 0}
                  classNames={{ track: "h-2" }}
                />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
      <Card
        shadow="none"
        className="bg-background border border-foreground/10 p-5"
      >
        <CardHeader className="p-0 pb-5 md:pb-8 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
          <h4 className="text-sm font-medium">Engagement by Segment</h4>
        </CardHeader>
        <CardBody className="p-0 overflow-visible">
          <div className="-ml-10 text-sm">
            <ResponsiveContainer width="100%" aspect={1.85} maxHeight={380}>
              <BarChart data={engagementData as any[]} barCategoryGap="20%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={
                    theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#e0e0e0"
                  }
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill:
                      theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "#666",
                  }}
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill:
                      theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "#666",
                  }}
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{
                    fill:
                      theme === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(128, 128, 128, 0.1)",
                  }}
                />
                <Bar
                  dataKey="percentage"
                  fill="#0ea5e9"
                  radius={[4, 4, 0, 0]}
                  name="Engagement"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Audience;
