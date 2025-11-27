import {
  LuCalculator,
  LuChartColumn,
  LuDollarSign,
  LuTarget,
} from "react-icons/lu";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import { IoMdTrendingUp } from "react-icons/io";
import { Card, CardBody, CardHeader } from "@heroui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FiPieChart } from "react-icons/fi";
import YearlyBudgetItems from "./YearlyBudget";

const MarketingBudget = () => {
  const HEADING_DATA = {
    heading: "Marketing Budget",
    subHeading: "Manage and track your marketing spend across all channels.",
  };

  const STAT_CARD_DATA = [
    {
      icon: <LuTarget className="text-[17px] mt-1 text-blue-600" />,
      heading: "Total Budget",
      value: "$9,000",
    },
    {
      icon: <LuDollarSign className="text-[17px] mt-1 text-green-600" />,
      heading: "Total Spent",
      value: "$5,885",
      // subheading: <p>65.4% of budget</p>,
    },
    {
      icon: <LuCalculator className="text-[17px] mt-1 text-yellow-600" />,
      heading: "Remaining Budget",
      value: "$3,115",
      // subheading: <p>34.6% remaining</p>,
    },
    {
      icon: <IoMdTrendingUp className="text-[17px] mt-1 text-purple-600" />,
      heading: "Average ROI",
      value: "123%",
      // subheading: <p>Needs improvement</p>,
    },
  ];

  const TREND_GRAPH_DATA = [
    {
      name: "Jan",
      budget: 456,
      spent: 142,
    },
    {
      name: "Feb",
      budget: 338,
      spent: 98,
    },
    {
      name: "Mar",
      budget: 289,
      spent: 67,
    },
    {
      name: "Apr",
      budget: 165,
      spent: 35,
    },
    {
      name: "May",
      budget: 165,
      spent: 35,
    },
    {
      name: "Jun",
      budget: 165,
      spent: 35,
    },
    {
      name: "Jul",
      budget: 165,
      spent: 35,
    },
    {
      name: "Aug",
      budget: 165,
      spent: 35,
    },
    {
      name: "Sep",
      budget: 165,
      spent: 35,
    },
    {
      name: "Oct",
      budget: 165,
      spent: 35,
    },
    {
      name: "Nov",
      budget: 165,
      spent: 35,
    },
    {
      name: "Dec",
      budget: 165,
      spent: 35,
    },
  ];

  const BUDGET_BY_CATEGORY_GRAPH = [
    { name: "Digital Advertising", value: 5000, fill: "#3b82f6" },
    { name: "Social Media Marketing", value: 2500, fill: "#8b5cf6" },
  ];

  const PieChartCustomLabel = (props: any) => {
    const { value, name } = props;
    console.log(props);

    if (value === 0) {
      return null;
    }

    return `${name}: $${value}`;
  };

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="flex flex-col gap-5">
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {STAT_CARD_DATA.map((data, i) => (
              <MiniStatsCard key={i} cardData={data} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Card
            shadow="none"
            radius="lg"
            className="p-0 border border-primary/15"
          >
            <CardHeader className="p-5">
              <h4 className="flex items-center gap-2 text-sm">
                <LuChartColumn /> Spending vs Budget Trend
              </h4>
            </CardHeader>
            <CardBody className="p-5 pt-0">
              <div className="my-1">
                <BarChart
                  style={{
                    width: "100%",
                    // maxWidth: "300px",
                    maxHeight: "400px",
                    aspectRatio: 1.618,
                    outline: "none",
                    overflow: "hidden",
                    fontSize: "14px",
                  }}
                  responsive
                  data={TREND_GRAPH_DATA}
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
                  <Legend
                    wrapperStyle={{
                      bottom: "-2px",
                      textTransform: "capitalize",
                    }}
                  />
                  <Bar
                    dataKey="budget"
                    barSize={30}
                    fill="#e5e7eb"
                    isAnimationActive
                  />
                  <Bar
                    dataKey="spent"
                    barSize={30}
                    fill="#3b82f6"
                    isAnimationActive
                  />
                </BarChart>
              </div>
            </CardBody>
          </Card>
          <Card
            shadow="none"
            radius="lg"
            className="p-0 border border-primary/15"
          >
            <CardHeader className="p-5">
              <h4 className="flex items-center gap-2 text-sm">
                <FiPieChart /> Budget by Category
              </h4>
            </CardHeader>
            <CardBody className="text-xs px-3 pb-0 items-center">
              <PieChart
                style={{
                  width: "100%",
                  height: "100%",
                  // maxWidth: "320px",
                  maxHeight: "340px",
                  aspectRatio: 1,
                  display: "flex",
                  flexDirection: "column-reverse",
                  gap: "20px",
                }}
                responsive
              >
                <Pie
                  data={BUDGET_BY_CATEGORY_GRAPH}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius="100%"
                  isAnimationActive
                  label={PieChartCustomLabel}
                />
                <Tooltip />
                {/* <Legend wrapperStyle={{ position: "static" }} /> */}
              </PieChart>
            </CardBody>
          </Card>
        </div>
        {/*  Yearly List  */}
        <YearlyBudgetItems />
      </div>
    </ComponentContainer>
  );
};

export default MarketingBudget;
