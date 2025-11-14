import { Chip, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { TbCalendarStats, TbRoute, TbNotes } from "react-icons/tb"; // Icons for new structure
import VisitStatusChip from "../../../components/chips/VisitStatusChip";
import { LuCar, LuClock, LuTimer } from "react-icons/lu";

// Assuming the data structure for a single plan
interface PlanData {
  planName: string;
  status: "active" | "draft" | "completed";
  visitPurpose: string;
  defaultPriority: string;
  description: string;
  isOptimized: boolean;
  estimatedTotalTime: string; // e.g., "1h 0m"
  estimatedDistance: string; // e.g., "0.0mi"
  referrerCount: number;
  visitDaysCount: string; // e.g., "0d 1h 0m" for display
  routeDetails: Array<{
    stop: number;
    name: string;
    address: string;
    timeWindow: string; // e.g., "09:00 PM - 09:30 PM"
    travelTime: string;
    travelDistance: string;
  }>;
}

interface ViewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanData; // The data for the specific plan to display
}

// Helper to render Status Tag
const StatusTag = ({ status }: { status: string }) => {
  let color = "bg-gray-200 text-gray-800";
  if (status === "active") color = "bg-blue-100 text-blue-600";
  if (status === "completed") color = "bg-green-100 text-green-600";
  if (status === "draft") color = "bg-yellow-100 text-yellow-600";

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${color}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function ViewScheduledVisitModal({
  isOpen,
  onClose,
  plan,
}: ViewScheduleModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="md"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent className="max-h-[90vh] overflow-hidden p-6 w-full">
        {/* Modal Header */}
        <ModalHeader className="flex gap-1 text-center sm:text-left p-0">
          <h4 className="text-base font-medium flex items-center gap-2">
            <TbCalendarStats className="h-6 w-6 text-blue-600" />
            <span>{plan?.planDetails?.name}</span>
          </h4>
          <div className="flex items-center gap-2 ml-2">
            <VisitStatusChip status={plan?.status} />
            {plan.isDraft && (
              <Chip
                size="sm"
                radius="sm"
                className="capitalize text-[11px] h-5"
                variant="flat"
                color="danger"
              >
                Draft
              </Chip>
            )}
          </div>
        </ModalHeader>

        <ModalBody className="p-0 overflow-y-auto space-y-4 mt-4 gap-0">
          {/* --- Summary Stats (Reference: Review & Save Tab) --- */}
          <div className="grid grid-cols-4 gap-4 py-3 bg-gray-50 rounded-lg border border-gray-100">
            <StatPill
              title="Referrers"
              value={plan.practices.length}
              color="blue"
            />
            <StatPill
              title="Visit Days"
              value={plan.route.visitDays}
              color="green"
            />
            <StatPill
              title="Total Time"
              value={plan.route.estimatedTotalTime}
              color="orange"
            />
            <StatPill
              title="Distance"
              value={plan.route.estimatedDistance}
              color="purple"
            />
          </div>

          {/* --- Plan Configuration --- */}
          <div className="space-y-4 border border-primary/15 p-4 rounded-xl">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <TbNotes className="h-4 w-4" /> Plan Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <DetailItem
                label="Visit Purpose"
                value={plan?.planDetails?.visitPurpose?.title}
              />
              <DetailItem
                label="Default Priority"
                value={plan?.planDetails?.priority}
              />
              {plan?.planDetails?.description && (
                <div className="col-span-2">
                  <div className="text-xs font-medium text-gray-500">
                    Description
                  </div>
                  <div className="text-sm font-medium text-gray-800 capitalize">
                    {plan?.planDetails?.description}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --- Route Details (Reference: Route Planning Tab) --- */}
          <div className="space-y-4 border border-primary/15 p-4 rounded-xl">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <TbRoute className="h-4 w-4" /> Route Stops (
              {plan.route.routeDetails?.length})
            </h3>
            <div className="space-y-2">
              {plan?.route?.routeDetails?.map((route, index) => (
                <RouteStopCard key={index} route={route} index={index} />
              ))}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

// --- Reusable Sub-Components ---

const StatPill = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: "blue" | "green" | "orange" | "purple";
}) => (
  <div className="text-center">
    <div className={`text-sm font-semibold text-${color}-600`}>{value}</div>
    <div className="text-xs text-gray-500">{title}</div>
  </div>
);

const DetailItem = ({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) => (
  <div className={fullWidth ? "col-span-2" : "col-span-1"}>
    <div className="text-xs font-medium text-gray-500">{label}</div>
    <div className="text-sm font-medium text-gray-800 capitalize mt-0.5">
      {value}
    </div>
  </div>
);

const RouteStopCard = ({
  route,
  index,
}: {
  route: PlanData["routeDetails"][0];
  index: number;
}) => (
  <div className="p-3 border border-primary/15 rounded-xl flex items-start gap-2">
    {/* Stop Number Icon */}
    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold mt-1">
      {index + 1}
    </div>

    {/* Details */}
    <div className="flex-grow space-y-1">
      <div className="font-medium text-sm">{route.name}</div>
      <div className="text-xs text-gray-600">{route.address.addressLine1}</div>
      <div className="flex items-center gap-3 text-xs text-gray-600 pt-1">
        <span className="flex items-center gap-1.5">
          <LuTimer className="min-h-3.5 min-w-3.5 size-3.5" />{" "}
          {route.arrivalTime} - {route.departureTime}
        </span>
        {route.travelDistance !== "0.0mi" && (
          <span className="flex items-center gap-1.5">
            <LuCar className="min-h-4 min-w-4 size-4" /> {route.travelDistance}
          </span>
        )}
        {route.travelTime !== "0m" && (
          <span className="flex items-center gap-1.5">
            <LuClock className="min-h-3.5 min-w-3.5 size-3.5" />{" "}
            {route.travelTime}
          </span>
        )}
      </div>
    </div>
  </div>
);
