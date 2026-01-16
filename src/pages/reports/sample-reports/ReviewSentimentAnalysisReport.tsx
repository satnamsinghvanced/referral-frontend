import { Card, CardBody, CardHeader, Chip, Progress } from "@heroui/react";
import { FaRegStar, FaStar } from "react-icons/fa";
import {
  IoArrowBack,
  IoCheckmarkCircle,
  IoStar,
  IoTime,
} from "react-icons/io5";
import {
  LuCircleCheckBig,
  LuTarget,
  LuThumbsUp,
  LuUsers,
} from "react-icons/lu";
import { MdChatBubbleOutline } from "react-icons/md";
import { TiWarningOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import ComponentContainer from "../../../components/common/ComponentContainer";
import { FiClock } from "react-icons/fi";
import clsx from "clsx";
import { IoMdTrendingUp } from "react-icons/io";

interface InsightData {
  title: string;
  description: string;
  color: "emerald" | "sky" | "amber" | "orange" | "blue" | "yellow";
}

const StarRating: React.FC<{ rating: number; maxStars?: number }> = ({
  rating,
  maxStars = 5,
}) => {
  const fullStars = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < maxStars; i++) {
    const isFull = i < fullStars;
    stars.push(
      <FaStar
        key={i}
        className={`size-3.5 ${
          isFull
            ? "fill-yellow-500 text-yellow-500"
            : "text-gray-300 dark:text-foreground/20"
        }`}
      />
    );
  }
  return <div className="flex items-center gap-1">{stars}</div>;
};

const reportData = {
  overall: {
    averageRating: 4.7,
    totalReviews: 1248,
    positiveSentiment: 92,
    responseRate: 89,
    avgResponseTime: "4.2h",
  },
  sentimentDistribution: [
    { label: "Positive", value: 89, color: "green", icon: LuThumbsUp },
    { label: "Neutral", value: 50, color: "yellow", icon: MdChatBubbleOutline },
    { label: "Negative", value: 3, color: "red", icon: TiWarningOutline },
  ],
  platformPerformance: [
    {
      platform: "Google",
      rating: 4.8,
      reviews: 678,
      positive: 94,
      color: "green",
    },
    {
      platform: "Yelp",
      rating: 4.6,
      reviews: 234,
      positive: 88,
      color: "green",
    },
    {
      platform: "Facebook",
      rating: 4.7,
      reviews: 198,
      positive: 91,
      color: "green",
    },
    {
      platform: "Healthgrades",
      rating: 4.8,
      reviews: 138,
      positive: 95,
      color: "green",
    },
  ],
  recentReviews: [
    {
      stars: 5,
      platform: "Google",
      sentiment: "Very Positive",
      response: { status: "Responded", time: "2.1h" },
      content:
        "Dr. Smith and his team provided exceptional orthodontic care for my daughter. The results exceeded our expectations and the staff was always professional and caring.",
      author: "Sarah M.",
      date: "2024-01-20",
    },
    {
      stars: 5,
      platform: "Yelp",
      sentiment: "Very Positive",
      response: { status: "Responded", time: "1.8h" },
      content:
        "Amazing experience with Invisalign treatment. The entire process was smooth and the office environment is modern and welcoming. Highly recommend!",
      author: "Michael R.",
      date: "2024-01-18",
    },
    {
      stars: 4,
      platform: "Facebook",
      sentiment: "Positive",
      response: { status: "Responded", time: "3.2h" },
      content:
        "Good service overall. The treatment took a bit longer than expected but the staff kept us informed throughout the process.",
      author: "Jennifer L.",
      date: "2024-01-15",
    },
    {
      stars: 3,
      platform: "Healthgrades",
      sentiment: "Neutral",
      response: { status: "Unresponded" },
      content:
        "The front desk staff seemed overwhelmed and the waiting time was almost 40 minutes for a quick check-up. The doctor was great once I got in.",
      author: "David K.",
      date: "2024-01-12",
    },
  ],
};

