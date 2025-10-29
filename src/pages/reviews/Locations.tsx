import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { GrLocation } from "react-icons/gr";
import ReviewsLocationCard from "./LocationCard";

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
    <div className="flex flex-col gap-6 bg-background  border border-primary/15  rounded-xl p-5">
      <h4 className="flex items-center">
        <GrLocation className="text-primary size-[18px] mr-2" />
        Review Performance by Location
      </h4>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <ReviewsLocationCard locations={LOCATIONS} />
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
          <Tooltip isAnimationActive />
          <Legend wrapperStyle={{ bottom: "-2px" }} />
          <Bar
            dataKey="reviews"
            barSize={60}
            fill="#f97316"
            isAnimationActive
          />
          <Bar
            dataKey="nfcTaps"
            barSize={60}
            fill="#1e40af"
            isAnimationActive
          />
          <Bar
            dataKey="qrScans"
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
