import { LuBuilding2, LuFilter } from "react-icons/lu";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import { FiStar, FiTarget, FiUsers } from "react-icons/fi";
import Calender from "../partner-network/Calendar";
import { Button, Input } from "@heroui/react";

const STAT_CARD_DATA = [
  {
    icon: <LuBuilding2 className="text-[17px] mt-1 text-sky-500" />,
    heading: "Total Referrals",
    value: 0,
    subheading: "Click to view all referrals",
  },
  {
    icon: <FiUsers className="text-[17px] mt-1 text-green-500" />,
    heading: "NFC Referrals",
    value: 0,
    subheading: "Click to view NFC referrals",
  },
  {
    icon: <FiStar className="text-[17px] mt-1 text-yellow-500" />,
    heading: "QR Code Referrals",
    value: 0,
    subheading: "Click to view QR referrals",
  },
  {
    icon: <FiTarget className="text-[17px] mt-1 text-green-500" />,
    heading: "Total Value",
    value: 0,
    subheading: "Click to view value details",
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
        <div className="space-y-5">
          <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-4">
            {STAT_CARD_DATA.map((data, i) => (
              <MiniStatsCard key={i} cardData={data} />
            ))}
          </div>
        </div>
        <Calender />
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
      </ComponentContainer>
    </>
  );
};

export default MarketingCalendar;