const THEME_STYLES = {
  emerald: {
    insight:
      "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20",
    recommendation:
      "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
    textTitle: "text-emerald-800 dark:text-emerald-300",
    textDesc: "text-emerald-700 dark:text-emerald-300/80",
    badge:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  },
  green: {
    insight:
      "bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/20",
    recommendation:
      "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-500/10",
    textTitle: "text-green-800 dark:text-green-300",
    textDesc: "text-green-700 dark:text-green-300/80",
    badge:
      "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300",
  },
  sky: {
    insight:
      "bg-sky-50 border-sky-200 dark:bg-sky-500/10 dark:border-sky-500/20",
    recommendation: "border-l-4 border-l-sky-500 bg-sky-50 dark:bg-sky-500/10",
    textTitle: "text-sky-800 dark:text-sky-300",
    textDesc: "text-sky-700 dark:text-sky-300/80",
    badge: "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300",
  },
  amber: {
    insight:
      "bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20",
    recommendation:
      "border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-500/10",
    textTitle: "text-amber-800 dark:text-amber-300",
    textDesc: "text-amber-700 dark:text-amber-300/80",
    badge:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  },
  orange: {
    insight:
      "bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20",
    recommendation:
      "border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-500/10",
    textTitle: "text-orange-800 dark:text-orange-300",
    textDesc: "text-orange-700 dark:text-orange-300/80",
    badge:
      "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300",
  },
  yellow: {
    insight:
      "bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/20",
    recommendation:
      "border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-500/10",
    textTitle: "text-yellow-800 dark:text-yellow-300",
    textDesc: "text-yellow-700 dark:text-yellow-300/80",
    badge:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300",
  },
  blue: {
    insight:
      "bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20",
    recommendation:
      "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-500/10",
    textTitle: "text-blue-800 dark:text-blue-300",
    textDesc: "text-blue-700 dark:text-blue-300/80",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300",
  },
  red: {
    insight:
      "bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20",
    recommendation: "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-500/10",
    textTitle: "text-red-800 dark:text-red-300",
    textDesc: "text-red-700 dark:text-red-300/80",
    badge: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
  },
  purple: {
    insight:
      "bg-purple-50 border-purple-200 dark:bg-purple-500/10 dark:border-purple-500/20",
    recommendation:
      "border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-500/10",
    textTitle: "text-purple-800 dark:text-purple-300",
    textDesc: "text-purple-700 dark:text-purple-300/80",
    badge:
      "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300",
  },
  default: {
    insight:
      "bg-gray-50 border-gray-200 dark:bg-gray-500/10 dark:border-gray-500/20",
    recommendation:
      "border-l-4 border-l-gray-500 bg-gray-50 dark:bg-gray-500/10",
    textTitle: "text-gray-800 dark:text-gray-300",
    textDesc: "text-gray-700 dark:text-gray-300/80",
    badge:
      "bg-gray-100 text-gray-800 dark:bg-foreground/10 dark:text-foreground/60",
  },
};

const INSIGHTS_DATA: InsightData[] = [
  {
    title: "Exceptional Clinical Results",
    description:
      "Patients consistently praise treatment outcomes and clinical expertise",
    color: "emerald",
  },
  {
    title: "Staff Professionalism",
    description:
      "Frequent mentions of caring, professional, and knowledgeable staff",
    color: "emerald",
  },
  {
    title: "Appointment Scheduling",
    description:
      "Some reviews mention longer wait times and scheduling challenges",
    color: "amber",
  },
  {
    title: "Treatment Timeline Communication",
    description:
      "Opportunity to better communicate treatment duration expectations",
    color: "amber",
  },
];

const RECOMMENDATIONS_DATA: InsightData[] = [
  {
    title: "Continue Excellence",
    description:
      "Maintain current high standards in clinical care and staff training that drive positive reviews.",
    color: "emerald",
  },
  {
    title: "Improve Communication",
    description:
      "Implement better timeline communication and appointment scheduling processes.",
    color: "blue",
  },
  {
    title: "Response Strategy",
    description:
      "Focus on responding to neutral/negative reviews faster to improve overall satisfaction.",
    color: "yellow",
  },
];

const CustomCard: React.FC<
  React.PropsWithChildren<{
    title?: string;
    className?: string;
  }>
