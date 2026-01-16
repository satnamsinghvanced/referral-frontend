import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { FiCheckCircle, FiMapPin } from "react-icons/fi";
import { LuCar, LuClock, LuTimer } from "react-icons/lu";
import { TbCalendarStats, TbNotes, TbRoute } from "react-icons/tb"; // Icons for new structure
import VisitStatusChip from "../../../components/chips/VisitStatusChip";
import { convertTo12HourClock } from "../../../utils/convertTo12HourClock";
import { formatDateToReadable } from "../../../utils/formatDateToReadable";

import { RouteDetailStop, SchedulePlan } from "../../../types/partner";

interface ViewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SchedulePlan; // The data for the specific plan to display
}

export default function ViewScheduledVisitModal({
  isOpen,
  onClose,
  plan,
}: ViewScheduleModalProps) {
  const progress = plan.status === "completed" ? 100 : 0;

  const handleOpenInMaps = () => {
    if (!plan?.route?.routeDetails || plan.route.routeDetails.length === 0) {
      return;
    }

    const activeCoordinateString = plan.route.routeDetails
      .map(
        (stop: any) =>
          `${stop.address.coordinates.long},${stop.address.coordinates.lat}`
      )
      .join(";");

    const baseUrl = `${import.meta.env.VITE_URL_PREFIX}/visit-map`;

    // Passing optimized as true since this is a saved route that was presumably optimized if intended
    const url = `${baseUrl}?coordinates=${encodeURIComponent(
      activeCoordinateString
    )}&optimized=true`;

    window.open(url, "_blank");
  };

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
      <ModalContent className="max-h-[95vh] overflow-hidden w-full">
        {/* Modal Header */}
        <ModalHeader className="flex gap-1 text-center sm:text-left p-4">
          <h4 className="text-base font-medium flex items-center gap-2 text-foreground">
            <TbCalendarStats className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>{plan?.planDetails?.name}</span>
          </h4>
          <div className="flex items-center gap-2 ml-2">
            <VisitStatusChip status={plan?.status} />
          </div>
        </ModalHeader>

        <ModalBody className="px-4 pt-0 pb-4 overflow-y-auto space-y-3 md:space-y-4 gap-0">
          {/* --- Summary Stats (Reference: Review & Save Tab) --- */}
          <div className="grid grid-cols-4 gap-4 py-3 bg-gray-50 dark:bg-default-100/20 rounded-lg border border-foreground/10">
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

          <div className="p-3 bg-gray-50 dark:bg-default-100/20 rounded-lg border border-foreground/10">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-foreground/60">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-default-200 rounded-full h-2">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* --- Plan Configuration --- */}
          <div className="space-y-4 border border-foreground/10 p-4 rounded-xl">
            <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
              <TbNotes className="h-4 w-4" /> Plan Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <DetailItem
                label="Scheduled Date"
                value={formatDateToReadable(plan.route.date)}
              />
              <DetailItem
                label="Scheduled Time"
                value={convertTo12HourClock(plan?.route?.startTime)}
              />
              <DetailItem
                label="Visit Purpose"
                value={plan?.planDetails?.visitPurpose?.title}
              />
              <DetailItem
                label="Default Priority"
                value={plan?.planDetails?.priority}
              />
              <DetailItem
                label="Created At"
                value={formatDateToReadable(plan?.createdAt, true)}
              />
              <DetailItem
                label="Updated At"
                value={formatDateToReadable(plan?.updatedAt, true)}
              />
              {plan?.planDetails?.description && (
                <div className="col-span-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-foreground/40">
                    Description
                  </div>
                  <div className="text-xs font-medium text-gray-800 dark:text-foreground/80 capitalize mt-0.5">
                    {plan?.planDetails?.description}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 border border-foreground/10 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
                <TbRoute className="h-4 w-4" /> Route Stops (
                {plan.route.routeDetails?.length})
              </h3>
              <Button
                size="sm"
                variant="bordered"
                radius="sm"
                className="border-small h-8 dark:border-default-200 dark:text-foreground/70"
                onPress={handleOpenInMaps}
              >
                <FiMapPin className="size-3.5" />
                Open in Maps
              </Button>
            </div>
            <div className="space-y-2">
              {plan?.route?.routeDetails?.map((route, index) => (
                <RouteStopCard key={index} route={route} index={index} />
              ))}
            </div>
          </div>

          {plan?.visitNotes && (
            <div className="space-y-1.5">
              <div className="text-xs text-foreground/60">Visit Notes</div>
              <div className="text-xs text-gray-700 dark:text-foreground/70 capitalize bg-gray-50 dark:bg-default-100/20 p-2 rounded-lg">
                {plan?.visitNotes}
              </div>
            </div>
          )}

          {plan?.visitOutcome && (
            <div className="space-y-1.5">
              <div className="text-xs text-foreground/60">
                Visit Outcome/Result
              </div>
              <div className="text-xs text-gray-700 dark:text-green-300 p-2 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-500/30 rounded-lg">
                {plan?.visitOutcome}
              </div>
            </div>
          )}

          {plan?.followUp && (
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                <FiCheckCircle fontSize={14} />
                <span className="text-xs ">Follow-up Action Required</span>
              </div>
            </div>
          )}
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
    <div
      className={`text-sm font-semibold text-${color}-600 dark:text-${color}-400`}
    >
      {value}
    </div>
    <div className="text-xs text-gray-500 dark:text-foreground/40">{title}</div>
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
    <div className="text-xs font-medium text-gray-500 dark:text-foreground/40">
      {label}
    </div>
    <div className="text-xs font-medium text-gray-800 dark:text-foreground/80 capitalize mt-0.5">
      {value}
    </div>
  </div>
);

const RouteStopCard = ({
  route,
  index,
}: {
  route: RouteDetailStop;
  index: number;
}) => (
  <div className="p-3 border border-foreground/10 rounded-xl flex items-start gap-2">
    {/* Stop Number Icon */}
    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-xs font-semibold mt-1">
      {index + 1}
    </div>

    {/* Details */}
    <div className="flex-grow space-y-1">
      <div className="font-medium text-sm text-foreground">{route.name}</div>
      <div className="text-xs text-gray-600 dark:text-foreground/60">
        {route.address.addressLine1} {route.address.addressLine2}{" "}
        {route.address.city}, {route.address.state} {route.address.zip}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-600 dark:text-foreground/40 pt-1">
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <LuTimer className="min-h-4 min-w-4 size-4" /> {route.arrivalTime} -{" "}
          {route.departureTime}
        </span>
        {route.travelDistance !== "0.0mi" && (
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <LuCar className="min-h-4 min-w-4 size-4" /> {route.travelDistance}
          </span>
        )}
        {route.travelTime !== "0m" && (
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <LuClock className="min-h-3.5 min-w-3.5 size-3.5" />{" "}
            {route.travelTime}
          </span>
        )}
      </div>
    </div>
  </div>
);
