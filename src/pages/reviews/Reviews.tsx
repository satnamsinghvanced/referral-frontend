import { Tab, Tabs } from "@heroui/react";
import { FiMessageSquare, FiStar, FiWifi } from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import LatestReviews from "./LatestReviews";
import Locations from "./Locations";
import NfcAnalytics from "./NfcAnalytics";
import Overview from "./Overview";

const Reviews = () => {
  const HEADING_DATA = {
    heading: "Reviews & Reputation Management",
    subHeading:
      "Monitor reviews, track NFC/QR analytics, and manage your online reputation across all locations.",
  };

  const STATS_CARD_DATA = [
    {
      icon: <FiMessageSquare className="h-full w-full text-sky-500" />,
      heading: "Total Reviews",
      value: "1,248",
      subheading: <p className="text-emerald-600">+18 from last month</p>,
    },
    {
      icon: <FiStar className="h-full w-full text-yellow-500" />,
      heading: "Average Rating",
      value: "4.8",
      subheading: <p className="text-emerald-600">+0.2 from last month</p>,
    },
    {
      icon: <FiWifi className="h-full w-full text-orange-500" />,
      heading: "NFC Interactions",
      value: "342",
      subheading: <p className="text-emerald-600">+23% conversion rate</p>,
    },
    {
      icon: <LuQrCode className="h-full w-full text-blue-500" />,
      heading: "QR Code Scans",
      value: "189",
      subheading: <p className="text-emerald-600">+15% from last month</p>,
    },
  ];

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-4 md:gap-5">
          <div className="grid grid-cols md:grid-cols-3 xl:grid-cols-4 gap-4">
            {STATS_CARD_DATA.map((card, index) => (
              <MiniStatsCard key={index} cardData={card} />
            ))}
          </div>
          <Tabs
            aria-label="Options"
            classNames={{
              tabList:
                "flex w-full rounded-full bg-foreground/5 text-xs bg-foreground/5",
              tab: "flex-1 text-xs font-medium transition-all",
              cursor: "rounded-full text-xs",
              panel: "p-0",
            }}
            className="text-background w-full text-xs"
          >
            <Tab key="overview" title="Overview" className="text-sm">
              <Overview />
            </Tab>

            <Tab key="locations" title="Locations" className="text-sm">
              <Locations />
            </Tab>

            <Tab key="nfc-cards" title="NFC Cards" className="text-sm">
              <NfcAnalytics />
            </Tab>

            <Tab
              key="recent-reviews"
              title="Recent Reviews"
              className="text-sm"
            >
              <LatestReviews />
            </Tab>
          </Tabs>
        </div>
      </ComponentContainer>
    </>
  );
};

export default Reviews;
