import { useState, useMemo } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import ComponentContainer from "../../components/common/ComponentContainer";
import Analytics from "./Analytics";
import Overview from "./Overview";
import Platforms from "./Platforms";
import Posts from "./Posts";
import { Tab, Tabs } from "@heroui/react";
import { CreatePostModal } from "./CreatePostModal"; // Import your CreateNewPost component

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

  const PLATFORMS = [
    {
      id: "Facebook",
      stats: [
        { label: "Followers", value: "5000" },
        { label: "Engagement", value: "6.2%" },
        { label: "Posts", value: "45" },
      ],
    },
    {
      id: "Instagram",
      stats: [
        { label: "Followers", value: "7000" },
        { label: "Engagement", value: "8.1%" },
        { label: "Posts", value: "70" },
      ],
    },
    {
      id: "LinkedIn",
      stats: [
        { label: "Connections", value: "2500" },
        { label: "Engagement", value: "5.4%" },
        { label: "Posts", value: "35" },
      ],
    },
  ];

  const recentPerformance = {
    totalReach: "1.5M",
    totalImpressions: "1.2M",
    avgClickRate: "4.2%",
  };
  const contentCalendar = {
    scheduledPosts: 12,
    draftPosts: 5,
    publishedThisMonth: 8,
  };

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="flex flex-col gap-5">
        <Tabs
          aria-label="Options"
          classNames={{
            tabList: "flex w-full rounded-full bg-primary/10 text-xs",
            tab: "flex-1 text-sm font-medium transition-all",
            cursor: "rounded-full text-sm",
            panel: "p-0",
          }}
          className="text-background w-full"
        >
          <Tab key="overview" title="Overview">
            <Overview
              platforms={PLATFORMS}
              recentPerformance={recentPerformance}
              contentCalendar={contentCalendar}
            />
          </Tab>

          <Tab key="posts" title="Posts">
            <Posts />
          </Tab>

          <Tab key="analytics" title="Analytics">
            <Analytics />
          </Tab>

          <Tab key="platform" title="Platform">
            <Platforms />
          </Tab>
        </Tabs>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </ComponentContainer>
  );
}
