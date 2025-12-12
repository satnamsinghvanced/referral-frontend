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
import { memo, useState, useCallback, useMemo } from "react";
import { useDebouncedValue } from "../../../../hooks/common/useDebouncedValue";

interface VisitHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemView: any;
}

export function VisitHistoryModal({
  isOpen,
  onClose,
  onItemView,
}: VisitHistoryModalProps) {
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Debounce the search input value
  const debouncedSearch = useDebouncedValue(searchInput, 500);

  // Memoize filters object to prevent unnecessary re-fetches
  const filters = useMemo(
    () => ({
      filter: statusFilter,
      search: debouncedSearch,
    }),
    [statusFilter, debouncedSearch]
  );

  // @ts-ignore
  const { data: visitHistoryData, isFetching } = useVisitHistory(filters);

  const visits = visitHistoryData?.data;
  const stats = visitHistoryData?.stats;

  const displayStats = stats || {
    totalVisits: "0",
    completedVisits: "0",
    officeVisits: "0",
    totalTime: "0",
  };

  // Handler for Select change, using useCallback for stability
  const handleStatusChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(event.target.value);
    },
    []
  );

  // Handler for Input change, using useCallback for stability
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

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
      <ModalContent className="max-h-[90vh] overflow-hidden p-0 w-full relative">
        {isFetching && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300">
            <FiLoader className="animate-spin h-6 w-6 text-primary" />
          </div>
        )}

        <ModalHeader className="flex flex-col gap-0 text-center sm:text-left flex-shrink-0 p-5 pb-0 font-normal">
          <div className="flex flex-col gap-2">
            <h2 className="text-base leading-none font-medium flex items-center gap-2">
              <TbArchive className="h-5 w-5 text-blue-600" />
              <span>Visit History & Routes</span>
            </h2>
            <p className="text-gray-600 text-xs font-normal">
              View past visits, routes, and performance analytics
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-b border-primary/15 flex-shrink-0">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {displayStats.totalVisits}
              </div>
              <div className="text-xs text-gray-600">Total Visits</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {displayStats.completedVisits}
              </div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">
                {displayStats.officeVisits}
              </div>
              <div className="text-xs text-gray-600">Offices Visited</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">
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
                placeholder="Search visits, offices..."
                startContent={
                  <FiSearch className="size-3.5 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
                }
                value={searchInput}
                onValueChange={handleSearchChange}
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
              onChange={handleStatusChange}
            >
              <SelectItem key="all">All Visits</SelectItem>
              <SelectItem key="completed">Completed</SelectItem>
              <SelectItem key="cancel">Cancelled</SelectItem>
            </Select>
          </div>
        </ModalHeader>

        <ModalBody className="p-5 pt-0 overflow-y-auto flex-1">
          <div>
            {visits?.map((monthGroup: any, index: number) => (
              <div key={index} className="space-y-3">
                <h3 className="text-sm font-medium sticky top-0 bg-background py-2.5 border-b border-primary/15 z-10">
                  {monthGroup.month} ({monthGroup.visits.length} visits)
                </h3>
                <div className="space-y-2.5">
                  {monthGroup.visits.map((visit: any) => (
                    <VisitHistoryCard
                      key={visit._id}
                      visit={visit}
                      onView={onItemView}
                    />
                  ))}
                </div>
              </div>
            ))}
            {/* Display if no visits are found */}
            {(!visits || visits.length === 0) && !isFetching && (
              <div className="text-center text-gray-500 pt-6 pb-2 text-sm">
                No visits found matching the current filters.
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default memo(VisitHistoryModal);
