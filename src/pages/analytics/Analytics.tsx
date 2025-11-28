import React from "react";
import ComponentContainer from "../../components/common/ComponentContainer";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import { LuTrendingUp, LuUsers, LuTarget, LuCalendar } from "react-icons/lu";
import { MdBarChart } from "react-icons/md";
import GoogleAnalytics from "./GoogleAnalytics";

const Analytics: React.FC = () => {
  const HEADING_DATA = {
    heading: "Analytics Dashboard",
    subHeading:
      "Track your practice performance and referral trends with detailed insights.",
  };

  const STAT_CARD_DATA = [
    {
      icon: <LuUsers className="text-[20px] mt-1 text-blue-500" />,
      heading: "Monthly Referrals",
      value: "247",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          +12% from last month
        </span>
      ),
      subValueClass: "text-green-600",
    },
    {
      icon: <LuTarget className="text-[20px] mt-1 text-orange-500" />,
      heading: "Conversion Rate",
      value: "86.3%",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          +3.2% from last month
        </span>
      ),
    },
    {
      icon: <LuCalendar className="text-[20px] mt-1 text-blue-500" />,
      heading: "Appointments",
      value: "189",
      subheading: (
        <span className="text-green-600 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          +8% from last month
        </span>
      ),
    },
    {
      icon: <MdBarChart className="text-[20px] mt-1 text-green-500" />,
      heading: "Revenue Growth",
      value: "+15%",
      subheading: (
        <span className="text-green-700 flex items-center">
          <LuTrendingUp className="h-4 w-4 mr-1 text-green-700" />
          Monthly revenue increase
        </span>
      ),
    },
  ];

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className=" ">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAT_CARD_DATA.map((data, i) => (
            <MiniStatsCard key={i} cardData={data} />
          ))}
        </div>
        <div>
          <GoogleAnalytics />
        </div>
      </div>
    </ComponentContainer>
  );
};

export default Analytics;
