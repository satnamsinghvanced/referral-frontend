import { FiMessageSquare, FiStar, FiWifi } from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";
import ComponentContainer from "../../components/common/ComponentContainer";
import ReviewStatsCard from "./ReviewStatsCard";
import ReviewToggle from "./Toggle";

const Reviews = () => {
  const HEADING_DATA = {
    heading: "Reviews & Reputation Management",
    subHeading:
      "Monitor reviews, track NFC/QR analytics, and manage your online reputation across all locations.",
  };

  const StatCardData = [
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
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols md:grid-cols-3 xl:grid-cols-4 gap-4">
            {StatCardData.map((card, index) => (
              <ReviewStatsCard
                key={index}
                cardHeading={card.heading}
                cardStat={card.value}
                subheading={card.subheading}
                cardIcon={card.icon}
              />
            ))}
          </div>
          <ReviewToggle />
        </div>
      </ComponentContainer>
    </>
  );
};

export default Reviews;