> = ({ title, children, className = "" }) => (
  <Card
    shadow="none"
    className={`bg-background text-card-foreground flex flex-col rounded-xl p-5 border border-foreground/10 ${className}`}
  >
    {title && (
      <CardHeader className="p-0 pb-4">
        <h4 className="text-sm flex items-center gap-2">
          {title === "Review Sentiment Analysis - January 2024" && (
            <FaRegStar className="size-[18px] text-yellow-600 fill-yellow-600" />
          )}
          {title === "Recent Review Analysis" && (
            <MdChatBubbleOutline className="size-[18px]" />
          )}
          {title}
        </h4>
      </CardHeader>
    )}
    <CardBody className="p-0">{children}</CardBody>
  </Card>
);

const ReviewSentimentAnalysisReport = () => {
  const navigate = useNavigate();
  const { overall, sentimentDistribution, platformPerformance, recentReviews } =
    reportData;

  const HEADING_DATA = {
    heading: "Sample Report",
    subHeading: "Preview of comprehensive review sentiment analysis",
    buttons: [
      {
        label: "Back to Reports",
        onClick: () => navigate(-1),
        icon: <IoArrowBack fontSize={15} />,
        variant: "ghost" as const,
        color: "default" as const,
        className: "border-small",
      },
    ],
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "Very Positive":
      case "Positive":
        return THEME_STYLES.green.badge;
      case "Neutral":
        return THEME_STYLES.yellow.badge;
      case "Negative":
        return THEME_STYLES.red.badge;
      default:
        return THEME_STYLES.default.badge;
    }
  };

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="flex flex-col gap-4 md:gap-5">
        <CustomCard title="Review Sentiment Analysis - January 2024">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center space-y-0.5">
              <div className="text-xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                <IoStar className="size-5 fill-yellow-600" />
                {overall.averageRating}
              </div>
              <div className="text-xs text-gray-600 dark:text-foreground/60">
                Average Rating
              </div>
            </div>
            <div className="text-center space-y-0.5">
              <div className="text-xl font-bold text-blue-600">
                {overall.totalReviews}
              </div>
              <div className="text-xs text-gray-600 dark:text-foreground/60">
                Total Reviews
              </div>
            </div>
            <div className="text-center space-y-0.5">
              <div className="text-xl font-bold text-green-600">
                {overall.positiveSentiment}%
              </div>
              <div className="text-xs text-gray-600 dark:text-foreground/60">
                Positive Sentiment
              </div>
            </div>
            <div className="text-center space-y-0.5">
              <div className="text-xl font-bold text-purple-600">
                {overall.responseRate}%
              </div>
              <div className="text-xs text-gray-600 dark:text-foreground/60">
                Response Rate
              </div>
            </div>
            <div className="text-center space-y-0.5">
              <div className="text-xl font-bold text-orange-600">
                {overall.avgResponseTime}
              </div>
              <div className="text-xs text-gray-600 dark:text-foreground/60">
                Avg Response Time
              </div>
            </div>
          </div>
        </CustomCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <CustomCard title="Sentiment Distribution">
            <div className="space-y-4 md:space-y-5">
              {sentimentDistribution.map((sentiment, index) => {
                const styles =
                  THEME_STYLES[sentiment.color as keyof typeof THEME_STYLES] ||
                  THEME_STYLES.default;
                const IconComponent = sentiment.icon;
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`text-xs font-medium flex items-center gap-1.5`}
                      >
                        <IconComponent
                          className={clsx("h-4 w-4", styles.textTitle)}
                        />
                        {sentiment.label} ({sentiment.value}%)
                      </span>
                      <span className="text-xs text-gray-600 dark:text-foreground/60">
                        {sentiment.value}%
                      </span>
                    </div>
                    <Progress
                      aria-label="Budget utilization"
                      value={sentiment.value}
                      color={
                        sentiment.color === "green"
                          ? "success"
                          : sentiment.color === "yellow"
                          ? "warning"
                          : "danger"
                      }
                      className="h-2.5"
                      radius="full"
                    />
                  </div>
                );
              })}
            </div>
          </CustomCard>

          <CustomCard title="Platform Performance">
            <div className="space-y-3">
              {platformPerformance.map((platformData, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-foreground/10 dark:bg-background/50"
                >
                  <div>
                    <h4 className="text-sm font-medium">
                      {platformData.platform}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <StarRating rating={platformData.rating} />
                        <span className="text-xs dark:text-foreground/80">
                          {platformData.rating}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-600 dark:text-foreground/60">
                        {platformData.reviews} reviews
                      </span>
                    </div>
                  </div>
                  <Chip
                    size="sm"
                    radius="sm"
                    className={clsx(
                      "text-[11px] h-5",
                      THEME_STYLES[
                        platformData.color as keyof typeof THEME_STYLES
                      ]?.badge || THEME_STYLES.default.badge
                    )}
                  >
                    {platformData.positive}% positive
                  </Chip>
                </div>
              ))}
            </div>
          </CustomCard>
        </div>

        <CustomCard title="Recent Review Analysis">
          <div className="space-y-3">
            {recentReviews.map((review, index) => (
              <Card
                key={index}
                shadow="none"
                className="border border-foreground/10 dark:bg-background/50 p-4 rounded-lg"
              >
                <CardHeader className="flex items-start justify-between p-0 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <StarRating rating={review.stars} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Chip
                        size="sm"
                        radius="sm"
                        className="text-[11px] h-5 bg-[#e0f2fe] text-[#0c4a6e] dark:bg-sky-500/10 dark:text-sky-400"
                      >
                        {review.platform}
                      </Chip>
                      <Chip
                        size="sm"
                        radius="sm"
                        className={`text-[11px] h-5 ${getSentimentBadge(
                          review.sentiment
                        )}`}
                      >
                        {review.sentiment}
                      </Chip>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.response.status === "Responded" ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <LuCircleCheckBig className="size-3.5" />
                        <span className="text-xs text-gray-600 dark:text-foreground/60">
                          Responded ({review.response.time})
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <FiClock className="size-3.5" />
                        <span className="text-xs">Unresponded</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardBody className="p-0">
                  <p className="text-sm text-gray-600 dark:text-foreground/80 mb-2">
                    "{review.content}"
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-foreground/40">
                    <span>{review.author}</span>
                    <span>{review.date}</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </CustomCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card
            shadow="none"
            className="border border-foreground/10 p-5 bg-background"
          >
            <CardHeader className="p-0 pb-4 flex items-center gap-2">
              <IoMdTrendingUp
                className="size-[18px] text-blue-600"
                aria-hidden="true"
              />
              <h4 className="text-sm">Key Insights</h4>
            </CardHeader>
            <CardBody className="p-0">
              <div className="space-y-3">
                {INSIGHTS_DATA.map((insight, index) => {
                  const styles =
                    THEME_STYLES[insight.color as keyof typeof THEME_STYLES] ||
                    THEME_STYLES.default;
                  return (
                    <div
                      key={index}
                      className={clsx(
                        "p-3 rounded-lg border space-y-1",
                        styles.insight
                      )}
                    >
                      <h4
                        className={clsx(
                          "text-sm font-medium",
                          styles.textTitle
                        )}
                      >
                        {insight.title}
                      </h4>
                      <p className={clsx("text-xs", styles.textDesc)}>
                        {insight.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          <Card
            shadow="none"
            className="border border-foreground/10 p-5 bg-background"
          >
            <CardHeader className="p-0 pb-4 flex items-center gap-2">
              <LuUsers
                className="size-[18px] text-purple-600"
                aria-hidden="true"
              />
              <h4 className="text-sm">Action Recommendations</h4>
            </CardHeader>
            <CardBody className="p-0">
              <div className="space-y-3">
                {RECOMMENDATIONS_DATA.map((rec, index) => {
                  const styles =
                    THEME_STYLES[rec.color as keyof typeof THEME_STYLES] ||
                    THEME_STYLES.default;
                  return (
                    <div
                      key={index}
                      className={clsx(
                        "pl-4 p-3 rounded-r-lg space-y-1",
                        styles.recommendation
                      )}
                    >
                      <h4
                        className={clsx(
                          "text-sm font-medium",
                          styles.textTitle
                        )}
                      >
                        {rec.title}
                      </h4>
                      <p className={clsx("text-xs", styles.textDesc)}>
                        {rec.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </ComponentContainer>
  );
};

export default ReviewSentimentAnalysisReport;
