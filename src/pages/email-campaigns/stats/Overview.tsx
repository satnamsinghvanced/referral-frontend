import {
  Button,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
} from "@heroui/react";
import { LuChartColumn } from "react-icons/lu";
import {
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
import ChartTooltip from "../../../components/common/ChartTooltip";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { useAnalyticsOverview } from "../../../hooks/useCampaign";
import { LoadingState } from "../../../components/common/LoadingState";
import { AnalyticsFilter } from "../../../types/campaign";
import { useState } from "react";
import CampaignReportModal from "../campaigns/modal/CampaignReportModal";

interface OverviewProps {
  filter: AnalyticsFilter;
}

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  percent: number;
  name: string;
  fill: string;
}

const Overview = ({ filter }: OverviewProps) => {
  const { theme } = useTypedSelector((state) => state.ui);
  const { data: overview, isLoading } = useAnalyticsOverview(filter);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );

  const handleViewDetails = (id: string) => {
    setSelectedCampaignId(id);
    onOpen();
  };

  const COLORS = ["#0ea5e9", "#f97316", "#1e40af", "#8b5cf6", "#ec4899"];

  const renderLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, name, fill } =
      props as LabelProps;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={fill}
        fontSize={13}
        textAnchor={x > cx ? "start" : "end"}
      >
        {`${name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <Card
          shadow="none"
          className="bg-background border border-foreground/10 p-5"
        >
          <CardHeader className="p-0 pb-5">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Performance Trends
            </h4>
          </CardHeader>
          <CardBody className="p-0 overflow-visible">
            <div className="text-sm">
              <ResponsiveContainer width="100%" aspect={1.85} maxHeight={320}>
                <LineChart
                  data={(overview?.performanceTrend || []) as any[]}
                  margin={{ top: 10, right: 10, left: -40, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={
                      theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#f0f0f0"
                    }
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill:
                        theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "#666",
                      fontSize: "12px",
                    }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill:
                        theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "#666",
                      fontSize: "12px",
                    }}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{
                      stroke:
                        theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#ccc",
                      strokeWidth: 2,
                    }}
                  />
                  <Legend wrapperStyle={{ bottom: "-10px" }} />

                  <Line
                    type="monotone"
                    dataKey="sent"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Sent"
                  />

                  <Line
                    type="monotone"
                    dataKey="opens"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Opens"
                  />

                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#1e40af"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Clicks"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
        <Card
          shadow="none"
          className="bg-background border border-foreground/10 p-5"
        >
          <CardHeader className="p-0 pb-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Referral Sources Distribution
            </h4>
          </CardHeader>
          <CardBody className="p-0 overflow-visible">
            <ResponsiveContainer width="100%" maxHeight={320}>
              <PieChart
                style={{
                  aspectRatio: 1,
                  fontSize: "14px",
                }}
              >
                <Pie
                  data={(overview?.audienceBreakdown || []) as any[]}
                  outerRadius={100}
                  innerRadius={0}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  width={400}
                  label={renderLabel}
                >
                  {overview?.audienceBreakdown.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
      <Card
        shadow="none"
        className="bg-background border border-foreground/10 p-4"
      >
        <CardHeader className="p-0 pb-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            Top Performing Campaigns
          </h4>
        </CardHeader>
        <CardBody className="p-0 overflow-visible">
          <div className="space-y-3">
            {overview?.topPerformingCampaigns.map((campaign, index) => {
              return (
                <div
                  key={campaign._id}
                  className="bg-content1 rounded-lg border border-foreground/10 p-3 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5 flex-grow">
                    <div className="bg-sky-100 dark:bg-sky-500/10 w-7 h-7 flex items-center justify-center rounded-full text-xs text-sky-600 dark:text-sky-400">
                      #{index + 1}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">{campaign.name}</h4>
                      <div className="text-xs text-gray-500 dark:text-foreground/60 space-x-3">
                        <span className="text-green-600 dark:text-green-400">
                          {campaign.openRate} opens
                        </span>
                        <span className="text-blue-600 dark:text-blue-400">
                          {campaign.clickRate} clicks
                        </span>
                        <span className="text-gray-600 dark:text-foreground/60">
                          {campaign.conversions} conversions
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    radius="sm"
                    variant="ghost"
                    color="default"
                    startContent={<LuChartColumn className="size-3.5" />}
                    className="border-small"
                    onPress={() =>
                      handleViewDetails(campaign._id || campaign.id)
                    }
                  >
                    View Details
                  </Button>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <CampaignReportModal
        isOpen={isOpen}
        onClose={onClose}
        campaignId={selectedCampaignId}
      />
    </div>
  );
};

export default Overview;
