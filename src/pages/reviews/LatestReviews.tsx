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
    SelectItem
} from "@heroui/react";
import { FaStar } from "react-icons/fa";
import { FiExternalLink, FiMapPin, FiMessageSquare } from "react-icons/fi";
import { IoIosWifi } from "react-icons/io";
import { LuQrCode } from "react-icons/lu";

// --- Mock Data & Helpers (defined above) ---
const REVIEWS = [
  // ... (data from section 1)
  {
    id: 1,
    name: "Sarah Johnson",
    initials: "SJ",
    isVerified: true,
    platform: "Google",
    platformColor: "bg-blue-100 text-blue-800 border-blue-200",
    location: "Downtown Office",
    interaction: "NFC",
    interactionIcon: "IoIosWifi",
    rating: 5,
    date: "1/20/2024",
    text: "Excellent service! Dr. Smith and the team were professional and caring throughout my treatment. The NFC tap made leaving a review so convenient!",
    responseStatus: "Responded",
    reviewTag: "NFC-001",
  },
  {
    id: 2,
    name: "Michael Brown",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    isVerified: true,
    platform: "Yelp",
    platformColor: "bg-red-100 text-red-800 border-red-200",
    location: "Westside Clinic",
    interaction: "QR Code",
    interactionIcon: "FiQrCode",
    rating: 4,
    date: "1/19/2024",
    text: "Amazing results with my Invisalign treatment. The QR code system made it easy to share my experience. Highly recommend this practice!",
    responseStatus: "Responded",
    reviewTag: null,
  },
  {
    id: 3,
    name: "Emily Davis",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    isVerified: true,
    platform: "Google",
    platformColor: "bg-blue-100 text-blue-800 border-blue-200",
    location: "Downtown Office",
    interaction: "NFC",
    interactionIcon: "IoIosWifi",
    rating: 4,
    date: "1/18/2024",
    text: "Great experience overall. The staff was friendly and the office was clean and modern. Easy review process via NFC.",
    responseStatus: "Unresponded",
    reviewTag: "NFC-001",
  },
  {
    id: 4,
    name: "Robert Wilson",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    isVerified: false,
    platform: "Facebook",
    platformColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    location: "Medical Center",
    interaction: "Direct",
    interactionIcon: "FiMessageSquare",
    rating: 5,
    date: "1/17/2024",
    text: "The consultation was very informative and the follow-up process was excellent. A truly professional team.",
    responseStatus: "Responded",
    reviewTag: null,
  },
];

const locationOptions = [
  "All Locations",
  "Downtown Office",
  "Westside Clinic",
  "Medical Center",
  "Northgate Branch",
];

// Helper to map icon name string to the actual component
const InteractionIcon = ({ iconName, className }: any) => {
  switch (iconName) {
    case "IoIosWifi":
      return <IoIosWifi className={`text-sky-600 ${className}`} />;
    case "FiQrCode":
      return <LuQrCode className={`text-orange-600 ${className}`} />;
    case "FiMessageSquare":
      return <FiMessageSquare className={`text-gray-600 ${className}`} />;
    default:
      return null;
  }
};

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
// --- End Mock Data & Helpers ---

/**
 * Component for rendering a single review item.
 */
const LatestReviewItem = ({ review }: any) => {
  const {
    name,
    initials,
    avatarUrl,
    isVerified,
    platform,
    platformColor,
    location,
    interaction,
    interactionIcon,
    rating,
    date,
    text,
    responseStatus,
    reviewTag,
  } = review;

  const isResponded = responseStatus === "Responded";
  const statusColor = isResponded
    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
    : "bg-red-100 text-red-800 border-red-200";

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50/50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Avatar
            name={initials || name}
            src={avatarUrl}
            className="h-10 w-10 text-base"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">{name}</h3>
              {isVerified && (
                <Chip
                  size="sm"
                  radius="sm"
                  className="text-[11px] font-medium h-5 bg-emerald-100 text-emerald-800 border border-emerald-200"
                >
                  Verified
                </Chip>
              )}
            </div>
            {/* Platform, Location, Interaction */}
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <Chip
                size="sm"
                radius="sm"
                className={`text-[11px] font-medium h-5 border ${platformColor}`}
              >
                {platform}
              </Chip>
              <div className="flex items-center gap-1 text-xs">
                <FiMapPin className="h-3 w-3" />
                {location}
              </div>
              <div className="flex items-center gap-1 text-xs">
                <InteractionIcon
                  iconName={interactionIcon}
                  className="h-4 w-4"
                />
                {interaction}
              </div>
            </div>
          </div>
        </div>

        {/* Rating and Date */}
        <div className="text-right flex flex-col items-end">
          <StarRating rating={rating} />
          <div className="text-xs text-gray-500">{date}</div>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 mb-2.5 leading-relaxed">{text}</p>

      {/* Actions and Tags */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {reviewTag && (
            <Chip
              size="sm"
              radius="sm"
              className="text-[11px] font-medium h-5 border bg-sky-100 text-sky-800 border-sky-200"
            >
              {reviewTag}
            </Chip>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Chip
            size="sm"
            radius="sm"
            className={`text-[11px] font-medium h-5 border ${statusColor}`}
          >
            {responseStatus}
          </Chip>
          <Button
            variant="ghost"
            size="sm"
            radius="sm"
            className="flex items-center gap-1.5 border border-gray-300"
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
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const filteredReviews = useMemo(() => {
    if (selectedLocation === "All Locations") {
      return REVIEWS;
    }
    return REVIEWS.filter((review) => review.location === selectedLocation);
  }, [selectedLocation]);

  const handleLocationChange = (event: any) => {
    setSelectedLocation(event.target.value);
  };

  return (
    <Card className="shadow-none border border-primary/15 p-5">
      {/* Card Header */}
      <CardHeader className="flex flex-col items-start gap-3 p-0 mb-6">
        <h4 className="font-medium">Recent Reviews & Interactions</h4>
        <div className="flex items-center gap-3">
          {/* Hero UI Select component */}
          <Select
            size="sm"
            radius="sm"
            selectedKeys={[selectedLocation]}
            disabledKeys={[selectedLocation]}
            onChange={handleLocationChange}
            className="w-48 text-sm"
          >
            {locationOptions.map((option) => (
              <SelectItem key={option}>{option}</SelectItem>
            ))}
          </Select>
          {/* Review Count Badge */}
          <Chip
            size="sm"
            radius="sm"
            className="text-[11px] font-medium h-5 border bg-sky-100 text-sky-800 border-sky-200"
          >
            {filteredReviews.length} review
            {filteredReviews.length !== 1 ? "s" : ""}
          </Chip>
        </div>
      </CardHeader>

      {/* Card Content (Reviews List) */}
      <CardBody className="p-0">
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <LatestReviewItem key={review.id} review={review} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-6">
              No reviews found for {selectedLocation}.
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
