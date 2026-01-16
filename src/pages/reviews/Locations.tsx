import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardBody } from "@heroui/react";
import { FiWifi } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { LuQrCode } from "react-icons/lu";
import { PiStarFill } from "react-icons/pi";

const LOCATIONS = [
  {
    location: "Tulsa",
    totalReviews: 287,
    averageRating: 4.8,
    nfcTaps: 142,
    qrScans: 78,
  },
  {
    location: "Oklahoma City",
    totalReviews: 150,
    averageRating: 4.5,
    nfcTaps: 110,
    qrScans: 65,
  },
  {
    location: "Norman",
    totalReviews: 120,
    averageRating: 3.9,
    nfcTaps: 80,
    qrScans: 45,
  },
  {
    location: "Edmond",
    totalReviews: 98,
    averageRating: 4.2,
    nfcTaps: 67,
    qrScans: 52,
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-xl">
        <p className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-xs">
          {label}
        </p>
        <div className="flex flex-col gap-1">
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                <span className="text-gray-600 dark:text-gray-400">
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

const LOCATIONS_GRAPH_DATA = [
  {
    name: "Downtown Office",
    reviews: 456,
    nfcTaps: 142,
    qrScans: 78,
  },
  {
    name: "Westside Clinic",
    reviews: 338,
    nfcTaps: 98,
    qrScans: 56,
  },
  {
    name: "Medical Center",
    reviews: 289,
    nfcTaps: 67,
    qrScans: 34,
  },
  {
    name: "Northgate Branch",
    reviews: 165,
    nfcTaps: 35,
    qrScans: 21,
  },
];

const Locations = () => {
  return (
    <div className="flex flex-col gap-4 border border-foreground/10 rounded-xl p-4 bg-background w-full">
      <h4 className="flex items-center">
        <GrLocation className="text-primary size-[18px] mr-2" />
        Review Performance by Location
      </h4>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {LOCATIONS.map((location, index) => (
          <Card
            key={index}
            className="border border-foreground/10 bg-primary/2 dark:bg-content1 p-4 rounded-lg"
            shadow="none"
          >
            <div className="flex justify-between">
              <h6 className="text-sm flex gap-2 items-center">
                {location.location}
              </h6>
              <div className="flex items-center gap-1">
                <PiStarFill className="inline h-4 w-4 text-yellow-400" />
                <div>{location.averageRating}</div>
              </div>
            </div>
            <CardBody className="text-xs flex flex-col gap-3 px-0 pt-5 pb-0">
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col gap-0 items-center w-full">
                  <p className="text-xl font-bold text-primary-600">
                    {location.totalReviews}
                  </p>
                  <p className="text-xs text-foreground/60">Total Reviews</p>
                </div>
                <div className="text-sm flex flex-col gap-0 items-center w-full">
                  <p className="text-xl font-bold text-orange-700">
                    {location.totalReviews}
                  </p>
                  <p className="text-xs text-foreground/60">
                    Digital Interactions
                  </p>
                </div>
              </div>

              <ul className="flex flex-col gap-2 text-xs font-extralight mt-3 text-foreground/80">
                <li className="flex justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FiWifi className="text-sm text-primary-600" /> NFC Taps
                  </div>
                  <div className="font-semibold">{location.nfcTaps}</div>
                </li>
                <li className="flex justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <LuQrCode className="text-sm text-orange-700" /> QR Scans
                  </div>
                  <div className="font-semibold">{location.qrScans}</div>
                </li>
              </ul>
            </CardBody>
          </Card>
        ))}
      </div>
      <div className="my-1">
        <BarChart
          style={{
            width: "100%",
            // maxWidth: "300px",
            maxHeight: "400px",
            aspectRatio: 1.618,
            outline: "none",
          }}
          responsive
          data={LOCATIONS_GRAPH_DATA}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tickMargin={8} />
          <YAxis width="auto" tickMargin={8} />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(128, 128, 128, 0.1)" }}
            isAnimationActive
          />
          <Legend wrapperStyle={{ bottom: "-2px" }} />
          <Bar
            dataKey="reviews"
            name="Reviews"
            barSize={60}
            fill="#f97316"
            isAnimationActive
          />
          <Bar
            dataKey="nfcTaps"
            name="NFC Taps"
            barSize={60}
            fill="#1e40af"
            isAnimationActive
          />
          <Bar
            dataKey="qrScans"
            name="QR Scans"
            barSize={60}
            fill="#0ea5e9"
            isAnimationActive
          />
        </BarChart>
      </div>
    </div>
  );
};

export default Locations;
