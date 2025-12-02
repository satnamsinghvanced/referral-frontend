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
          isFull ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
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

const colorMap: {
  [key: string]: { text: string; bg: string; border: string };
} = {
  green: {
    text: "text-green-600",
    bg: "bg-green-100",
    border: "border-green-600",
  },
  yellow: {
    text: "text-yellow-600",
    bg: "bg-yellow-100",
    border: "border-yellow-600",
  },
  red: { text: "text-red-600", bg: "bg-red-100", border: "border-red-600" },
  blue: { text: "text-blue-600", bg: "bg-blue-100", border: "border-blue-600" },
  purple: {
    text: "text-purple-600",
    bg: "bg-purple-100",
    border: "border-purple-600",
  },
  orange: {
    text: "text-orange-600",
    bg: "bg-orange-100",
    border: "border-orange-600",
  },
  default: {
    text: "text-gray-700",
    bg: "bg-gray-100",
    border: "border-gray-300",
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
    className={`bg-white text-card-foreground flex flex-col rounded-xl p-5 border border-primary/15 ${className}`}
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
        return "bg-green-100 text-green-800";
      case "Neutral":
        return "bg-yellow-100 text-yellow-800";
      case "Negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="flex flex-col gap-5">
        <CustomCard title="Review Sentiment Analysis - January 2024">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center space-y-0.5">
              <div className="text-xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                <IoStar className="size-5 fill-yellow-600" />
                {overall.averageRating}
              </div>
              <div className="text-xs text-gray-600">Average Rating</div>
            </div>
            <div className="text-center space-y-0.5">
              <div className="text-xl font-bold text-blue-600">
                {overall.totalReviews}
              </div>
              <div className="text-xs text-gray-600">Total Reviews</div>
            </div>
            <div className="text-center space-y-0.5">
              <div className="text-xl font-bold text-green-600">
                {overall.positiveSentiment}%
              </div>
              <div className="text-xs text-gray-600">Positive Sentiment</div>
            </div>
            <div className="text-center space-y-0.5">
              <div className="text-xl font-bold text-purple-600">
                {overall.responseRate}%
              </div>
              <div className="text-xs text-gray-600">Response Rate</div>
            </div>
            <div className="text-center space-y-0.5">
              <div className="text-xl font-bold text-orange-600">
                {overall.avgResponseTime}
              </div>
              <div className="text-xs text-gray-600">Avg Response Time</div>
            </div>
          </div>
        </CustomCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <CustomCard title="Sentiment Distribution">
            <div className="space-y-5">
              {sentimentDistribution.map((sentiment, index) => {
                const colors = colorMap[sentiment.color];
                const IconComponent = sentiment.icon;
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`text-xs font-medium flex items-center gap-1.5`}
                      >
                        <IconComponent className={`h-4 w-4 ${colors?.text}`} />
                        {sentiment.label} ({sentiment.value}%)
                      </span>
                      <span className="text-xs text-gray-600">
                        {sentiment.value}%
                      </span>
                    </div>
                    <Progress
                      aria-label="Budget utilization"
                      value={sentiment.value}
                      color="primary"
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
                  className="flex items-center justify-between p-3 rounded-lg border border-primary/15"
                >
                  <div>
                    <h4 className="text-sm font-medium">
                      {platformData.platform}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <StarRating rating={platformData.rating} />
                        <span className="text-xs">{platformData.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-600">
                        {platformData.reviews} reviews
                      </span>
                    </div>
                  </div>
                  <Chip
                    size="sm"
                    radius="sm"
                    className={`text-[11px] h-5 ${
                      colorMap[platformData.color]?.bg
                    } ${colorMap[platformData.color]?.text}`}
                  >
                    {platformData.positive}% positive
                  </Chip>
                </div>
              ))}
            </div>
          </CustomCard>
        </div>

        <CustomCard title="Recent Review Analysis">
          <div className="space-y-4">
            {recentReviews.map((review, index) => (
              <Card
                key={index}
                shadow="none"
                className="border border-primary/15 p-4"
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
                        className="text-[11px] h-5 bg-[#e0f2fe] text-[#0c4a6e]"
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
                        <span className="text-xs">
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
                  <p className="text-sm text-gray-600 mb-2">
                    "{review.content}"
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{review.author}</span>
                    <span>{review.date}</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </CustomCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card shadow="none" className="border border-primary/15 p-5">
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
                  let color;

                  switch (index) {
                    case 0:
                    case 1:
                      color = "emerald";
                      break;

                    default:
                      color = "yellow";
                      break;
                  }

                  return (
                    <div
                      key={index}
                      className={clsx(
                        "p-3 rounded-lg border space-y-1",
                        `bg-${color}-50 border-${color}-200`
                      )}
                    >
                      <h4
                        className={clsx(
                          "text-sm font-medium",
                          `text-${color}-800`
                        )}
                      >
                        {insight.title}
                      </h4>
                      <p className={clsx("text-xs", `text-${color}-700`)}>
                        {insight.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          <Card shadow="none" className="border border-primary/15 p-5">
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
                  let color;

                  switch (index) {
                    case 1:
                      color = "blue";
                      break;

                    case 2:
                      color = "yellow";
                      break;

                    default:
                      color = "emerald";
                      break;
                  }

                  return (
                    <div
                      key={index}
                      className={clsx(
                        "pl-4 p-3 rounded-r-lg space-y-1",
                        `border-l-4 border-l-${color}-500 bg-${color}-50`,
                        index === 0 && "border-l-emerald-500"
                      )}
                    >
                      <h4
                        className={clsx(
                          "text-sm font-medium",
                          `text-${color}-800`
                        )}
                      >
                        {rec.title}
                      </h4>
                      <p className={clsx("text-xs", `text-${color}-700`)}>
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
