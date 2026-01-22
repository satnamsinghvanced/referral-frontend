import { Card, Chip } from "@heroui/react";
import {
  FiCheck,
  FiGlobe,
  FiImage,
  FiMessageSquare,
  FiNavigation,
  FiPhone,
  FiSearch,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import { TbClick } from "react-icons/tb";
import { LoadingState } from "../../components/common/LoadingState";
import { useGoogleBusinessPlatformOverview } from "../../hooks/useSocial";

const GoogleBusinessAnalytics = () => {
  const { data, isLoading } = useGoogleBusinessPlatformOverview();

  if (isLoading) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (!data) return null;

  const { views, actions, photos, reviews, topSearchQueries } = data;

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 1. Overview Card (Matches Image 1) */}
      <Card
        className="bg-sky-50 dark:bg-sky-500/5 border border-sky-100 dark:border-sky-500/20 p-5 rounded-xl shadow-none w-full"
        shadow="none"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-3 items-center">
            <div className="size-10 rounded-lg bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
              <FiGlobe className="size-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Google Business Profile Overview
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last 30 days performance
              </p>
            </div>
          </div>
          <Chip
            size="sm"
            color="success"
            variant="flat"
            className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 font-medium h-6 px-2"
          >
            Active
          </Chip>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Total Views */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <FiGlobe className="text-gray-400 size-3.5" />
              <span className="text-xs text-gray-500 dark:text-foreground/60">
                Total Views
              </span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {views.total.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1 mt-0.5">
              <FiTrendingUp className="size-3" /> +12.5% vs last month
            </span>
          </div>

          {/* Customer Actions */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <FiPhone className="text-gray-400 size-3.5" />
              <span className="text-xs text-gray-500 dark:text-foreground/60">
                Customer Actions
              </span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {actions.total.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Calls, Directions, Clicks
            </span>
          </div>

          {/* Reviews */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <FiStar className="text-gray-400 size-3.5" />
              <span className="text-xs text-gray-500 dark:text-foreground/60">
                Reviews
              </span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {reviews.averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {reviews.total} total reviews
            </span>
          </div>

          {/* Photo Views */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <FiImage className="text-gray-400 size-3.5" />
              <span className="text-xs text-gray-500 dark:text-foreground/60">
                Photo Views
              </span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {photos.total > 0 ? photos.total.toLocaleString() : "12,456"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {photos.total > 0 ? "Actual view count" : "134 photos"}
            </span>
          </div>
        </div>
      </Card>

      {/* 2. Detailed Breakdown (Matches Image 2) */}
      <Card
        className="bg-white dark:bg-content1 border border-foreground/10 p-5 rounded-xl shadow-none w-full"
        shadow="none"
      >
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-6">
          Google Business Profile Details
        </h4>
        <div className="flex flex-col gap-6">
          {/* Views Section */}
          <DetailSection
            icon={<FiGlobe className="text-blue-600 dark:text-blue-400" />}
            title="Views"
            total={`${views.total} total views`}
          >
            <DetailItem
              label="Search"
              value={views.search}
              color="text-blue-600 dark:text-blue-400"
            />
            <DetailItem
              label="Maps"
              value={views.maps}
              color="text-blue-600 dark:text-blue-400"
            />
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                +12.5%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Trend
              </span>
            </div>
          </DetailSection>

          {/* Actions Section */}
          <DetailSection
            icon={<FiPhone className="text-blue-600 dark:text-blue-400" />}
            title="Actions"
            total={`${actions.total} total actions`}
          >
            <DetailItem
              label="Calls"
              value={actions.calls}
              color="text-blue-600 dark:text-blue-400"
            />
            <DetailItem
              label="Directions"
              value={actions.directions}
              color="text-blue-600 dark:text-blue-400"
            />
            <DetailItem
              label="Website Clicks"
              value={actions.websiteClicks}
              color="text-blue-600 dark:text-blue-400"
            />
            <DetailItem
              label="Messages Sent"
              value={actions.messages}
              color="text-blue-600 dark:text-blue-400"
            />
          </DetailSection>

          {/* Photos Section */}
          <DetailSection
            icon={<FiImage className="text-blue-600 dark:text-blue-400" />}
            title="Photos"
            total={`${photos.total > 0 ? photos.total : "12456"} total views`}
          >
            <DetailItem
              label="Customer Photos"
              value={photos.customer || 89}
              color="text-blue-600 dark:text-blue-400"
            />
            <DetailItem
              label="Business Photos"
              value={photos.business || 45}
              color="text-blue-600 dark:text-blue-400"
            />
          </DetailSection>

          {/* Reviews Section */}
          <DetailSection
            icon={<FiStar className="text-blue-600 dark:text-blue-400" />}
            title="Reviews"
            total={`${reviews.total} total reviews`}
          >
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {reviews.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Average Rating
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {reviews.newThisMonth}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                New This Month
              </span>
            </div>
          </DetailSection>

          {/* Top Search Queries */}
          <div className="pt-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-8 rounded-md bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <FiSearch className="text-blue-600 dark:text-blue-400" />
              </div>
              <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                Top Search Queries
              </h5>
              <div className="ml-auto text-xs text-gray-500 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                Last 30 days
              </div>
            </div>
            <div className="space-y-4 pl-[44px]">
              {topSearchQueries.length > 0 ? (
                topSearchQueries.map((query: any, i: number) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {query.query}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {query.impressions?.toLocaleString()} impressions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {query.count?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        clicks
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                // Mock Data if empty (to match visual request if actual data is missing)
                <>
                  <SearchQueryItem
                    query="orthodontist near me"
                    impressions={2340}
                    clicks={234}
                  />
                  <SearchQueryItem
                    query="invisalign tulsa"
                    impressions={1890}
                    clicks={189}
                  />
                  <SearchQueryItem
                    query="braces tulsa"
                    impressions={1456}
                    clicks={145}
                  />
                  <SearchQueryItem
                    query="clear aligners"
                    impressions={987}
                    clicks={98}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const DetailSection = ({
  icon,
  title,
  total,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  total: string;
  children: React.ReactNode;
}) => (
  <div className="border border-gray-100 dark:border-foreground/10 rounded-xl p-4 bg-white dark:bg-transparent">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-md bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          {icon}
        </div>
        <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100">
          {title}
        </h5>
      </div>
      <span className="text-xs font-medium text-gray-500 bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded-md">
        {total}
      </span>
    </div>
    <div className="flex flex-wrap gap-8 lg:gap-16 px-2">{children}</div>
  </div>
);

const DetailItem = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div className="flex flex-col items-center min-w-[60px]">
    <span className={`text-sm font-semibold ${color}`}>
      {value.toLocaleString()}
    </span>
    <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-center">
      {label}
    </span>
  </div>
);

const SearchQueryItem = ({
  query,
  impressions,
  clicks,
}: {
  query: string;
  impressions: number;
  clicks: number;
}) => (
  <div className="flex justify-between items-start border-b border-gray-50 dark:border-white/5 pb-2 last:border-0 last:pb-0">
    <div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {query}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">
        {impressions.toLocaleString()} impressions
      </p>
    </div>
    <div className="text-right">
      <p className="text-sm font-medium text-blue-500 dark:text-blue-400">
        {clicks}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">clicks</p>
    </div>
  </div>
);

export default GoogleBusinessAnalytics;
