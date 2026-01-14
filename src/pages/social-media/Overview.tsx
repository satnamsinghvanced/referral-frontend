import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import { FaRegComment } from "react-icons/fa";
import { FiClock, FiHeart } from "react-icons/fi";
import { IoMdTrendingUp } from "react-icons/io";
import { LuChartColumnIncreasing, LuUsers } from "react-icons/lu";
import MiniStatsCard from "../../components/cards/MiniStatsCard";

// Define the prop types for better TypeScript support
interface OverviewProps {
  platforms: {
    id: string;
    stats: { label: string; value: string }[];
  }[];
  recentPerformance: {
    totalReach: string;
    totalImpressions: string;
    avgClickRate: string;
  };
  contentCalendar: {
    scheduledPosts: number;
    draftPosts: number;
    publishedThisMonth: number;
  };
  stats: {
    totalFollowers: number;
    totalEngagement: string;
    totalLikes: number;
    totalComments: number;
  };
}

const Overview: React.FC<OverviewProps> = ({
  platforms,
  recentPerformance,
  contentCalendar,
  stats,
}) => {
  const STAT_CARD_DATA = [
    {
      icon: <LuUsers className="" />,
      heading: "Total Followers",
      value: stats.totalFollowers.toLocaleString(),
      subheading: "All time",
    },
    {
      icon: <IoMdTrendingUp className="" />,
      heading: "Engagement Rate",
      value: stats.totalEngagement,
      subheading: "Total engagement",
    },
    {
      icon: <FiHeart className="" />,
      heading: "Total Likes",
      value: stats.totalLikes.toLocaleString(),
      subheading: "All time",
    },
    {
      icon: <FaRegComment className="" />,
      heading: "Comments",
      value: stats.totalComments.toLocaleString(),
      subheading: "All time",
    },
  ];

  const gridColsClass =
    platforms.length === 1
      ? "grid-cols-1"
      : platforms.length === 2
      ? "grid-cols-1 lg:grid-cols-2"
      : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3";

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        {STAT_CARD_DATA.map((data, i) => (
          <MiniStatsCard key={i} cardData={data} />
        ))}
      </div>

      <div className={`grid ${gridColsClass} gap-3 md:gap-4`}>
        {platforms.map((platform, i) => (
          <Card
            key={platform.id}
            className="bg-background rounded-xl shadow-none p-4 border border-primary/15"
          >
            <CardHeader className="p-0 pb-4">
              <h3 className="text-sm font-extralight text-gray-800 flex items-center gap-2">
                <span
                  className={`inline-block size-4 rounded-sm ${
                    {
                      Facebook: "bg-blue-500",
                      Instagram: "bg-pink-500",
                      LinkedIn: "bg-sky-400",
                      YouTube: "bg-red-500",
                      GoogleBusiness: "bg-green-500",
                    }[platform.id]
                  }`}
                ></span>
                {platform.id}
              </h3>
            </CardHeader>
            <CardBody className="p-0 space-y-3">
              {platform.stats.map((stat, i) => {
                return (
                  stat.value && (
                    <div
                      className="text-xs flex items-center justify-between"
                      key={i}
                    >
                      <p className="text-gray-600">{stat.label}</p>
                      <p className="font-medium">{stat.value}</p>
                    </div>
                  )
                );
              })}
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <Card className="bg-background rounded-xl shadow-none p-4 border border-primary/15">
          <h4 className="text-sm mb-4 flex items-center gap-2">
            <LuChartColumnIncreasing className="text-base text-primary" />{" "}
            Recent Performance
          </h4>
          <div className="space-y-3">
            <div className="text-xs flex items-center justify-between">
              <p className="text-gray-600">Total Reach</p>
              <p className="font-medium">{recentPerformance.totalReach}</p>
            </div>
            <div className="text-xs flex items-center justify-between">
              <p className="text-gray-600">Total Impressions</p>
              <p className="font-medium">
                {recentPerformance.totalImpressions}
              </p>
            </div>
            <div className="text-xs flex items-center justify-between">
              <p className="text-gray-600">Avg. Click Rate</p>
              <p className="font-medium">{recentPerformance.avgClickRate}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-background rounded-xl shadow-none p-4 border border-primary/15">
          <h4 className="text-sm mb-4 flex items-center gap-2">
            <FiClock className="text-base text-primary" /> Content Calendar
          </h4>
          <div className="space-y-3">
            <div className="text-xs flex items-center justify-between">
              <p className="text-gray-600">Scheduled posts</p>
              <p className="font-medium">{contentCalendar.scheduledPosts}</p>
            </div>
            <div className="text-xs flex items-center justify-between">
              <p className="text-gray-600">Draft posts</p>
              <p className="font-medium">{contentCalendar.draftPosts}</p>
            </div>
            <div className="text-xs flex items-center justify-between">
              <p className="text-gray-600">Published this month</p>
              <p className="font-medium">
                {contentCalendar.publishedThisMonth}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
