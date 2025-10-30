import { FiMessageSquare, FiSettings, FiStar, FiWifi } from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";
import ComponentContainer from "../../components/common/ComponentContainer";
import ReviewStatsCard from "./ReviewStatsCard";
import ReviewToggle from "./Toggle";
import { useState } from "react";
import GoogleApiConfigurationModal from "../call-tracking/GoogleApiConfigurationModal";
import { useTypedSelector } from "../../hooks/useTypedSelector";

const Reviews = () => {
  const [isGoogleSettingsModalOpen, setIsGoogleSettingsModalOpen] =
    useState(false);
  const { user } = useTypedSelector((state) => state.auth);
  const userId = user?.userId;

  const headingData = {
    heading: "Reviews & Reputation Management",
    subHeading:
      "Monitor reviews, track NFC/QR analytics, and manage your online reputation across all locations.",
    buttons: [
      {
        label: "Google Settings",
        onClick: () => setIsGoogleSettingsModalOpen(true),
        icon: <FiSettings fontSize={15} />,
        variant: "bordered",
        color: "default",
        className: "border-small",
      },
    ],
  };

  const StatCardData = [
    {
      icon: <FiMessageSquare className="h-full w-full text-sky-500" />,
      heading: "Total Reviews",
      value: "1,248",
      subheading: <p className="text-green-700">+18 from last month</p>,
    },
    {
      icon: <FiStar className="h-full w-full text-yellow-500" />,
      heading: "Average Rating",
      value: "4.8",
      subheading: <p className="text-green-700">+0.2 from last month</p>,
    },
    {
      icon: <FiWifi className="h-full w-full text-orange-500" />,
      heading: "NFC Interactions",
      value: "342",
      subheading: <p className="text-green-700">+23% conversion rate</p>,
    },
    {
      icon: <LuQrCode className="h-full w-full text-blue-500" />,
      heading: "QR Code Scans",
      value: "189",
      subheading: <p className="text-green-700">+15% from last month</p>,
    },
  ];

  return (
    <>
      <ComponentContainer headingData={headingData}>
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
      <GoogleApiConfigurationModal
        userId={userId as string}
        isOpen={isGoogleSettingsModalOpen}
        onClose={() => setIsGoogleSettingsModalOpen(false)}
      />
    </>
  );
};

export default Reviews;
