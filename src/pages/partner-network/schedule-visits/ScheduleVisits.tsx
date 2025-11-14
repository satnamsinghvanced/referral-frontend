import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Pagination,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { useState, useCallback } from "react";
import { LuCalendar } from "react-icons/lu";
import { MdOutlineCalendarToday } from "react-icons/md";
import {
  useDeleteSchedulePlan,
  useFetchPartners,
  useGetSchedulePlans,
} from "../../../hooks/usePartner";
import { GetSchedulePlansQuery } from "../../../types/partner";
import CompactPlanCard from "./CompactPlanCard";
import { ScheduleVisitsModal } from "./modal/ScheduleVisitsModal";
import PlanCard from "./PlanCard";
import ViewScheduledVisitModal from "./ViewScheduledVisitModal";
import { FiUsers } from "react-icons/fi";
import { LoadingState } from "../../../components/common/LoadingState";
import EmptyState from "../../../components/common/EmptyState";
import { VisitHistoryModal } from "./history-modal/VisitHistoryModal";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";

const StatsGrid = ({ stats }: any) => {
  const statData = [
    {
      label: "Total Plans",
      value: stats.totalPlans,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Draft",
      value: stats.draftCount,
      bg: "bg-gray-50",
      text: "text-gray-600",
    },
    {
      label: "Active",
      value: stats.activeCount,
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      label: "Completed",
      value: stats.completedCount,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      label: "Total Practices",
      value: stats.totalPractices,
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      label: "Total Visits",
      value: stats.totalVisits,
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      label: "Total Hours",
      value: Number(stats?.totalHours ?? 0).toFixed(2),
      bg: "bg-indigo-50",
      text: "text-indigo-600",
    },
    {
      label: "Total Miles",
      value: stats.totalMiles,
      bg: "bg-pink-50",
      text: "text-pink-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-sm">
      {statData.map((stat) => (
        <div
          key={stat.label}
          className={`text-center p-3 ${stat.bg} rounded flex flex-col items-center justify-center`}
        >
          <div className={`font-semibold ${stat.text}`}>{stat.value}</div>
          <div className="text-xs text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default function ScheduleVisits({
  isHistoryModalOpen,
  setIsHistoryModalOpen,
}: any) {
  const [isScheduleVisitModalOpen, setIsScheduleVisitModalOpen] =
    useState(false);
  const [isViewScheduleVisitModalOpen, setIsViewScheduleVisitModalOpen] =
    useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteVisitId, setDeleteVisitId] = useState("");
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [viewPlan, setViewPlan] = useState<any>();

  const [filters, setFilters] = useState<GetSchedulePlansQuery>({
    page: 1,
    limit: 9,
    status: "all",
    order: "desc",
    sortBy: "month",
  });

  const { data: practicesData } = useFetchPartners();

  const practices = practicesData?.data || [];

  const { data, isLoading, isError, error } = useGetSchedulePlans(filters);

  const schedulePlans = data?.data || [];
  const dashboardStats = data?.dashboardStats;
  const pagination = data?.pagination;

  const { mutate: deleteSchedulePlan, isPending } = useDeleteSchedulePlan();

  const handleFilterChange = useCallback(
    (key: keyof GetSchedulePlansQuery, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleOrderToggle = () => {
    handleFilterChange("order", filters.order === "desc" ? "asc" : "desc");
  };

  const PlanListContent = () => {
    if (isLoading && !dashboardStats) {
      return (
        <div className="col-span-full text-center p-8">
          <LoadingState />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="col-span-full p-4 border border-red-300 bg-red-50 text-red-700 rounded">
          Failed to load plans: {(error as Error)?.message}
        </div>
      );
    }

    if (schedulePlans.length === 0) {
      return (
        <div className="col-span-full text-center p-8 text-gray-500 border border-primary/15 rounded-xl bg-background text-sm">
          <EmptyState title="No schedule plans found based on current filters." />
        </div>
      );
    }

    return schedulePlans.map((plan: any) =>
      isCompactMode ? (
        <CompactPlanCard
          key={plan._id}
          plan={plan}
          onView={(p: any) => {
            setIsViewScheduleVisitModalOpen(true);
            setViewPlan(p);
          }}
          onDelete={(planId: string) => {
            setIsDeleteModalOpen(true);
            setDeleteVisitId(planId);
          }}
        />
      ) : (
        <PlanCard
          key={plan._id}
          plan={plan}
          onView={(p: any) => {
            setIsViewScheduleVisitModalOpen(true);
            setViewPlan(p);
          }}
          onDelete={(planId: string) => {
            setIsDeleteModalOpen(true);
            setDeleteVisitId(planId);
          }}
        />
      )
    );
  };

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
          Schedule Visit
        </Button>
      </div>

      <div className="space-y-6">
        <Card
          data-slot="card"
          className="rounded-xl border border-primary/15 shadow-none"
        >
          <CardHeader data-slot="card-header" className="px-5 pt-5 pb-5">
            <div className="flex items-center justify-between w-full">
              <div className="space-y-2">
                <h4
                  data-slot="card-title"
                  className="leading-none text-sm font-medium"
                >
                  Monthly Visit Plans
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Manage and track your monthly practice visit schedules
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => setIsCompactMode(!isCompactMode)}
                  className="border-small min-w-auto border-primary/15 size-8 p-0"
                  title={isCompactMode ? "Show Grid View" : "Show Compact View"}
                >
                  <LuCalendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardBody data-slot="card-content" className="px-5 pt-0 pb-5">
            {isLoading && !dashboardStats && <LoadingState />}
            {isError && !dashboardStats && (
              <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded">
                Error: {(error as Error)?.message}
              </div>
            )}
            {dashboardStats && <StatsGrid stats={dashboardStats} />}
          </CardBody>
        </Card>

        <div className="flex items-center justify-between border-primary/15 border rounded-xl bg-background p-4">
          <div className="flex items-center gap-2">
            <Select
              aria-label="Filter Plans"
              placeholder="All Plans"
              size="sm"
              radius="sm"
              selectedKeys={[filters.status] as string[]}
              disabledKeys={[filters.status] as string[]}
              onSelectionChange={(keys) =>
                handleFilterChange("status", Array.from(keys)[0] as string)
              }
              className="min-w-[160px]"
            >
              <SelectItem key="all">All Plans</SelectItem>
              <SelectItem key="active">Active</SelectItem>
              <SelectItem key="draft">Draft</SelectItem>
              <SelectItem key="completed">Completed</SelectItem>
              <SelectItem key="archived">Archived</SelectItem>
            </Select>
            <Select
              aria-label="Filter by Month"
              placeholder="Month"
              size="sm"
              radius="sm"
              selectedKeys={[filters.sortBy] as string[]}
              disabledKeys={[filters.sortBy] as string[]}
              onSelectionChange={(keys) => {
                handleFilterChange("sortBy", Array.from(keys)[0] as string);
              }}
              className="min-w-[160px]"
            >
              <SelectItem key="month">Month</SelectItem>
              <SelectItem key="name">Name</SelectItem>
              <SelectItem key="createdDate">Created Date</SelectItem>
              <SelectItem key="updatedDate">Updated Date</SelectItem>
            </Select>
            <Button
              size="sm"
              variant="ghost"
              onPress={handleOrderToggle}
              className="min-w-[100px] border-small"
            >
              {filters.order === "desc" ? "Descending" : "Ascending"}
            </Button>
          </div>
          <div className="text-xs text-gray-600">
            Showing {schedulePlans.length} of {pagination?.totalData} plans
          </div>
        </div>

        <div>
          <div
            className={`${
              !isCompactMode
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"
            }`}
          >
            <PlanListContent />
          </div>
          {pagination && pagination.totalPages > 1 ? (
            <Pagination
              showControls
              size="sm"
              radius="sm"
              initialPage={1}
              page={filters.page as number}
              onChange={(page) => {
                setFilters((prev) => ({ ...prev, page }));
              }}
              total={pagination?.totalPages as number}
              classNames={{
                base: "flex justify-center py-3 mt-3",
                wrapper: "gap-1.5",
                item: "bg-white cursor-pointer",
                prev: "bg-white cursor-pointer",
                next: "bg-white cursor-pointer",
              }}
            />
          ) : (
            ""
          )}
        </div>
      </div>

      <ScheduleVisitsModal
        isOpen={isScheduleVisitModalOpen}
        onClose={() => setIsScheduleVisitModalOpen(false)}
        practices={practices}
      />

      {viewPlan && (
        <ViewScheduledVisitModal
          isOpen={isViewScheduleVisitModalOpen}
          onClose={() => setIsViewScheduleVisitModalOpen(false)}
          plan={viewPlan}
        />
      )}

      <VisitHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onItemView={(p: any) => {
          setIsViewScheduleVisitModalOpen(true);
          setViewPlan(p);
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteSchedulePlan(deleteVisitId, {
            onSuccess() {
              setDeleteVisitId("");
              setIsDeleteModalOpen(false);
            },
          });
        }}
        isLoading={isPending}
      />
    </>
  );
}
