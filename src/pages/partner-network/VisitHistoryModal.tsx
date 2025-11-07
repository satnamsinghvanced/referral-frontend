import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { FiEye, FiSearch } from "react-icons/fi";
import {
  LuBuilding2,
  LuCalendar,
  LuCar,
  LuClock,
  LuRoute,
  LuTimer,
} from "react-icons/lu";
import { TbArchive } from "react-icons/tb";
import PriorityLevelChip from "../../components/chips/PriorityLevelChip";
import VisitStatusChip from "../../components/chips/VisitStatusChip";

const DUMMY_VISIT_DATA = [
  {
    month: "October 2024",
    visits: [
      {
        id: 1,
        title: "Relationship Building",
        status: "completed",
        priority: "high",
        optimized: false,
        date: "Oct 15, 2024",
        time: "10:00 AM - 11:00 AM",
        durationMin: 65,
        offices: 1,
        visitedNames: "Tulsa Family Dental",
        milesTraveled: 12.5,
      },
      {
        id: 2,
        title: "Lunch Meeting",
        status: "completed",
        priority: "medium",
        optimized: true,
        date: "Oct 08, 2024",
        time: "2:00 PM - 4:30 PM",
        durationMin: 150,
        offices: 2,
        visitedNames: "Jenks Dental Care, Bixby Smile Center",
        milesTraveled: 18.3,
      },
    ],
  },
  {
    month: "September 2024",
    visits: [
      {
        id: 3,
        title: "Case Consultation",
        status: "completed",
        priority: "high",
        optimized: false,
        date: "Sep 22, 2024",
        time: "9:00 AM - 10:00 AM",
        durationMin: 60,
        offices: 1,
        visitedNames: "Unknown Office",
        milesTraveled: 8.7,
      },
      {
        id: 4,
        title: "Marketing Materials",
        status: "completed",
        priority: "low",
        optimized: true,
        date: "Sep 15, 2024",
        time: "1:00 PM - 5:00 PM",
        durationMin: 195,
        offices: 3,
        visitedNames: "Unknown Office, Unknown Office, Unknown Office",
        milesTraveled: 25.6,
      },
    ],
  },
];

interface VisitItemProps {
  visit: (typeof DUMMY_VISIT_DATA)[0]["visits"][0];
}

const VisitItem: React.FC<VisitItemProps> = ({ visit }) => {
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
                  <PriorityLevelChip level={visit.priority} />
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
                  {visit.title}
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
                {visit.date}
              </div>
              <div className="flex items-center gap-1">
                <LuClock className="min-h-3.5 min-w-3.5 size-3.5" />
                {visit.time}
              </div>
              <div className="flex items-center gap-1">
                <LuTimer className="min-h-3.5 min-w-3.5 size-3.5" />
                {visit.durationMin} min
              </div>
              <div className="flex items-center gap-1">
                <LuBuilding2 className="min-h-3.5 min-w-3.5 size-3.5" />
                {visit.offices} office(s)
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-700">
                <span className="font-medium">Visited: </span>
                {visit.visitedNames}
              </p>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              <LuCar className="min-h-4 min-w-4 size-4 inline mr-1" />
              {visit.milesTraveled} miles traveled
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

interface VisitHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisitHistoryModal({
  isOpen,
  onClose,
}: VisitHistoryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="md"
    >
      <ModalContent className="max-h-[90vh] overflow-hidden p-5 w-full">
        <ModalHeader className="flex flex-col gap-2 text-center sm:text-left flex-shrink-0 p-0">
          <h2 className="text-base leading-none font-medium flex items-center gap-2">
            <TbArchive className="h-5 w-5 text-blue-600" />
            <span>Visit History & Routes</span>
          </h2>
          <p className="text-gray-600 text-xs font-normal">
            View past visits, routes, and performance analytics
          </p>
        </ModalHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-b border-primary/15 flex-shrink-0">
          <div className="text-center">
            <div className="text-lg font-medium text-blue-600">7</div>
            <div className="text-xs text-gray-600">Total Visits</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-green-600">6</div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-purple-600">8</div>
            <div className="text-xs text-gray-600">Offices Visited</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-orange-600">12h</div>
            <div className="text-xs text-gray-600">Total Time</div>
          </div>
        </div>

        <div className="flex items-center gap-2 py-4 border-b border-primary/15 flex-shrink-0">
          <div className="flex-1 relative">
            <Input
              data-slot="input"
              size="sm"
              radius="sm"
              classNames={{ input: "!pl-5" }}
              placeholder="Search visits, offices, notes..."
              startContent={
                <FiSearch className="size-3.5 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
              }
            />
          </div>
          <Select
            aria-label="Filter visits"
            placeholder="All Visits"
            size="sm"
            radius="sm"
            defaultSelectedKeys={["all"]}
            className="max-w-[150px]"
          >
            <SelectItem key="all">All Visits</SelectItem>
            <SelectItem key="completed">Completed</SelectItem>
            <SelectItem key="pending">Pending</SelectItem>
            <SelectItem key="cancelled">Cancelled</SelectItem>
          </Select>
        </div>

        <ModalBody className="p-0 overflow-y-auto flex-1">
          <div>
            {DUMMY_VISIT_DATA.map((monthGroup, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-sm font-medium sticky top-0 bg-white py-2.5 border-b border-primary/15 z-10">
                  {monthGroup.month} ({monthGroup.visits.length} visits)
                </h3>
                <div className="space-y-2">
                  {monthGroup.visits.map((visit) => (
                    <VisitItem key={visit.id} visit={visit} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ModalBody>

        {/* <ModalFooter className="flex-shrink-0 flex justify-end space-x-2 pt-4 border-t border-primary/15 p-0">
          <Button
            variant="bordered"
            size="sm"
            className="border-small"
            onPress={onClose}
          >
            Close
          </Button>
          <Button
            color="primary"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Edit Practice
          </Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
}
