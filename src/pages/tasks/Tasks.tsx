import { useMemo, useState } from "react";
import ComponentContainer from "../../components/common/ComponentContainer";
import MiniStatsCard from "../../components/cards/MiniStatsCard";
import { GoTasklist } from "react-icons/go";
import { MdOutlineTaskAlt } from "react-icons/md";
import { LuCalendar, LuInfo } from "react-icons/lu";
import { Input, Pagination, Select, SelectItem } from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import { TASK_PRIORITIES, TASK_STATUSES } from "../../consts/practice";
import { useFetchAllTasks } from "../../hooks/usePartner";
import TaskCard from "./TaskCard";
import { FaRegClock } from "react-icons/fa";

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

  const { data: tasksData } = useFetchAllTasks(currentFilters);
  const tasks = tasksData?.tasks;
  const stats = tasksData?.stats;

  const STAT_CARD_DATA = [
    {
      icon: <GoTasklist className="text-lg mt-1 text-sky-600" />,
      heading: "Total Tasks",
      value: stats?.allTasksCount || 0,
    },
    {
      icon: <MdOutlineTaskAlt className="text-[17px] mt-1 text-green-600" />,
      heading: "Completed Tasks",
      value: stats?.completedCount || 0,
    },
    {
      icon: <FaRegClock className="text-[17px] mt-1 text-yellow-600" />,
      heading: "In Progress Tasks",
      value: stats?.inProgressCount || 0,
    },
    {
      icon: <LuInfo className="text-[17px] mt-1 text-red-600" />,
      heading: "Overdue Tasks",
      value: stats?.overDueCount || 0,
    },
  ];

  const onFilterChange = (key: string, value: string) => {
    setCurrentFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const onSearchChange = (value: string) => {
    setCurrentFilters((prev: any) => ({ ...prev, search: value }));
  };

  return (
    <ComponentContainer headingData={HEADING_DATA as any}>
      <div className="flex flex-col gap-5">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAT_CARD_DATA.map((data, i) => (
            <MiniStatsCard key={i} cardData={data} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-primary/15 rounded-xl p-4 bg-white shadow-none">
          <div className="relative flex-1">
            <Input
              placeholder="Search tasks by name or practice name..."
              size="sm"
              value={currentFilters.search}
              onValueChange={onSearchChange}
              startContent={<FiSearch className="text-gray-400 h-4 w-4" />}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              aria-label="Task Status"
              placeholder="All Statuses"
              size="sm"
              selectedKeys={new Set([currentFilters.status])}
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
        <div className="flex flex-col gap-4 border border-primary/15 bg-background rounded-xl p-4">
          <p className="font-medium text-sm">Task List</p>

          {tasks?.length > 0 ? (
            tasks.map((task: any) => <TaskCard key={task._id} task={task} />)
          ) : (
            <div className="text-center py-10 text-gray-500 text-sm">
              No tasks found matching your filters.
            </div>
          )}

          {stats?.totalPages && stats.totalPages > 1 ? (
            <Pagination
              showControls
              size="sm"
              radius="sm"
              initialPage={1}
              page={currentFilters.page as number}
              onChange={(page) => {
                setCurrentFilters((prev: any) => ({ ...prev, page }));
              }}
              total={stats?.totalPages as number}
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
        </div>
      </div>
    </ComponentContainer>
  );
}

export default Tasks;
