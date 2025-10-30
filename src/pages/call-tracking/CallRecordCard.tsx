import { Button, Chip } from "@heroui/react";
import {
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiExternalLink,
  FiPhoneIncoming,
  FiPlay,
} from "react-icons/fi";
import { CallRecord, Tag } from "../../types/call";

const getSentimentColor = (sentiment: CallRecord["sentiment"]) => {
  switch (sentiment) {
    case "positive":
      return { color: "success", className: "bg-green-100 text-green-800" }; // maps to green in most UI systems
    case "negative":
      return { color: "danger", className: "text-red-600 bg-red-200" }; // maps to red/danger
    default:
      return { color: "default", className: "" }; // maps to gray/neutral
  }
};

const getChipColorAndVariant = (tag: Tag) => {
  if (tag.label === "Completed") {
    return {
      color: "success",
      variant: "flat",
      className: "bg-green-100 text-green-800 border-0",
    };
  }
  if (tag.label === "Follow-up") {
    return {
      color: "danger",
      variant: "bordered",
      className: "text-orange-600 border-orange-200",
    };
  }
  return { color: "default", variant: "bordered", className: "" };
};

// --- Component ---
export default function CallRecordCard({
  record,
  onPlayClick,
}: {
  record: CallRecord;
  onPlayClick: () => void;
}) {
  const sentimentColor = getSentimentColor(record.sentiment);
  const categoryTags = record.tags.filter((t) => t.type === "category");
  const statusTags = record.tags.filter((t) => t.type !== "category");

  const iconBgClass =
    record.sentiment === "positive" ? "bg-green-100/70" : "bg-gray-100/70";
  const iconColorClass =
    record.sentiment === "positive" ? "text-green-600" : "text-gray-600";

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center space-x-3.5">
        <div className={`p-2 rounded-lg ${iconBgClass}`}>
          <FiPhoneIncoming
            className={`h-4 w-4 ${iconColorClass}`}
            aria-hidden="true"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-foreground text-sm">
              {record.callerName}
            </h3>
            <Chip
              size="sm"
              radius="sm"
              color={sentimentColor.color} // Use Hero UI color prop
              variant="flat"
              className={`text-[11px] h-5 capitalize ${sentimentColor.className}`}
            >
              {record.sentiment}
            </Chip>

            {record.isVerified && (
              <FiCheckCircle
                className="h-4 w-4 text-green-600"
                aria-hidden="true"
              />
            )}
          </div>

          <p className="text-xs text-gray-600">
            {record.callerPhone} &bull; {record.timeAgo}
          </p>

          {/* Tags (Categories) */}
          <div className="flex space-x-2 mt-2">
            {categoryTags.map((tag) => {
              // Default appearance for tags
              const { color, variant, className } = getChipColorAndVariant(tag);
              return (
                <Chip
                  key={tag.label}
                  size="sm"
                  radius="sm"
                  //   color={color as ButtonColor}
                  variant={variant as string}
                  className={`text-[11px] h-5 capitalize border-small ${className}`}
                >
                  {tag.label}
                </Chip>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Duration, Status Badges, and Action Buttons */}
      <div className="flex items-center space-x-4">
        {/* Duration and Status */}
        <div className="text-right text-sm text-gray-600 space-y-1.5">
          {/* Duration */}
          <div className="flex items-center justify-end space-x-1">
            <FiClock className="h-3 w-3" aria-hidden="true" />
            <span className="text-xs">{record.duration}</span>
          </div>

          {/* Status Tags */}
          <div className="flex items-center justify-end space-x-2 mt-1">
            {statusTags.map((tag) => {
              const { color, variant, className } = getChipColorAndVariant(tag);
              return (
                <Chip
                  key={tag.label}
                  size="sm"
                  radius="sm"
                  //   color={color as ButtonColor}
                  variant={variant}
                  className={`text-[11px] h-5 capitalize border-small ${className}`}
                >
                  {tag.label}
                </Chip>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {/* Play Button */}
          <Button
            size="sm"
            variant="bordered"
            className="border-small px-0 !min-w-8"
            aria-label="Play recording"
            onPress={onPlayClick}
          >
            <FiPlay className="size-3.5" />
          </Button>

          {/* Download Button */}
          <Button
            size="sm"
            variant="bordered"
            className="border-small px-0 !min-w-8"
            aria-label="Download recording"
          >
            <FiDownload className="size-3.5" />
          </Button>

          {/* External Link Button */}
          <Button
            size="sm"
            variant="bordered"
            className="border-small px-0 !min-w-8"
            aria-label="View in Twilio Console"
          >
            <FiExternalLink className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
