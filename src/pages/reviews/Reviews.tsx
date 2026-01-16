import { Tab, Tabs } from "@heroui/react";
import { FiMessageSquare, FiStar, FiWifi } from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import LatestReviews from "./LatestReviews";
import Locations from "./Locations";
import ManageTags from "./ManageTags";
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 justify-between">
            {STATS_CARD_DATA.map((card, index) => (
              <MiniStatsCard key={index} cardData={card} />
            ))}
          </div>
          <div className="space-y-5">
            <Tabs
              aria-label="Options"
              variant="light"
              radius="full"
              classNames={{
                base: "bg-primary/15 dark:bg-background rounded-full p-1 w-full",
                tabList: "flex w-full rounded-full p-0 gap-0",
                tab: "flex-1 h-9 text-sm font-medium transition-all",
                cursor: "rounded-full bg-white dark:bg-primary",
                tabContent:
                  "dark:group-data-[selected=true]:text-primary-foreground text-default-500 dark:text-foreground/60 transition-colors",
                panel: "p-0",
              }}
              className="w-full"
            >
              <Tab key="overview" title="Overview">
                <Overview />
              </Tab>

              <Tab key="manage-tags" title="Manage Tags/QR">
                <ManageTags />
              </Tab>

              <Tab key="locations" title="Locations">
                <Locations />
              </Tab>

              <Tab key="recent-reviews" title="Recent Reviews">
                <LatestReviews />
              </Tab>
            </Tabs>
          </div>
        </div>
      </ComponentContainer>
    </>
  );
};

export default Reviews;
