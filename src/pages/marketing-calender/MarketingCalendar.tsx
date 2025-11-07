import {
  LuBuilding2,
  LuCalendar,
  LuFilter,
  LuTarget,
  LuTrophy,
  LuUserPlus,
} from "react-icons/lu";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import { FiShare2, FiStar, FiTarget, FiUsers } from "react-icons/fi";
import Calender from "../partner-network/Calendar";
import { Button, Input } from "@heroui/react";
import { RiMegaphoneLine } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { TbWaveSawTool } from "react-icons/tb";

const STAT_CARD_DATA = [
  {
    icon: <RiMegaphoneLine className="text-[17px] mt-1 text-sky-600" />,
    heading: "Active Campaigns",
    value: 15,
    subheading: "+3 this week",
  },
  {
    icon: <FiShare2 className="text-[17px] mt-1 text-blue-600" />,
    heading: "Scheduled Posts",
    value: 42,
    subheading: "Next 30 days",
  },
  {
    icon: <LuUserPlus className="text-[17px] mt-1 text-purple-600" />,
    heading: "Referral Activities",
    value: 8,
    subheading: "This month",
  },
  {
    icon: <LuTarget className="text-[17px] mt-1 text-emerald-600" />,
    heading: "Monthly ROI",
    value: "284%",
    subheading: "+12% vs last month",
  },
  {
    icon: (
      <MdOutlineRemoveRedEye className="text-[17px] mt-1 text-orange-600" />
    ),
    heading: "Total Reach",
    value: "67,400",
    subheading: "This month",
  },
  {
    icon: <LuTrophy className="text-[17px] mt-1 text-green-500" />,
    heading: "Conversions",
    value: 1247,
    subheading: "+24% this month",
  },
];

const MarketingCalendar = () => {
  const headingData = {
    heading: "Marketing Calendar",
    subHeading:
      "Plan social media, events, office visits, and marketing campaigns",
  };

  return (
    <>
      <ComponentContainer headingData={headingData}>
        <div className="flex flex-col gap-5">
          <div className="space-y-5">
            <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-4">
              {STAT_CARD_DATA.map((data, i) => (
                <MiniStatsCard key={i} cardData={data} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-start-1 col-end-4">
              <Calender />
            </div>
            <div className="space-y-5">
              <div className="bg-background p-4 border border-primary/15 rounded-xl">
                <h4 className="text-base font-medium flex items-center gap-2">
                  <TbWaveSawTool className="text-primary text-xl" />
                  Select Date
                </h4>
                <div className="flex flex-col gap-3 items-center justify-center min-h-[100px]">
                  <LuCalendar className="text-4xl text-gray-300" />
                  <p className="text-xs text-gray-600">
                    Click on a date to view activities
                  </p>
                </div>
              </div>
              <div className="bg-background p-4 border border-primary/15 rounded-xl">
                123456
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full rounded-md py-4">
            <Input
              size="sm"
              variant="flat"
              placeholder="Search..."
              // value={overviewSearchKeyword}
              // onValueChange={handleOverviewSearchChange}
              className="text-xs flex-1 min-w-fit"
            />

            <Button
              size="sm"
              variant="bordered"
              className="text-xs ml-auto min-w-[100px] border-small border-primary/15 hover:bg-orange-200 hover:text-orange-500 transition-colors"
              // onPress={handleViewAllAndFilter}
            >
              <LuFilter />
              All Activity
            </Button>
          </div>
        </div>
      </ComponentContainer>
    </>
  );
};

export default MarketingCalendar;
