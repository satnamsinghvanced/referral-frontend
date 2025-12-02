import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import MiniStatsCard from "../../components/cards/MiniStatsCard";

const STAT_CARD_DATA = [
  {
    heading: "Total Reach",
    value: "3,056",
    subheading: "All time",
  },
  {
    heading: "Total Impressions",
    value: "5,460",
    subheading: "All time",
  },
  {
    heading: "Avg. CTR",
    value: "4.1%",
    subheading: "Average rate",
  },
  {
    heading: "Total Engagement",
    value: 160,
    subheading: "All interactions",
  },
];

const PLATFORM_BREAKDOWN_DATA = [
  {
    name: "Facebook",
    posts: 3,
    color: "bg-blue-500",
    metrics: { likes: 107, comments: 30, shares: 23, views: 546 },
  },
  {
    name: "Instagram",
    posts: 2,
    color: "bg-pink-500",
    metrics: { likes: 87, comments: 20, shares: 15, views: 490 },
  },
  {
    name: "LinkedIn",
    posts: 2,
    color: "bg-primary-500",
    metrics: { likes: 124, comments: 48, shares: 35, views: "1,200" },
  },
];

const Analytics = () => {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {STAT_CARD_DATA.map((data, i) => (
          <MiniStatsCard key={i} cardData={data} />
        ))}
      </div>

      {/* Platform Breakdown */}
      <Card className="bg-background rounded-xl shadow-none p-5 w-full border border-primary/15">
        <CardHeader className="p-0 pb-5">
          <h3 className="text-sm">Platform Performance Breakdown</h3>
        </CardHeader>
        <CardBody className="p-0 space-y-4">
          {/* Facebook */}
          {PLATFORM_BREAKDOWN_DATA.map((platform, i) => (
            <Card
              key={platform.name}
              className="bg-white rounded-xl shadow-none p-4 w-full border border-primary/15"
            >
              <div className="">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Color Block and Name */}
                    <div
                      className={`inline-block size-4 font-sans ${platform.color} rounded-sm`}
                    ></div>
                    <span className="text-sm">{platform.name}</span>
                  </div>
                  <Chip
                    size="sm"
                    radius="sm"
                    variant="bordered"
                    className="text-[11px] border-small border-gray-100 dark:text-white dark:border-gray-600"
                  >
                    {platform.posts} posts
                  </Chip>
                </div>

                <div className="text-sm text-gray-600 flex flex-wrap justify-around gap-x-5 mt-2">
                  {/* Metrics Grid */}
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-sky-400">
                      {platform.metrics.likes}
                    </span>
                    <span className="text-[11px] dark:text-gray-400">
                      Likes
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-sky-400">
                      {platform.metrics.comments}
                    </span>
                    <span className="text-[11px] dark:text-gray-400">
                      Comments
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-sky-400">
                      {platform.metrics.shares}
                    </span>
                    <span className="text-[11px] dark:text-gray-400">
                      Shares
                    </span>
                  </div>
                  <div className="flex flex-col items-center -translate-x-1">
                    <span className="text-sm font-medium text-sky-400">
                      {platform.metrics.views}
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
