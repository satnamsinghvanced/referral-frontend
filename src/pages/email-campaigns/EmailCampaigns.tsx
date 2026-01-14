import { Tab, Tabs } from "@heroui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaRegEnvelope } from "react-icons/fa";
import { FiPlay, FiSettings } from "react-icons/fi";
import { IoMdTrendingUp } from "react-icons/io";
import { LuEye, LuMousePointer, LuSend } from "react-icons/lu";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import Analytics from "./analytics/Analytics";
import Audiences from "./Audiences";
import Automation from "./automation/Automation";
import Campaigns from "./Campaigns";
import Overview from "./Overview";
import Templates from "./Templates";
import { useState } from "react";
import CampaignActionModal from "./modal/CampaignActionModal";

const EmailCampaigns = () => {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const HEADING_DATA = {
    heading: "Email Campaigns",
    subHeading: "Create and manage email campaigns for your referral network.",
    buttons: [
      {
        label: "New Campaign",
        onClick: () => setIsActionModalOpen(true),
        icon: <AiOutlinePlus fontSize={15} />,
        variant: "solid" as const,
        color: "primary" as const,
      },
    ],
  };

  const STAT_CARD_DATA = [
    {
      icon: <FaRegEnvelope className="text-blue-500" />,
      heading: "Total Campaigns",
      value: 4,
      subheading: "All time",
    },
    {
      icon: <FiPlay className="text-green-500" />,
      heading: "Active",
      value: 2,
      subheading: "Running now",
    },
    {
      icon: <LuSend className="text-purple-500" />,
      heading: "Total Sent",
      value: "1,137",
      subheading: "Emails delivered",
    },
    {
      icon: <LuEye className="text-yellow-500" />,
      heading: "Avg Open Rate",
      value: "75.3%",
      subheading: "Industry avg: 22%",
    },
    {
      icon: <LuMousePointer className="text-orange-500" />,
      heading: "Avg Click Rate",
      value: "28.0%",
      subheading: "Industry avg: 3.5%",
    },
    {
      icon: <IoMdTrendingUp className="text-emerald-500" />,
      heading: "Conversions",
      value: 57,
      subheading: "Total referrals",
    },
  ];

  return (
    <>
      <ComponentContainer headingData={HEADING_DATA}>
        <div className="flex flex-col gap-4 md:gap-5">
          <div className="grid md:grid-cols-2 xl:grid-cols-6 gap-4">
            {STAT_CARD_DATA.map((data, i) => (
              <MiniStatsCard key={i} cardData={data} />
            ))}
          </div>
          <Tabs
            aria-label="Options"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            classNames={{
              tabList: "flex w-full rounded-full bg-primary/10 text-xs",
              tab: "flex-1 text-sm font-medium transition-all",
              cursor: "rounded-full text-xs",
              panel: "p-0",
            }}
            className="text-background w-full text-xs"
          >
            <Tab key="overview" title="Overview">
              <Overview
                setIsActionModalOpen={setIsActionModalOpen}
                setActiveTab={setActiveTab}
              />
            </Tab>

            <Tab key="campaigns" title="Campaigns">
              <Campaigns />
            </Tab>

            <Tab key="automation" title="Automation">
              <Automation />
            </Tab>

            <Tab key="templates" title="Templates">
              <Templates />
            </Tab>
            <Tab key="audiences" title="Audiences">
              <Audiences />
            </Tab>
            <Tab key="analytics" title="Analytics">
              <Analytics />
            </Tab>
          </Tabs>
        </div>
      </ComponentContainer>

      <CampaignActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onSubmit={() => {}}
      />
    </>
  );
};

export default EmailCampaigns;
