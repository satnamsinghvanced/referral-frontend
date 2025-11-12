import { useState, useMemo } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import ComponentContainer from "../../components/common/ComponentContainer";
import Analytics from "./Analytics";
import Overview from "./Overview";
import Platforms from "./Platforms";
import Posts from "./Posts";
import { Tab, Tabs } from "@heroui/react";
import CreateNewPost from "./CreateNewPost"; // Import your CreateNewPost component

export default function SocialMedia() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  // Heading Data with button
  const HEADING_DATA = useMemo(
    () => ({
      heading: "Social Media",
      subHeading: "Manage your social media presence and engagement.",
      buttons: [
        {
          label: "Create Post",
          onClick: () => setIsModalOpen(true), // Open modal on click
          icon: <AiOutlinePlus fontSize={15} />,
          variant: "solid" as const,
          color: "primary" as const,
        },
      ],
    }),
    []
  );

  // Sample data for Overview component
  const topCards = [
    { title: "Total Followers", value: "3.5k", subtitle: "Followers on all platforms", icon: "👥" },
    { title: "Total Posts", value: "150", subtitle: "Total posts across platforms", icon: "📈" },
    { title: "Total Impressions", value: "1.2M", subtitle: "Total impressions this month", icon: "👁️" },
    { title: "Engagement Rate", value: "8.5%", subtitle: "Overall engagement rate", icon: "💬" },
  ];

  const platforms = [
    { name: "Facebook", followers: "5000", connections: "3000", engagement: "6.2%", posts: "45" },
    { name: "Instagram", followers: "7000", connections: "3500", engagement: "8.1%", posts: "70" },
    { name: "LinkedIn", followers: "4000", connections: "2500", engagement: "5.4%", posts: "35" },
  ];

  const recentPerformance = { totalReach: "1.5M", totalImpressions: "1.2M", avgClickRate: "4.2%" };
  const contentCalendar = { scheduledPosts: 12, draftPosts: 5, publishedThisMonth: 8 };

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      {/* Tabs */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key)}
        classNames={{
          tabList: "flex w-full rounded-full bg-sky-50 text-xs mb-4",
          tab: "flex-1 text-xs font-medium transition-all",
          cursor: "rounded-full text-xs",
          panel: "p-0",
        }}
        className="text-background w-full text-xs"
      >
        <Tab key="Overview" title="Overview">
          <Overview
            topCards={topCards}
            platforms={platforms}
            recentPerformance={recentPerformance}
            contentCalendar={contentCalendar}
          />
        </Tab>

        <Tab key="Posts" title="Posts">
          <Posts />
        </Tab>

        <Tab key="Analytics" title="Analytics">
          <Analytics />
        </Tab>

        <Tab key="Platform" title="Platform">
          <Platforms />
        </Tab>
      </Tabs>

      {/* Modal for Create New Post */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-start pt-20">
          <CreateNewPost setIsModalOpen={setIsModalOpen} />
        </div>
      )}
    </ComponentContainer>
  );
}
