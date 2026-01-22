import { Tab, Tabs } from "@heroui/react";
import { useMemo, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import ComponentContainer from "../../components/common/ComponentContainer";
import { LoadingState } from "../../components/common/LoadingState";
import { useSocialOverview } from "../../hooks/useSocial";
import Analytics from "./Analytics";
import { CreatePostModal } from "./modal/CreatePostModal";
import Overview from "./Overview";
import Platforms from "./Platforms";
import Posts from "./Posts";

export default function SocialMedia() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { data, isLoading } = useSocialOverview();

  const isAnyPlatformConnected = useMemo(() => {
    if (!data?.platformPerformance) return false;
    return Object.values(data.platformPerformance).some((p) => p.connected);
  }, [data]);

  const HEADING_DATA = useMemo(
    () => ({
      heading: "Social Media",
      subHeading: "Manage your social media presence and engagement.",
      buttons: isAnyPlatformConnected
        ? [
            {
              label: "Create Post",
              onClick: () => setIsModalOpen(true),
              icon: <AiOutlinePlus fontSize={15} />,
              variant: "solid" as const,
              color: "primary" as const,
            },
          ]
        : [],
    }),
    [isAnyPlatformConnected],
  );

  const platformsData = useMemo(() => {
    if (!data?.platformPerformance) return [];
    const pp = data.platformPerformance;
    const items = [];

    if (pp.facebook?.connected) {
      items.push({
        id: "Facebook",
        stats: [
          {
            label: "Followers",
            value: pp.facebook.followers?.toString() || "0",
          },
          {
            label: "Engagement",
            value: pp.facebook.engagement?.toString() + "%" || "0%",
          },
          { label: "Posts", value: pp.facebook.posts?.toString() || "0" },
        ],
      });
    }

    if (pp.instagram?.connected) {
      items.push({
        id: "Instagram",
        stats: [
          {
            label: "Followers",
            value: pp.instagram.followers?.toString() || "0",
          },
          {
            label: "Engagement",
            value: pp.instagram.engagement?.toString() + "%" || "0%",
          },
          { label: "Posts", value: pp.instagram.posts?.toString() || "0" },
        ],
      });
    }

    if (pp.linkedin?.connected) {
      items.push({
        id: "LinkedIn",
        stats: [
          {
            label: "Followers",
            value: pp.linkedin.followers?.toString() || "0",
          },
          {
            label: "Engagement",
            value: pp.linkedin.engagement?.toString() + "%" || "0%",
          },
          { label: "Posts", value: pp.linkedin.posts?.toString() || "0" },
        ],
      });
    }

    if (pp.youtube?.connected) {
      items.push({
        id: "YouTube",
        stats: [
          {
            label: "Followers",
            value: pp.youtube.followers?.toString() || "0",
          },
          {
            label: "Engagement",
            value: pp.youtube.engagement?.toString() + "%" || "0%",
          },
          { label: "Posts", value: pp.youtube.posts?.toString() || "0" },
        ],
      });
    }

    return items;
  }, [data]);

  const recentPerformance = useMemo(() => {
    return {
      totalReach: data?.recentPerformance?.totalReach?.toLocaleString() || "0",
      totalImpressions:
        data?.recentPerformance?.totalImpressions?.toLocaleString() || "0",
      avgClickRate: data?.recentPerformance?.avgClickRate || "0%",
    };
  }, [data]);

  const contentCalendar = useMemo(() => {
    return {
      scheduledPosts: data?.contentCalender?.scheduledPosts || 0,
      draftPosts: 0, // Not provided by the current API response example
      publishedThisMonth: data?.contentCalender?.publishedPosts || 0,
    };
  }, [data]);

  const overviewStats = useMemo(() => {
    return {
      totalFollowers: data?.overview?.totalFollowers || 0,
      totalEngagement: data?.overview?.totalEngagement
        ? `${data.overview.totalEngagement}%`
        : "0%",
      totalLikes: data?.overview?.totalLikes || 0,
      totalComments: data?.overview?.totalComments || 0,
    };
  }, [data]);

  const renderConnectionWarning = () => (
    <div className="flex flex-col items-center justify-center p-10 bg-background border border-foreground/10 rounded-xl space-y-4">
      <div className="text-4xl text-warning">⚠️</div>
      <div className="text-center space-y-2">
        <h3 className="text-md font-medium">No Platforms Integrated</h3>
        <p className="text-sm text-gray-600 dark:text-foreground/60">
          Please integrate at least one social media platform to view statistics
          and start posting.
        </p>
      </div>
    </div>
  );

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="flex flex-col gap-4 md:gap-5">
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
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
          >
            <Tab key="overview" title="Overview">
              {isLoading ? (
                <div className="min-h-[250px] flex items-center justify-center">
                  <LoadingState />
                </div>
              ) : !isAnyPlatformConnected ? (
                renderConnectionWarning()
              ) : (
                <Overview
                  platforms={platformsData}
                  recentPerformance={recentPerformance}
                  contentCalendar={contentCalendar}
                  stats={overviewStats}
                />
              )}
            </Tab>

            <Tab key="posts" title="Posts">
              {!isLoading && !isAnyPlatformConnected ? (
                renderConnectionWarning()
              ) : (
                <Posts />
              )}
            </Tab>

            <Tab key="analytics" title="Analytics">
              {!isLoading && !isAnyPlatformConnected ? (
                renderConnectionWarning()
              ) : (
                <Analytics />
              )}
            </Tab>

            <Tab key="platform" title="Platform">
              <Platforms />
            </Tab>
          </Tabs>
        </div>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setActiveTab("posts")}
      />
    </ComponentContainer>
  );
}
