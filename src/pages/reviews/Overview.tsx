import { Card, CardBody } from "@heroui/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGBPOverview } from "../../hooks/useReviews";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-xl">
        {label && (
          <p className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-xs">
            {label}
          </p>
        )}
        <div className="flex flex-col gap-1">
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-2">
                {/* <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color || entry.fill }}
                /> */}
                <span className="text-gray-600 dark:text-gray-400 capitalize">
                  {entry.name}:
                </span>
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const Overview = () => {
  const { data, isLoading } = useGBPOverview();

  const monthlyStats = data?.monthlyStats || [];

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading chart data...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Card
          className="border border-foreground/10 bg-background w-full p-4"
          shadow="none"
        >
          <h6 className="text-sm">Monthly Review Trends</h6>
          <CardBody className="text-xs px-3 pb-0 overflow-hidden">
            <AreaChart
              style={{
                width: "100%",
                // maxWidth: "700px",
                maxHeight: "350px",
                aspectRatio: 1.618,
              }}
              responsive
              data={monthlyStats}
              margin={{
                top: 20,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis width="auto" />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Legend />
              <Area
                type="monotone"
                dataKey="reviews"
                stroke="#0ea5e9"
                fill="#0ea5e9"
                fillOpacity={0.6}
                name="Reviews"
              />
              <Area
                type="monotone"
                dataKey="nfc"
                stroke="#fa8433"
                fill="#fa8433"
                fillOpacity={0.6}
                name="NFC"
              />
              <Area
                type="monotone"
                dataKey="qr"
                stroke="#1e40af"
                fill="#1e40af"
                fillOpacity={0.6}
                name="QR"
              />
            </AreaChart>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
