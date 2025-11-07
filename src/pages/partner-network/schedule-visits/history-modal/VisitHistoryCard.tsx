import { Button, Card, CardBody, Chip } from "@heroui/react";
import VisitStatusChip from "../../../../components/chips/VisitStatusChip";
import PriorityLevelChip from "../../../../components/chips/PriorityLevelChip";
import {
  LuBuilding2,
  LuCalendar,
  LuCar,
  LuClock,
  LuRoute,
  LuTimer,
} from "react-icons/lu";
import { FiEye } from "react-icons/fi";
import { formatDateToReadable } from "../../../../utils/formatDateToReadable";

const VisitHistoryCard = ({ visit }: any) => {
  return (
    <Card
      data-slot="card"
      className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-primary/15 shadow-none"
    >
      <CardBody data-slot="card-content" className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <VisitStatusChip status={visit.status} />
                  <PriorityLevelChip level={visit.planDetails.priority} />
                  {visit.optimized && (
                    <Chip
                      size="sm"
                      radius="sm"
                      className="bg-green-50 text-green-700 border border-green-100 h-5 text-[11px] !px-1.5"
                      startContent={<LuRoute className="h-3 w-3" />}
                    >
                      Optimized
                    </Chip>
                  )}
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  {visit.planDetails.name}
                </h4>
              </div>
              <Button
                size="sm"
                variant="light"
                radius="sm"
                className="hover:bg-accent hover:text-accent-foreground p-0 min-w-0 h-8 px-2"
              >
                <FiEye className="size-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <LuCalendar className="min-h-3.5 min-w-3.5 size-3.5" />
                {formatDateToReadable(visit.route.date)}
              </div>
              <div className="flex items-center gap-1">
                <LuClock className="min-h-3.5 min-w-3.5 size-3.5" />
                {visit.route.estimatedTotalTime}
              </div>
              <div className="flex items-center gap-1">
                <LuTimer className="min-h-3.5 min-w-3.5 size-3.5" />
                {visit.route.durationPerVisit}
              </div>
              <div className="flex items-center gap-1">
                <LuBuilding2 className="min-h-3.5 min-w-3.5 size-3.5" />
                {visit.route.totalStops} office(s)
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-700">
                <span className="font-medium">Visited: </span>
                {visit.route.routeDetails.map((route: any) => route.name).join(", ")}
              </p>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              <LuCar className="min-h-4 min-w-4 size-4 inline mr-1" />
              {visit.route.estimatedDistance} traveled
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default VisitHistoryCard;
