import React from "react";

// Define the prop types for better TypeScript support
interface OverviewProps {
  topCards: { title: string; value: string; subtitle: string; icon: string }[];
  platforms: {
    name: string;
    followers?: string;
    connections?: string;
    engagement: string;
    posts: string;
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
}

const Overview: React.FC<OverviewProps> = ({
  topCards,
  platforms,
  recentPerformance,
  contentCalendar,
}) => {
  return (
    <div className="">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {topCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-6 border border-gray-50 hover:border-sky-200 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-extralight text-gray-500">
                {card.title}
              </p>
              <span className="text-xl">{card.icon}</span>
            </div>
            <h2 className="text-2xl font-bold text-sky-600">{card.value}</h2>
            <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Platforms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {platforms.map((p, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-6 border border-gray-50 hover:border-sky-200 transition-colors"
          >
            <h3 className="text-sm font-extralight text-gray-800 mb-3 flex items-center gap-2">
              <span
                className={`inline-block w-5 h-5 rounded-sm ${
                  {
                    Facebook: "bg-blue-500",
                    Instagram: "bg-pink-500",
                    LinkedIn: "bg-sky-400",
                  }[p.name]
                }`}
              ></span>
              {p.name}
            </h3>

            {p.followers && (
              <>
                <div className="text-xs font-extralight text-gray-500">
                  Followers:
                </div>
                <div className="text-sm ml-100 relative -top-4  text-gray-900">
                  {p.followers}
                </div>
              </>
            )}

            {p.connections && (
              <>
                <div className="text-xs font-extralight text-gray-500">
                  Connections:
                </div>
                <div className="text-sm ml-100 relative -top-4  text-gray-900">
                  {p.connections}
                </div>
              </>
            )}

            <div className="text-xs font-extralight text-gray-500 mt-2">
              Engagement:
            </div>
            <div className="text-sm ml-100 relative -top-4 text-gray-900">
              {p.engagement}
            </div>

            <div className="text-xs font-extralight text-gray-500 mt-2">
              Posts:
            </div>
            <div className="text-sm ml-100 relative -top-4 text-gray-900">
              {p.posts}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Performance */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-50 hover:border-sky-200 transition-colors">
          <h3 className="text-xs text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-blue-600">📊</span> Recent Performance
          </h3>
          <div className="flex justify-between mt-2">
            <div className="text-xs text-gray-500">Total Reach</div>
            <div className="text-sm text-sky-400">
              {recentPerformance.totalReach}
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <div className="text-xs text-gray-500">Total Impressions</div>
            <div className="text-sm text-sky-400">
              {recentPerformance.totalImpressions}
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <div className="text-xs text-gray-500">Avg. Click Rate</div>
            <div className="text-sm text-sky-400">
              {recentPerformance.avgClickRate}
            </div>
          </div>
        </div>

        {/* Content Calendar */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-50 hover:border-sky-200 transition-colors">
          <h3 className="text-xs font-extralight text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-sky-500">🗓️</span> Content Calendar
          </h3>
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-2">Scheduled posts:</span>
              <span className="text-sky-400">
                {contentCalendar.scheduledPosts}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-2">Draft posts:</span>
              <span className="text-sky-400">{contentCalendar.draftPosts}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-2">Published this month:</span>
              <span className="text-sky-400">
                {contentCalendar.publishedThisMonth}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
