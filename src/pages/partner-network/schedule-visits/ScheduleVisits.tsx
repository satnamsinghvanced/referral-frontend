import { Button } from "@heroui/react";
import { useState } from "react";
import { MdOutlineCalendarToday } from "react-icons/md";
import { ScheduleVisitsModal } from "./modal/ScheduleVisitsModal";

export default function ScheduleVisits({ practices }: any) {
  const [isScheduleVisitModalOpen, setIsScheduleVisitModalOpen] =
    useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-base">Schedule Referrer Visits</h3>
          <p className="text-xs text-gray-600">
            Plan monthly visits to multiple referrers with route optimization
          </p>
        </div>
        <Button
          size="sm"
          variant="solid"
          color="primary"
          startContent={<MdOutlineCalendarToday />}
          onPress={() => setIsScheduleVisitModalOpen(true)}
        >
          Create Plan
        </Button>
      </div>
      <ScheduleVisitsModal
        isOpen={isScheduleVisitModalOpen}
        onClose={() => setIsScheduleVisitModalOpen(false)}
        practices={practices}
      />
    </>
  );
}
