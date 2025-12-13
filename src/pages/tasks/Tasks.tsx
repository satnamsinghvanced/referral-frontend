import { Input, Pagination, Select, SelectItem } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { GoTasklist } from "react-icons/go";
import { LuInfo } from "react-icons/lu";
import { MdOutlineTaskAlt } from "react-icons/md";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import { TASK_PRIORITIES, TASK_STATUSES } from "../../consts/practice";
import { useDebouncedValue } from "../../hooks/common/useDebouncedValue";
import { useFetchAllTasks } from "../../hooks/usePartner";
import TaskCard from "./TaskCard";

function Tasks() {
  const HEADING_DATA = useMemo(
    () => ({
      heading: "Tasks",
      subHeading:
        "Manage and prioritize tasks for efficient practice operations.",
      buttons: [],
    }),
    []
  );

  const [currentFilters, setCurrentFilters] = useState<any>({
    page: 1,
    limit: 10,
    search: "",
    status: "all",
    priority: "all",
  });

  const debouncedSearch = useDebouncedValue(currentFilters.search, 500);

  useEffect(() => {
    setCurrentFilters((prev: any) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  const {
    data: tasksData,
    isLoading,
    isFetching,
  } = useFetchAllTasks({ ...currentFilters, search: debouncedSearch });

  const tasks = tasksData?.tasks;
  const stats = tasksData?.stats;
  const pagination = tasksData?.pagination;

  const STAT_CARD_DATA = [
    {
      icon: <GoTasklist className="text-sky-600" />,
      heading: "Total Tasks",
      value: stats?.allTasksCount || 0,
    },
    {
      icon: <MdOutlineTaskAlt className="text-green-600" />,
      heading: "Completed Tasks",
      value: stats?.completedCount || 0,
    },
    {
      icon: <FaRegClock className="text-yellow-600" />,
      heading: "In Progress Tasks",
      value: stats?.inProgressCount || 0,
    },
    {
      icon: <LuInfo className="text-red-600" />,
      heading: "Overdue Tasks",
      value: stats?.overDueCount || 0,
    },
  ];

  const onFilterChange = (key: string, value: string) => {
    setCurrentFilters((prev: any) => ({ ...prev, [key]: value, page: 1 }));
  };

  const onSearchChange = (value: string) => {
    setCurrentFilters((prev: any) => ({ ...prev, search: value, page: 1 }));
  };

  return (
    <ComponentContainer headingData={HEADING_DATA as any}>
      <div className="flex flex-col gap-5">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAT_CARD_DATA.map((data, i) => (
            <MiniStatsCard key={i} cardData={data} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-primary/15 rounded-xl p-4 bg-white shadow-none">
          <div className="relative flex-1">
            <Input
              placeholder="Search tasks..."
              size="sm"
              value={currentFilters.search}
              onValueChange={onSearchChange}
              startContent={<FiSearch className="text-gray-400 h-4 w-4" />}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              aria-label="Task Status"
              placeholder="All Statuses"
              size="sm"
              selectedKeys={new Set([currentFilters.status])}
              disabledKeys={new Set([currentFilters.status])}
              onSelectionChange={(keys) =>
                onFilterChange("status", Array.from(keys)[0] as string)
              }
            >
              <>
                <SelectItem key="all" className="capitalize">
                  All Statuses
                </SelectItem>
                {TASK_STATUSES.map((status: any) => (
                  <SelectItem key={status.value} className="capitalize">
                    {status.label}
                  </SelectItem>
                ))}
              </>
            </Select>

            <Select
              aria-label="Task Priority"
              placeholder="All Priorities"
              size="sm"
              selectedKeys={new Set([currentFilters.priority])}
              disabledKeys={new Set([currentFilters.priority])}
              onSelectionChange={(keys) =>
                onFilterChange("priority", Array.from(keys)[0] as string)
              }
            >
              <>
                <SelectItem key="all" className="capitalize">
                  All Priorities
                </SelectItem>
                {TASK_PRIORITIES.map((priority: any) => (
                  <SelectItem key={priority.value} className="capitalize">
                    {priority.label}
                  </SelectItem>
                ))}
              </>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-4 border border-primary/15 bg-background rounded-xl p-4 min-h-unit-96">
          <p className="font-medium text-sm">Task List</p>

          {isLoading || isFetching ? (
            <LoadingState />
          ) : !tasks || tasks?.length <= 0 ? (
            <EmptyState title="There are no tasks matching your current filters. Try adjusting your search or filters." />
          ) : (
            <>
              <div className="space-y-3">
                {tasks?.map((task: any) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
              {pagination?.totalPages && pagination.totalPages > 1 ? (
                <Pagination
                  showControls
                  size="sm"
                  radius="sm"
                  initialPage={1}
                  page={currentFilters.page as number}
                  onChange={(page) => {
                    setCurrentFilters((prev: any) => ({ ...prev, page }));
                  }}
                  total={pagination?.totalPages as number}
                  classNames={{
                    base: "flex justify-end py-3",
                    wrapper: "gap-1.5",
                    item: "cursor-pointer",
                    prev: "cursor-pointer",
                    next: "cursor-pointer",
                  }}
                />
              ) : (
                ""
              )}
            </>
          )}
        </div>
      </div>
    </ComponentContainer>
  );
}

export default Tasks;
