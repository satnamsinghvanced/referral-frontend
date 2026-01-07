import { Card, CardBody, CardHeader, Progress } from "@heroui/react";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EngagementData {
  segment: string;
  percentage: number;
  value: number; // Value used for the bar chart
}

const ENGAGEMENT_GRAPH: EngagementData[] = [
  { segment: "Dental Practices", percentage: 45, value: 45 },
  { segment: "Patients", percentage: 35, value: 35 },
  { segment: "Referral Partners", percentage: 20, value: 20 },
];

const Audience: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-5">
      <Card shadow="none" className="border border-primary/15 p-5">
        <CardHeader className="p-0 pb-8">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
            Audience Engagement
          </h4>
        </CardHeader>
        <CardBody className="p-0 overflow-visible">
          <div className="space-y-4 text-sm">
            {ENGAGEMENT_GRAPH.map((item) => (
              <div className="space-y-1.5" key={item.segment}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.segment}</span>
                  <span className="text-xs text-gray-600">
                    {item.percentage}%
                  </span>
                </div>
                <Progress
                  size="sm"
                  radius="sm"
                  arai-label={item.segment}
                  value={item.percentage}
                  classNames={{ track: "h-2" }}
                />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
      <Card shadow="none" className="border border-primary/15 p-5">
        <CardHeader className="p-0 pb-8 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
          <h4 className="text-sm font-medium">Engagement by Segment</h4>
        </CardHeader>
        <CardBody className="p-0 overflow-visible">
          <div className="-ml-10 text-sm">
            <ResponsiveContainer width="100%" aspect={1.85} maxHeight={380}>
              <BarChart data={ENGAGEMENT_GRAPH} barCategoryGap="20%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e0e0e0"
                />
                <XAxis
                  dataKey="segment"
                  tickLine={false}
                  axisLine={false}
                  style={{ fill: "#6b7280" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  style={{ fill: "#6b7280" }}
                />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#0ea5e9"
                  radius={[4, 4, 0, 0]}
                  name="Engagement %"
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
