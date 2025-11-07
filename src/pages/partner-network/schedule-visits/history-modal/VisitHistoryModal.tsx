import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { FiSearch, FiLoader } from "react-icons/fi";
import { TbArchive } from "react-icons/tb";
import VisitHistoryCard from "./VisitHistoryCard";
import { useVisitHistory } from "../../../../hooks/usePartner";
import { memo, useState } from "react";
import { useDebouncedValue } from "../../../../hooks/common/useDebouncedValue";
// Assuming you have this hook implemented correctly

interface VisitHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VisitHistoryModal({ isOpen, onClose }: VisitHistoryModalProps) {
  // 1. State for immediate input value (to control the input field)
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 2. Debounced value for triggering the data fetch (500ms delay)
  const debouncedSearch = useDebouncedValue(searchInput, 500);

  // 3. Filters passed to the query hook
  const filters = {
    filter: statusFilter,
    search: debouncedSearch,
  };

  const {
    data: visitHistoryData,
    isLoading,
    isFetching, // TanStack Query state for background refetch
    error,
  } = useVisitHistory(filters);

  // Handle initial full-screen loading and errors
  if (isLoading) return <div>Loading visit history...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const visits = visitHistoryData?.data;
  const stats = visitHistoryData?.stats;

  const displayStats = stats || {
    totalVisits: "—",
    completedVisits: "—",
    officeVisits: "—",
    totalTime: "—",
  };

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
      {/* Set ModalContent to relative for absolute loading overlay positioning */}
      <ModalContent className="max-h-[90vh] overflow-hidden p-5 w-full relative">
        {/* Loading Overlay: This prevents content from collapsing during refetch */}
        {isFetching && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300">
            <FiLoader className="animate-spin h-6 w-6 text-blue-600" />
          </div>
        )}

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
            <div className="text-lg font-medium text-blue-600">
              {displayStats.totalVisits}
            </div>
            <div className="text-xs text-gray-600">Total Visits</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-green-600">
              {displayStats.completedVisits}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-purple-600">
              {displayStats.officeVisits}
            </div>
            <div className="text-xs text-gray-600">Offices Visited</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-orange-600">
              {displayStats.totalTime}
            </div>
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
              // Set the input value to the immediate state (searchInput)
              value={searchInput}
              // Update immediate state on change
              onValueChange={setSearchInput}
            />
          </div>
          <Select
            aria-label="Filter visits"
            placeholder="All Visits"
            size="sm"
            radius="sm"
            selectedKeys={[statusFilter]}
            disabledKeys={[statusFilter]}
            className="max-w-[150px]"
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <SelectItem key="all">All Visits</SelectItem>
            <SelectItem key="completed">Completed</SelectItem>
            <SelectItem key="pending">Pending</SelectItem>
            <SelectItem key="cancelled">Cancelled</SelectItem>
          </Select>
        </div>

        <ModalBody className="p-0 overflow-y-auto flex-1">
          <div>
            {visits?.map((monthGroup, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-sm font-medium sticky top-0 bg-white py-2.5 border-b border-primary/15 z-10">
                  {monthGroup.month} ({monthGroup.visits.length} visits)
                </h3>
                <div className="space-y-2">
                  {monthGroup.visits.map((visit: any) => (
                    <VisitHistoryCard key={visit._id} visit={visit} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default memo(VisitHistoryModal);
