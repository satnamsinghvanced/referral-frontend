import { useMemo, useState } from "react";
// Assuming these components are available in your Hero UI library
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Select,
  SelectItem,
} from "@heroui/react";
import { FaStar } from "react-icons/fa";
import { FiExternalLink, FiMapPin, FiMessageSquare } from "react-icons/fi";
import { IoIosWifi } from "react-icons/io";
import { LuQrCode } from "react-icons/lu";
import { useGBPRecentReviews } from "../../hooks/useReviews";
import { GBPReview } from "../../types/reviews";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import EmptyState from "../../components/common/EmptyState";

dayjs.extend(relativeTime);

// --- Mock Data & Helpers (defined above) ---

const StarRating = ({ rating }: any) => {
  const totalStars = 5;
  return (
    <div className="flex items-center gap-1 mb-1">
      {[...Array(totalStars)].map((_, i) => (
        <FaStar
          key={i}
          className={`size-3.5 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const mapStarRating = (rating: string) => {
  switch (rating) {
    case "FIVE":
      return 5;
    case "FOUR":
      return 4;
    case "THREE":
      return 3;
    case "TWO":
      return 2;
    case "ONE":
      return 1;
    default:
      return 0;
  }
};

/**
 * Component for rendering a single review item.
 */
const LatestReviewItem = ({ review }: { review: GBPReview }) => {
  const { reviewer, starRating, createTime, comment, reviewReply } = review;

  const rating = mapStarRating(starRating);
  // Default to Google since this is GBP API
  const platform = "Google";
  const platformColor =
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30";

  const isResponded = !!reviewReply;
  const statusColor = isResponded
    ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
    : "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30";

  return (
    <div className="p-4 border border-foreground/10 rounded-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50/50 dark:from-content1 dark:to-background">
      <div className="flex items-start justify-between mb-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 rounded-full overflow-hidden h-10 w-10 aspect-square flex items-center justify-center -mt-15 sm:-mt-0">
            <Avatar
              src={reviewer.profilePhotoUrl}
              name={reviewer.displayName}
              radius="none"
              classNames={{
                base: "w-full h-full !rounded-none",
                img: "w-full h-full object-cover",
                fallback: "w-full h-full flex items-center justify-center",
              }}
            />
          </div>

          <div>
            <div className="flex justify-start gap-2">
              <h3 className="text-sm">{reviewer.displayName}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-sm text-gray-500 dark:text-foreground/60">
              <Chip
                size="sm"
                radius="sm"
                className={`text-[11px] font-medium h-5 border ${platformColor}`}
              >
                {platform}
              </Chip>
            </div>
            <div className="sm:hidden mt-1">
              <StarRating rating={rating} />
            </div>
            <div className="sm:hidden mt-2 text-xs text-gray-600 dark:text-foreground/60">
              {dayjs(createTime).fromNow()}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="hidden sm:block">
            <StarRating rating={rating} />
          </div>
          <div className="hidden sm:block text-xs text-gray-600 dark:text-foreground/60">
            {dayjs(createTime).fromNow()}
          </div>
        </div>
      </div>

      <p className="text-gray-700 dark:text-foreground/80 mb-1.5 text-sm leading-relaxed">
        {comment}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-1">
        <div className="flex items-center gap-1"></div>

        <div className="flex items-center gap-2 mt-1 sm:mt-0">
          <Chip
            size="sm"
            radius="sm"
            className={`text-[11px] font-medium h-5 border ${statusColor} px-1`}
          >
            {isResponded ? "Responded" : "Pending"}
          </Chip>
          <Button
            variant="ghost"
            size="sm"
            radius="sm"
            className="flex items-center gap-1.5 border border-gray-300 dark:border-foreground/20 px-2"
          >
            <FiExternalLink className="size-3.5" />
            View
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * Main component for the Reviews and Interactions section.
 */
export default function LatestReviews() {
  const { data, isLoading } = useGBPRecentReviews();
  const reviews = data?.reviews || [];

  return (
    <Card
      shadow="none"
      className="bg-background flex flex-col gap-4 border border-foreground/10 rounded-xl p-4"
    >
      {/* Card Header */}
      <CardHeader className="w-full flex flex-col items-start gap-3 p-0 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="font-medium">Recent Reviews & Interactions</h4>
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
          <Chip
            size="sm"
            radius="sm"
            className="text-[11px] font-medium h-5 border bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30"
          >
            {reviews.length} review
            {reviews.length !== 1 ? "s" : ""}
          </Chip>
        </div>
      </CardHeader>

      {/* Card Content (Reviews List) */}
      <CardBody className="p-0">
        <div className="space-y-3 pr-2">
          {isLoading ? (
            <div className="text-center py-6 text-sm text-gray-500">
              Loading reviews...
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <LatestReviewItem key={review.reviewId} review={review} />
            ))
          ) : (
            <EmptyState title="No recent reviews found." />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
