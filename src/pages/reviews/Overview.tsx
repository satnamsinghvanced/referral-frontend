import { Card, CardBody } from "@heroui/react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    Pie,
    PieChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const MONTHLY_REVIEW_TRENDS = [
  {
    name: "Aug",
    reviews: 89,
    nfc: 23,
    qr: 12,
  },
  {
    name: "Sep",
    reviews: 95,
    nfc: 31,
    qr: 18,
  },
  {
    name: "Oct",
    reviews: 103,
    nfc: 42,
    qr: 25,
  },
  {
    name: "Nov",
    reviews: 118,
    nfc: 38,
    qr: 21,
  },
  {
    name: "Dec",
    reviews: 134,
    nfc: 45,
    qr: 29,
  },
  {
    name: "Jan",
    reviews: 142,
    nfc: 52,
    qr: 31,
  },
];

const REVIEWS_PLATFORM_DISTRUBUTION = [
  { name: "Facebook", value: 234, fill: "#1e40af" },
  { name: "Google", value: 542, fill: "#0ea5e9" },
  { name: "Healthgrades", value: 174, fill: "#0284c7" },
  { name: "Yelp", value: 298, fill: "#f97316" },
];

const Overview = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 w-full">
        <Card
          className="border border-primary/15  w-full p-4 min-h-80"
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
              data={MONTHLY_REVIEW_TRENDS}
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
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="reviews"
                stroke="#0ea5e9"
                fill="#0ea5e9"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="nfc"
                stroke="#fa8433"
                fill="#fa8433"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="qr"
                stroke="#1e40af"
                fill="#1e40af"
                fillOpacity={0.6}
              />
            </AreaChart>
          </CardBody>
        </Card>
        <Card
          className="border border-primary/15 w-full p-4 min-h-80"
          shadow="none"
        >
          <h6 className="text-sm">Review Platform Distribution</h6>
          <CardBody className="text-xs px-3 pb-0 items-center">
            <PieChart
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "320px",
                aspectRatio: 1,
              }}
              responsive
            >
              <Pie
                data={REVIEWS_PLATFORM_DISTRUBUTION}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius="45%"
                outerRadius="80%"
                label
                isAnimationActive
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
