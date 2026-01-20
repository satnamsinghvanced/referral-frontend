import { Card } from "@heroui/react";
import { FiWifi } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { useFetchNFCDesks } from "../../hooks/useNFCDesk";
import { NFCDeskCard } from "../../types/nfcDesk";
import { LoadingState } from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import { LuNfc } from "react-icons/lu";

// Helper to get status color (kept for future use if needed, or remove if unused)
const getStatusColor = (status: string) => {
  switch (status) {
    case "Reviewed":
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30";
    case "Pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/30";
    default:
      return "bg-gray-100 text-gray-700 border-foreground/10 dark:bg-content2 dark:text-foreground/70";
  }
};

/**
 * Renders a single dashboard card.
 * @param {object} props - Card data and state handlers.
 */
const NfcCard = ({ data }: { data: NFCDeskCard }) => {
  const { name, locations, totalTap, totalReview, conversionRate, lastScan } =
    data;
  const progressBarWidth = `${conversionRate}%`;

  const locationName =
    locations.length > 0
      ? locations.map((l) => l.name).join(", ")
      : "No Location";

  return (
    // Card component from @heroui/react
    <Card
      className="p-4 border border-foreground/10 shadow-none transition-shadow hover:shadow-lg cursor-default flex flex-col"
      disableAnimation
    >
      <div className="flex items-center font-medium mb-2">
        <FiWifi className="text-xl text-blue-600" />
        <span className="ml-1.5 text-base">{name}</span>
      </div>
      <div className="flex items-center text-xs text-gray-600 dark:text-foreground/60 mb-4">
        <GrLocation className="text-base" />
        <span className="ml-1">{locationName}</span>
      </div>

      {/* Taps & Conversions Stats */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 mr-2 text-center p-3 bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-500/10 dark:to-sky-500/20 rounded-lg">
          <p className="text-xl font-bold text-sky-700 dark:text-sky-300">
            {totalTap}
          </p>
          <p className="text-xs text-gray-600 dark:text-sky-200/70">
            Total Taps
          </p>
        </div>
        <div className="flex-1 ml-2 text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-500/10 dark:to-emerald-500/20 rounded-lg">
          <p className="text-xl font-bold text-green-700 dark:text-emerald-300">
            {totalReview}
          </p>
          <p className="text-xs text-gray-600 dark:text-emerald-200/70">
            Reviews
          </p>
        </div>
      </div>

      {/* Conversion Rate Bar */}
      <div className="flex flex-col justify-start">
        <div className="flex justify-between items-center text-sm font-medium">
          <p className="text-xs text-gray-600 dark:text-foreground/60">
            Conversion Rate
          </p>
          <span className="text-xs text-gray-900 dark:text-foreground">
            {conversionRate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-primary-100 rounded-full h-1.5 mt-1">
          <div
            className="bg-primary h-1.5 rounded-full"
            style={{ width: progressBarWidth }}
          ></div>
        </div>
        <span className="text-xs text-gray-600 dark:text-foreground/60 mt-3 text-left">
          Last used:{" "}
          {lastScan ? new Date(lastScan).toLocaleDateString() : "N/A"}
        </span>
      </div>
    </Card>
  );
};

// Main component
export default function NfcAnalytics() {
  const { data, isLoading } = useFetchNFCDesks(1, 100); // Fetch mostly all for analytics view
  const tags = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <LoadingState />
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <EmptyState
        title="No NFC/QR Tags Found"
        message="Create your first review collection tag to see analytics."
        icon={<LuNfc size={32} className="text-primary-500" />}
      />
    );
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {tags.map((tag: NFCDeskCard) => (
          <NfcCard key={tag._id} data={tag} />
        ))}
      </div>
    </div>
  );
}
