import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { useMemo } from "react";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import { LoadingState } from "../../components/common/LoadingState";
import { usePostsAnalytics } from "../../hooks/useSocial";

import GoogleBusinessAnalytics from "./GoogleBusinessAnalytics";

const Analytics = () => {
  const { data, isLoading } = usePostsAnalytics();

  const statCardData = useMemo(
    () => [
      {
        heading: "Total Reach",
        value: data?.stats?.totalReach?.toLocaleString() || "0",
        subheading: "All time",
      },
      {
        heading: "Total Impressions",
        value: data?.stats?.totalImpressions?.toLocaleString() || "0",
        subheading: "All time",
      },
      {
        heading: "Avg. CTR",
        value: data?.stats?.avgCTR ? `${data.stats.avgCTR}%` : "0%",
        subheading: "Average rate",
      },
      {
        heading: "Total Engagement",
        value: data?.stats?.totalEngagement?.toLocaleString() || "0",
        subheading: "All interactions",
      },
    ],
    [data],
  );

  const platformBreakdown = useMemo(() => {
    if (!data?.platformPerformance) return [];
    return Object.entries(data.platformPerformance)
      .filter(([_, stats]) => stats.connected)
      .map(([name, stats]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        posts: stats.posts || 0,
        color:
          {
            facebook: "bg-blue-500",
            instagram: "bg-pink-500",
            linkedin: "bg-primary-500",
            youtube: "bg-red-500",
          }[name.toLowerCase()] || "bg-gray-500",
        metrics: {
          likes: stats.likes || 0,
          comments: stats.comments || 0,
          shares: stats.shares || 0,
          views: stats.views || 0,
        },
      }));
  }, [data]);

  if (isLoading)
    return (
      <div className="min-h-[250px] flex items-center justify-center">
        <LoadingState />
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-5">
      <GoogleBusinessAnalytics />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        {statCardData.map((data, i) => (
          <MiniStatsCard key={i} cardData={data} />
        ))}
      </div>

      {/* Platform Breakdown */}
      <Card className="bg-background rounded-xl shadow-none p-4 w-full border border-foreground/10">
        <CardHeader className="p-0 pb-4">
          <h3 className="text-sm">Platform Performance Breakdown</h3>
        </CardHeader>
        <CardBody className="p-0 space-y-3">
          {platformBreakdown.map((platform, i) => (
            <Card
              key={platform.name}
              className="bg-background dark:bg-content1 rounded-xl shadow-none p-3 w-full border border-foreground/10"
            >
              <div className="">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-block size-4 font-sans ${platform.color} rounded-sm`}
                    ></div>
                    <span className="text-sm">{platform.name}</span>
                  </div>
                  <Chip
                    size="sm"
                    radius="sm"
                    variant="bordered"
                    className="text-[11px] border-small border-foreground/10 dark:text-white dark:border-gray-600"
                  >
                    {platform.posts} posts
                  </Chip>
                </div>

                <div className="text-sm text-gray-600 dark:text-foreground/60 flex flex-wrap justify-around gap-x-5 mt-5 md:mt-3 xl:mt-2">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-sky-400">
                      {platform.metrics.likes.toLocaleString()}
                    </span>
                    <span className="text-[11px] dark:text-gray-400">
                      Likes
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-sky-400">
                      {platform.metrics.comments.toLocaleString()}
                    </span>
                    <span className="text-[11px] dark:text-gray-400">
                      Comments
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-sky-400">
                      {platform.metrics.shares.toLocaleString()}
                    </span>
                    <span className="text-[11px] dark:text-gray-400">
                      Shares
                    </span>
                  </div>
                  <div className="flex flex-col items-center -translate-x-1">
                    <span className="text-sm font-medium text-sky-400">
                      {platform.metrics.views.toLocaleString()}
                    </span>
                    <span className="text-[11px] dark:text-gray-400">
                      Views
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default Analytics;
