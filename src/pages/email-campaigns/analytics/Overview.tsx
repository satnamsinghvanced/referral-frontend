import { Card, CardBody, CardHeader } from "@heroui/react";
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

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  percent: number;
  name: string;
  fill: string;
}

const Overview = () => {
  const PERFORMANCE_TRENDS_GRAPH = [
    { month: "Jan", sent: 2400, opens: 1800, clicks: 600 },
    { month: "Feb", sent: 2800, opens: 2200, clicks: 750 },
    { month: "Mar", sent: 3200, opens: 2400, clicks: 900 },
    { month: "Apr", sent: 2900, opens: 2100, clicks: 700 },
    { month: "May", sent: 3500, opens: 2800, clicks: 1100 },
    { month: "Jun", sent: 3800, opens: 3000, clicks: 1200 },
  ];

  const AUDIENCE_BREAKDOWN = [
    { name: "Dental Practices", value: 45 },
    { name: "Patients", value: 35 },
    { name: "Referral Partners", value: 20 },
  ];

  const COLORS = ["#0ea5e9", "#f97316", "#1e40af"];

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

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <Card shadow="none" className="border border-primary/15 p-5">
          <CardHeader className="p-0 pb-8">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Performance Trends
            </h4>
          </CardHeader>
          <CardBody className="p-0 overflow-visible">
            <div className="-ml-5 text-sm">
              <ResponsiveContainer width="100%" aspect={1.85} maxHeight={320}>
                <LineChart data={PERFORMANCE_TRENDS_GRAPH}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

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
        <Card shadow="none" className="border border-primary/15 p-5">
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
                  data={AUDIENCE_BREAKDOWN}
                  outerRadius={100}
                  innerRadius={0}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  width={400}
                  label={renderLabel}
                >
                  {AUDIENCE_BREAKDOWN.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
