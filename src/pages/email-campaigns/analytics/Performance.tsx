import { Card, CardBody, CardHeader } from "@heroui/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "../../../components/common/ChartTooltip";
import { useTypedSelector } from "../../../hooks/useTypedSelector";

const Performance = () => {
  const { theme } = useTypedSelector((state) => state.ui);
  const PERFORMANCE_METRICS = [
    { month: "Jan", sent: 2400, opens: 1800, clicks: 600, conversions: 120 },
    { month: "Feb", sent: 2800, opens: 2200, clicks: 750, conversions: 150 },
    { month: "Mar", sent: 3200, opens: 2400, clicks: 900, conversions: 180 },
    { month: "Apr", sent: 2900, opens: 2100, clicks: 700, conversions: 140 },
    { month: "May", sent: 3500, opens: 2800, clicks: 1100, conversions: 220 },
    { month: "Jun", sent: 3800, opens: 3000, clicks: 1200, conversions: 240 },
  ];

  return (
    <Card shadow="none" className="bg-background border border-foreground/10 p-5 col-span-2">
      <CardHeader className="p-0 pb-5 md:pb-8">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
          Detailed Performance Metrics
        </h4>
      </CardHeader>
      <CardBody className="p-0 overflow-visible">
        <div className="-ml-5 text-sm">
          <ResponsiveContainer width="100%" aspect={1.85} maxHeight={380}>
            <AreaChart data={PERFORMANCE_METRICS}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={
                  theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#e0e0e0"
                }
              />
              <XAxis
                dataKey="month"
                tick={{
                  fill: theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "#666",
                }}
              />
              <YAxis
                tick={{
                  fill: theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "#666",
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
              <Legend />
              <Area
                type="monotone"
                dataKey="sent"
                stackId="1"
                stroke="#0ea5e9"
                fill="#0ea5e9"
                fillOpacity={0.5}
                name="Sent"
              />
              <Area
                type="monotone"
                dataKey="opens"
                stackId="2"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.5}
                name="Opens"
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stackId="3"
                stroke="#1e40af"
                fill="#1e40af"
                fillOpacity={0.5}
                name="Clicks"
              />
              <Area
                type="monotone"
                dataKey="conversions"
                stackId="4"
                stroke="#0284c7"
                fill="#0284c7"
                fillOpacity={0.5}
                name="Conversions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};

export default Performance;
