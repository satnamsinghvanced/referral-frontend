import { Button, Chip } from "@heroui/react";
import {
  FiClock,
  FiExternalLink,
  FiPhoneIncoming,
  FiPhoneOutgoing,
  FiPlay,
} from "react-icons/fi";
import { CallRecord } from "../../types/call";
import { timeAgo as formatTimeAgo } from "../../utils/timeAgo";
import CallStatusChip from "../../components/chips/CallStatusChip";
import { Link } from "react-router";

export default function CallRecordCard({
  record,
  onPlayClick,
}: {
  record: CallRecord;
  onPlayClick: () => void;
}) {
  const isIncoming = record.direction === "Incoming";

  const displayTags = [
    { label: record.direction, type: "category" },
    ...(record.followUp ? [{ label: "Follow-up", type: "action" }] : []),
    ...(record.appointment ? [{ label: "Appointment", type: "action" }] : []),
  ];

  const timeAgo = record.createdAt ? formatTimeAgo(record.createdAt) : "";

  return (
    <div className="flex items-center justify-between p-3.5 border border-gray-200 rounded-lg bg-background">
      <div className="flex items-center space-x-3.5">
        <div className={`p-2 rounded-lg bg-gray-100/70`}>
          {isIncoming ? (
            <FiPhoneIncoming className="h-4 w-4 text-gray-600" />
          ) : (
            <FiPhoneOutgoing className="h-4 w-4 text-gray-600" />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-foreground text-sm">
              {record.contact.name || record.contact.phone || "Unknown"}
            </h3>
            <CallStatusChip status={record.status} />
          </div>

          <p className="text-xs text-gray-600">
            {record.contact.phone || record.from}{" "}
            <span className="mx-0.5 text-gray-500">&bull;</span> {timeAgo}
          </p>

          <div className="flex space-x-2 mt-2">
            {displayTags.map((tag) => (
              <Chip
                key={tag.label}
                size="sm"
                radius="sm"
                variant="bordered"
                className={`text-[11px] h-5 capitalize border-small ${
                  tag.type === "action"
                    ? "text-orange-600 border-orange-200"
                    : ""
                }`}
              >
                {tag.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center space-x-4">
        <div className="text-right text-sm text-gray-600 space-y-1.5">
          <div className="flex items-center justify-end space-x-1">
            <FiClock className="h-3 w-3" aria-hidden="true" />
            <span className="text-xs">{record.duration}s</span>
          </div>
        </div>

        <div className="flex space-x-2">
          {record.recordingUrl && (
            <Button
              size="sm"
              variant="bordered"
              className="border-small px-0 !min-w-8"
              aria-label="Play recording"
              onPress={onPlayClick}
            >
              <FiPlay className="size-3.5" />
            </Button>
          )}

          <Link to="https://www.twilio.com/login" target="_blank">
            <Button
              size="sm"
              variant="bordered"
              className="border-small px-0 !min-w-8"
              aria-label="External Link"
            >
              <FiExternalLink className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
